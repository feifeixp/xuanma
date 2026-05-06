#!/bin/bash
# Redeploy frontend with current tunnel URL
# Run: bash /Users/ff/workspace/qimen-dunjia/scripts/redeploy.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="/Users/ff/workspace/qimen-dunjia/frontend"

echo "=== Step 1: Get tunnel URL ==="
bash "$SCRIPT_DIR/get-tunnel-url.sh"

echo ""
echo "=== Step 2: Build frontend ==="
cd "$FRONTEND_DIR"
npx next build 2>&1 | tail -5

echo ""
echo "=== Step 3: Deploy to Cloudflare Pages ==="
npx wrangler pages deploy out --project-name=xuanma --commit-dirty=true 2>&1 | tail -5

echo ""
echo "=== Done ==="
echo "Tunnel: $(cat /Users/ff/workspace/qimen-dunjia/.tunnel_url)"
echo "Frontend: https://xuanma.pages.dev"
