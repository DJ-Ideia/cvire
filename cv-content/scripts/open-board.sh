#!/usr/bin/env bash
set -euo pipefail

SLUG="${1:-}"
PORT="${CV_BOARD_PORT:-8765}"

if [[ -z "$SLUG" ]]; then
  echo "Usage: $0 <slug-board.html>" >&2
  exit 1
fi

FILE="$(basename "$SLUG")"
URL="http://127.0.0.1:${PORT}/${FILE}"

if ! curl -sf -o /dev/null "$URL"; then
  echo "Server not reachable at $URL — start with: npm run serve:cv-board" >&2
  exit 1
fi

echo "Opening $URL"
if command -v wslview >/dev/null 2>&1; then
  exec wslview "$URL"
fi
if command -v xdg-open >/dev/null 2>&1; then
  exec xdg-open "$URL"
fi
if command -v cmd.exe >/dev/null 2>&1; then
  cd /mnt/c 2>/dev/null || cd "$HOME"
  exec cmd.exe /c start "" "$URL"
fi
echo "Abra manualmente: $URL"
