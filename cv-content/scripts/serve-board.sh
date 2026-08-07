#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="$ROOT/cv-content/outputs/html"
PORT="${CV_BOARD_PORT:-8765}"

if [[ ! -d "$DIR" ]]; then
  echo "Missing $DIR" >&2
  exit 1
fi

echo "Serving CV boards at http://127.0.0.1:${PORT}/"
echo "Directory: $DIR"
echo "Open e.g. http://127.0.0.1:${PORT}/<slug>-board.html"
echo "Stop with Ctrl+C"

cd "$DIR"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
