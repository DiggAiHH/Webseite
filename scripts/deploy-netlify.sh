#!/usr/bin/env bash
# ============================================
# DiggAi.de — Netlify Production Deployment
# ============================================
# Nutzung:
#   NETLIFY_AUTH_TOKEN=<token> ./scripts/deploy-netlify.sh
#
# Voraussetzung: Netlify Personal Access Token
#   → https://app.netlify.com/user/applications#personal-access-tokens
# ============================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# ── Farben ──
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${CYAN}[deploy]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[⚠]${NC} $1"; }
fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ── 1. Auth prüfen ──
if [[ -z "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  fail "NETLIFY_AUTH_TOKEN ist nicht gesetzt.
  Erstelle einen Token: https://app.netlify.com/user/applications#personal-access-tokens
  Dann: NETLIFY_AUTH_TOKEN=<dein-token> $0"
fi

log "Auth-Token erkannt"

# ── 2. Netlify CLI prüfen / installieren ──
if ! command -v netlify &>/dev/null; then
  log "Installiere Netlify CLI..."
  npm install -g netlify-cli
fi
ok "Netlify CLI $(netlify --version)"

# ── 3. Site finden oder erstellen ──
SITE_NAME="diggai-frontend"

# Prüfe ob .netlify/state.json existiert
if [[ -f .netlify/state.json ]]; then
  SITE_ID=$(cat .netlify/state.json | grep -o '"siteId":"[^"]*"' | cut -d'"' -f4)
  log "Existierende Site gefunden: $SITE_ID"
else
  log "Erstelle neue Netlify Site: $SITE_NAME"
  
  # Site via API erstellen
  RESPONSE=$(curl -sf \
    -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$SITE_NAME\", \"custom_domain\": \"diggai.de\"}" \
    "https://api.netlify.com/api/v1/sites" 2>&1) || {
      # Falls Name bereits existiert, versuche die existierende Site zu finden
      log "Site existiert möglicherweise bereits, suche..."
      RESPONSE=$(curl -sf \
        -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
        "https://api.netlify.com/api/v1/sites?name=$SITE_NAME" 2>&1) || fail "Netlify API Fehler"
      RESPONSE=$(echo "$RESPONSE" | head -c 5000)
    }
  
  SITE_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  SITE_URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [[ -z "$SITE_ID" ]]; then
    fail "Konnte Site-ID nicht ermitteln. API Response: $(echo "$RESPONSE" | head -c 500)"
  fi
  
  # State lokal speichern
  mkdir -p .netlify
  echo "{\"siteId\": \"$SITE_ID\"}" > .netlify/state.json
  ok "Site erstellt: $SITE_ID ($SITE_URL)"
fi

# ── 4. Environment Variables setzen ──
log "Setze Environment Variables..."

set_env_var() {
  local key="$1" value="$2"
  # Lösche alte Variable (ignoriere Fehler falls nicht vorhanden)
  curl -sf -X DELETE \
    -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
    "https://api.netlify.com/api/v1/sites/$SITE_ID/env/$key" &>/dev/null || true
  
  # Neue Variable setzen
  curl -sf -X POST \
    -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d "[{\"key\": \"$key\", \"values\": [{\"value\": \"$value\", \"context\": \"production\"}]}]" \
    "https://api.netlify.com/api/v1/sites/$SITE_ID/env" &>/dev/null && \
    ok "  $key = $value" || warn "  $key konnte nicht gesetzt werden"
}

set_env_var "VITE_API_URL" "https://api.diggai.de"
set_env_var "NODE_VERSION" "20"

# ── 5. Build ──
log "Baue Produktion-Frontend..."
npm run build
ok "Build erfolgreich (dist/)"

# ── 6. Deploy ──
log "Deploye zu Netlify (Production)..."
netlify deploy \
  --prod \
  --dir=dist \
  --functions=netlify/functions \
  --site="$SITE_ID" \
  --auth="$NETLIFY_AUTH_TOKEN" \
  --message="Production deploy $(date -Iseconds)"

ok "Production Deploy abgeschlossen!"

# ── 7. Custom Domain konfigurieren ──
log "Konfiguriere Custom Domain diggai.de..."

# Hauptdomain setzen
curl -sf -X POST \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hostname": "diggai.de"}' \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/domains" &>/dev/null && \
  ok "  Domain diggai.de registriert" || warn "  diggai.de bereits registriert oder Fehler"

# www-Subdomain setzen
curl -sf -X POST \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hostname": "www.diggai.de"}' \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/domains" &>/dev/null && \
  ok "  Domain www.diggai.de registriert" || warn "  www.diggai.de bereits registriert oder Fehler"

# ── 8. SSL provisionieren ──
log "Provisioniere SSL-Zertifikat..."
curl -sf -X POST \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  "https://api.netlify.com/api/v1/sites/$SITE_ID/ssl" &>/dev/null && \
  ok "SSL-Zertifikat wird provisioniert" || warn "SSL-Provisionierung: DNS muss erst korrekt konfiguriert sein"

# ── 9. Zusammenfassung ──
echo ""
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}  DiggAi.de Netlify Deployment erfolgreich  ${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo ""
echo "  Site ID:     $SITE_ID"
echo "  Netlify URL: https://$SITE_NAME.netlify.app"
echo "  Custom:      https://diggai.de (nach DNS-Setup)"
echo ""
echo "  Nächste Schritte:"
echo "  1. DNS-Records setzen (siehe INFRASTRUCTURE_DEPLOYMENT_PLAN.md Sektion 1)"
echo "  2. Warten auf DNS-Propagation (5-30 Minuten)"
echo "  3. SSL wird automatisch provisioniert nach DNS-Verifikation"
echo ""
