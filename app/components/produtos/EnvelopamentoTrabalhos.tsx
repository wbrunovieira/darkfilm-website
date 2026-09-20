"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Reveal } from "../Reveal";
import { PhotoGrid } from "../PhotoGrid";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons/catalogo";
import { GALERIA, TRANSFORMACAO } from "@/content/envelopamento";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Envelopamento: a transformação da Hilux e a galeria de trabalhos.
 *
 * Os dois blocos nasceram do mesmo pedido, de 19/09/2026, mas resolvem coisas diferentes e por
 * isso não são o mesmo componente visual. A galeria é o que ele descreveu — miniaturas, ampliar,
 * anterior e seguinte. A transformação responde à pergunta que ele fez logo depois ("possível
 * nessa galeria colocar antes e depois?"), e uma grade de miniaturas não conta sequência: quatro
 * fotos parecidas de picape prata, embaralhadas entre 36 outras, viram repetição em vez de
 * história.
 *
 * **Por que passos e não um comparador de arrastar.** O comparador clássico exige duas fotos do
 * mesmo enquadramento, e essas não são: entre a foto com o carro preto e a do carro pronto a
 * picape muda de posição, de distância e de ângulo. A linha divisória mostraria dois caminhões
 * diferentes deslizando um sobre o outro. O que salva o caso é que o material dele é melhor que
 * o formato — em duas fotos o carro está metade preto e metade prata NA MESMA IMAGEM.
 */

/* ------------------------------------------------------------------ */
/* A transformação: sequência em passos                                */
/* ------------------------------------------------------------------ */

function Transformacao() {
  const [i, setI] = useState(0);
  const [parado, setParado] = useState(false);
  const reduce = useReducedMotion();
  const total = TRANSFORMACAO.length;
  const passo = TRANSFORMACAO[i];

  const ir = useCallback(
    (d: number) => {
      setParado(true);
      setI((v) => (v + d + total) % total);
    },
    [total],
  );

  /**
   * Avança sozinho até a pessoa interagir — aí para para sempre. Quem tocou está lendo, e
   * trocar a foto debaixo de quem está lendo é o tipo de animação que atrapalha.
   * Com `prefers-reduced-motion` não avança nunca: o controle fica só nos botões.
   */
  useEffect(() => {
    if (parado || reduce) return;
    const t = setTimeout(() => setI((v) => (v + 1) % total), 3600);
    return () => clearTimeout(t);
  }, [i, parado, reduce, total]);

  if (!passo) return null;

  return (
    <section
      id="a-transformacao"
      className="container-x mt-24 scroll-mt-24 border-t border-line pt-16"
      aria-labelledby="transformacao-titulo"
    >
      <Reveal className="mb-8 max-w-2xl">
        <p className="eyebrow mb-3">Antes e depois</p>
        <h2 id="transformacao-titulo" className="display text-3xl md:text-5xl">
          A transformação, passo a passo
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-fg-2">
          Esta Toyota Hilux era preta. Saiu daqui prata fosco, sem tinta nenhuma na pintura
          original. As fotos são do próprio serviço, na ordem em que aconteceu.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="grain relative overflow-hidden rounded-lg border border-line bg-bg-2"
          onMouseEnter={() => setParado(true)}
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/10]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={passo.src}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) ir(1);
                  else if (info.offset.x > 60 || info.velocity.x > 400) ir(-1);
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={passo.src}
                  alt={passo.alt}
                  fill
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="photo object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-8">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-red">
                {String(i + 1).padStart(2, "0")} · {passo.passo}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                {passo.legenda}
              </p>
            </div>

            <button
              type="button"
              onClick={() => ir(-1)}
              aria-label="Passo anterior"
              className="lb__btn lb__nav lb__nav--prev"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => ir(1)}
              aria-label="Próximo passo"
              className="lb__btn lb__nav lb__nav--next"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Os passos como botões nomeados, e não como bolinhas: o nome já conta a história
            mesmo para quem não vai clicar em nada. */}
        <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {TRANSFORMACAO.map((p, n) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => {
                  setParado(true);
                  setI(n);
                }}
                aria-current={n === i}
                className={`flex w-full min-h-11 flex-col items-start gap-0.5 rounded-md border px-3 py-2.5 text-left transition-colors ${
                  n === i
                    ? "border-red bg-red/10 text-fg"
                    : "border-line text-fg-3 hover:border-line-strong hover:text-fg-2"
                }`}
              >
                <span className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-70">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-medium leading-tight sm:text-sm">{p.passo}</span>
              </button>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Galeria de trabalhos                                                */
/* ------------------------------------------------------------------ */

function Trabalhos() {
  return (
    <section
      id="alguns-dos-nossos-trabalhos"
      className="container-x mt-24 scroll-mt-24 border-t border-line pt-16"
      aria-labelledby="trabalhos-titulo"
    >
      <Reveal className="mb-8 max-w-2xl">
        <p className="eyebrow mb-3">Feito aqui</p>
        {/* Título e subtítulo são os que o cliente escreveu, sem alteração. */}
        <h2 id="trabalhos-titulo" className="display text-3xl md:text-5xl">
          Alguns dos nossos trabalhos
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-fg-2">
          Projetos de envelopamento e personalização realizados pela The Dark Film.
        </p>
      </Reveal>

      {/* `limit` mostra 12 e guarda o resto atrás de um botão: são 36 fotos, e despejar todas
          de uma vez no celular custa rolagem e dados sem nenhum ganho. O lightbox do site já
          traz o que ele pediu — ampliar, anterior, seguinte, teclado e deslize. */}
      <Reveal delay={0.1}>
        <PhotoGrid
          photos={GALERIA}
          limit={12}
          variant="uniform"
          label="Envelopamento e personalização"
        />
      </Reveal>
    </section>
  );
}

export function EnvelopamentoTrabalhos() {
  return (
    <>
      <Transformacao />
      <Trabalhos />
    </>
  );
}
