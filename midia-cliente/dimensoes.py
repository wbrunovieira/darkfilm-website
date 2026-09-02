#!/usr/bin/env python3
"""Dimensoes de EXIBICAO de um JPEG, respeitando a rotacao EXIF.

Existe porque `sips -g pixelWidth` devolve o pixel armazenado, ignorando a tag
Orientation. Foto de celular costuma vir gravada em paisagem com a tag mandando
girar: no navegador ela aparece em retrato. Gravar a dimensao errada quebra o
aspecto no lightbox (que usa width/height explicitos com object-contain).
"""
import struct, subprocess

def exif_orientation(path):
    """Le a tag Orientation (0x0112) do IFD0. Devolve None se nao houver EXIF."""
    with open(path, "rb") as f:
        if f.read(2) != b"\xff\xd8":
            return None
        while True:
            b = f.read(2)
            if len(b) < 2 or b[0] != 0xFF:
                return None
            (marker,) = struct.unpack(">H", b)
            if marker == 0xFFE1:  # APP1
                (size,) = struct.unpack(">H", f.read(2))
                data = f.read(size - 2)
                if not data.startswith(b"Exif\x00\x00"):
                    continue
                tiff = data[6:]
                bo = "<" if tiff[:2] == b"II" else ">"
                (off,) = struct.unpack(bo + "I", tiff[4:8])
                (n,) = struct.unpack(bo + "H", tiff[off : off + 2])
                for i in range(n):
                    e = off + 2 + i * 12
                    tag, _typ, _cnt = struct.unpack(bo + "HHI", tiff[e : e + 8])
                    if tag == 0x0112:
                        (val,) = struct.unpack(bo + "H", tiff[e + 8 : e + 10])
                        return val
                return None
            elif marker == 0xFFD9 or 0xFFD0 <= marker <= 0xFFD8:
                continue
            else:
                (size,) = struct.unpack(">H", f.read(2))
                f.seek(size - 2, 1)

def dimensoes(path):
    """(largura, altura) como o navegador exibe."""
    out = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", path],
                         capture_output=True, text=True).stdout
    w = h = 0
    for l in out.splitlines():
        if "pixelWidth" in l: w = int(l.split(":")[1])
        if "pixelHeight" in l: h = int(l.split(":")[1])
    # 5,6,7,8 trocam os eixos
    if exif_orientation(path) in (5, 6, 7, 8):
        w, h = h, w
    return w, h

if __name__ == "__main__":
    import sys
    for p in sys.argv[1:]:
        print(f"{p}\t{'x'.join(map(str, dimensoes(p)))}")
