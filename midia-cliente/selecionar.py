#!/usr/bin/env python3
"""Monta a proposta de selecao por area, a partir do catalogo.

Areas conforme o pedido do cliente no audio de 02/09/2026:
  vitrine | servico-multimidia | servico-arquitetura | aplicacao-filme-carros

Regras de corte (conservadoras — na duvida, fica de fora):
  - descarta qualidade < 4
  - descarta uso == descartar
  - descarta qualquer item com placa-visivel ou rosto-visivel (bloqueado ate o cliente autorizar)
  - descarta duplicata exata (sufixo "(1)")
  - de cada sequencia do mesmo carro, mantem so a melhor (maior qualidade, depois maior arquivo)

Uso: python3 midia-cliente/selecionar.py
"""
import csv, os, collections

BASE = os.path.dirname(os.path.abspath(__file__))

AREA = {
    "outro": "vitrine",
    "som-acessorios": "servico-multimidia",
    "pelicula-arquitetonica": "servico-arquitetura",
    "pelicula-automotiva": "aplicacao-filme-carros",
    "envelopamento": "aplicacao-filme-carros",
    "loja-fachada": "institucional",
    "equipe": "institucional",
    "produto-avulso": "servico-multimidia",
}

itens = list(csv.DictReader(open(os.path.join(BASE, "catalogo.csv"), encoding="utf-8")))

def num(v, d=0):
    try: return float(v)
    except (TypeError, ValueError): return d

motivo = collections.Counter()
elegiveis = []
for i in itens:
    f = i.get("flags") or ""
    if "(1)" in i["arquivo"]:            motivo["duplicata exata"] += 1; continue
    if i.get("uso") == "descartar":      motivo["marcada para descarte"] += 1; continue
    if num(i.get("qualidade")) < 4:      motivo["qualidade abaixo de 4"] += 1; continue
    if "placa-visivel" in f or "rosto-visivel" in f:
        motivo["placa ou rosto (bloqueada)"] += 1; continue
    elegiveis.append(i)

# melhor de cada sequencia
por_seq = collections.defaultdict(list)
for i in elegiveis:
    por_seq[i["sequencia"]].append(i)
escolhidas, descartadas_seq = [], 0
for seq, grupo in por_seq.items():
    grupo.sort(key=lambda x: (num(x.get("qualidade")), num(x.get("mb"))), reverse=True)
    escolhidas.append(grupo[0])
    descartadas_seq += len(grupo) - 1

print("FUNIL DE SELECAO")
print(f"  catalogo ............... {len(itens)}")
for k, v in motivo.most_common():
    print(f"  - {k:28} {v}")
print(f"  elegiveis .............. {len(elegiveis)}")
print(f"  - melhor de cada sequencia (descartadas {descartadas_seq})")
print(f"  SELECIONADAS ........... {len(escolhidas)}\n")

por_area = collections.defaultdict(list)
for i in escolhidas:
    por_area[AREA.get(i["categoria"], "institucional")].append(i)

print("POR AREA (conforme o pedido do cliente)")
for area in ["vitrine", "aplicacao-filme-carros", "servico-multimidia", "servico-arquitetura", "institucional"]:
    lst = por_area.get(area, [])
    fotos = sum(1 for x in lst if x["tipo"] == "foto")
    videos = len(lst) - fotos
    print(f"  {area:24} {len(lst):3d}  ({fotos} fotos, {videos} videos)")

campos = ["area", "arquivo", "tipo", "categoria", "qualidade", "orientacao", "alt", "data", "largura", "altura", "mb", "sequencia"]
saida = os.path.join(BASE, "selecao-proposta.csv")
with open(saida, "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=campos, extrasaction="ignore")
    w.writeheader()
    for area in por_area:
        for i in sorted(por_area[area], key=lambda x: (-num(x.get("qualidade")), x["arquivo"])):
            w.writerow({**i, "area": area})

print(f"\nBLOQUEADAS por placa/rosto: {motivo['placa ou rosto (bloqueada)']} "
      f"— entram se o cliente autorizar ou depois de borrar.")
print(f"Gravado: {saida}")
