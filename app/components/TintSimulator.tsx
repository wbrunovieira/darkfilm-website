"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./icons";
import { whatsappUrl } from "@/lib/site";

/**
 * Simulador de transparência de película.
 *
 * Fontes dos dados:
 * - Tonalidades G5, G20, G35, G50, G70: foto do mostruário do site original
 *   (`arquivos_ckfinder/images/imgMostruarioFilm.jpg`). "G" = % de luz visível transmitida
 *   pela película (convenção do mercado).
 * - Faixas 3M: página `3m.html` do site original (Crystalline 40–90, CS Premium 5–50,
 *   FX Pro 5–70, EX 5–35, Black Chrome 10–40).
 * - Limites legais (verificados em 25/08/2026): Resolução CONTRAN 960/2022, alterada pela
 *   989/2022. Para-brisa: 75% (vidro incolor) / laterais dianteiras: 70%. Vidros traseiros e
 *   vigia: sem mínimo desde que o veículo tenha retrovisores externos dos dois lados.
 *   O site antigo citava a Res. 254/2007 (revogada), que exigia 28% nos traseiros.
 *   PENDÊNCIA: cliente confirmar a leitura da resolução antes de publicar.
 * - A lei mede a transmitância do conjunto vidro + película; o número da película sozinha
 *   não é o valor final. Por isso o rótulo é cauteloso e aponta para a medição na loja.
 */
export const TONALIDADES = [5, 20, 35, 50, 70] as const;

type VidroId = "parabrisa" | "dianteiras" | "traseiras";
const VIDROS: { id: VidroId; nome: string; min: number | null; nota: string }[] = [
  { id: "parabrisa", nome: "Para-brisa", min: 75, nota: "mín. 75%" },
  { id: "dianteiras", nome: "Laterais dianteiras", min: 70, nota: "mín. 70%" },
  { id: "traseiras", nome: "Traseiras e vidro de trás", min: null, nota: "sem mínimo*" },
];

const LINHAS_3M = [
  { nome: "Crystalline", min: 40, max: 90, metalizada: false },
  { nome: "CS Premium", min: 5, max: 50, metalizada: false },
  { nome: "FX Pro", min: 5, max: 70, metalizada: false },
  { nome: "EX", min: 5, max: 35, metalizada: false },
  { nome: "Black Chrome", min: 10, max: 40, metalizada: true },
];

const MIN = 5;
const MAX = 90;

/** Curva perceptual: o escurecimento linear em sRGB fica "sujo" demais nos tons claros. */
export function shadeFor(vlt: number) {
  return 1 - Math.pow(vlt / 100, 0.6);
}

// Janela lateral traseira, em % do quadro (polígono compartilhado pela moldura e pela película).
export const WINDOW_POLY = "5% 16%, 56% 5%, 95% 9%, 96% 84%, 5% 89%";
export const WINDOW_POINTS = "5,16 56,5 95,9 96,84 5,89";

export function TintSimulator({
  image = "/img/simulador/cena.jpg",
  showHeading = true,
}: {
  image?: string;
  /** false na página /simulador, que já tem PageHero. */
  showHeading?: boolean;
}) {
  const [vlt, setVlt] = useState<number>(35);
  const [vidro, setVidro] = useState<VidroId>("traseiras");
  const id = useId();

  const limite = VIDROS.find((v) => v.id === vidro) ?? VIDROS[2];
  const status =
    limite.min === null
      ? { ok: true, label: "Sem mínimo legal", sr: "sem mínimo legal para este vidro" }
      : vlt >= limite.min
        ? { ok: true, label: "Acima do mínimo", sr: `acima do mínimo de ${limite.min}%` }
        : { ok: false, label: "Abaixo do mínimo", sr: `abaixo do mínimo de ${limite.min}%` };

  const shade = shadeFor(vlt);
  const pct = ((vlt - MIN) / (MAX - MIN)) * 100;
  const compativeis = LINHAS_3M.filter((l) => vlt >= l.min && vlt <= l.max);

  const ctaText = `Olá! Usei o simulador do site e quero orçamento de película G${vlt} para ${limite.nome.toLowerCase()}.`;

  return (
    <section
      className="container-x border-t border-line py-16 md:py-24"
      aria-labelledby={showHeading ? `${id}-title` : undefined}
      aria-label={showHeading ? undefined : "Simulador de tonalidade de película"}
    >
      {showHeading && (
      <Reveal className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-3">Simulador</p>
          <h2 id={`${id}-title`} className="display text-3xl md:text-5xl">
            Veja a tonalidade <span className="text-red-2">antes de aplicar.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-fg-2">
          Arraste para escolher a transmissão de luz. O número da tonalidade (G5, G20…) é a
          porcentagem de luz visível que atravessa a película. A lei considera o conjunto vidro
          + película — na loja medimos o valor final com equipamento próprio.
        </p>
      </Reveal>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ---------- Janela ---------- */}
        <Reveal className="overflow-hidden rounded-lg border border-line bg-bg-2">
          <div className="relative aspect-[16/10] bg-[radial-gradient(120%_90%_at_30%_0%,#2a2c31_0%,#141518_55%,#0b0b0d_100%)]">
            {/* cena externa, recortada pela janela */}
            <div className="absolute inset-0" style={{ clipPath: `polygon(${WINDOW_POLY})` }}>
              <Image
                src={image}
                alt="Rua com palmeiras e prédios vista através do vidro lateral de um carro"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover object-[center_28%]"
              />
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-black"
                animate={{ opacity: shade }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
              {/* reflexo do vidro */}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/[0.16] via-transparent to-white/[0.05]" />
              <div aria-hidden className="absolute -left-1/4 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            </div>

            {/* moldura da porta: borracha + coluna */}
            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
              <polygon points="5,16 56,5 95,9 96,84 5,89" fill="none" stroke="#000" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <polygon points="5,16 56,5 95,9 96,84 5,89" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
              {/* linha de cintura da porta */}
              <line x1="0" y1="94" x2="100" y2="90" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* medidor */}
            <output
              htmlFor={`${id}-vlt`}
              className="absolute left-3 top-3 rounded-md border border-white/15 bg-bg/80 px-3 py-2 backdrop-blur md:left-4 md:top-4"
            >
              <span className="block font-display text-[11px] uppercase tracking-[0.22em] text-fg-2">Transmissão luminosa</span>
              <span className="display block text-3xl tabular-nums text-fg md:text-5xl">
                {vlt}
                <span className="text-lg text-fg-2 md:text-xl">%</span>
              </span>
            </output>

            <p
              role="status"
              aria-live="polite"
              className={`absolute right-3 top-3 rounded-full px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.18em] md:right-4 md:top-4 ${
                status.ok ? "bg-[#25D366] text-[#062b16]" : "bg-red text-white"
              }`}
            >
              {status.label}
              <span className="sr-only">
                : G{vlt} em {limite.nome.toLowerCase()}, {status.sr}
              </span>
            </p>
          </div>

          {/* ---------- Controles ---------- */}
          <div className="space-y-6 border-t border-line p-5 md:p-6">
            {/* Vidro (radios reais) */}
            <fieldset className="min-w-0 border-0 p-0">
              <legend className="eyebrow mb-3">Qual vidro?</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {VIDROS.map((v) => {
                  const active = vidro === v.id;
                  return (
                    <label
                      key={v.id}
                      className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red ${
                        active ? "border-red bg-red/10 text-fg" : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${id}-vidro`}
                        value={v.id}
                        checked={active}
                        onChange={() => setVidro(v.id)}
                        className="sr-only"
                      />
                      <span className="font-display text-base font-semibold uppercase leading-tight">{v.nome}</span>
                      <span className="shrink-0 font-display text-xs tabular-nums text-fg-3">{v.nota}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Slider com marcador do limite */}
            <div>
              <div className="mb-3 flex items-center justify-between font-display text-xs uppercase tracking-[0.22em] text-fg-3" aria-hidden>
                <span>Mais escuro</span>
                <span>Mais claro</span>
              </div>
              <div className="relative">
                <input
                  id={`${id}-vlt`}
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={1}
                  value={vlt}
                  onChange={(e) => setVlt(Number(e.target.value))}
                  aria-label="Transmissão luminosa da película"
                  aria-valuetext={`${vlt}% de transmissão luminosa`}
                  className="tint-range w-full"
                  style={{ "--p": `${pct}%` } as React.CSSProperties}
                />
                {limite.min !== null && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-fg"
                    style={{ left: `calc(${((limite.min - MIN) / (MAX - MIN)) * 100}% + (13px - ${((limite.min - MIN) / (MAX - MIN)) * 26}px))` }}
                    title={`Mínimo legal: ${limite.min}%`}
                  />
                )}
              </div>
              {limite.min !== null ? (
                <p className="mt-2 text-xs text-fg-3">
                  Marca no trilho: mínimo de <strong className="text-fg-2">{limite.min}%</strong> para {limite.nome.toLowerCase()}.
                </p>
              ) : (
                <p className="mt-2 text-xs text-fg-3">
                  *Vidros traseiros não têm mínimo legal quando o veículo tem retrovisores externos dos dois lados.
                </p>
              )}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Tonalidades do mostruário">
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
          </div>
        </Reveal>

        {/* ---------- Painel ---------- */}
        <Reveal delay={0.1} className="flex flex-col gap-6">
          <div className="rounded-lg border border-line bg-bg-2 p-5 md:p-6">
            <p className="eyebrow mb-3">Linhas 3M nessa faixa</p>
            <ul className="grid gap-2" aria-live="polite">
              {LINHAS_3M.map((l) => {
                const ok = compativeis.includes(l);
                return (
                  <li
                    key={l.nome}
                    className={`flex items-center justify-between gap-3 text-sm transition-opacity ${ok ? "opacity-100" : "opacity-40"}`}
                  >
                    <span className="font-display text-lg font-semibold uppercase">
                      <span className={`mr-2 inline-block size-1.5 rounded-full align-middle ${ok ? "bg-[#25D366]" : "bg-fg-3"}`} aria-hidden />
                      3M {l.nome}
                      {l.metalizada && <span className="ml-2 text-xs font-medium tracking-[0.15em] text-fg-3">metalizada</span>}
                      <span className="sr-only">{ok ? ", compatível" : ", fora da faixa"}</span>
                    </span>
                    <span className="tabular-nums text-fg-3">{l.min}–{l.max}%</span>
                  </li>
                );
              })}
            </ul>
            <Link href="/3m" className="mt-4 inline-block text-sm text-fg-2 underline underline-offset-4 hover:text-fg">
              Ver detalhes das películas 3M
            </Link>
          </div>

          <a
            href={whatsappUrl(ctaText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-red px-6 py-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-2"
          >
            <WhatsAppIcon className="size-5" />
            Orçamento para G{vlt}
          </a>

          <p className="text-xs leading-relaxed text-fg-3">
            Simulação ilustrativa: a tonalidade real depende do vidro do veículo, da iluminação
            e da calibração do seu monitor, e pode não corresponder ao resultado final. Limites
            conforme Resolução CONTRAN 960/2022 (alterada pela 989/2022); a fiscalização mede
            vidro + película. Na loja, medimos a transmissão luminosa com equipamento próprio.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
