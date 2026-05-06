#!/bin/bash
# /Users/ff/workspace/qimen-dunjia/scripts/update-tunnel-url.sh
# Called by launchd after cloudflared tunnel starts.
# Extracts the tunnel URL, updates .env, rebuilds frontend, redeploys.

set -euo pipefail

LOG="/Users/ff/workspace/qimen-dunjia/backend/logs/tunnel-err.log"
ENV_FILE="/Users/ff/workspace/qimen-dunjia/frontend/.env.production"
FRONTEND_DIR="/Users/ff/workspace/qimen-dunjia/frontend"

# Wait for tunnel log to have a URL
for i in {1..20}; do
    TUNNEL_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" 2>/dev/null | tail -1)
    if [ -n "$TUNNEL_URL" ]; then
        break
    fi
    sleep 3
done

if [ -z "$TUNNEL_URL" ]; then
    echo "ERROR: Could not find tunnel URL in $LOG" >&2
    exit 1
fi

echo "Tunnel URL: $TUNNEL_URL"

# Update .env.production
echo "NEXT_PUBLIC_API_URL=$TUNNEL_URL" > "$ENV_FILE"

# Rebuild frontend
cd "$FRONTEND_DIR"
npx next build --no-lint 2>&1

# Redeploy
npx wrangler pages deploy out --project-name=xuanma --commit-dirty=true 2>&1

echo "Redeploy complete: $TUNNEL_URL"
