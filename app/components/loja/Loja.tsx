"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Container from "./Container";
import SideBar, { type Filtros } from "./SideBar";
import Card from "./Card";
import SearchBox from "./SearchBox";
import { ImagesSlider } from "./ui/images-slider";
import { DESTAQUES, PRODUTOS, reais, type ProdutoLoja } from "@/content/loja-mock";
import { Confianca } from "./Confianca";
import { site, whatsappUrl } from "@/lib/site";

/**
 * Home da loja: a mesma sequência da home do Stylos — slider de imagens, faixa de cartões de
 * categoria, e a seção 1/4 + 3/4 com a barra lateral de filtros e a grade de produtos.
 *
 * Os componentes vieram de lá (`ImagesSlider`, `PlaceholdersAndVanishInput`, `Container`,
 * `SideBar`, `Card`), com duas trocas: `framer-motion` virou `motion/react`, que é o sucessor e
 * tem a mesma API, e os dados vêm de arquivo em vez de `axios` — não existe backend nesta fase.
 *
 * O `Loader` de abertura do Stylos ficou: é ele que dá o "carregou" na apresentação.
 */
const TETO = Math.max(...PRODUTOS.map((p) => p.preco));

const BANNERS = [
  "/img/novo/institucional--fachada-dia.jpg",
  "/img/novo/vitrine--datsun-240z-frente.jpg",
  "/img/novo/aplicacao--audi-tt-tres-quartos.jpg",
  "/img/novo/vitrine--defender-frente.jpg",
];

export default function Loja() {
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [sacola, setSacola] = useState<Record<string, number>>({});
  const [f, setF] = useState<Filtros>({ categorias: [], marcas: [], tamanhos: [], precoMax: TETO });

  useEffect(() => setCarregando(false), []);

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return PRODUTOS.filter(
      (p) =>
        (!f.categorias.length || f.categorias.includes(p.categoria)) &&
        (!f.marcas.length || f.marcas.includes(p.marca)) &&
        (!f.tamanhos.length || p.tamanhos?.some((t) => f.tamanhos.includes(t))) &&
        p.preco <= f.precoMax &&
        (!q || p.nome.toLowerCase().includes(q) || p.detalhe.toLowerCase().includes(q)),
    );
  }, [f, busca]);

  const itens = Object.values(sacola).reduce((a, b) => a + b, 0);
  const total = PRODUTOS.reduce((s, p) => s + (sacola[p.id] ?? 0) * p.preco, 0);
  const add = (p: ProdutoLoja) => setSacola((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <span className="size-10 animate-spin rounded-full border-2 border-line border-t-red" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      {/* Fundo vivo: dois focos que derivam devagar, grão por cima e véu na base. Ver loja.css. */}
      <div aria-hidden className="loja-fundo">
        <span className="loja-fundo__foco-3" />
        <span className="loja-fundo__grao" />
        <span className="loja-fundo__veu" />
      </div>
      <div className="loja-conteudo">
      {/* Nenhuma tela de proposta pode ser confundida com o produto pronto. */}
      <p className="sticky top-0 z-50 text-balance bg-red px-4 py-2 text-center font-display text-[0.62rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white sm:text-[0.7rem] sm:tracking-[0.18em]">
        Maquete de apresentação · a loja ainda não existe · valores de exemplo
      </p>

      <header className="sticky top-[34px] z-40 border-b border-line loja-vidro">
        <Container>
          <div className="flex h-20 items-center gap-4">
            <Link href="/loja" className="flex shrink-0 items-center gap-3">
              <Image src="/img/marca/logo.png" alt={site.name} width={412} height={137} priority className="h-9 w-auto md:h-11" />
              <span className="hidden border-l border-line-strong pl-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-red-2 sm:block">
                Loja
              </span>
            </Link>

            <div className="mx-auto hidden w-full max-w-md md:block">
              <SearchBox onBuscar={setBusca} />
            </div>

            <button
              type="button"
              className="ml-auto flex shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-semibold transition-colors hover:border-red hover:text-red-2 md:ml-0"
            >
              <SacolaIcon className="size-5" />
              <span className="tabular-nums">{itens}</span>
              {total > 0 && <span className="hidden text-fg-3 sm:inline">· {reais(total)}</span>}
            </button>
          </div>
        </Container>
      </header>

      <Container>
        {/* 1. Slider, como no Stylos */}
        <div className="mt-4 w-full max-w-full">
          <ImagesSlider className="h-[15rem] w-full max-w-full rounded-lg sm:h-[20rem]" images={BANNERS} autoplay direction="up">
            <div className="z-50 mx-4 max-w-[min(34rem,calc(100%-2rem))] rounded-lg bg-bg/70 p-5 backdrop-blur md:p-6">
              <h1 className="display pb-2 text-3xl leading-[0.95] md:text-5xl">
                A oficina agora
                <br />
                <span className="text-red-2">também entrega.</span>
              </h1>
              <p className="text-sm font-semibold text-fg-2 md:text-lg">
                Camiseta, caneca e os acessórios que a gente instala no balcão.
              </p>
            </div>
          </ImagesSlider>
        </div>

        {/* 2. Faixa de cartões de categoria */}
        <div className="mt-4 max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESTAQUES.map((d) => (
              <button
                key={d.categoria}
                type="button"
                onClick={() => setF({ ...f, categorias: [d.categoria] })}
                className="loja-borda-viva z-10 flex items-center rounded-xl border border-line loja-vidro p-3 text-left transition duration-300 ease-in-out hover:scale-105 hover:border-line-strong hover:shadow-lg"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded bg-bg-3 text-red-2">
                  <IconeCategoria nome={d.icone} />
                </span>
                <span className="self-center pl-3 font-display text-xs font-semibold uppercase tracking-[0.12em]">
                  {d.categoria}
                  <span className="ml-1.5 font-normal text-fg-3">
                    ({PRODUTOS.filter((p) => p.categoria === d.categoria).length})
                  </span>
                  <span className="block text-[11px] font-normal normal-case tracking-normal text-fg-3">
                    {d.chamada}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Barra lateral 1/4 + grade 3/4, como no Stylos */}
        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <SideBar f={f} setF={setF} max={TETO} />
          </div>

          <div className="md:col-span-3">
            {/* No celular a barra some, como no Stylos — então a busca precisa aparecer aqui. */}
            <div className="mb-4 md:hidden">
              <SearchBox onBuscar={setBusca} />
            </div>

            {lista.length === 0 ? (
              <p className="rounded border border-line bg-bg-2 px-6 py-16 text-center text-fg-2">
                Nada encontrado com esses filtros.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lista.map((p) => (
                  <Card key={p.id} p={p} naSacola={sacola[p.id] ?? 0} onAdd={add} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Confianca />

        <footer className="border-t border-line py-10 text-sm text-fg-3">
          <p className="max-w-3xl">
            Maquete de apresentação feita pela WB Digital Solutions. Vestuário é simulação com a
            marca; os acessórios são os do catálogo atual. Preço, frete e formas de pagamento
            entram depois, com os valores da loja.
          </p>
          <p className="mt-4 flex flex-wrap gap-4">
            <a href={whatsappUrl("Olá! Vim pela loja online.")} className="underline underline-offset-4 hover:text-red-2">
              Falar no WhatsApp
            </a>
            <Link href="/" className="underline underline-offset-4 hover:text-red-2">
              Voltar para o site
            </Link>
          </p>
        </footer>
      </Container>
      </div>
    </div>
  );
}

function IconeCategoria({ nome }: { nome: string }) {
  const c = "size-7";
  if (nome === "camiseta")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={c} aria-hidden>
        <path d="M9 3 4 5.5 5.5 10 8 9v11h8V9l2.5 1L20 5.5 15 3a3 3 0 0 1-6 0Z" strokeLinejoin="round" />
      </svg>
    );
  if (nome === "caneca")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={c} aria-hidden>
        <path d="M4 6h12v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6Z" strokeLinejoin="round" />
        <path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={c} aria-hidden>
      <path d="M14.5 3.5a5 5 0 0 0-6.4 6.4L3 15v6h6l5.1-5.1a5 5 0 0 0 6.4-6.4l-3.1 3.1-2.9-.6-.6-2.9 3.1-3.1Z" strokeLinejoin="round" />
    </svg>
  );
}

function SacolaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 1 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
