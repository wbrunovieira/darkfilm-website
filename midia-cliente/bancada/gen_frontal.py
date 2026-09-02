# -*- coding: utf-8 -*-
"""carro-frontal.svg — 3/4 frontal. Reaproveita o flanco de carro-perfil.svg
   via transformação afim, de modo que os dois desenhos sejam o MESMO carro."""
import re, math

PHI, ALPHA, S = math.radians(54.6), math.radians(13.0), 66.0
OX, OY = 156.0, 176.0
UX =  math.cos(PHI)*S; UY = -math.sin(ALPHA)*math.sin(PHI)*S
VX = -math.sin(PHI)*S; VY = -math.sin(ALPHA)*math.cos(PHI)*S
WY = -math.cos(ALPHA)*S
K  = 76.96                      # unidades do perfil por metro

def P(X,Y,Z): return (OX+UX*X+VX*Y, OY+UY*X+VY*Y+WY*Z)
def f(p): return "%.2f,%.2f"%p
def poly(pts, close=True): return "M "+" L ".join(f(p) for p in pts)+(" Z" if close else "")
def smooth(pts, close=False, t=.5):
    Q=[pts[-1]]+list(pts)+[pts[0],pts[1]] if close else [pts[0]]+list(pts)+[pts[-1]]
    d="M "+f(pts[0])
    for i in range(1,len(Q)-2):
        p0,p1,p2,p3=Q[i-1],Q[i],Q[i+1],Q[i+2]
        c1=(p1[0]+(p2[0]-p0[0])*t/3, p1[1]+(p2[1]-p0[1])*t/3)
        c2=(p2[0]-(p3[0]-p1[0])*t/3, p2[1]-(p3[1]-p1[1])*t/3)
        d+=" C %s %s %s"%(f(c1),f(c2),f(p2))
    return d+(" Z" if close else "")
def surf(edgeA, edgeB):
    "faixa entre duas bordas amostradas (A ida, B volta), com bordas suaves"
    return smooth(edgeA)+" "+smooth(list(reversed(edgeB)))[1:].replace(f(edgeB[-1]),"",0).lstrip() \
           if False else smooth(edgeA)+" L "+" L ".join(f(p) for p in reversed(edgeB))+" Z"

# ---- geometria do carro (metros) ----
NOSE=0.28
def fx(Y): return NOSE*((Y-0.90)/0.90)**2
def FP(Y,Z): return P(fx(Y),Y,Z)
def crown(Y,half,amt): return amt*max(0.0,1-((Y-0.90)/half)**2)

Zhood,Zcowl,Zroof,ZdeckF,ZdeckR,Zbelt = 0.878,1.078,1.515,1.143,1.100,1.10
Xnose,Xcowl,Xhdr,XroofR,XdeckF,XdeckR = 0.35,1.42,2.05,3.44,4.015,4.38
YB0,YB1 = 0.00,1.78          # largura da carroceria
YG1     = 1.64               # largura da estufa (lado oposto)

ysB=[YB0,0.22,0.50,0.90,1.30,1.58,YB1]
ysG=[YB0,0.22,0.50,0.90,1.24,1.48,YG1]

e_hood_f=[FP(y,Zhood+crown(y,0.90,0.022)) for y in ysB]
e_hood_r=[P(Xcowl-crown(y,0.90,0.045), y, Zcowl+crown(y,0.90,0.020)) for y in ysB]
e_ws_b  =[P(Xcowl-crown(y,0.90,0.045), y, Zcowl+crown(y,0.90,0.020)) for y in ysG]
e_ws_t  =[P(Xhdr +crown(y,0.78,0.048), y, Zroof+crown(y,0.78,0.024)) for y in ysG]
e_roof_r=[P(XroofR, y, Zroof+crown(y,0.82,0.032)) for y in ysG]
e_bl_b  =[P(XdeckF-crown(y,0.82,0.030), y, ZdeckF+crown(y,0.82,0.014)) for y in ysG]
e_deck_r=[P(XdeckR, y, ZdeckR+crown(y,0.90,0.012)) for y in ysB]
e_deck_f=[P(XdeckF, y, ZdeckF) for y in ysB]
e_ff_t  =e_hood_f
e_ff_b  =[FP(y,0.170+crown(y,0.90,0.014)) for y in ysB]
e_sillF =[P(x, YG1, Zbelt) for x in (Xcowl,2.2,3.0,3.7,XdeckF)]
e_sillF2=[P(x, YB1, Zbelt-0.02) for x in (Xcowl,2.2,3.0,3.7,XdeckF)]

hood   = surf(e_hood_f,e_hood_r)
wssurf = surf(e_ws_b,e_ws_t)
roof   = surf(e_ws_t,e_roof_r)
blsurf = surf(e_roof_r,e_bl_b)
deck   = surf(e_deck_f,e_deck_r)
front  = surf(e_ff_t,e_ff_b)
sill   = surf(e_sillF,e_sillF2)

# vidros
ysW=[0.18,0.48,0.90,1.30,1.60]
ysWt=[0.30,0.56,0.90,1.24,1.48]
ws_b=[P(Xcowl-crown(y,0.90,0.045)+0.030, y, Zcowl+crown(y,0.90,0.020)+0.026) for y in ysW]
ws_t=[P(Xhdr +crown(y,0.78,0.048)+0.030, y, Zroof+crown(y,0.78,0.024)-0.028) for y in ysWt]
WS  =ws_b+list(reversed(ws_t))
ysK=[0.30,0.60,0.90,1.20,1.48]
bl_t=[P(XroofR+0.035, y, Zroof+crown(y,0.82,0.032)-0.030) for y in ysK]
bl_b=[P(XdeckF-crown(y,0.82,0.030)-0.030, y, ZdeckF+crown(y,0.82,0.014)+0.026) for y in ysK]
BL  =bl_t+list(reversed(bl_b))

# detalhes da face frontal
def band(y0,y1,z0,z1,n=5):
    ys=[y0+(y1-y0)*i/(n-1.) for i in range(n)]
    return surf([FP(y,z1) for y in ys],[FP(y,z0) for y in ys])
grille  = band(0.34,1.46,0.455,0.640,7)
intake  = band(0.28,1.52,0.205,0.380,7)
lip     = band(0.20,1.60,0.150,0.205,7)
plate   = band(0.72,1.10,0.255,0.360)
hlN     = band(0.06,0.60,0.660,0.808)
hlF     = band(1.20,1.74,0.660,0.808)
hlNi    = band(0.10,0.56,0.762,0.796)
hlFi    = band(1.24,1.70,0.762,0.796)
fogN    = band(0.15,0.32,0.250,0.330,3)
fogF    = band(1.48,1.65,0.250,0.330,3)
slats   = [band(0.38,1.42,z-0.011,z+0.011,7) for z in (0.600,0.545,0.490)]
crease  = smooth([FP(y,0.415) for y in (0.14,0.5,0.9,1.3,1.66)])
hoodline= smooth([P(Xcowl-crown(y,0.9,0.045)-0.06, y, Zcowl+crown(y,0.9,0.020)-0.012) for y in ysB])
noseHi  = smooth([FP(y,Zhood+crown(y,0.90,0.022)-0.030) for y in ysB])

# limpadores
wip=[]
for y0 in (0.55,1.05):
    a=P(Xcowl-crown(y0,0.9,0.045)+0.03, y0, Zcowl+crown(y0,0.9,0.020)+0.02)
    b=P(Xcowl+0.30, y0+0.30, Zcowl+0.22)
    wip.append((a,b))

# retrovisores
def mir(y,sg):
    b=P(1.60,y,1.105); t=P(1.50,y+sg*0.17,1.155)
    u=P(1.53,y+sg*0.06,1.185); d=P(1.63,y+sg*0.06,1.075)
    return poly([b,u,t,d])
mirN=mir(0.14,-1); mirF=mir(1.66,1)

far_w=P(0.897,1.74,0.344)
M_A,M_B,M_D = UX/K, UY/K, -WY/K
M_E,M_F     = OX-UX*23.0/K, OY-UY*23.0/K+WY*162.0/K
FLANK_M="matrix(%.5f %.5f 0 %.5f %.4f %.4f)"%(M_A,M_B,M_D,M_E,M_F)
XCUT=P(NOSE,0,0)[0]
XCUT2=P(4.50,0,0)[0]

# ---- flanco importado ----
src=open('carro-perfil.svg').read()
src=re.sub(r'\bid="([A-Za-z][\w-]*)"',lambda m:'id="F%s"'%m.group(1),src)
src=re.sub(r'href="#([A-Za-z][\w-]*)"',lambda m:'href="#F%s"'%m.group(1),src)
src=re.sub(r'url\(#([A-Za-z][\w-]*)\)',lambda m:'url(#F%s)'%m.group(1),src)
md=re.search(r'<defs>(.*?)</defs>',src,re.S); FDEFS=md.group(1)
bd=src[md.end():src.rindex('</svg>')]
bd=re.sub(r'<!-- chão -->.*?<!-- rodas -->','<!-- rodas -->',bd,flags=re.S)
def drop_group(txt, gid):
    i=txt.find('<g id="%s"'%gid)
    if i<0: return txt
    j=txt.index('>',i)+1; depth=1; k=j
    while depth:
        a=txt.find('<g',k); b=txt.find('</g>',k)
        if b<0: break
        if a>=0 and a<b: depth+=1; k=a+2
        else: depth-=1; k=b+4
    return txt[:i]+txt[k:]
bd=drop_group(bd,'FpNose')
bd=drop_group(bd,'FpHeadlamp')
bd=bd.replace('data-vidro="parabrisa"','data-vidro-perfil="parabrisa"')
bd=bd.replace('stroke="#e4edf8" stroke-width="1.5" stroke-opacity=".64"','stroke="#e4edf8" stroke-width="1.5" stroke-opacity=".34"')
bd=bd.replace('stroke="#e4edf8" stroke-width="1.4" stroke-opacity=".5"','stroke="#e4edf8" stroke-width="1.4" stroke-opacity=".28"')
FLANK=bd

svg=f'''<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Carro em 3/4 frontal">
<defs>
{FDEFS}
  <linearGradient id="fHood" x1=".08" y1="0" x2=".92" y2=".9">
    <stop offset="0"   stop-color="#646e7c"/>
    <stop offset=".22" stop-color="#39414c"/>
    <stop offset=".52" stop-color="#1c212a"/>
    <stop offset=".80" stop-color="#151920"/>
    <stop offset="1"   stop-color="#2b323c"/>
  </linearGradient>
  <linearGradient id="fRoof" x1=".1" y1="0" x2=".9" y2=".9">
    <stop offset="0"   stop-color="#6c7684"/>
    <stop offset=".30" stop-color="#3b4450"/>
    <stop offset=".70" stop-color="#1b2027"/>
    <stop offset="1"   stop-color="#262d36"/>
  </linearGradient>
  <linearGradient id="fPillar" x1=".1" y1="0" x2=".9" y2=".8">
    <stop offset="0"   stop-color="#39414c"/>
    <stop offset=".55" stop-color="#181c23"/>
    <stop offset="1"   stop-color="#232932"/>
  </linearGradient>
  <linearGradient id="fFace" x1=".08" y1="0" x2=".85" y2=".9">
    <stop offset="0"   stop-color="#454e5a"/>
    <stop offset=".26" stop-color="#272e37"/>
    <stop offset=".58" stop-color="#171b22"/>
    <stop offset=".84" stop-color="#0f1218"/>
    <stop offset="1"   stop-color="#1b212a"/>
  </linearGradient>
  <linearGradient id="fDeck" x1="0" y1="0" x2=".85" y2=".9">
    <stop offset="0"   stop-color="#3a424d"/>
    <stop offset=".55" stop-color="#1a1f26"/>
    <stop offset="1"   stop-color="#242b34"/>
  </linearGradient>
  <linearGradient id="fWs" x1=".16" y1="0" x2=".74" y2="1">
    <stop offset="0"   stop-color="#8fa3ba" stop-opacity=".34"/>
    <stop offset=".26" stop-color="#41505f" stop-opacity=".46"/>
    <stop offset=".60" stop-color="#171d25" stop-opacity=".58"/>
    <stop offset=".86" stop-color="#232d3a" stop-opacity=".54"/>
    <stop offset="1"   stop-color="#4a5d75" stop-opacity=".44"/>
  </linearGradient>
  <linearGradient id="fBl" x1=".2" y1="0" x2=".8" y2="1">
    <stop offset="0"   stop-color="#5f7086" stop-opacity=".30"/>
    <stop offset=".55" stop-color="#161c23" stop-opacity=".56"/>
    <stop offset="1"   stop-color="#3a4a5e" stop-opacity=".40"/>
  </linearGradient>
  <linearGradient id="fSheen" x1=".1" y1="0" x2=".8" y2="1">
    <stop offset="0"   stop-color="#dfe9f6" stop-opacity=".22"/>
    <stop offset=".45" stop-color="#dfe9f6" stop-opacity=".07"/>
    <stop offset="1"   stop-color="#dfe9f6" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="fLamp" x1="0" y1="0" x2=".9" y2=".7">
    <stop offset="0"   stop-color="#ffffff"/>
    <stop offset=".26" stop-color="#c9dbef"/>
    <stop offset=".64" stop-color="#54677d"/>
    <stop offset="1"   stop-color="#12181f"/>
  </linearGradient>
  <radialGradient id="fFloor" cx=".5" cy=".5" r=".5">
    <stop offset="0"   stop-color="#000" stop-opacity=".85"/>
    <stop offset=".45" stop-color="#000" stop-opacity=".30"/>
    <stop offset="1"   stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <clipPath id="fCut"><rect x="{XCUT:.2f}" y="0" width="{XCUT2-XCUT:.2f}" height="200"/></clipPath>
  <clipPath id="fShellC"><use href="#FpShell" transform="{FLANK_M}"/></clipPath>
  <linearGradient id="fCorner" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#05070a" stop-opacity="0"/>
    <stop offset="1" stop-color="#05070a" stop-opacity=".72"/>
  </linearGradient>
</defs>

<!-- chão -->
<ellipse cx="208" cy="158" rx="176" ry="30" fill="url(#fFloor)"/>
<ellipse cx="{P(0.90,0.55,0)[0]:.1f}" cy="{P(0.90,0.55,0)[1]:.1f}" rx="44" ry="10" fill="#000" opacity=".62"/>
<ellipse cx="{P(3.70,0.55,0)[0]:.1f}" cy="{P(3.70,0.55,0)[1]:.1f}" rx="40" ry="9" fill="#000" opacity=".58"/>

<!-- roda dianteira do lado oposto -->
<g transform="translate({far_w[0]:.2f},{far_w[1]:.2f})">
  <ellipse rx="26.5" ry="26.5" transform="matrix({M_A:.5f} {M_B:.5f} 0 {M_D:.5f} 0 0)" fill="#0a0c0f"/>
  <ellipse rx="17"   ry="17"   transform="matrix({M_A:.5f} {M_B:.5f} 0 {M_D:.5f} 0 0)" fill="#171c22"/>
</g>

<!-- ===== superfícies superiores ===== -->
<path d="{deck}"   fill="url(#fDeck)"/>
<path d="{sill}"   fill="#12161c"/>
<path d="{blsurf}" fill="url(#fPillar)"/>
<path d="{BL and poly(BL)}" fill="url(#fBl)" stroke="#8ba3bc" stroke-opacity=".28" stroke-width="1"/>
<path d="{roof}"   fill="url(#fRoof)"/>
<path d="{wssurf}" fill="url(#fPillar)"/>
<path d="{hood}"   fill="url(#fHood)"/>
<path d="{hoodline}" fill="none" stroke="#04060a" stroke-width="1.1" stroke-opacity=".55"/>
<path d="{surf(e_hood_f,[P(Xnose+(Xcowl-Xnose)*0.46-crown(y,0.90,0.02), y, Zhood+(Zcowl-Zhood)*0.46+crown(y,0.90,0.018)) for y in ysB])}" fill="url(#fSheen)"/>
<path d="{surf([P(Xhdr+crown(y,0.78,0.048), y, Zroof+crown(y,0.78,0.024)) for y in ysG],[P(Xhdr+(XroofR-Xhdr)*0.55, y, Zroof+crown(y,0.82,0.030)) for y in ysG])}" fill="url(#fSheen)" opacity=".7"/>
<path d="{smooth(e_hood_f)}" fill="none" stroke="#e2ecf7" stroke-width="1.4" stroke-opacity=".5"/>
<path d="{smooth(e_ws_t)}"   fill="none" stroke="#e2ecf7" stroke-width="1.3" stroke-opacity=".42"/>
<path d="{smooth(e_roof_r)}" fill="none" stroke="#c3d2e3" stroke-width="1"   stroke-opacity=".26"/>

<!-- ===== flanco: o mesmo carro do perfil ===== -->
<g clip-path="url(#fCut)"><g transform="{FLANK_M}">
{FLANK}
</g></g>

<g clip-path="url(#fCut)"><g clip-path="url(#fShellC)"><rect x="{XCUT2-26:.2f}" y="0" width="27" height="200" fill="url(#fCorner)"/></g></g>

<!-- ===== face frontal ===== -->
<path d="{front}" fill="url(#fFace)"/>
<path d="{noseHi}" fill="none" stroke="#eef4fc" stroke-width="1.6" stroke-opacity=".30"/>
<path d="{grille}" fill="#04060a"/>
{"".join('<path d="%s" fill="#3d4753" opacity=".26"/>'%s_ for s_ in slats)}
<path d="{grille}" fill="none" stroke="#9dabbc" stroke-width=".9" stroke-opacity=".45"/>
<path d="{crease}" fill="none" stroke="#000" stroke-width="1.6" stroke-opacity=".45"/>
<path d="{intake}" fill="#04060a"/>
<path d="{intake}" fill="none" stroke="#5b6672" stroke-width=".8" stroke-opacity=".4"/>
<path d="{plate}"  fill="#171c23"/>
<path d="{plate}"  fill="none" stroke="#7d8a99" stroke-width=".7" stroke-opacity=".45"/>
<path d="{lip}"    fill="#1a1f26"/>
<path d="{fogN}"   fill="#0d1116"/><path d="{fogF}" fill="#0d1116"/>
<path d="{hlF}"  fill="url(#fLamp)" opacity=".72"/>
<path d="{hlFi}" fill="#e6f0ff" opacity=".62"/>
<path d="{hlF}"  fill="none" stroke="#060a0e" stroke-width="1" stroke-opacity=".8"/>
<path d="{hlN}"  fill="url(#fLamp)"/>
<path d="{hlNi}" fill="#ffffff" opacity=".95"/>
<path d="{hlN}"  fill="none" stroke="#060a0e" stroke-width="1.1" stroke-opacity=".85"/>

<path d="{poly([P(NOSE,0.0,0.808),P(0.62,0.0,0.792),P(0.64,0.0,0.700),P(NOSE,0.0,0.664)])}" fill="url(#fLamp)" opacity=".9"/>
<path d="{poly([P(NOSE,0.0,0.796),P(0.60,0.0,0.782),P(0.61,0.0,0.760),P(NOSE,0.0,0.762)])}" fill="#ffffff" opacity=".85"/>
<path d="{poly([P(NOSE,0.0,0.808),P(0.62,0.0,0.792),P(0.64,0.0,0.700),P(NOSE,0.0,0.664)])}" fill="none" stroke="#060a0e" stroke-width="1" stroke-opacity=".85"/>

<!-- ===== PARA-BRISA (seletor) ===== -->
<polygon data-vidro="parabrisa" points="{" ".join(f(p) for p in WS)}"
   fill="url(#fWs)" stroke="#9ab2cb" stroke-opacity=".45" stroke-width="1.2" stroke-linejoin="round"/>
<g pointer-events="none">
  <path d="{poly([ws_b[0],ws_b[2],ws_t[2],ws_t[0]])}" fill="#eaf3fd" opacity=".07"/>
  <path d="{poly([ws_b[3],ws_b[4],ws_t[4],ws_t[3]])}" fill="#eaf3fd" opacity=".10"/>
  {"".join('<path d="M %s L %s" stroke="#0c1116" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".85"/>'%(f(a),f(b)) for a,b in wip)}
</g>

</svg>
'''
open('carro-frontal.svg','w').write(svg)
print("ok  XCUT=%.2f"%XCUT)
