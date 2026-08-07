#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DUMP="$ROOT/cv-content/outputs/dump"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <file> [more files...]" >&2
  exit 1
fi

mkdir -p "$DUMP"

for src in "$@"; do
  if [[ ! -e "$src" ]]; then
    continue
  fi
  base="$(basename "$src")"
  stem="${base%.*}"
  dest_dir="$DUMP/${stem}/${STAMP}"
  mkdir -p "$dest_dir"
  mv "$src" "$dest_dir/"
  echo "Archived → $dest_dir/$base"
done
