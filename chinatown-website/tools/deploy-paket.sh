#!/bin/sh
# Baut ein ZIP mit genau den Dateien, die auf den Server gehoeren.
# Aufruf aus dem Webseiten-Ordner:  sh tools/deploy-paket.sh
set -e
ZIEL="${1:-chinatown-webseite-vercel.zip}"
TMP="$(mktemp -d)"
cp index.html speisekarte.html kontakt.html impressum.html datenschutz.html style.css script.js vercel.json "$TMP/"
cp -r assets "$TMP/"
rm -f "$ZIEL"
(cd "$TMP" && zip -qr - .) > "$ZIEL"
rm -rf "$TMP"
echo "fertig: $ZIEL"
