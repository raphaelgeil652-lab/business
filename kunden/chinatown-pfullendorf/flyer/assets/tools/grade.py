"""Schritt 2: Freigestellte Winkekatze auf sattes Gold graden -> assets/winkekatze.png

Behebt gegenüber der ersten Fassung:
  * fleckiges Latz (Türkis wurde nur teilweise verschoben) -> zusammenhängende Region,
    einheitlich in tiefes Rot umgefärbt, Schattierung aus der Luminanz übernommen
  * Terrakotta-Rest am Sockel -> höherer Schnitt + längeres Ausblenden
  * dunkle Halos an der Kante -> Maske stärker eingezogen
  * Solarzelle im Sockel -> abgedunkelt, damit sie nicht nach Plastik aussieht
"""
import os
import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.dirname(HERE)
WORK = f"{HERE}/_work"

crop = cv2.imread(f"{WORK}/crop.png")
m = cv2.imread(f"{WORK}/mask.png", cv2.IMREAD_GRAYSCALE)
if crop is None or m is None:
    raise SystemExit("Bitte zuerst cutout.py ausführen.")

# --- auf die Maske zuschneiden ----------------------------------------------
ys, xs = np.where(m > 0)
pad = 12
y0, y1 = max(0, ys.min() - pad), min(m.shape[0] - 1, ys.max() + pad)
x0, x1 = max(0, xs.min() - pad), min(m.shape[1] - 1, xs.max() + pad)
crop, m = crop[y0:y1, x0:x1], m[y0:y1, x0:x1]
h, w = m.shape

# --- Unterkante: Kunststoff-Sockel abschneiden -------------------------------
hsv0 = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
H0, S0, V0 = hsv0[..., 0].astype(int), hsv0[..., 1].astype(int), hsv0[..., 2].astype(int)
gold_px = (H0 >= 12) & (H0 <= 38) & (S0 > 70) & (V0 > 70) & (m > 0)
per_row = gold_px.sum(1)
rows = np.where(per_row > per_row.max() * 0.30)[0]
cut = int(rows.max()) if len(rows) else h
print(f"Ausschnitt {w}x{h} -> Schnitt bei Zeile {cut}")
crop, m = crop[:cut], m[:cut]
h = cut

# --- Alpha: Rand einziehen + Sockel weich ausblenden -------------------------
a = cv2.erode(m, np.ones((3, 3), np.uint8), iterations=3)
a = cv2.GaussianBlur(a, (0, 0), 1.8)
fade = int(0.09 * h)
ramp = np.linspace(1.0, 0.0, fade).reshape(-1, 1)
a[h - fade:] = (a[h - fade:].astype(np.float32) * ramp).astype(np.uint8)

# --- Regionen bestimmen (auf den Originalfarben) -----------------------------
hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
Hh, Ss, Vv = hsv[..., 0].astype(int), hsv[..., 1].astype(int), hsv[..., 2].astype(int)
inside = m > 0

# Latz: türkis, als zusammenhängende Fläche (weit gefasst, damit kein Rand stehen bleibt)
teal = ((Hh > 42) & (Hh < 125) & (Ss > 20) & (Vv > 20) & inside).astype(np.uint8) * 255
teal = cv2.morphologyEx(teal, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8), iterations=3)
# Das Latz wird von der Pfote zerschnitten -> alle nennenswerten Teilflächen behalten,
# nicht nur die größte (sonst bleibt unten ein türkiser Streifen stehen).
n, lab, stats, _ = cv2.connectedComponentsWithStats(teal, 8)
if n > 1:
    areas = stats[1:, cv2.CC_STAT_AREA]
    keep = 1 + np.where(areas >= max(areas.max() * 0.05, 200))[0]
    teal = np.where(np.isin(lab, keep), 255, 0).astype(np.uint8)
cnts, _ = cv2.findContours(teal, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
teal = np.zeros_like(teal)
cv2.drawContours(teal, cnts, -1, 255, cv2.FILLED)

# Restsaum am Latzrand mitnehmen: erweitern, aber nichts Goldenes überschreiben
strong_gold = (Hh >= 12) & (Hh <= 45) & (Ss > 110)
grown = cv2.dilate(teal, np.ones((5, 5), np.uint8), iterations=2) > 0
teal = np.where((teal > 0) | (grown & ~strong_gold & inside), 255, 0).astype(np.uint8)
cnts, _ = cv2.findContours(teal, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
teal = np.zeros_like(teal)
cv2.drawContours(teal, cnts, -1, 255, cv2.FILLED)
teal_soft = cv2.GaussianBlur(teal, (0, 0), 2.0).astype(np.float32) / 255.0
bib = teal > 0

# Solarzelle: schwach gesättigtes Feld im unteren Sockelbereich
lower = np.zeros_like(m, bool)
lower[int(0.66 * h):] = True
panel = (Ss < 110) & (Vv > 55) & inside & lower & ~bib
panel = cv2.morphologyEx(panel.astype(np.uint8) * 255, cv2.MORPH_OPEN,
                         np.ones((7, 7), np.uint8), iterations=2)
n, lab, stats, _ = cv2.connectedComponentsWithStats(panel, 8)
if n > 1:
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    panel = np.where(lab == big, 255, 0).astype(np.uint8)
panel = cv2.GaussianBlur(panel, (0, 0), 1.5) > 40

# --- Farbgrading -------------------------------------------------------------
hsvf = hsv.astype(np.float32)
Hf, Sf, Vf = hsvf[..., 0], hsvf[..., 1], hsvf[..., 2]

goldm = (Hf >= 10) & (Hf <= 48) & (~bib)
Hf[goldm] = Hf[goldm] * 0.45 + 23.0 * 0.55          # Richtung sattes Gold
Sf[goldm] = np.clip(Sf[goldm] * 1.45, 0, 255)

redm = ((Hf < 8) | (Hf > 168)) & (Sf > 60) & (~bib)  # Ohren, Halsband
Sf[redm] = np.clip(Sf[redm] * 1.32, 0, 255)

Vf[panel] = Vf[panel] * 0.32                         # Solarzelle abdunkeln
Sf[panel] = Sf[panel] * 0.6

out = cv2.cvtColor(np.clip(np.stack([Hf, Sf, Vf], -1), 0, 255).astype(np.uint8),
                   cv2.COLOR_HSV2BGR).astype(np.float32)

# --- Latz einheitlich in tiefes Rot, Schattierung aus der Luminanz -----------
if bib.any():
    lum = Vv.astype(np.float32) / 255.0
    lo, hi = np.percentile(lum[bib], 8), np.percentile(lum[bib], 96)
    shade = np.clip((lum - lo) / max(hi - lo, 1e-3), 0, 1)
    shade = 0.42 + 0.72 * shade                       # nie ganz schwarz, nie ausgebrannt
    target = np.array([34.0, 26.0, 168.0], np.float32)  # BGR: tiefes Rot
    bib_rgb = target.reshape(1, 1, 3) * shade[..., None]
    t = teal_soft[..., None]
    out = out * (1 - t) + bib_rgb * t

# --- Kontrast, warmer Gold-Tint, Schärfe ------------------------------------
x = np.clip(out / 255.0, 0, 1)
x = np.clip((x - 0.5) * 1.22 + 0.5, 0, 1)
x = np.power(x, 0.94)
lum = x.mean(2, keepdims=True)
tint = np.array([0.62, 0.80, 1.00], np.float32)       # BGR -> warmes Gold in den Lichtern
x = np.clip(x * (1 - 0.30 * lum) + x * tint * (0.30 * lum), 0, 1)
out = (x * 255).astype(np.uint8)

blur = cv2.GaussianBlur(out, (0, 0), 3.0)
out = cv2.addWeighted(out, 1.42, blur, -0.42, 0)

# --- speichern ---------------------------------------------------------------
rgba = np.dstack([cv2.cvtColor(out, cv2.COLOR_BGR2RGB), a])
img = Image.fromarray(rgba, "RGBA")
tw = 1200
img = img.resize((tw, int(img.height * tw / img.width)), Image.LANCZOS)
img.save(f"{ASSETS}/winkekatze.png", optimize=True)
print(f"Latz {bib.sum()} px, Solarzelle {panel.sum()} px")
print("gespeichert:", img.size, "->", f"{ASSETS}/winkekatze.png")
