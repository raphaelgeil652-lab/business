"""Schritt 1: Winkekatze aus dem Originalfoto freistellen (GrabCut).

Ergebnis: _work/crop.png (Bildausschnitt) + _work/mask.png (Freistell-Maske).
Danach grade.py laufen lassen.
"""
import os
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.dirname(HERE)
SRC = f"{ASSETS}/quellen/winkekatze-original.jpeg"
WORK = f"{HERE}/_work"
os.makedirs(WORK, exist_ok=True)

img = cv2.imread(SRC)
if img is None:
    raise SystemExit(f"Quellbild nicht gefunden: {SRC}")
print("Quelle:", img.shape[1], "x", img.shape[0])

# Grobe Bounding-Box der Katze im Originalfoto
x0, y0, x1, y1 = 1280, 600, 2500, 2400
crop = img[y0:y1, x0:x1]
ch, cw = crop.shape[:2]

mask = np.zeros((ch, cw), np.uint8)
bgd = np.zeros((1, 65), np.float64)
fgd = np.zeros((1, 65), np.float64)
rect = (int(cw * 0.06), int(ch * 0.03), int(cw * 0.88), int(ch * 0.94))
cv2.grabCut(crop, mask, rect, bgd, fgd, 8, cv2.GC_INIT_WITH_RECT)

m = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

# Aufräumen: schließen, öffnen, größte Komponente, Löcher füllen
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8), iterations=3)
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8), iterations=2)
n, lab, stats, _ = cv2.connectedComponentsWithStats(m, 8)
if n > 1:
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    m = np.where(lab == big, 255, 0).astype(np.uint8)
cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
m = np.zeros_like(m)
cv2.drawContours(m, cnts, -1, 255, cv2.FILLED)

cv2.imwrite(f"{WORK}/crop.png", crop)
cv2.imwrite(f"{WORK}/mask.png", m)
print(f"Maske deckt {100 * m.mean() / 255:.1f}% des Ausschnitts -> {WORK}/")
