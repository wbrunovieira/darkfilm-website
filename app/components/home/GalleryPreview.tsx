import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { ArrowIcon } from "../icons";
import { CardVideo } from "../CardVideo";

// O cliente pediu "bastante foto" nesta seção em 02/09/2026, e a Michele completou:
// "carros novos". São 11 itens, todos do acervo dele — e agora os MESMOS arquivos da
// galeria, para onde esta seção leva. Antes a home apontava para cópias com outro nome:
// dois arquivos por foto no build, e o risco de a home mostrar uma seleção e a galeria outra.
//
// 11 não é número solto: o primeiro tile ocupa 2 colunas, então a grade usa 12 células —
// que fecham tanto em 2 colunas (celular) quanto em 3 (desktop).
// A primeira é 16/9 e as outras 4/3, então todas aqui precisam ser paisagem.
// Material novo do cliente (2024-2026); o `alt` descreve cada foto, em vez do
// texto genérico que valia para todas.
const photos: { src: string; alt: string; video?: string }[] = [
  {
    src: "/video/gal-golf-perfil.jpg",
    video: "/video/gal-golf-perfil.mp4",
    alt: "Volkswagen Golf cinza de perfil, com todos os vidros aplicados",
  },
  {
    src: "/img/novo/vitrine--byd-sedan-oficina.jpg",
    alt: "Sedã elétrico BYD preto dentro da oficina, com os vidros escurecidos",
  },
  {
    src: "/img/novo/aplicacao--peugeot-2008-traseira.jpg",
    alt: "Peugeot 2008 azul de trás, com os vidros traseiros escurecidos",
  },
  {
    src: "/img/novo/vitrine--datsun-240z-frente.jpg",
    alt: "Frente do Datsun 240Z laranja, com faróis redondos",
  },
  {
    src: "/img/novo/vitrine--peugeot-2008-interior.jpg",
    alt: "Interior do Peugeot 2008 azul, com volante e central multimídia",
  },
  {
    src: "/img/novo/vitrine--datsun-240z-perfil.jpg",
    alt: "Perfil do Datsun 240Z laranja clássico",
  },
  {
    src: "/video/gal-audi-tt-frente.jpg",
    video: "/video/gal-audi-tt-frente.mp4",
    alt: "Audi TT azul de frente na oficina, com os vidros escurecidos",
  },
  {
    src: "/img/novo/vitrine--defender-frente.jpg",
    alt: "Land Rover Defender preto de frente, na oficina",
  },
  {
    src: "/img/novo/vitrine--opala-vermelho-portas-abertas.jpg",
    alt: "Chevrolet Opala vermelho customizado, com as portas abertas na oficina",
  },
  {
    src: "/img/novo/vitrine--bmw-interior-couro-vermelho.jpg",
    alt: "Interior de BMW com bancos de couro vermelho e painel digital",
  },
  {
    src: "/img/novo/vitrine--chevette-prata-perfil.jpg",
    alt: "Chevrolet Chevette prata rebaixado, de perfil na oficina",
  },
];

export function GalleryPreview() {
  return (
    <section className="atmo relative overflow-hidden bg-bg-2 py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Trabalhos</p>
            <h2 className="display text-4xl md:text-6xl">
              Na oficina<span className="text-red-2">.</span>
            </h2>
          </div>
          <Link
            href="/galeria"
            className="group link-grow hidden items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg-2 transition-colors hover:text-fg sm:inline-flex"
          >
            Ver galeria completa
            <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <RevealGroup stagger={0.1} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {photos.map((p, i) => (
            <RevealItem
              key={p.src}
              className={`photo-tile relative overflow-hidden rounded-md border border-line ${
                i === 0 ? "col-span-2 aspect-[16/9] md:col-span-2" : "aspect-[4/3]"
              }`}
            >
              <Link href="/galeria" className="absolute inset-0 block focus-visible:outline-2 focus-visible:outline-fg">
                {p.video ? (
                  <CardVideo
                    src={p.video}
                    poster={p.src}
                    className="photo absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                    className="photo object-cover"
                  />
                )}
                <span aria-hidden className="photo-veil" />
                <span
                  aria-hidden
                  className="photo-cap absolute bottom-3 left-3 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-fg md:bottom-4 md:left-4"
                >
                  <span className="h-px w-5 bg-red" />
                  0{i + 1} / 0{photos.length}
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Link
          href="/galeria"
          className="mt-8 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg-2 sm:hidden"
        >
          Ver galeria completa <ArrowIcon className="size-4" />
        </Link>
      </div>
    </section>
  );
}
