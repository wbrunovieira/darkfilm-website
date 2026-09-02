#!/usr/bin/env python3
"""Consolida os CSVs dos agentes num catalogo unico e imprime o relatorio de curadoria.

Junta a classificacao visual (resultado-foto-*.csv, resultado-videos.csv) com o inventario
tecnico (inventario-*.csv) e agrupa sequencias do mesmo carro pelo timestamp do nome.

Uso:  python3 midia-cliente/consolidar.py
Saida: midia-cliente/catalogo.csv + relatorio no terminal
"""
import csv, glob, os, re, collections, datetime, json

BASE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(BASE, "analise")

def stem(n):
    """Nome sem extensao — o thumb de um .jpeg virou .jpg, entao o join e por stem."""
    return os.path.splitext(n)[0]

def carrega_inventario(path, campos):
    out = {}
    if not os.path.exists(path):
        return out
    for r in csv.DictReader(open(path, encoding="utf-8")):
        out[stem(r["arquivo"])] = {k: r.get(k, "") for k in campos}
    return out

inv_f = carrega_inventario(os.path.join(BASE, "inventario-fotos.csv"), ["data", "largura", "altura", "mb"])
inv_v = carrega_inventario(os.path.join(BASE, "inventario-videos.csv"), ["data", "largura", "altura", "rotacao", "segundos", "mb"])

itens = []
for p in sorted(glob.glob(os.path.join(A, "resultado-foto-*.csv"))):
    for r in csv.DictReader(open(p, encoding="utf-8")):
        s = stem(r["arquivo"])
        itens.append({**r, "tipo": "foto", "stem": s, **inv_f.get(s, {})})
pv = os.path.join(A, "resultado-videos.csv")
if os.path.exists(pv):
    for r in csv.DictReader(open(pv, encoding="utf-8")):
        s = stem(r["arquivo"])
        itens.append({**r, "tipo": "video", "stem": s,
                      "alt": r.get("descricao", ""), "orientacao": r.get("orientacao_real", ""),
                      **inv_v.get(s, {})})

def ts(s):
    m = re.search(r"(\d{8})[_-](\d{6})", s) or re.search(r"(\d{8})", s)
    if not m: return None
    try:
        return datetime.datetime.strptime(m.group(1) + (m.group(2) if m.lastindex and m.lastindex > 1 else "000000"),
                                          "%Y%m%d%H%M%S")
    except ValueError:
        return None

# Sequencia = mesma categoria e fotos tiradas com menos de 10 min de intervalo.
for i in itens:
    i["ts"] = ts(i["stem"])
itens.sort(key=lambda x: (x["categoria"], x["ts"] or datetime.datetime.min))
seq, ant = 0, None
for i in itens:
    if ant and i["categoria"] == ant["categoria"] and i["ts"] and ant["ts"] \
       and (i["ts"] - ant["ts"]).total_seconds() < 600:
        pass
    else:
        seq += 1
    i["sequencia"] = f"S{seq:03d}"
    ant = i

campos = ["arquivo", "tipo", "categoria", "qualidade", "orientacao", "uso", "alt", "flags",
          "data", "largura", "altura", "mb", "segundos", "rotacao", "sequencia"]
with open(os.path.join(BASE, "catalogo.csv"), "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=campos, extrasaction="ignore")
    w.writeheader()
    for i in sorted(itens, key=lambda x: x["arquivo"]):
        w.writerow(i)

def cont(campo, filtro=lambda x: True):
    return collections.Counter(i[campo] for i in itens if filtro(i) and i.get(campo))

print(f"CATALOGO: {len(itens)} itens ({sum(1 for i in itens if i['tipo']=='foto')} fotos, "
      f"{sum(1 for i in itens if i['tipo']=='video')} videos)\n")
print("Por categoria:")
for k, v in cont("categoria").most_common(): print(f"  {v:4d}  {k}")
print("\nPor uso sugerido:")
for k, v in cont("uso").most_common(): print(f"  {v:4d}  {k}")
print("\nQualidade:")
for k, v in sorted(cont("qualidade").items(), reverse=True): print(f"  {v:4d}  nota {k}")

flags = collections.Counter()
for i in itens:
    for f in (i.get("flags") or "").split(";"):
        f = f.strip()
        if f and f != "nenhum": flags[f] += 1
print("\nFlags:")
for k, v in flags.most_common(): print(f"  {v:4d}  {k}")

priv = [i for i in itens if "placa-visivel" in (i.get("flags") or "") or "rosto-visivel" in (i.get("flags") or "")]
print(f"\nPRIVACIDADE: {len(priv)} itens com placa ou rosto visivel — bloqueados ate decisao do cliente.")

seqs = collections.Counter(i["sequencia"] for i in itens)
mult = {k: v for k, v in seqs.items() if v > 1}
print(f"\nSEQUENCIAS: {len(seqs)} grupos; {len(mult)} com mais de uma midia "
      f"({sum(mult.values())} itens -> escolher {len(mult)}, descartar {sum(mult.values())-len(mult)}).")

# Aproveitaveis = nota >= 4, sem flag de privacidade, nao descartadas
apro = [i for i in itens if (i.get("qualidade") or "0").isdigit() and int(i["qualidade"]) >= 4
        and i.get("uso") != "descartar" and i not in priv]
print(f"\nPRONTAS PARA USO (nota 4+, sem placa/rosto, nao descartadas): {len(apro)}")
for k, v in collections.Counter(i["categoria"] for i in apro).most_common():
    print(f"  {v:4d}  {k}")

faltando = [c for c in ["pelicula-automotiva", "pelicula-arquitetonica", "envelopamento",
                        "som-acessorios", "alarme", "farois", "lavagem-seco", "para-brisa"]
            if sum(1 for i in apro if i["categoria"] == c) < 3]
if faltando:
    print("\nLACUNAS (menos de 3 fotos aproveitaveis) — pedir material ao cliente:")
    for c in faltando: print(f"  - {c}")
print(f"\nGravado: {os.path.join(BASE, 'catalogo.csv')}")
