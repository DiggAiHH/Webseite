#!/usr/bin/env bash
# ============================================================
# DiggAi.de — Hetzner Server Provisioning (Remote Execution)
# ============================================================
# Dieses Script wird LOKAL ausgeführt und führt via SSH
# alle Befehle auf dem Hetzner-Server aus.
#
# Nutzung:
#   ./scripts/provision-hetzner.sh <SERVER_IP> [SSH_KEY_PATH]
#
# Beispiel:
#   ./scripts/provision-hetzner.sh 159.69.42.100 ~/.ssh/diggai_ed25519
#
# Voraussetzungen:
#   - Root-SSH-Zugang zum Hetzner-Server
#   - SSH-Key authentifiziert
#   - Server: Ubuntu 22.04 / 24.04
# ============================================================
set -euo pipefail

# ── Parameter ──
SERVER_IP="${1:?Fehler: Server-IP als erstes Argument angeben. Nutzung: $0 <IP> [SSH_KEY]}"
SSH_KEY="${2:-$HOME/.ssh/id_ed25519}"
SSH_USER="root"
DEPLOY_USER="diggai-deploy"
APP_DIR="/opt/diggai"
REPO_URL="https://github.com/DiggAiHH/Webseite.git"

# ── Farben ──
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${CYAN}[hetzner]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[⚠]${NC} $1"; }
fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ── SSH Helper ──
ssh_cmd() {
  ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10 -i "$SSH_KEY" "$SSH_USER@$SERVER_IP" "$@"
}

# ── Pre-Flight Check ──
log "Teste SSH-Verbindung zu $SERVER_IP..."
ssh_cmd "echo 'SSH OK — $(hostname) — $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)'" || \
  fail "SSH-Verbindung fehlgeschlagen. Prüfe IP, SSH-Key und Firewall."
ok "SSH-Verbindung hergestellt"

# ══════════════════════════════════════════
# PHASE 1: System-Härtung
# ══════════════════════════════════════════
log "━━━ Phase 1: System-Härtung ━━━"

log "1.1 System aktualisieren..."
ssh_cmd "DEBIAN_FRONTEND=noninteractive apt update && apt upgrade -y && apt autoremove -y"
ok "System aktualisiert"

log "1.2 Deploy-User '$DEPLOY_USER' erstellen..."
ssh_cmd "id $DEPLOY_USER &>/dev/null && echo 'User existiert bereits' || {
  adduser --disabled-password --gecos 'DiggAi Deploy' $DEPLOY_USER
  usermod -aG sudo $DEPLOY_USER
  echo '$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/$DEPLOY_USER
  chmod 440 /etc/sudoers.d/$DEPLOY_USER
  
  # SSH-Key kopieren
  mkdir -p /home/$DEPLOY_USER/.ssh
  chmod 700 /home/$DEPLOY_USER/.ssh
  cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/authorized_keys
  chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
  chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
  echo 'User erstellt und SSH-Key kopiert'
}"
ok "Deploy-User konfiguriert"

log "1.3 SSH härten..."
ssh_cmd "cat << 'SSHEOF' > /etc/ssh/sshd_config.d/99-hardening.conf
PermitRootLogin prohibit-password
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
X11Forwarding no
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
SSHEOF
sshd -t && systemctl restart sshd"
ok "SSH gehärtet"

log "1.4 UFW Firewall..."
ssh_cmd "ufw --force reset >/dev/null 2>&1 || true
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw limit ssh/tcp
ufw --force enable
echo 'UFW aktiv'"
ok "Firewall konfiguriert"

log "1.5 Fail2Ban..."
ssh_cmd "apt install -y fail2ban >/dev/null 2>&1
cat << 'F2BEOF' > /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 3
backend  = systemd

[sshd]
enabled  = true
port     = ssh
maxretry = 3
bantime  = 7200

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
F2BEOF
systemctl enable fail2ban
systemctl restart fail2ban"
ok "Fail2Ban installiert"

log "1.6 Unattended Upgrades..."
ssh_cmd "DEBIAN_FRONTEND=noninteractive apt install -y unattended-upgrades >/dev/null 2>&1
echo 'APT::Periodic::Update-Package-Lists \"1\";
APT::Periodic::Unattended-Upgrade \"1\";' > /etc/apt/apt.conf.d/20auto-upgrades"
ok "Auto-Security-Updates aktiv"

# ══════════════════════════════════════════
# PHASE 2: Application Stack
# ══════════════════════════════════════════
log "━━━ Phase 2: Application Stack ━━━"

log "2.1 Node.js 20 installieren..."
ssh_cmd "if ! command -v node &>/dev/null || ! node -v | grep -q 'v20'; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null 2>&1
  apt install -y nodejs >/dev/null 2>&1
fi
echo \"Node.js \$(node -v) / npm \$(npm -v)\""
ok "Node.js installiert"

log "2.2 PM2 installieren..."
ssh_cmd "npm install -g pm2 >/dev/null 2>&1 && echo 'PM2 installiert: '$(pm2 -v)"
ok "PM2 installiert"

log "2.3 Nginx installieren..."
ssh_cmd "apt install -y nginx >/dev/null 2>&1 && systemctl enable nginx"
ok "Nginx installiert"

log "2.4 Certbot installieren..."
ssh_cmd "apt install -y certbot python3-certbot-nginx >/dev/null 2>&1"
ok "Certbot installiert"

log "2.5 Git & Build-Tools..."
ssh_cmd "apt install -y git build-essential >/dev/null 2>&1"
ok "Build-Tools installiert"

# ══════════════════════════════════════════
# PHASE 3: App Deployment
# ══════════════════════════════════════════
log "━━━ Phase 3: App Deployment ━━━"

log "3.1 App-Verzeichnis vorbereiten..."
ssh_cmd "mkdir -p $APP_DIR && chown $DEPLOY_USER:$DEPLOY_USER $APP_DIR"

# Ab hier als deploy-user
SSH_USER="$DEPLOY_USER"

log "3.2 Repository klonen/aktualisieren..."
ssh_cmd "cd $APP_DIR
if [ -d app/.git ]; then
  cd app && git pull origin main
  echo 'Repository aktualisiert'
else
  git clone $REPO_URL app
  echo 'Repository geklont'
fi"
ok "Code auf Server"

log "3.3 Server-Dependencies installieren..."
ssh_cmd "cd $APP_DIR/app/server && npm ci --production 2>&1 | tail -3"
ok "Dependencies installiert"

# ── .env-Datei Handling ──
log "3.4 Environment-Datei prüfen..."
ENV_EXISTS=$(ssh_cmd "[ -f $APP_DIR/app/server/.env ] && echo 'yes' || echo 'no'")
if [[ "$ENV_EXISTS" == "no" ]]; then
  warn ".env-Datei existiert NICHT — erstelle Template..."
  ssh_cmd "cat << 'ENVEOF' > $APP_DIR/app/server/.env
NODE_ENV=production
PORT=3000

# SMTP — IONOS Credentials hier eintragen:
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=no-reply@diggai.de
SMTP_PASS=__HIER_PASSWORT_EINTRAGEN__

MAIL_TO=kontakt@diggai.de
MAIL_FROM=no-reply@diggai.de
MAIL_SUBJECT_PREFIX=[DiggAi Anfrage]
ENVEOF
chmod 600 $APP_DIR/app/server/.env"
  warn "⚠ SMTP-Passwort muss manuell eingetragen werden!"
  warn "  → ssh $DEPLOY_USER@$SERVER_IP 'nano $APP_DIR/app/server/.env'"
else
  ok ".env-Datei existiert bereits"
fi

# ── PM2 starten ──
log "3.5 Backend mit PM2 starten..."
ssh_cmd "cd $APP_DIR/app
pm2 delete diggai-api 2>/dev/null || true
pm2 start server/src/index.js \
  --name 'diggai-api' \
  --max-memory-restart 256M \
  --log-date-format 'YYYY-MM-DD HH:mm:ss Z' \
  --merge-logs \
  --env production

# Autostart
pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER 2>&1 | grep 'sudo' | bash 2>/dev/null || true
pm2 save
pm2 status"
ok "PM2 Backend läuft"

log "3.6 PM2 Log-Rotation..."
ssh_cmd "pm2 install pm2-logrotate 2>/dev/null || true
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true" 2>/dev/null || true
ok "Log-Rotation konfiguriert"

# ══════════════════════════════════════════
# PHASE 4: Nginx Reverse Proxy + SSL
# ══════════════════════════════════════════
SSH_USER="root"  # Zurück zu root für Nginx

log "━━━ Phase 4: Nginx & SSL ━━━"

log "4.1 Nginx Server-Block erstellen..."
ssh_cmd "cat << 'NGINXEOF' > /etc/nginx/sites-available/api.diggai.de
limit_req_zone \\\$binary_remote_addr zone=api_limit:10m rate=10r/s;

upstream diggai_backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.diggai.de;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://\\\$host\\\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.diggai.de;

    # SSL wird von Certbot eingefügt
    # ssl_certificate /etc/letsencrypt/live/api.diggai.de/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/api.diggai.de/privkey.pem;

    add_header X-Frame-Options \"DENY\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;
    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\" always;
    add_header Access-Control-Allow-Origin \"https://diggai.de\" always;
    add_header Access-Control-Allow-Methods \"GET, POST, OPTIONS\" always;
    add_header Access-Control-Allow-Headers \"Content-Type, Authorization\" always;

    access_log /var/log/nginx/api.diggai.de.access.log;
    error_log  /var/log/nginx/api.diggai.de.error.log warn;

    client_max_body_size 1m;
    server_tokens off;

    location ~ /\\\. {
        deny all;
        return 404;
    }

    location = /health {
        proxy_pass http://diggai_backend/health;
        proxy_http_version 1.1;
        proxy_set_header Connection \"\";
        access_log off;
    }

    location / {
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;

        proxy_pass http://diggai_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
        proxy_set_header X-Request-ID \\\$request_id;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection \"upgrade\";

        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;

        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;

        add_header Cache-Control \"no-store, no-cache, must-revalidate\" always;

        if (\\\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin \"https://diggai.de\" always;
            add_header Access-Control-Allow-Methods \"GET, POST, OPTIONS\" always;
            add_header Access-Control-Allow-Headers \"Content-Type, Authorization\" always;
            add_header Access-Control-Max-Age \"86400\";
            add_header Content-Length 0;
            add_header Content-Type \"text/plain\";
            return 204;
        }
    }
}
NGINXEOF"
ok "Nginx-Config geschrieben"

log "4.2 Site aktivieren..."
ssh_cmd "ln -sf /etc/nginx/sites-available/api.diggai.de /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx"
ok "Nginx aktiv"

log "4.3 SSL-Zertifikat (Certbot)..."
echo ""
warn "ACHTUNG: Certbot benötigt funktionierenden DNS für api.diggai.de!"
warn "Falls DNS noch nicht konfiguriert ist, diesen Befehl MANUELL ausführen:"
echo ""
echo "  ssh root@$SERVER_IP 'certbot --nginx -d api.diggai.de --non-interactive --agree-tos --email admin@diggai.de --redirect'"
echo ""

# Versuche Certbot (ignoriere Fehler falls DNS noch nicht bereit)
ssh_cmd "certbot --nginx -d api.diggai.de --non-interactive --agree-tos --email admin@diggai.de --redirect 2>&1" && \
  ok "SSL-Zertifikat aktiv" || \
  warn "Certbot fehlgeschlagen (DNS vermutlich noch nicht konfiguriert — manuell nachholen)"

# ══════════════════════════════════════════
# PHASE 5: Health Check
# ══════════════════════════════════════════
log "━━━ Phase 5: Verifizierung ━━━"

log "5.1 Backend Health Check (lokal auf Server)..."
HEALTH=$(ssh_cmd "curl -sf http://localhost:3000/health 2>/dev/null || echo 'UNREACHABLE'")
echo "  → $HEALTH"

if echo "$HEALTH" | grep -q '"status"'; then
  ok "Backend antwortet korrekt"
else
  warn "Backend noch nicht erreichbar — PM2 Logs prüfen"
fi

# ── Zusammenfassung ──
echo ""
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Hetzner Server Provisioning abgeschlossen       ${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════${NC}"
echo ""
echo "  Server:     $SERVER_IP"
echo "  User:       $DEPLOY_USER"
echo "  App:        $APP_DIR/app"
echo "  Backend:    PM2 → diggai-api (Port 3000)"
echo "  Nginx:      api.diggai.de → localhost:3000"
echo ""
echo "  Offene Punkte:"
echo "  [ ] DNS: A-Record 'api' → $SERVER_IP setzen"
echo "  [ ] SSH: PermitRootLogin auf 'no' setzen nach Verifikation"
echo "  [ ] .env: SMTP-Passwort eintragen"
echo "  [ ] SSL: Certbot manuell ausführen nach DNS-Setup"
echo "  [ ] Tomedo-Tunnel: docker compose up -d (siehe INFRASTRUCTURE_DEPLOYMENT_PLAN.md)"
echo ""
