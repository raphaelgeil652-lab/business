#!/usr/bin/env bash
# Rendert eine Komposition zu einer fertigen MP4-Datei.
#
# Aufruf (aus dem Ordner `videoschnitt/projekt`):
#   werkzeuge/rendern.sh Kurzvideo ausgabe/kurzvideo.mp4
#   werkzeuge/rendern.sh Werbeclip ausgabe/werbeclip.mp4
#
# Auf dem eigenen Rechner laedt Remotion sich beim ersten Mal einen eigenen
# Browser herunter. In einer Umgebung, in der schon ein Chromium liegt, wird
# der genommen — das spart den Download.
set -euo pipefail

KOMPOSITION="${1:-Werbeclip}"
ZIEL="${2:-ausgabe/${KOMPOSITION,,}.mp4}"

ARGS=(remotion render src/index.ts "$KOMPOSITION" "$ZIEL")

for KANDIDAT in \
  /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell \
  /opt/pw-browsers/chromium-*/chrome-linux/chrome; do
  if [ -x "$KANDIDAT" ]; then
    ARGS+=("--browser-executable=$KANDIDAT")
    break
  fi
done

mkdir -p "$(dirname "$ZIEL")"
npx "${ARGS[@]}"
echo "Fertig: $ZIEL"
