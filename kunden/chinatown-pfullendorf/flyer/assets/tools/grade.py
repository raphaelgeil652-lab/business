"""Schritt 2: Freigestellte Winkekatze auf sattes Gold graden -> assets/winkekatze.png

Behebt gegenüber der ersten Fassung:
  * fleckiges Latz (Türkis wurde nur teilweise verschoben) -> zusammenhängende Region,
    einheitlich in tiefes Rot umgefärbt, Schattierung aus der Luminanz übernommen
  * Terrakotta-Rest am Sockel -> höherer Schnitt + längeres Ausblenden
  * dunkle Halos an der Kante -> Maske stärker eingezogen
  * Solarzelle im Sockel -> restlos durch eine glatte Goldplatte ersetzt
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

# --- Solarzelle im Sockel restlos entfernen ---------------------------------
# Sie ist ein Rechteck aus dunklen bzw. schwach gesättigten Pixeln. Erst die
# Fläche finden, dann ihr *Bounding-Rechteck* durch eine glatte Goldplatte
# ersetzen. Über das Rechteck statt die Pixelmaske zu gehen, stellt sicher,
# dass auch der ganz dunkle obere Rand der Zelle mit verschwindet.
lower = np.zeros_like(m, bool)
lower[int(0.66 * h):] = True
kern = (Ss < 110) & (Vv > 55) & inside & lower & ~bib
kern = cv2.morphologyEx(kern.astype(np.uint8) * 255, cv2.MORPH_OPEN,
                        np.ones((7, 7), np.uint8), iterations=2)
n, lab, stats, _ = cv2.connectedComponentsWithStats(kern, 8)
panel_px = 0
if n > 1:
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    px0, py0, pw0, ph0, panel_px = (int(v) for v in stats[big])

    # Der obere Rand der Zelle ist fast schwarz und fällt aus dem Kernfenster.
    # Deshalb zeilenweise nach oben erweitern, solange es dort deutlich dunkler
    # ist als das umgebende Gold - höchstens aber um 60 % der Zellenhöhe.
    gold_ref = float(np.median(Vv[inside & (Vv > 120)]))
    grenze = max(0, py0 - int(0.6 * ph0))
    r = py0
    while r > grenze and float(np.median(Vv[r - 1, px0:px0 + pw0])) < gold_ref * 0.55:
        r -= 1
    ph0 += py0 - r
    py0 = r

    pad = 5
    py0, px0 = max(0, py0 - pad), max(0, px0 - pad)
    py1, px1 = min(h, py0 + ph0 + 2 * pad), min(w, px0 + pw0 + 2 * pad)
    ph, pw = py1 - py0, px1 - px0

    # Sicherheitsnetz: was zu groß ist, ist nicht die Solarzelle
    if ph * pw > 0.16 * inside.sum():
        raise SystemExit(f"Solarzellen-Erkennung unplausibel ({pw}x{ph}) - Abbruch")

    # Goldton aus schmalen Bändern direkt ober- und unterhalb der Zelle nehmen
    band = 16
    s_oben = crop[max(0, py0 - band):py0, px0:px1].reshape(-1, 3)
    s_unten = crop[py1:min(h, py1 + band), px0:px1].reshape(-1, 3)
    oben = s_oben.mean(0) if len(s_oben) else None
    unten = s_unten.mean(0) if len(s_unten) else None
    if oben is None:
        oben = unten
    if unten is None:
        unten = oben
    if oben is None:                       # beide leer: Notfallwert aus dem Sockel
        oben = unten = crop[inside].reshape(-1, 3).mean(0)

    t = np.linspace(0, 1, ph, dtype=np.float32).reshape(-1, 1, 1)
    platte = oben.reshape(1, 1, 3) * (1 - t) + unten.reshape(1, 1, 3) * t
    platte = np.repeat(platte, pw, axis=1)
    # leichte Wölbung quer, damit die Fläche nicht platt wirkt
    xg = np.linspace(-1, 1, pw, dtype=np.float32).reshape(1, -1, 1)
    platte *= (1.0 - 0.10 * xg ** 2)
    # feine Körnung wie im umgebenden Sockel
    platte += np.random.default_rng(7).normal(0, 3.0, platte.shape)
    platte = np.clip(platte, 0, 255)

    # nur ganz außen weich auslaufen -> nahtloser Übergang ins umgebende Gold
    # (eigener Name: `a` ist weiter oben der Alphakanal des Bildes)
    feder = np.zeros((ph, pw), np.float32)
    feder[3:-3, 3:-3] = 1.0
    feder = cv2.GaussianBlur(feder, (0, 0), 2.5)[..., None]
    ziel = crop[py0:py1, px0:px1].astype(np.float32)
    crop[py0:py1, px0:px1] = (ziel * (1 - feder) + platte * feder).astype(np.uint8)

    # Lage der Goldplatte in Prozent des fertigen Bildes ausgeben. Im Flyer wird
    # "Familie Mau" per CSS genau darauf gesetzt - diese Werte gehören dorthin.
    print(f"Goldplatte im Bild: left {100 * px0 / w:.1f}%  top {100 * py0 / h:.1f}%  "
          f"width {100 * pw / w:.1f}%  height {100 * ph / h:.1f}%")

hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
Vv = hsv[..., 2].astype(int)

# --- Farbgrading -------------------------------------------------------------
hsvf = hsv.astype(np.float32)
Hf, Sf, Vf = hsvf[..., 0], hsvf[..., 1], hsvf[..., 2]

goldm = (Hf >= 10) & (Hf <= 48) & (~bib)
Hf[goldm] = Hf[goldm] * 0.45 + 23.0 * 0.55          # Richtung sattes Gold
Sf[goldm] = np.clip(Sf[goldm] * 1.45, 0, 255)

redm = ((Hf < 8) | (Hf > 168)) & (Sf > 60) & (~bib)  # Ohren, Halsband
Sf[redm] = np.clip(Sf[redm] * 1.32, 0, 255)

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
print(f"Latz {bib.sum()} px, Solarzelle {panel_px} px ersetzt")
print("gespeichert:", img.size, "->", f"{ASSETS}/winkekatze.png")
