"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { Reveal } from "../Reveal";
import { ArrowIcon } from "../icons";
import { TONALIDADES, WINDOW_POINTS, WINDOW_POLY, shadeFor } from "../TintSimulator";

/** Versão compacta e funcional do simulador para a home: só janela + presets + link. */
export function SimuladorTeaser() {
  const [vlt, setVlt] = useState<number>(35);
  const id = useId();

  return (
    <section className="container-x py-24 md:py-32" aria-labelledby={`${id}-t`}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-4">Simulador</p>
          <h2 id={`${id}-t`} className="display text-4xl md:text-6xl">
            Veja a tonalidade <span className="text-red-2">antes de aplicar.</span>
          </h2>
          <p className="mt-6 max-w-md text-fg-2">
            Escolha uma tonalidade do nosso mostruário e veja como fica a visão pelo vidro. No
            simulador completo você confere o que a lei permite em cada vidro e quais películas
            3M atendem a faixa.
          </p>
          <Link
            href="/simulador"
            className="group mt-8 inline-flex items-center gap-3 rounded-full border border-line-strong px-6 py-3.5 font-display text-base font-semibold uppercase tracking-[0.14em] transition-colors hover:border-red hover:bg-red hover:text-white"
          >
            Abrir o simulador
            <ArrowIcon className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="overflow-hidden rounded-lg border border-line bg-bg-2">
          <div className="relative aspect-[16/10] bg-[radial-gradient(120%_90%_at_30%_0%,#2a2c31_0%,#141518_55%,#0b0b0d_100%)]">
            <div className="absolute inset-0" style={{ clipPath: `polygon(${WINDOW_POLY})` }}>
              <Image
                src="/img/simulador/cena.jpg"
                alt="Rua vista através do vidro lateral de um carro"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[center_28%]"
              />
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-black"
                animate={{ opacity: shadeFor(vlt) }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/[0.16] via-transparent to-white/[0.05]" />
            </div>
            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
              <polygon points={WINDOW_POINTS} fill="none" stroke="#000" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <polygon points={WINDOW_POINTS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
            </svg>
            <p className="absolute left-3 top-3 rounded-md border border-white/15 bg-bg/80 px-3 py-2 backdrop-blur md:left-4 md:top-4" aria-live="polite">
              <span className="block font-display text-[11px] uppercase tracking-[0.22em] text-fg-2">Transmissão luminosa</span>
              <span className="display block text-3xl tabular-nums text-fg md:text-4xl">
                {vlt}
                <span className="text-lg text-fg-2">%</span>
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
                  className={`min-h-11 rounded-full border px-4 font-display text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${
                    vlt === t ? "border-red bg-red text-white" : "border-line-strong text-fg-2 hover:border-fg-3 hover:text-fg"
                  }`}
                >
                  G{t}
                </button>
              ))}
            </div>
            <Link href="/simulador" className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-fg-3 hover:text-fg">
              Limites legais e linhas 3M →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
