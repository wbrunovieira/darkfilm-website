"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Reveal } from "./Reveal";

/**
 * Simulador de transparência de película.
 * Dados reais do site original:
 * - Tonalidades do mostruário: G5, G20, G35, G50, G70 (número = % de luz visível transmitida).
 * - Limites da Resolução CONTRAN 254/2007 (imagem "imgExemploResolucao"): para-brisa 75%,
 *   laterais dianteiras 70%, demais vidros 28%.
 * - Faixas das linhas 3M (página 3M): Crystalline 40–90, CS Premium 5–50, FX Pro 5–70,
 *   EX 5–35, Black Chrome 10–40.
 */
const TONALIDADES = [5, 20, 35, 50, 70] as const;

const VIDROS = [
  { id: "parabrisa", nome: "Para-brisa", min: 75 },
  { id: "dianteiras", nome: "Laterais dianteiras", min: 70 },
  { id: "traseiras", nome: "Traseiras e vigia", min: 28 },
] as const;

const LINHAS_3M = [
  { nome: "Crystalline", min: 40, max: 90 },
  { nome: "CS Premium", min: 5, max: 50 },
  { nome: "FX Pro", min: 5, max: 70 },
  { nome: "EX", min: 5, max: 35 },
  { nome: "Black Chrome", min: 10, max: 40, metalizada: true },
] as const;

export function TintSimulator({ image = "/img/hero/arquitetonica.jpg" }: { image?: string }) {
  const [vlt, setVlt] = useState<number>(35);
  const [vidro, setVidro] = useState<(typeof VIDROS)[number]["id"]>("traseiras");
  const reduce = useReducedMotion();
  const id = useId();

  const limite = VIDROS.find((v) => v.id === vidro)!;
  const legal = vlt >= limite.min;
  const compativeis = LINHAS_3M.filter((l) => vlt >= l.min && vlt <= l.max);
  // Escurecimento: quanto menor a transmissão, mais opaca a camada preta.
  const shade = 1 - vlt / 100;

  return (
    <section className="container-x border-t border-line py-16 md:py-24">
      <Reveal className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-3">Simulador</p>
          <h2 className="display text-3xl md:text-5xl">
            Veja a tonalidade <span className="text-red-2">antes de aplicar.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-fg-2">
          Arraste para escolher a transmissão de luz. O número da tonalidade (G5, G20…) é a
          porcentagem de luz visível que atravessa o vidro.
        </p>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Vidro */}
        <Reveal className="relative overflow-hidden rounded-lg border border-line bg-bg-2">
          <div className="relative aspect-[16/10]">
            <Image src={image} alt="Cena vista através do vidro" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            {/* película */}
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-black"
              animate={{ opacity: shade }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
            />
            {/* reflexo do vidro */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/[0.14] via-transparent to-white/[0.04]" />
            <div aria-hidden className="absolute -left-1/4 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* leitura do medidor */}
            <div className="absolute left-4 top-4 rounded-md border border-white/15 bg-bg/70 px-3 py-2 backdrop-blur">
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-fg-3">Transmissão luminosa</p>
              <p className="display text-4xl tabular-nums text-fg md:text-5xl">
                {vlt}
                <span className="text-xl text-fg-2">%</span>
              </p>
            </div>

            <div className={`absolute right-4 top-4 rounded-full px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.18em] ${legal ? "bg-[#25D366] text-[#062b16]" : "bg-red text-white"}`}>
              {legal ? "Dentro da lei" : "Abaixo do mínimo"}
            </div>

            <p className="absolute bottom-4 left-4 right-4 text-xs text-fg-2/80">
              Mínimo para {limite.nome.toLowerCase()}: <strong className="text-fg">{limite.min}%</strong> (Res. CONTRAN 254/2007).
            </p>
          </div>

          {/* slider */}
          <div className="border-t border-line p-5 md:p-6">
            <label htmlFor={`${id}-vlt`} className="mb-3 flex items-center justify-between font-display text-xs uppercase tracking-[0.22em] text-fg-3">
              <span>Mais escuro</span>
              <span>Mais claro</span>
            </label>
            <input
              id={`${id}-vlt`}
              type="range"
              min={5}
              max={90}
              step={1}
              value={vlt}
              onChange={(e) => setVlt(Number(e.target.value))}
              aria-valuetext={`${vlt}% de transmissão luminosa`}
              className="tint-range w-full"
              style={{ ["--p" as string]: `${((vlt - 5) / 85) * 100}%` }}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {TONALIDADES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setVlt(t)}
                  aria-pressed={vlt === t}
                  className={`rounded-full border px-3.5 py-1.5 font-display text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${
                    vlt === t ? "border-red bg-red text-white" : "border-line-strong text-fg-2 hover:border-fg-3 hover:text-fg"
                  }`}
                >
                  G{t}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Painel */}
        <Reveal delay={0.1} className="flex flex-col gap-6">
          <div className="rounded-lg border border-line bg-bg-2 p-5 md:p-6">
            <p className="eyebrow mb-3">Qual vidro?</p>
            <div role="radiogroup" aria-label="Vidro" className="grid gap-2">
              {VIDROS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={vidro === v.id}
                  onClick={() => setVidro(v.id)}
                  className={`flex items-center justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                    vidro === v.id ? "border-red bg-red/10 text-fg" : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
                  }`}
                >
                  <span className="font-display text-lg font-semibold uppercase">{v.nome}</span>
                  <span className="font-display text-sm tabular-nums text-fg-3">mín. {v.min}%</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-bg-2 p-5 md:p-6">
            <p className="eyebrow mb-3">Linhas 3M nessa faixa</p>
            <ul className="grid gap-2">
              {LINHAS_3M.map((l) => {
                const ok = compativeis.includes(l);
                return (
                  <li key={l.nome} className={`flex items-center justify-between text-sm transition-opacity ${ok ? "opacity-100" : "opacity-35"}`}>
                    <span className="font-display text-lg font-semibold uppercase">
                      3M {l.nome}
                      {"metalizada" in l && <span className="ml-2 text-xs font-medium tracking-[0.15em] text-fg-3">metalizada</span>}
                    </span>
                    <span className="tabular-nums text-fg-3">{l.min}–{l.max}%</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="text-xs leading-relaxed text-fg-3">
            Simulação ilustrativa: a tonalidade real depende do vidro do veículo, da iluminação e
            da calibração do seu monitor, e pode não corresponder ao resultado final. Na loja,
            medimos a transmissão luminosa com equipamento próprio.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
