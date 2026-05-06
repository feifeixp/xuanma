#!/bin/bash
# Extract the current cloudflared tunnel URL and save it
# Run: bash /Users/ff/workspace/qimen-dunjia/scripts/get-tunnel-url.sh

LOG="/Users/ff/workspace/qimen-dunjia/backend/logs/tunnel-err.log"
ENV_FILE="/Users/ff/workspace/qimen-dunjia/frontend/.env.production"
URL_FILE="/Users/ff/workspace/qimen-dunjia/.tunnel_url"

TUNNEL_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' "$LOG" 2>/dev/null | tail -1)

if [ -z "$TUNNEL_URL" ]; then
    echo "No tunnel URL found. Is cloudflared running?"
    exit 1
fi

echo "$TUNNEL_URL" > "$URL_FILE"
echo "NEXT_PUBLIC_API_URL=$TUNNEL_URL" > "$ENV_FILE"
echo "Tunnel URL: $TUNNEL_URL"
echo "Saved to $URL_FILE and $ENV_FILE"

# Verify
curl -s --max-time 3 "$TUNNEL_URL/api/health" > /dev/null && echo "✅ Backend reachable" || echo "⚠️  Backend not reachable"
