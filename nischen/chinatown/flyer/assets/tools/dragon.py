"""Schritt 4: Den Drachen vom alten Papierflyer vektorisieren -> assets/drache.svg

Der Drache auf dem bisherigen Flyer ist eine gedruckte Linienzeichnung. Hier wird sie
freigestellt, von der Papier-Schattierung befreit, binarisiert und in SVG-Pfade
umgewandelt. Ergebnis ist vektoriell, also in jeder Druckgröße scharf, und es bleibt
*ihr eigener* Drache.
"""
import os
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.dirname(HERE)
SRC = f"{ASSETS}/quellen/altflyer-seite2.jpeg"
WORK = f"{HERE}/_work"
os.makedirs(WORK, exist_ok=True)

# Bildausschnitt des Drachen (ohne die Textzeile darüber)
Y0, Y1, X0, X1 = 2185, 2705, 3045, 3480

img = cv2.imread(SRC)
if img is None:
    raise SystemExit(f"Quellbild nicht gefunden: {SRC}")
crop = img[Y0:Y1, X0:X1]
gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY).astype(np.float32)

# Papier-Schattierung herausrechnen: durch stark weichgezeichnete Version teilen
bg = cv2.GaussianBlur(gray, (0, 0), 30)
flat = np.clip(gray / np.maximum(bg, 1e-3) * 255.0, 0, 255).astype(np.uint8)

# hochskalieren -> weichere Kanten beim Tracen
scale = 3
flat = cv2.resize(flat, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
flat = cv2.GaussianBlur(flat, (0, 0), 1.2)

_, binary = cv2.threshold(flat, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8), iterations=2)
binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8), iterations=1)
# Striche leicht verstärken, damit die Zeichnung im Druck nicht aufbricht
binary = cv2.dilate(binary, np.ones((3, 3), np.uint8), iterations=1)

# Rauschen entfernen: winzige Komponenten verwerfen
n, lab, stats, _ = cv2.connectedComponentsWithStats(binary, 8)
keep = np.zeros_like(binary)
min_area = 15 * scale * scale
for i in range(1, n):
    if stats[i, cv2.CC_STAT_AREA] >= min_area:
        keep[lab == i] = 255
binary = keep
cv2.imwrite(f"{WORK}/dbg_dragon_binary.png", binary)

# Konturen -> SVG-Pfade (evenodd, damit Innenflächen als Löcher wirken)
cnts, _ = cv2.findContours(binary, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
h, w = binary.shape
parts = []
pts_total = 0
for c in cnts:
    if cv2.contourArea(c) < 12 * scale * scale:
        continue
    approx = cv2.approxPolyDP(c, 0.7, True).reshape(-1, 2)
    if len(approx) < 3:
        continue
    pts_total += len(approx)
    d = "M" + " ".join(f"{x},{y}" for x, y in approx) + "Z"
    parts.append(d)

# Der Goldverlauf steckt direkt in der Datei, damit sie im Flyer als schlichtes
# <img> eingebunden werden kann. (Chromium lädt bei file:// keine externe SVG als
# CSS-Maske, und currentColor hat in einer eingebetteten Grafik keinen Farbkontext.)
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
    f'role="img" aria-label="Chinesischer Drache">\n'
    f'  <defs>\n'
    f'    <linearGradient id="drachengold" x1="0" y1="0" x2="0" y2="1">\n'
    f'      <stop offset="0" stop-color="#f7e2a0"/>\n'
    f'      <stop offset="0.55" stop-color="#d8b04a"/>\n'
    f'      <stop offset="1" stop-color="#9a7820"/>\n'
    f'    </linearGradient>\n'
    f'  </defs>\n'
    f'  <path fill="url(#drachengold)" fill-rule="evenodd" d="{"".join(parts)}"/>\n'
    f'</svg>\n'
)
out = f"{ASSETS}/drache.svg"
with open(out, "w") as fh:
    fh.write(svg)
print(f"{len(parts)} Konturen, {pts_total} Punkte, {len(svg) / 1024:.1f} KB -> {out}")
