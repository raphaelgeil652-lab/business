#!/usr/bin/env bash
# Rendert eine Composition zu MP4.
#   ./render.sh                      -> KfzAufbereitung -> out/KfzAufbereitung.mp4
#   ./render.sh KfzFolierung         -> out/KfzFolierung.mp4
#   ./render.sh KfzAufbereitung out/mueller.mp4
set -euo pipefail
cd "$(dirname "$0")"

COMP="${1:-KfzAufbereitung}"
OUT="${2:-out/${COMP}.mp4}"

# Chromium ist in dieser Umgebung vorinstalliert (kein Remotion-Download nötig).
# Remotion braucht die chrome-headless-shell (das volle Chromium hat den alten
# Headless-Modus entfernt). Erst ENV, dann Auto-Erkennung.
BROWSER="${REMOTION_BROWSER:-}"
if [ -z "$BROWSER" ]; then
  BROWSER="$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1 || true)"
fi

mkdir -p out
if [ -n "$BROWSER" ]; then
  npx remotion render "$COMP" "$OUT" \
    --browser-executable="$BROWSER" \
    --chromium-no-sandbox \
    --concurrency=2
else
  # Fallback: Remotion lädt/nutzt seine eigene Browser-Binary.
  npx remotion render "$COMP" "$OUT" --chromium-no-sandbox --concurrency=2
fi

echo "✅ Fertig: $OUT"
