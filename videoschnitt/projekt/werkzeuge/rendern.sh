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

# Ton angleichen. Handyaufnahmen sind fast immer zu leise — auf dem Handy
# klingt das Video dann tonlos, obwohl Ton drauf ist. Ziel ist -14 LUFS,
# das ist der Wert, mit dem TikTok, Instagram und YouTube ausliefern.
# Abschalten mit: TON=aus
if [ "${TON:-an}" != "aus" ]; then
  TMP="${ZIEL%.mp4}-ton.mp4"
  if npx remotion ffmpeg -y -v error \
      -i "$ZIEL" -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
      -c:v copy -c:a aac -b:a 192k -ar 48000 "$TMP"; then
    mv "$TMP" "$ZIEL"
    echo "Ton auf -14 LUFS angeglichen."
  else
    rm -f "$TMP"
    echo "Ton konnte nicht angeglichen werden — das Video ist trotzdem fertig."
  fi
fi

echo "Fertig: $ZIEL"
