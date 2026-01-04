#!/usr/bin/env bash
set -euo pipefail

TARGET_URL="${ZAP_TARGET_URL:-http://localhost}"
OUT_DIR="${ZAP_OUT_DIR:-zap-report}"

mkdir -p "$OUT_DIR"

# Defensive baseline scan (no auth, no exploitation). Produces HTML + JSON reports.
# Requires Docker.

docker run --rm \
  --network host \
  -v "$PWD/$OUT_DIR:/zap/wrk" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
  -t "$TARGET_URL" \
  -r report.html \
  -J report.json \
  -m 5 \
  -a

echo "ZAP report written to $OUT_DIR/report.html"
