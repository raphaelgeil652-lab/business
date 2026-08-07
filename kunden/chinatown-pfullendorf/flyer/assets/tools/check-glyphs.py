"""Prüft, ob alle im Flyer verwendeten CJK-Zeichen im Font-Subset enthalten sind.

Ein fehlendes Zeichen fällt im Druck auf einen Ersatzfont zurück und sieht falsch aus.
Nach jeder Änderung am HTML ausführen.
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
FLYER = os.path.dirname(os.path.dirname(HERE))

sys.path.insert(0, HERE)
import fonts as fonts_mod  # noqa: E402  (liefert den Zeichenvorrat)

available = set(fonts_mod.LATIN + fonts_mod.CJK)

html = open(f"{FLYER}/faltflyer.html", encoding="utf-8").read()
# Nur den sichtbaren Text prüfen: Tags und CSS entfernen
text = re.sub(r"<style.*?</style>|<script.*?</script>", " ", html, flags=re.S)
text = re.sub(r"<[^>]+>", " ", text)

used = {c for c in text if "一" <= c <= "鿿"}
missing = sorted(used - available)

print(f"verwendete CJK-Zeichen: {len(used)}")
if missing:
    print("FEHLEND im Font-Subset:", "".join(missing))
    print("-> in fonts.py zur CJK-Liste hinzufügen und fonts.py erneut ausführen")
    raise SystemExit(1)
print("alle Zeichen im Subset enthalten ✓")
