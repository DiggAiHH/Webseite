# INFRASTRUCTURE DEPLOYMENT PLAN — DiggAi.de Production

> **Status:** EXECUTABLE PLAYBOOK  
> **Datum:** 2026-04-12  
> **Ziel:** Frontend (Netlify) + Backend (Hetzner) + Domain (diggai.de) produktiv schalten  
> **Erstellt für:** DevOps-Agenten — jeder Befehl ist copy-paste-fähig  

---

## Architektur-Übersicht

```
                         ┌─────────────────┐
                         │   DNS (diggai.de)│
                         └──────┬──────────┘
                   ┌────────────┼────────────┐
                   │                         │
          CNAME/ALIAS                    A-Record
         diggai.de                    api.diggai.de
        www.diggai.de                      │
                   │                       │
          ┌────────▼────────┐    ┌─────────▼──────────┐
          │   Netlify CDN   │    │  Hetzner Server     │
          │   React SPA     │    │  Ubuntu 24.04       │
          │   (Vite Build)  │    │                     │
          │                 │    │  ┌───────────────┐  │
          │  VITE_API_URL=  │───▶│  │ Nginx :443    │  │
          │  https://api.   │    │  │ (Reverse Proxy│  │
          │  diggai.de      │    │  │  + SSL/TLS)   │  │
          │                 │    │  └──────┬────────┘  │
          └─────────────────┘    │         │           │
                                 │  ┌──────▼────────┐  │
                                 │  │ PM2 → Node.js │  │
                                 │  │ Express :3000  │  │
                                 │  │ (Lead API)     │  │
                                 │  └───────────────┘  │
                                 │                     │
                                 │  ┌───────────────┐  │
                                 │  │ Tomedo Tunnel  │  │
                                 │  │ (Docker/mTLS)  │  │
                                 │  └───────────────┘  │
                                 └─────────────────────┘
```

---

## SEKTION 1: DNS & Domain Routing (diggai.de)

### 1.1 Voraussetzung

- Domain `diggai.de` muss bei einem DNS-Provider verwaltet werden (z.B. Hetzner DNS, Cloudflare, INWX).
- Die **öffentliche IPv4** des Hetzner-Servers muss bekannt sein (im Folgenden: `<HETZNER_IP>`).
- Netlify-Loadbalancer-IP: Wird nach Custom-Domain-Setup angezeigt. Standard-CNAME-Ziel ist der Netlify-Subdomain-Name.

### 1.2 DNS-Records — Exakte Tabelle

> **HINWEIS:** `<HETZNER_IP>` durch die tatsächliche öffentliche IP des Hetzner-Servers ersetzen.  
> **HINWEIS:** `<NETLIFY_SUBDOMAIN>` durch den Netlify-App-Namen ersetzen (z.B. `diggai-frontend.netlify.app`).

| Type    | Name              | Value                                     | TTL   | Zweck                            |
|---------|-------------------|-------------------------------------------|-------|----------------------------------|
| `A`     | `@` (diggai.de)   | `75.2.60.5`                               | 3600  | Netlify Apex Load Balancer       |
| `CNAME` | `www`             | `<NETLIFY_SUBDOMAIN>.netlify.app`         | 3600  | Netlify Frontend (www)           |
| `A`     | `api`             | `<HETZNER_IP>`                            | 300   | Backend API auf Hetzner          |
| `TXT`   | `@`               | `v=spf1 include:_spf.google.com ~all`    | 3600  | SPF für E-Mail-Versand (ggf.)    |
| `CAA`   | `@`               | `0 issue "letsencrypt.org"`               | 3600  | Nur Let's Encrypt darf Zerts.    |

> **Apex-Domain bei Netlify:** Falls der DNS-Provider **kein ALIAS/ANAME** unterstützt, muss ein `A`-Record auf die Netlify-Load-Balancer-IP `75.2.60.5` zeigen. Netlify dokumentiert diese IP unter [docs.netlify.com/domains-https/custom-domains](https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/).

### 1.3 Validierung nach DNS-Setup

```bash
# Warten, bis DNS-Propagation abgeschlossen (kann bis zu 48h dauern, üblich: 5-30 min)
# Dann prüfen:
dig +short diggai.de
# → Muss 75.2.60.5 zeigen (Netlify LB)

dig +short www.diggai.de
# → Muss den Netlify CNAME auflösen

dig +short api.diggai.de
# → Muss <HETZNER_IP> zeigen

# Oder via nslookup:
nslookup diggai.de 8.8.8.8
nslookup api.diggai.de 8.8.8.8
```

---

## SEKTION 2: Hetzner Server Härtung (Ubuntu 24.04)

> **Alle Befehle als `root` via initialen SSH-Zugang ausführen.**  
> **Voraussetzung:** SSH-Key ist bereits auf dem Server hinterlegt (Hetzner Cloud Panel / Rescue System).

### 2.1 System aktualisieren

```bash
apt update && apt upgrade -y && apt autoremove -y
```

### 2.2 Non-Root Deploy-User erstellen

```bash
# User anlegen mit Home-Verzeichnis und bash als Shell
adduser --disabled-password --gecos "DiggAi Deploy" diggai-deploy

# Sudo-Rechte vergeben
usermod -aG sudo diggai-deploy

# NOPASSWD-Sudo für Deployment-Automatisierung (optional, für CI/CD)
echo "diggai-deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/diggai-deploy
chmod 440 /etc/sudoers.d/diggai-deploy

# SSH-Key des Deploy-Users setzen
mkdir -p /home/diggai-deploy/.ssh
chmod 700 /home/diggai-deploy/.ssh

# EIGENEN PUBLIC KEY HIER EINFÜGEN:
cat << 'EOF' > /home/diggai-deploy/.ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... diggai-deploy-key
EOF

chmod 600 /home/diggai-deploy/.ssh/authorized_keys
chown -R diggai-deploy:diggai-deploy /home/diggai-deploy/.ssh
```

### 2.3 SSH Härtung

```bash
# Backup der aktuellen Config
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# SSH-Konfiguration härten
cat << 'EOF' > /etc/ssh/sshd_config.d/99-hardening.conf
# DiggAi SSH Hardening — 2026-04-12
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers diggai-deploy
EOF

# Config-Syntax prüfen, dann Dienst neu starten
sshd -t && systemctl restart sshd

# WICHTIG: In einer NEUEN Terminal-Session testen, ob Login als diggai-deploy funktioniert,
# BEVOR die aktuelle root-Session geschlossen wird!
```

### 2.4 UFW Firewall

```bash
# Firewall-Regeln setzen
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'

# Optional: Rate-Limiting für SSH
ufw limit ssh/tcp

# Firewall aktivieren (Bestätigung mit 'y')
ufw --force enable

# Status prüfen
ufw status verbose
```

**Erwartete Ausgabe:**
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
22/tcp                     LIMIT       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
22/tcp (v6)                LIMIT       Anywhere (v6)
```

### 2.5 Fail2Ban installieren und konfigurieren

```bash
apt install -y fail2ban

# Lokale Konfiguration erstellen (wird von Updates nicht überschrieben)
cat << 'EOF' > /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 3
backend  = systemd

[sshd]
enabled  = true
port     = ssh
filter   = sshd
maxretry = 3
bantime  = 7200

[nginx-http-auth]
enabled  = true

[nginx-limit-req]
enabled  = true
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Status prüfen
fail2ban-client status
fail2ban-client status sshd
```

### 2.6 Automatische Sicherheits-Updates

```bash
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
# → "Yes" auswählen für automatische Sicherheits-Updates

# Überprüfen, dass Security-Updates aktiv sind:
cat /etc/apt/apt.conf.d/20auto-upgrades
# Erwartete Ausgabe:
# APT::Periodic::Update-Package-Lists "1";
# APT::Periodic::Unattended-Upgrade "1";
```

---

## SEKTION 3: Backend Deployment (Hetzner — Node.js Lead API)

> **Ab hier alle Befehle als `diggai-deploy` ausführen.**

```bash
# Zum Deploy-User wechseln (falls noch als root):
su - diggai-deploy
```

### 3.1 Node.js via NodeSource installieren

```bash
# NodeSource Setup für Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Version prüfen
node -v   # → v20.x.x
npm -v    # → 10.x.x

# PM2 global installieren
sudo npm install -g pm2
```

### 3.2 Git und Build-Tools installieren

```bash
sudo apt install -y git build-essential
```

### 3.3 Repository klonen und Backend vorbereiten

```bash
# App-Verzeichnis erstellen
sudo mkdir -p /opt/diggai
sudo chown diggai-deploy:diggai-deploy /opt/diggai
cd /opt/diggai

# Repository klonen
git clone https://github.com/DiggAiHH/Webseite.git app
cd app

# Nur Server-Dependencies installieren
cd server
npm ci --production
cd ..
```

### 3.4 Environment-Datei erstellen

> **ALLE Werte mit echten Credentials befüllen, bevor das Backend gestartet wird.**

```bash
cat << 'EOF' > /opt/diggai/app/server/.env
# ============================================
# DiggAi Backend — Production Environment
# ============================================

# Server
NODE_ENV=production
PORT=3000

# SMTP-Konfiguration (für Lead-E-Mail-Versand)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=no-reply@diggai.de
SMTP_PASS=__SMTP_PASSWORD_HERE__

# Mail-Routing
MAIL_TO=kontakt@diggai.de
MAIL_FROM=no-reply@diggai.de
MAIL_SUBJECT_PREFIX=[DiggAi Anfrage]
EOF

# Datei absichern (nur Owner lesen/schreiben)
chmod 600 /opt/diggai/app/server/.env
```

**Pflicht-Keys im Überblick:**

| Key                    | Beschreibung                                    | Beispiel                        |
|------------------------|-------------------------------------------------|---------------------------------|
| `NODE_ENV`             | Runtime-Modus                                   | `production`                    |
| `PORT`                 | Express-Listener-Port                           | `3000`                          |
| `SMTP_HOST`            | SMTP-Server-Adresse                             | `smtp.ionos.de`                 |
| `SMTP_PORT`            | SMTP-Port                                       | `587`                           |
| `SMTP_SECURE`          | TLS direkt (465) oder STARTTLS (587)            | `false`                         |
| `SMTP_USER`            | SMTP-Login                                      | `no-reply@diggai.de`           |
| `SMTP_PASS`            | SMTP-Passwort                                   | `(geheim)`                      |
| `MAIL_TO`              | Empfänger der Lead-Mails                        | `kontakt@diggai.de`            |
| `MAIL_FROM`            | Absender-Adresse                                | `no-reply@diggai.de`           |
| `MAIL_SUBJECT_PREFIX`  | Betreff-Prefix                                  | `[DiggAi Anfrage]`             |

### 3.5 Backend mit PM2 starten

```bash
cd /opt/diggai/app

# App mit PM2 starten
pm2 start server/src/index.js \
  --name "diggai-api" \
  --max-memory-restart 256M \
  --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
  --merge-logs \
  --env production

# Autostart bei Server-Reboot einrichten
pm2 startup systemd -u diggai-deploy --hp /home/diggai-deploy
# → Den ausgegebenen sudo-Befehl kopieren und ausführen!

# Aktuelle Prozessliste speichern
pm2 save

# Status prüfen
pm2 status
pm2 logs diggai-api --lines 20
```

### 3.6 Health-Check verifizieren

```bash
curl -s http://localhost:3000/health | python3 -m json.tool
# Erwartete Ausgabe:
# {
#     "status": "ok",
#     "service": "diggaihh-lead-api",
#     "version": "1.0.0",
#     "timestamp": "2026-04-12T..."
# }
```

### 3.7 PM2 Log-Rotation einrichten

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## SEKTION 4: Reverse Proxy & SSL (Nginx + Certbot)

### 4.1 Nginx installieren

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

### 4.2 Nginx Server-Block erstellen

```bash
sudo tee /etc/nginx/sites-available/api.diggai.de << 'NGINX_EOF'
# ============================================
# DiggAi API — Nginx Reverse Proxy
# api.diggai.de → localhost:3000
# ============================================

# Rate Limiting Zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# Upstream für Node.js Backend
upstream diggai_backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# HTTP → HTTPS Redirect (wird von Certbot automatisch befüllt)
server {
    listen 80;
    listen [::]:80;
    server_name api.diggai.de;

    # Certbot Challenge Directory
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Alles andere → HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server Block (wird nach Certbot aktiv)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.diggai.de;

    # SSL-Zertifikate — werden von Certbot eingefügt
    # ssl_certificate /etc/letsencrypt/live/api.diggai.de/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/api.diggai.de/privkey.pem;
    # include /etc/letsencrypt/options-ssl-nginx.conf;
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # CORS Headers für Frontend (diggai.de)
    add_header Access-Control-Allow-Origin "https://diggai.de" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    add_header Access-Control-Max-Age "86400" always;

    # Logging
    access_log /var/log/nginx/api.diggai.de.access.log;
    error_log  /var/log/nginx/api.diggai.de.error.log warn;

    # Request Size Limit
    client_max_body_size 1m;

    # Hide Server Version
    server_tokens off;

    # Deny Hidden Files
    location ~ /\. {
        deny all;
        return 404;
    }

    # Health Check (kein Rate Limit)
    location = /health {
        proxy_pass http://diggai_backend/health;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        access_log off;
    }

    # API Proxy
    location / {
        # Rate Limiting
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;

        # Proxy Settings
        proxy_pass http://diggai_backend;
        proxy_http_version 1.1;

        # Header Forwarding
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-ID $request_id;

        # WebSocket Support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Keepalive
        proxy_set_header Connection "";

        # Timeouts
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;

        # Buffer Settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;

        # Kein Caching für API-Antworten
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
        add_header Pragma "no-cache" always;

        # CORS Preflight
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://diggai.de" always;
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
            add_header Access-Control-Max-Age "86400";
            add_header Content-Length 0;
            add_header Content-Type "text/plain";
            return 204;
        }
    }
}
NGINX_EOF
```

### 4.3 Site aktivieren und Default deaktivieren

```bash
# Symlink erstellen
sudo ln -sf /etc/nginx/sites-available/api.diggai.de /etc/nginx/sites-enabled/api.diggai.de

# Default-Site entfernen
sudo rm -f /etc/nginx/sites-enabled/default

# Konfiguration testen
sudo nginx -t
# → "syntax is ok" + "test is successful"

# Nginx neu laden
sudo systemctl reload nginx
```

### 4.4 SSL-Zertifikat mit Certbot

```bash
# Certbot und Nginx-Plugin installieren
sudo apt install -y certbot python3-certbot-nginx

# Zertifikat abrufen und automatisch in Nginx einfügen
sudo certbot --nginx \
  -d api.diggai.de \
  --non-interactive \
  --agree-tos \
  --email admin@diggai.de \
  --redirect

# Certbot fügt automatisch die SSL-Zeilen in den Nginx-Server-Block ein
# und kommentiert die manuellen ssl_certificate-Zeilen ein.

# Auto-Renewal testen
sudo certbot renew --dry-run

# Auto-Renewal Timer prüfen
sudo systemctl status certbot.timer
```

### 4.5 SSL-Konfiguration verifizieren

```bash
# HTTPS-Verbindung testen
curl -vI https://api.diggai.de/health 2>&1 | head -30

# SSL-Grade prüfen (extern):
# https://www.ssllabs.com/ssltest/analyze.html?d=api.diggai.de

# Health-Check über HTTPS
curl -s https://api.diggai.de/health | python3 -m json.tool
```

---

## SEKTION 5: Netlify Frontend Finalisierung

### 5.1 Custom Domain im Netlify UI

**Klick-Pfad:**

1. Einloggen auf [app.netlify.com](https://app.netlify.com)
2. Projekt-Dashboard des DiggAi-Frontends öffnen
3. **"Domain management"** → **"Domains"** in der linken Sidebar
4. **"Add a domain"** klicken
5. `diggai.de` eingeben → **"Verify"** → **"Add domain"**
6. Netlify erkennt, dass DNS extern verwaltet wird → DNS-Records wie in Sektion 1 setzen
7. `www.diggai.de` wird automatisch als Alias hinzugefügt
8. **Warten**, bis Netlify den DNS-Check besteht (grünes Häkchen)
9. **"HTTPS"** Sektion → **"Verify DNS configuration"** → **"Provision certificate"**
10. Let's Encrypt Zertifikat wird automatisch erstellt (kann 5-10 Minuten dauern)

### 5.2 Environment Variables im Netlify Dashboard

**Klick-Pfad:**

1. Projekt-Dashboard → **"Site configuration"** → **"Environment variables"**
2. **"Add a variable"** klicken
3. Folgende Variablen hinzufügen:

| Key                  | Value                          | Scope          |
|----------------------|--------------------------------|----------------|
| `VITE_API_URL`       | `https://api.diggai.de`       | All scopes     |
| `NODE_VERSION`       | `20`                           | All scopes     |
| `VITE_STRIPE_PK`     | `pk_live_...` (falls Stripe)  | Production     |

> **WICHTIG:** Alle `VITE_`-Variablen werden beim Build in den Client-Code eingebettet.  
> Sie sind im Browser sichtbar — **keine Secrets als VITE_-Variablen setzen!**

### 5.3 Build-Settings verifizieren

**Klick-Pfad:**

1. **"Site configuration"** → **"Build & deploy"** → **"Build settings"**
2. Folgende Werte sicherstellen:

| Setting              | Wert                           |
|----------------------|--------------------------------|
| Base directory       | *(leer lassen)*                |
| Build command        | `npm run build`                |
| Publish directory    | `dist`                         |
| Functions directory  | `netlify/functions`            |
| Node.js version      | `20` (via NODE_VERSION env)   |

### 5.4 Redirects & Headers verifizieren

Die [`netlify.toml`](netlify.toml) im Repository enthält bereits:
- SPA-Redirect: `/* → /index.html` (200)
- API-Redirect: `/api/* → /.netlify/functions/:splat` (200)  
- Security Headers (CSP, X-Frame-Options, etc.)

**Keine manuelle Konfiguration nötig** — wird beim Deploy automatisch angewendet.

### 5.5 Re-Deploy auslösen

**Methode 1 — Netlify UI:**
1. **"Deploys"** Tab → **"Trigger deploy"** → **"Deploy site"**

**Methode 2 — Git Push (bevorzugt):**
```bash
# Lokales Repo
cd /path/to/Webseite
git add -A
git commit -m "chore: production env config for diggai.de"
git push origin main
# → Netlify Webhook löst automatisch Build + Deploy aus
```

**Methode 3 — Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### 5.6 Frontend-Validierung

```bash
# Prüfen, ob die Seite erreichbar ist
curl -sI https://diggai.de | head -20

# Prüfen, ob Security-Headers gesetzt sind
curl -sI https://diggai.de | grep -iE "x-frame|x-content|strict-transport|referrer-policy"

# Prüfen, ob API-Calls vom Frontend funktionieren
curl -s https://diggai.de | grep -o 'api.diggai.de' | head -1
```

---

## SEKTION 6: Tomedo Tunnel (mTLS / Docker Container)

> **Kontext:** Der Tomedo-Tunnel verbindet den Hetzner-Server (Cloud) mit dem Praxis-Netzwerk  
> (On-Premise Tomedo-Server). Die Kommunikation wird über mTLS (Mutual TLS) abgesichert.

### 6.1 Docker auf dem Hetzner-Server installieren

```bash
# Docker Engine installieren (als diggai-deploy)
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# diggai-deploy zur Docker-Gruppe hinzufügen
sudo usermod -aG docker diggai-deploy

# Neue Shell starten, damit Gruppenmitgliedschaft aktiv wird
newgrp docker

# Docker-Funktionalität testen
docker run --rm hello-world
```

### 6.2 mTLS-Zertifikate für Tomedo-Tunnel vorbereiten

```bash
# Verzeichnis für Tunnel-Zertifikate erstellen
mkdir -p /opt/diggai/tomedo-tunnel/certs
cd /opt/diggai/tomedo-tunnel/certs

# CA-Key und CA-Zertifikat erstellen (Root CA für den Tunnel)
openssl genrsa -out ca-key.pem 4096
openssl req -new -x509 -sha256 -key ca-key.pem -out ca-cert.pem -days 3650 \
  -subj "/C=DE/ST=Hamburg/L=Hamburg/O=DiggAi GmbH/OU=Infrastructure/CN=DiggAi Tunnel CA"

# Server-Zertifikat (Hetzner-Seite)
openssl genrsa -out server-key.pem 4096
openssl req -new -sha256 -key server-key.pem -out server-csr.pem \
  -subj "/C=DE/ST=Hamburg/L=Hamburg/O=DiggAi GmbH/OU=Infrastructure/CN=tunnel.diggai.de"

cat << 'EOF' > server-ext.cnf
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = tunnel.diggai.de
DNS.2 = api.diggai.de
IP.1 = 127.0.0.1
EOF

openssl x509 -req -sha256 -in server-csr.pem -CA ca-cert.pem -CAkey ca-key.pem \
  -CAcreateserial -out server-cert.pem -days 825 -extfile server-ext.cnf

# Client-Zertifikat (Praxis-Seite / Tomedo)
openssl genrsa -out client-key.pem 4096
openssl req -new -sha256 -key client-key.pem -out client-csr.pem \
  -subj "/C=DE/ST=Hamburg/L=Hamburg/O=DiggAi Praxis/OU=Tomedo/CN=praxis-client"

cat << 'EOF' > client-ext.cnf
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
EOF

openssl x509 -req -sha256 -in client-csr.pem -CA ca-cert.pem -CAkey ca-key.pem \
  -CAcreateserial -out client-cert.pem -days 825 -extfile client-ext.cnf

# Berechtigungen absichern
chmod 600 *-key.pem
chmod 644 *-cert.pem ca-cert.pem

# Auflistung prüfen
ls -la /opt/diggai/tomedo-tunnel/certs/
```

### 6.3 Docker Compose für Tomedo-Tunnel

```bash
cat << 'COMPOSE_EOF' > /opt/diggai/tomedo-tunnel/docker-compose.yml
# ============================================
# DiggAi Tomedo Tunnel — mTLS Secured
# ============================================
version: "3.9"

services:
  tomedo-tunnel:
    image: nginx:alpine
    container_name: diggai-tomedo-tunnel
    restart: unless-stopped
    ports:
      - "127.0.0.1:8443:8443"   # Nur lokal erreichbar, NICHT von außen
    volumes:
      - ./certs:/etc/nginx/certs:ro
      - ./tunnel-nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - tunnel-net
    healthcheck:
      test: ["CMD", "wget", "--spider", "--quiet", "http://127.0.0.1:8443/tunnel-health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    labels:
      app: "diggai-tomedo-tunnel"
      environment: "production"

networks:
  tunnel-net:
    driver: bridge
COMPOSE_EOF
```

### 6.4 Nginx-Konfiguration für den Tunnel-Container

```bash
cat << 'TUNNEL_CONF_EOF' > /opt/diggai/tomedo-tunnel/tunnel-nginx.conf
# DiggAi Tomedo Tunnel — mTLS Nginx Config
server {
    listen 8443 ssl;
    server_name tunnel.diggai.de;

    # Server-Zertifikat
    ssl_certificate     /etc/nginx/certs/server-cert.pem;
    ssl_certificate_key /etc/nginx/certs/server-key.pem;

    # Client-Authentifizierung (mTLS)
    ssl_client_certificate /etc/nginx/certs/ca-cert.pem;
    ssl_verify_client on;
    ssl_verify_depth 2;

    # TLS-Härtung
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_timeout 1d;
    ssl_session_cache shared:TunnelSSL:10m;
    ssl_session_tickets off;

    # Logging
    access_log /var/log/nginx/tunnel.access.log;
    error_log  /var/log/nginx/tunnel.error.log warn;

    # Health-Check (kein mTLS nötig)
    location = /tunnel-health {
        ssl_verify_client off;
        return 200 '{"status":"ok","tunnel":"tomedo"}';
        add_header Content-Type application/json;
    }

    # Proxy zum Tomedo-System im Praxis-Netzwerk
    # HINWEIS: Zieladresse des Tomedo-Servers im Praxis-LAN anpassen
    location /tomedo/ {
        proxy_pass https://TOMEDO_PRAXIS_IP:TOMEDO_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Client-DN $ssl_client_s_dn;
        proxy_set_header X-Client-Verify $ssl_client_verify;
        proxy_connect_timeout 10s;
        proxy_read_timeout 60s;
    }
}
TUNNEL_CONF_EOF
```

### 6.5 Tunnel starten und verifizieren

```bash
cd /opt/diggai/tomedo-tunnel

# Container starten
docker compose up -d

# Logs prüfen
docker compose logs -f tomedo-tunnel

# Health-Check (ohne mTLS, lokal)
curl -sk https://127.0.0.1:8443/tunnel-health | python3 -m json.tool

# mTLS-Verbindung testen (mit Client-Zertifikat)
curl -sk \
  --cert certs/client-cert.pem \
  --key certs/client-key.pem \
  --cacert certs/ca-cert.pem \
  https://127.0.0.1:8443/tomedo/ \
  -w "\nHTTP Status: %{http_code}\n"
```

### 6.6 UFW-Regel für Tunnel (optional, falls externer Zugriff nötig)

```bash
# NUR aktivieren, wenn der Praxis-Client von außen zugreift:
# sudo ufw allow from <PRAXIS_PUBLIC_IP> to any port 8443 proto tcp
# Ansonsten bleibt Port 8443 nur auf 127.0.0.1 gebunden und ist von außen nicht erreichbar.
```

---

## SEKTION 7: Post-Deployment Validierung & Monitoring

### 7.1 End-to-End Smoke Test

```bash
#!/bin/bash
# smoke-test.sh — Auf dem Hetzner-Server oder lokal ausführen
set -e

echo "=== DiggAi Production Smoke Test ==="
echo ""

# 1. Backend Health
echo "[1/5] Backend Health Check..."
HEALTH=$(curl -sf https://api.diggai.de/health)
echo "$HEALTH" | python3 -m json.tool
echo "✓ Backend OK"
echo ""

# 2. Frontend erreichbar
echo "[2/5] Frontend erreichbar..."
HTTP_CODE=$(curl -so /dev/null -w '%{http_code}' https://diggai.de)
if [ "$HTTP_CODE" = "200" ]; then
  echo "✓ Frontend OK (HTTP $HTTP_CODE)"
else
  echo "✗ Frontend FEHLER (HTTP $HTTP_CODE)"
  exit 1
fi
echo ""

# 3. HTTPS-Redirect
echo "[3/5] HTTP→HTTPS Redirect..."
REDIRECT=$(curl -so /dev/null -w '%{http_code}' http://diggai.de)
if [ "$REDIRECT" = "301" ] || [ "$REDIRECT" = "308" ]; then
  echo "✓ Redirect OK (HTTP $REDIRECT)"
else
  echo "⚠ Redirect: HTTP $REDIRECT (erwartet: 301/308)"
fi
echo ""

# 4. API CORS Header
echo "[4/5] CORS Headers..."
CORS=$(curl -sI https://api.diggai.de/health | grep -i "access-control-allow-origin" || true)
echo "  $CORS"
echo "✓ CORS Check abgeschlossen"
echo ""

# 5. SSL-Zertifikat
echo "[5/5] SSL-Zertifikat..."
echo | openssl s_client -connect api.diggai.de:443 -servername api.diggai.de 2>/dev/null | \
  openssl x509 -noout -dates
echo "✓ SSL Check abgeschlossen"
echo ""

echo "=== Smoke Test abgeschlossen ==="
```

### 7.2 PM2 Monitoring einrichten

```bash
# PM2 Monitoring-Dashboard (Terminal-basiert)
pm2 monit

# Optionales Web-Dashboard (PM2 Plus)
# pm2 link <SECRET_KEY> <PUBLIC_KEY>  # → pm2.io Account benötigt
```

### 7.3 Log-Überwachung

```bash
# Backend-Logs live verfolgen
pm2 logs diggai-api --lines 50

# Nginx Access-Logs
sudo tail -f /var/log/nginx/api.diggai.de.access.log

# Nginx Error-Logs
sudo tail -f /var/log/nginx/api.diggai.de.error.log

# Fail2Ban Status
sudo fail2ban-client status sshd
```

### 7.4 Cronjob für Uptime-Monitoring (minimal)

```bash
# Einfaches Uptime-Monitoring via Cron
cat << 'CRON_EOF' > /opt/diggai/healthcheck.sh
#!/bin/bash
HEALTH=$(curl -sf --max-time 10 https://api.diggai.de/health || echo "FAIL")
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  exit 0
else
  echo "[$(date -Iseconds)] ALERT: api.diggai.de health check failed" >> /opt/diggai/alerts.log
  # Optional: Benachrichtigung per Mail
  # echo "DiggAi API Health Check FAILED at $(date)" | mail -s "ALERT: DiggAi API Down" admin@diggai.de
fi
CRON_EOF

chmod +x /opt/diggai/healthcheck.sh

# Alle 5 Minuten prüfen
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/diggai/healthcheck.sh") | crontab -
```

---

## SEKTION 8: Rollback-Prozedur

### 8.1 Backend Rollback

```bash
# PM2 Prozess stoppen
pm2 stop diggai-api

# Zum vorherigen Git-Commit wechseln
cd /opt/diggai/app
git log --oneline -5           # Vorherigen Commit identifizieren
git checkout <PREVIOUS_HASH>   # Oder: git revert HEAD

# Dependencies neu installieren
cd server && npm ci --production && cd ..

# Neu starten
pm2 restart diggai-api
pm2 logs diggai-api --lines 20
```

### 8.2 Frontend Rollback (Netlify)

1. **Netlify Dashboard** → **"Deploys"**
2. Auf einen vorherigen erfolgreichen Deploy klicken
3. **"Publish deploy"** klicken → Sofort aktiv

### 8.3 Notfall: Backend komplett neu aufsetzen

```bash
# Alles stoppen
pm2 delete diggai-api

# Neu klonen
cd /opt/diggai
rm -rf app
git clone https://github.com/DiggAiHH/Webseite.git app
cd app/server
npm ci --production
# .env muss neu erstellt oder aus Backup wiederhergestellt werden
cp /opt/diggai/backups/.env.latest ./server/.env

# Neu starten
cd /opt/diggai/app
pm2 start server/src/index.js --name "diggai-api" --env production
pm2 save
```

---

## CHECKLISTE — Definition of Done

- [ ] **DNS:** `diggai.de` → Netlify, `www.diggai.de` → Netlify, `api.diggai.de` → Hetzner IP
- [ ] **Server:** Ubuntu gehärtet (kein root SSH, UFW aktiv, Fail2Ban)
- [ ] **Node.js:** v20 LTS installiert, PM2 konfiguriert
- [ ] **Backend:** `diggai-api` PM2-Prozess läuft, `/health` antwortet `200`
- [ ] **Nginx:** Reverse Proxy aktiv, Traffic → `localhost:3000`
- [ ] **SSL:** Certbot-Zertifikat für `api.diggai.de` aktiv, Auto-Renewal bestätigt
- [ ] **Netlify:** Custom Domain `diggai.de` + `www.diggai.de` aktiv, HTTPS grün
- [ ] **Netlify Env:** `VITE_API_URL=https://api.diggai.de` gesetzt
- [ ] **Netlify Re-Deploy:** Nach Env-Änderung erfolgreich deployed
- [ ] **Tomedo Tunnel:** Docker Container läuft, mTLS-Verbindung verifiziert
- [ ] **Smoke Test:** Alle 5 Checks bestanden
- [ ] **Monitoring:** Cronjob aktiv, PM2 Logrotation konfiguriert
- [ ] **Backup:** `.env`-Datei gesichert, Zertifikate gesichert

---

> **Nächster Schritt:** Dieses Playbook Sektion für Sektion abarbeiten. Bei Fragen oder Fehlern  
> den Output des fehlgeschlagenen Befehls zusammen mit der Sektionsnummer dokumentieren.
