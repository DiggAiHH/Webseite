#!/usr/bin/env bash
# ============================================================
# DiggAi.de — Full Production Stack Deployment
# ============================================================
# Ein Befehl für alles: Netlify + Hetzner + DNS-Verifizierung
#
# Nutzung:
#   NETLIFY_AUTH_TOKEN=<token> ./scripts/go-live.sh [HETZNER_IP] [SSH_KEY]
#
# Nur Netlify:
#   NETLIFY_AUTH_TOKEN=<token> ./scripts/go-live.sh
#
# Vollständig:
#   NETLIFY_AUTH_TOKEN=<token> ./scripts/go-live.sh 159.69.42.100 ~/.ssh/diggai
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

HETZNER_IP="${1:-}"
SSH_KEY="${2:-$HOME/.ssh/id_ed25519}"

echo -e "${BOLD}"
echo "╔══════════════════════════════════════════════╗"
echo "║   DiggAi.de — Production Go-Live Sequence    ║"
echo "║   $(date '+%Y-%m-%d %H:%M:%S %Z')                  ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Step 1: Netlify ──
echo -e "${CYAN}━━━ STEP 1/3: Netlify Frontend Deploy ━━━${NC}"
if [[ -n "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  bash "$SCRIPT_DIR/deploy-netlify.sh"
else
  echo -e "${YELLOW}[⚠] NETLIFY_AUTH_TOKEN nicht gesetzt — überspringe Netlify${NC}"
  echo "    → NETLIFY_AUTH_TOKEN=<token> $0 $*"
fi

echo ""

# ── Step 2: Hetzner ──
echo -e "${CYAN}━━━ STEP 2/3: Hetzner Backend Provisioning ━━━${NC}"
if [[ -n "$HETZNER_IP" ]]; then
  bash "$SCRIPT_DIR/provision-hetzner.sh" "$HETZNER_IP" "$SSH_KEY"
else
  echo -e "${YELLOW}[⚠] Keine Hetzner-IP angegeben — überspringe Server-Setup${NC}"
  echo "    → $0 <HETZNER_IP> [SSH_KEY_PATH]"
fi

echo ""

# ── Step 3: DNS Check ──
echo -e "${CYAN}━━━ STEP 3/3: DNS-Verifizierung ━━━${NC}"

check_dns() {
  local domain="$1" expected="$2" type="${3:-A}"
  local result
  result=$(dig +short "$domain" "$type" 2>/dev/null | head -1)
  if [[ -n "$result" ]]; then
    if [[ "$result" == *"$expected"* ]]; then
      echo -e "${GREEN}[✓]${NC} $domain → $result"
    else
      echo -e "${YELLOW}[⚠]${NC} $domain → $result (erwartet: $expected)"
    fi
  else
    echo -e "${RED}[✗]${NC} $domain — kein DNS-Record gefunden"
  fi
}

check_dns "diggai.de" "75.2.60.5"
check_dns "www.diggai.de" "netlify"
if [[ -n "$HETZNER_IP" ]]; then
  check_dns "api.diggai.de" "$HETZNER_IP"
else
  echo -e "${YELLOW}[⚠]${NC} api.diggai.de — Hetzner-IP unbekannt, DNS nicht prüfbar"
fi

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║            DNS-Records zum Setzen             ║${NC}"
echo -e "${BOLD}╠══════════════════════════════════════════════╣${NC}"
echo -e "${BOLD}║ Typ   │ Name  │ Wert                        ║${NC}"
echo -e "${BOLD}╠═══════╪═══════╪═════════════════════════════╣${NC}"
echo -e "${BOLD}║ A     │ @     │ 75.2.60.5   (Netlify LB)    ║${NC}"
echo -e "${BOLD}║ CNAME │ www   │ diggai-frontend.netlify.app  ║${NC}"
if [[ -n "$HETZNER_IP" ]]; then
echo -e "${BOLD}║ A     │ api   │ $HETZNER_IP                  ║${NC}"
else
echo -e "${BOLD}║ A     │ api   │ <HETZNER_IP>                 ║${NC}"
fi
echo -e "${BOLD}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Go-Live Sequenz abgeschlossen. DNS-Records manuell setzen!${NC}"
