#!/usr/bin/env bash
# Borra uma região retangular de uma imagem (placa de veículo, rosto).
#
#   borrar-placa.sh entrada.jpg saida.jpg X Y LARGURA ALTURA [intensidade]
#
# X/Y/LARGURA/ALTURA são em pixels da imagem ORIGINAL. A intensidade padrão (14)
# apaga o texto de uma placa sem virar um borrão preto chapado, que denuncia a
# edição mais que o próprio borrão.
#
# Para achar as coordenadas, recorte a região e confira antes:
#   ffmpeg -i entrada.jpg -vf "crop=500:260:X:Y,scale=1000:-2" -q:v 2 conferir.jpg
set -euo pipefail
[ $# -ge 6 ] || { sed -n '2,12p' "$0"; exit 1; }
IN="$1"; OUT="$2"; X="$3"; Y="$4"; W="$5"; H="$6"; F="${7:-14}"
# O raio do croma é limitado pelo tamanho da região (plano subamostrado): passar
# um valor alto aqui faz o ffmpeg abortar. Luma vai forte, croma vai contido.
CR=$(( H / 6 )); [ "$CR" -gt 6 ] && CR=6; [ "$CR" -lt 1 ] && CR=1
ffmpeg -v error -i "$IN" -filter_complex \
  "[0:v]crop=${W}:${H}:${X}:${Y},boxblur=${F}:2:${CR}:1[b];[0:v][b]overlay=${X}:${Y}" \
  -q:v 2 -y "$OUT"
echo "borrado: $OUT  (região ${W}x${H} em ${X},${Y})"
