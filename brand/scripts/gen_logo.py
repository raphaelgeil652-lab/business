import math, os

# ===========================================================================
# CCG monogram — production generator
#   Left  = interlocked double-C ("CC")  -> two nested crescents
#   Right = ring with upward hook + crossbar ("G")
# Canvas 300 x 200. Precise circular arcs. Angle: math (0=east,+=CCW), y-down.
# ===========================================================================

W, H = 300, 200

# ---- Brand palette --------------------------------------------------------
INK    = "#14181A"   # near-black neutral
PETROL = "#0E3A43"   # primary: deep teal / water / trust
BRASS  = "#B07A3C"   # accent: warm sand / kitchen / premium
PAPER  = "#F4F1EC"   # warm off-white
WHITE  = "#FFFFFF"

def P(cx, cy, r, deg):
    a = math.radians(deg); return (cx + r*math.cos(a), cy - r*math.sin(a))
def f(pt): return f"{pt[0]:.2f},{pt[1]:.2f}"

# ---- Geometry -------------------------------------------------------------
GC = (196, 100); GR = 70
G_up, G_lo = 32, -8
OC = (104, 100); ORr = 70
O_up, O_lo = 42, -42
IC = (116, 100); IRr = 41
I_up, I_lo = 44, -44
NIB = 38

def g_hook():
    p = P(*GC, GR, G_up)
    return p, (p[0]+22,p[1]-1), (p[0]+34,p[1]-22), (p[0]+21,p[1]-37)

def crossbar_d():
    start = P(*GC, GR, G_lo)
    mid = (GC[0]+15, start[1]); up = (GC[0]+15, start[1]-18)
    return f"M{f(start)} L{f(mid)} L{f(up)}"

def arc_stroke(cx, cy, r, s, e):
    p0=P(cx,cy,r,s); p1=P(cx,cy,r,e); large=1 if (e-s)%360>180 else 0
    return f"M{f(p0)} A{r},{r} 0 {large} 0 {f(p1)}"

# ---- Monoline inner markup -------------------------------------------------
def monoline_inner(sw, color):
    p,c1,c2,end = g_hook()
    d = " ".join([
        arc_stroke(*OC,ORr,O_up,360+O_lo),
        arc_stroke(*IC,IRr,I_up,360+I_lo),
        arc_stroke(*GC,GR,G_up,360+G_lo),
        f"M{f(p)} C{f(c1)} {f(c2)} {f(end)}",
        crossbar_d(),
    ])
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{sw}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')

# ---- Calligraphic ribbons --------------------------------------------------
def ribbon(cx, cy, r, s, e, wmax, wmin=3.5, taper=0.5, n=90):
    out=[]; inn=[]; span=e-s
    for i in range(n+1):
        t=i/n; deg=s+span*t; a=math.radians(deg)
        px=cx+r*math.cos(a); py=cy-r*math.sin(a); nx=math.cos(a); ny=-math.sin(a)
        contrast=abs(math.sin(math.radians(deg+90-NIB)))
        w=wmin+(wmax-wmin)*(0.35+0.65*contrast)
        edge=min(t,1-t)/taper if taper>0 else 1
        w*=(0.15+0.85*min(1.0,edge)**0.7)
        h=w/2; out.append((px+nx*h,py+ny*h)); inn.append((px-nx*h,py-ny*h))
    d="M"+f(out[0])
    for q in out[1:]: d+=" L"+f(q)
    for q in reversed(inn): d+=" L"+f(q)
    return d+" Z"

def hook_ribbon(wmax=14):
    p,c1,c2,end=g_hook()
    def bez(t):
        m=1-t
        return (m**3*p[0]+3*m*m*t*c1[0]+3*m*t*t*c2[0]+t**3*end[0],
                m**3*p[1]+3*m*m*t*c1[1]+3*m*t*t*c2[1]+t**3*end[1])
    out=[]; inn=[]; n=40
    for i in range(n+1):
        t=i/n; x,y=bez(t); x2,y2=bez(min(1,t+0.01))
        dx,dy=x2-x,y2-y; L=math.hypot(dx,dy) or 1; nx,ny=-dy/L,dx/L
        w=(wmax*(1-t)**0.6)/2+1.2; out.append((x+nx*w,y+ny*w)); inn.append((x-nx*w,y-ny*w))
    d="M"+f(out[0])
    for q in out[1:]: d+=" L"+f(q)
    for q in reversed(inn): d+=" L"+f(q)
    return d+" Z"

def calli_inner(color, accent=None):
    ca=accent or color
    outer=ribbon(*OC,ORr,O_up,360+O_lo,wmax=26)
    inner=ribbon(*IC,IRr,I_up,360+I_lo,wmax=16,taper=0.8,wmin=5)
    gring=ribbon(*GC,GR,G_up,360+G_lo,wmax=26)
    hook=hook_ribbon(14)
    return (f'<path d="{outer}" fill="{color}"/>'
            f'<path d="{inner}" fill="{color}"/>'
            f'<path d="{gring}" fill="{ca}"/>'
            f'<path d="{hook}" fill="{ca}"/>'
            f'<path d="{crossbar_d()}" fill="none" stroke="{ca}" stroke-width="15" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')

# ---- SVG wrappers ----------------------------------------------------------
def svg(inner, w=W, h=H, vb=None):
    vb = vb or f"0 0 {w} {h}"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
            f'width="{w}" height="{h}">\n  {inner}\n</svg>\n')

def construction_inner(guide=BRASS):
    # faint square grid
    grid = ['<g stroke="%s" stroke-width="0.6" opacity="0.28">' % guide]
    for x in range(0, W+1, 20): grid.append(f'<line x1="{x}" y1="10" x2="{x}" y2="190"/>')
    for y in range(10, 191, 20): grid.append(f'<line x1="20" y1="{y}" x2="280" y2="{y}"/>')
    grid.append('</g>')
    # construction circles + centerlines
    circ = ['<g fill="none" stroke="%s" stroke-width="1.1" opacity="0.7">' % guide]
    for (cx,cy,r) in [(OC[0],OC[1],ORr),(IC[0],IC[1],IRr),(GC[0],GC[1],GR)]:
        circ.append(f'<circle cx="{cx}" cy="{cy}" r="{r}"/>')
        circ.append(f'<circle cx="{cx}" cy="{cy}" r="1.6" fill="{guide}" stroke="none"/>')
    circ.append(f'<line x1="20" y1="100" x2="280" y2="100" stroke-dasharray="3 4"/>')
    circ.append('</g>')
    return "".join(grid) + "".join(circ) + calli_inner(PETROL)

def badge(mark_inner, bg, size=240, rx=54, pad=42):
    scale=(size-2*pad)/W
    tx=(size-W*scale)/2; ty=(size-H*scale)/2
    return svg(
        f'<rect x="0" y="0" width="{size}" height="{size}" rx="{rx}" fill="{bg}"/>'
        f'<g transform="translate({tx:.2f},{ty:.2f}) scale({scale:.4f})">{mark_inner}</g>',
        w=size, h=size)

# ===========================================================================
OUT = "/home/user/business/brand/logo"
os.makedirs(OUT, exist_ok=True)

files = {
    # primary + masters (currentColor where mono so they recolor via CSS)
    "ccg-primary.svg":       svg(calli_inner(PETROL)),                 # main logo, petrol
    "ccg-calligraphic.svg":  svg(calli_inner("currentColor")),         # hero master, inherits color
    "ccg-monoline.svg":      svg(monoline_inner(12, "currentColor")),  # line master
    "ccg-bold.svg":          svg(monoline_inner(20, "currentColor")),  # bold, small sizes
    "ccg-duo.svg":           svg(calli_inner(PETROL, BRASS)),          # two-color
    # mono fixed
    "ccg-black.svg":         svg(calli_inner(INK)),
    "ccg-white.svg":         svg(calli_inner(WHITE)),
    # applications
    "ccg-badge-petrol.svg":  badge(calli_inner(WHITE), PETROL),
    "ccg-badge-ink.svg":     badge(calli_inner(WHITE), INK),
    "favicon.svg":           badge(monoline_inner(22, WHITE), PETROL, size=64, rx=14, pad=9),
    "ccg-construction.svg":  svg(construction_inner()),
}
for name, content in files.items():
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(content)
print("wrote", len(files), "files to", OUT)
for n in files: print("  ", n)
