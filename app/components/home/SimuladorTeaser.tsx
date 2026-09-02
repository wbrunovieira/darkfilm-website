"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { Reveal } from "../Reveal";
import { ArrowIcon } from "../icons";
import { SunFilterIcon } from "../icons/home";
import { ROTULOS, TONALIDADES, WINDOW_POINTS, WINDOW_POLY, shadeFor } from "../TintSimulator";

/** Versão compacta e funcional do simulador para a home: só janela + presets + link. */
export function SimuladorTeaser() {
  const [vlt, setVlt] = useState<number>(35);
  const id = useId();

  return (
    <section className="atmo atmo-right overflow-hidden py-24 md:py-32" aria-labelledby={`${id}-t`}>
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-2">
              <SunFilterIcon className="size-4" />
              Simulador
            </p>
            <h2 id={`${id}-t`} className="display text-4xl md:text-6xl">
              Veja a tonalidade <span className="text-red-2">antes de aplicar.</span>
            </h2>
            <p className="mt-6 max-w-md text-fg-2">
              Escolha uma tonalidade do nosso mostruário e veja como fica a visão pelo vidro. No
              simulador completo você confere o que a lei permite em cada vidro e quais películas
              3M atendem a faixa.
            </p>

            {/* Leitura instantânea: número grande acompanha o preset escolhido. */}
            <p className="mt-8 flex items-baseline gap-3 border-t border-line pt-6" aria-live="polite">
              <motion.span
                key={vlt}
                initial={{ opacity: 0.4, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="display text-6xl tabular-nums md:text-7xl"
              >
                {vlt}%
              </motion.span>
              <span className="max-w-[12rem] text-sm leading-tight text-fg-3">
                da luz visível passa pelo vidro com {ROTULOS[vlt as (typeof TONALIDADES)[number]]}
              </span>
            </p>

            <Link
              href="/simulador"
              className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-line-strong px-6 py-3.5 font-display text-base font-semibold uppercase tracking-[0.14em] transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-red hover:bg-red hover:text-white"
            >
              Abrir o simulador
              <ArrowIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            {/* halo vermelho atrás do vidro: liga o card ao acento do site */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-[radial-gradient(60%_50%_at_60%_40%,rgba(209,20,31,0.16),transparent_70%)] blur-2xl"
            />
            <div className="overflow-hidden rounded-lg border border-line bg-bg-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <div className="relative aspect-[16/10] bg-[radial-gradient(120%_90%_at_30%_0%,#2a2c31_0%,#141518_55%,#0b0b0d_100%)]">
                <div className="absolute inset-0" style={{ clipPath: `polygon(${WINDOW_POLY})` }}>
                  <Image
                    src="/img/simulador/cena.jpg"
                    alt="Rua Cel. Veiga vista através do vidro, com a simulação de tonalidade aplicada"
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover object-[center_28%]"
                  />
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 bg-black"
                    animate={{ opacity: shadeFor(vlt) }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/[0.16] via-transparent to-white/[0.05]" />
                </div>
                <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                  <polygon points={WINDOW_POINTS} fill="none" stroke="#000" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <polygon points={WINDOW_POINTS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
                </svg>
                <p className="absolute left-3 top-3 rounded-md border border-white/15 bg-bg/80 px-3 py-2 backdrop-blur md:left-4 md:top-4">
                  <span className="block font-display text-base font-semibold uppercase leading-none text-fg md:text-lg">
                    {ROTULOS[vlt as (typeof TONALIDADES)[number]]} <span className="text-fg-3">· G{vlt}</span>
                  </span>
                  <span className="mt-1 block text-xs text-fg-2">
                    deixa passar <strong className="tabular-nums text-fg">{vlt}%</strong> da luz
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4 md:p-5" role="group" aria-label="Tonalidades do mostruário">
                <div className="flex flex-wrap gap-2">
                  {TONALIDADES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVlt(t)}
                      aria-pressed={vlt === t}
                      aria-label={`${ROTULOS[t]}, código G${t}`}
                      className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-[border-color,background-color,color,transform] duration-200 active:scale-95 ${
                        vlt === t ? "border-red bg-red text-white" : "border-line-strong text-fg-2 hover:border-fg-3 hover:text-fg"
                      }`}
                    >
                      {ROTULOS[t]} <span className={`font-display text-xs tracking-[0.15em] ${vlt === t ? "text-white/70" : "text-fg-3"}`}>G{t}</span>
                    </button>
                  ))}
                </div>
                <Link
                  href="/simulador"
                  className="link-grow inline-flex min-h-11 items-center font-display text-xs font-semibold uppercase tracking-[0.2em] text-fg-3 transition-colors hover:text-fg"
                >
                  Ver o que a lei permite em cada vidro →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
