"use client";

import Image from "next/image";
import { CARRO_FRONTAL, CARRO_PERFIL } from "./simulador/carros";
import Link from "next/link";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./icons";
import { whatsappUrl } from "@/lib/site";

/**
 * Simulador de transparência de película — pensado para quem nunca comprou película.
 *
 * Fontes dos dados:
 * - Tonalidades G5, G20, G35, G50, G70: foto do mostruário do site original
 *   (`arquivos_ckfinder/images/imgMostruarioFilm.jpg`). "G" = % de luz visível transmitida
 *   pela película (convenção do mercado). Os rótulos humanos ("Bem escura"… "Bem clara") são
 *   apenas apelidos de UI para esses cinco códigos; o código continua visível.
 * - Faixas 3M: página `3m.html` do site original (Crystalline 40–90, CS Premium 5–50,
 *   FX Pro 5–70, EX 5–35, Black Chrome 10–40).
 * - Limites legais conferidos no texto oficial da resolução em 03/09/2026 (PDF do gov.br),
 *   não em fonte secundária: Resolução CONTRAN 960/2022, art. 4º, com a redação dada pela
 *   Resolução 989/2022. Para-brisa E laterais dianteiras: 70% — o §1º define as duas como
 *   "áreas indispensáveis à dirigibilidade". Traseiros e vigia: sem mínimo, desde que o
 *   veículo tenha retrovisores externos dos dois lados; películas refletivas são vedadas
 *   em qualquer área (art. 10, I).
 *   Correções feitas nessa conferência: o site trazia 75% no para-brisa, valor da resolução
 *   anterior já revogada; e o mínimo de 28% dos demais vidros deixou de existir quando a
 *   989/2022 reescreveu o inciso II.
 * - A lei mede a transmitância do conjunto vidro + película; o número da película sozinha
 *   não é o valor final. Por isso o rótulo é cauteloso e aponta para a medição na loja.
 */
export const TONALIDADES = [5, 20, 35, 50, 70] as const;

/** Apelidos em linguagem simples para os cinco códigos do mostruário. */
export const ROTULOS: Record<(typeof TONALIDADES)[number], string> = {
  5: "Bem escura",
  20: "Escura",
  35: "Média",
  50: "Clara",
  70: "Bem clara",
};

/** Rótulo humano para qualquer valor do slider (faixas entre os presets). */
export function rotuloFor(vlt: number) {
  if (vlt <= 12) return ROTULOS[5];
  if (vlt <= 27) return ROTULOS[20];
  if (vlt <= 42) return ROTULOS[35];
  if (vlt <= 60) return ROTULOS[50];
  return ROTULOS[70];
}

type VidroId = "parabrisa" | "dianteiras" | "traseiras";
/** `em` = frase com preposição ("nos vidros da frente"); `para` = "para os vidros da frente". */
/* Mínimos conferidos no texto oficial em 03/09/2026 — Resolução CONTRAN 960/2022,
   art. 4º, com a redação dada pela Resolução 989/2022:
   - inciso I: não pode ser inferior a 70% para o para-brisa E para as demais áreas
     indispensáveis à dirigibilidade, que o §1º define como o para-brisa e as laterais
     DIANTEIRAS;
   - inciso II (redação da 989/2022): pode ser inferior a isso nos vidros que não
     interferem nessas áreas, desde que o veículo tenha retrovisores externos dos dois
     lados. O mínimo de 28% que constava na redação original deixou de existir.
   O site trazia 75% no para-brisa, que era o valor da resolução antiga, revogada. */
const VIDROS: { id: VidroId; nome: string; em: string; para: string; min: number | null }[] = [
  { id: "dianteiras", nome: "Vidros da frente (motorista e carona)", em: "nos vidros da frente", para: "para os vidros da frente", min: 70 },
  { id: "traseiras", nome: "Vidros de trás (portas traseiras e vidro traseiro)", em: "nos vidros de trás", para: "para os vidros de trás", min: null },
  { id: "parabrisa", nome: "Para-brisa", em: "no para-brisa", para: "para o para-brisa", min: 70 },
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

/* ---------- Diagrama do carro (vista lateral, frente à esquerda) ---------- */
// Áreas de vidro em coordenadas do viewBox 0 0 400 150. Só apresentação: os controles
// reais são os radios; o SVG é aria-hidden e apenas atalho de clique.
/* Desenho do carro: dois SVGs vetoriais, injetados como HTML.
   São dois porque o seletor tem três opções e o para-brisa NÃO aparece num perfil
   puro — fica escondido pela coluna A. Então o perfil serve aos vidros dianteiros e
   traseiros, e a vista 3/4 frontal serve ao para-brisa.
   Os quatro polígonos `data-vidro` são estilizados por CSS (ver .carro-diagrama no
   globals) e clicados por delegação, sem converter o SVG para JSX. */
const VIDRO_DO_POLIGONO: Record<string, VidroId> = {
  parabrisa: "parabrisa",
  dianteiro: "dianteiras",
  traseiro: "traseiras",
  vigia: "traseiras",
};

function CarDiagram({ vidro, onPick }: { vidro: VidroId; onPick: (v: VidroId) => void }) {
  const svg = vidro === "parabrisa" ? CARRO_FRONTAL : CARRO_PERFIL;
  return (
    <div
      className="carro-diagrama"
      data-sel={vidro}
      onClick={(e) => {
        const alvo = (e.target as HTMLElement).closest?.("[data-vidro]");
        const chave = alvo?.getAttribute("data-vidro");
        const destino = chave ? VIDRO_DO_POLIGONO[chave] : undefined;
        if (destino) onPick(destino);
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-red font-display text-sm font-semibold text-white"
    >
      {n}
    </span>
  );
}

export function TintSimulator({
  /* A cena anterior era um Lamborghini numa rua dos Estados Unidos ("7 Street",
     palmeiras, semáforo americano), com marca d'água carimbada, pessoas
     identificáveis e placas legíveis — e quase certamente não era foto do cliente.
     Trocada pela Rua Cel. Veiga em dia claro, foto dele, sem placa nem rosto. */
  image = "/img/novo/simulador--rua-cel-veiga.jpg",
  showHeading = true,
}: {
  image?: string;
  /** false na página /simulador, que já tem PageHero. */
  showHeading?: boolean;
}) {
  const [vlt, setVlt] = useState<number>(35);
  const [vidro, setVidro] = useState<VidroId>("traseiras");
  const id = useId();

  const limite = VIDROS.find((v) => v.id === vidro) ?? VIDROS[1];
  const rotulo = rotuloFor(vlt);

  const status =
    limite.min === null
      ? {
          ok: true,
          titulo: `Permitido ${limite.em}`,
          detalhe: "A lei não define mínimo para os vidros de trás, desde que o carro tenha retrovisor externo dos dois lados.",
        }
      : vlt >= limite.min
        ? {
            ok: true,
            titulo: `Permitido ${limite.em}`,
            detalhe: `Deixa passar ${vlt}% da luz — acima do mínimo de ${limite.min}% que a lei exige neste vidro.`,
          }
        : {
            ok: false,
            titulo: `Escuro demais ${limite.para}`,
            detalhe: `A lei exige que passe pelo menos ${limite.min}% da luz neste vidro — esta película deixa passar só ${vlt}%. Escolha uma opção mais clara.`,
          };

  const shade = shadeFor(vlt);
  const pct = ((vlt - MIN) / (MAX - MIN)) * 100;
  const compativeis = LINHAS_3M.filter((l) => vlt >= l.min && vlt <= l.max);

  const ctaText = `Olá! Usei o simulador do site e quero orçamento de película ${rotulo.toLowerCase()} (G${vlt}, deixa passar ${vlt}% da luz) ${limite.para}.`;

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
            Três passos: escolha o vidro, escolha quão escura quer a película e veja como fica —
            e se a lei permite.
          </p>
        </Reveal>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr] lg:items-start">
        {/* ---------- Passos 1 e 2 ---------- */}
        <Reveal className="flex flex-col gap-6">
          {/* Passo 1: vidro */}
          <fieldset className="min-w-0 rounded-lg border border-line bg-bg-2 p-5 md:p-6">
            <legend className="sr-only">Passo 1: qual vidro você quer escurecer?</legend>
            <div className="mb-4 flex items-center gap-3" aria-hidden>
              <StepBadge n={1} />
              <p className="font-display text-lg font-semibold uppercase leading-tight">
                Qual vidro você quer escurecer?
              </p>
            </div>
            <p className="mb-3 text-sm text-fg-2">Toque no vidro do carro ou escolha na lista.</p>

            <div className="rounded-md border border-line bg-bg px-2 pt-2">
              <CarDiagram vidro={vidro} onPick={setVidro} />
            </div>

            <div className="mt-3 grid gap-2">
              {VIDROS.map((v) => {
                const active = vidro === v.id;
                return (
                  <label
                    key={v.id}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3.5 py-2.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red ${
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
                    <span
                      aria-hidden
                      className={`size-3.5 shrink-0 rounded-full border-2 ${active ? "border-red bg-red" : "border-fg-3"}`}
                    />
                    <span className="leading-snug">{v.nome}</span>
                    <span className="ml-auto shrink-0 text-xs tabular-nums text-fg-3">
                      {v.min === null ? "sem mínimo" : `mín. ${v.min}% de luz`}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Passo 2: tonalidade */}
          <div className="rounded-lg border border-line bg-bg-2 p-5 md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <StepBadge n={2} />
              <p className="font-display text-lg font-semibold uppercase leading-tight" id={`${id}-p2`}>
                Quão escura você quer?
              </p>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2" role="group" aria-labelledby={`${id}-p2`}>
              {TONALIDADES.map((t) => {
                const on = vlt === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setVlt(t)}
                    aria-pressed={on}
                    aria-label={`${ROTULOS[t]}, código G${t}, deixa passar ${t}% da luz`}
                    className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-center transition-colors ${
                      on ? "border-red bg-red/10 text-fg" : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="size-5 rounded-full border border-white/25"
                      style={{ backgroundColor: `rgb(${Math.round(210 * (1 - shadeFor(t)))},${Math.round(215 * (1 - shadeFor(t)))},${Math.round(225 * (1 - shadeFor(t)))})` }}
                    />
                    <span className="text-[11px] font-semibold leading-tight sm:text-xs">{ROTULOS[t]}</span>
                    <span className="font-display text-[10px] tabular-nums tracking-[0.15em] text-fg-3">G{t}</span>
                  </button>
                );
              })}
            </div>

            {/* Ajuste fino */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor={`${id}-vlt`} className="text-sm text-fg-2">
                  Ajuste fino
                </label>
                <span className="font-display text-xs uppercase tracking-[0.15em] text-fg-3" aria-hidden>
                  escura ← → clara
                </span>
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
                  aria-valuetext={`${rotulo}, deixa passar ${vlt}% da luz`}
                  className="tint-range w-full"
                  style={{ "--p": `${pct}%` } as React.CSSProperties}
                />
                {limite.min !== null && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-fg"
                    style={{ left: `calc(${((limite.min - MIN) / (MAX - MIN)) * 100}% + (13px - ${((limite.min - MIN) / (MAX - MIN)) * 26}px))` }}
                  />
                )}
              </div>
              {limite.min !== null && (
                <p className="mt-2 text-xs text-fg-3">
                  A marca branca no trilho é o mínimo da lei para este vidro ({limite.min}% de luz).
                </p>
              )}
            </div>

            <details className="mt-4 text-sm text-fg-2">
              <summary className="cursor-pointer list-none text-fg-3 underline underline-offset-4 hover:text-fg [&::-webkit-details-marker]:hidden">
                O que é o código G?
              </summary>
              <p className="mt-2 leading-relaxed">
                É a numeração do mostruário: o número diz quanto da luz atravessa a película. G5
                deixa passar 5% da luz (quase não se vê para dentro); G70 deixa passar 70% (bem
                clara). É só um jeito de nomear a tonalidade — não é preço nem qualidade.
              </p>
            </details>
          </div>
        </Reveal>

        {/* ---------- Passo 3: resultado ---------- */}
        <Reveal delay={0.1} className="flex flex-col overflow-hidden rounded-lg border border-line bg-bg-2 lg:sticky lg:top-24">
          <div className="flex items-center gap-3 border-b border-line p-5 md:p-6">
            <StepBadge n={3} />
            <p className="font-display text-lg font-semibold uppercase leading-tight">Como fica</p>
          </div>

          <div className="relative aspect-[16/10] bg-[radial-gradient(120%_90%_at_30%_0%,#2a2c31_0%,#141518_55%,#0b0b0d_100%)]">
            {/* cena externa, recortada pela janela */}
            <div className="absolute inset-0" style={{ clipPath: `polygon(${WINDOW_POLY})` }}>
              <Image
                src={image}
                alt="Rua com palmeiras e prédios vista através do vidro lateral de um carro"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[center_28%]"
              />
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-black"
                animate={{ opacity: shade }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/[0.16] via-transparent to-white/[0.05]" />
              <div aria-hidden className="absolute -left-1/4 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            </div>

            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
              <polygon points={WINDOW_POINTS} fill="none" stroke="#000" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <polygon points={WINDOW_POINTS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="94" x2="100" y2="90" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            </svg>

            <output
              htmlFor={`${id}-vlt`}
              className="absolute left-3 top-3 rounded-md border border-white/15 bg-bg/80 px-3 py-2 backdrop-blur md:left-4 md:top-4"
            >
              <span className="block font-display text-base font-semibold uppercase leading-none text-fg md:text-lg">
                {rotulo} <span className="text-fg-3">· G{vlt}</span>
              </span>
              <span className="mt-1 block text-xs text-fg-2">
                deixa passar <strong className="tabular-nums text-fg">{vlt}%</strong> da luz
              </span>
            </output>
          </div>

          <div className="space-y-5 p-5 md:p-6">
            {/* Veredito legal */}
            <div
              role="status"
              aria-live="polite"
              className={`rounded-md border p-4 ${status.ok ? "border-[#25D366]/40 bg-[#25D366]/10" : "border-red/50 bg-red/10"}`}
            >
              <p className="flex items-start gap-2.5 font-display text-base font-semibold uppercase leading-tight">
                <span
                  aria-hidden
                  className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] ${status.ok ? "bg-[#25D366] text-[#062b16]" : "bg-red text-white"}`}
                >
                  {status.ok ? "✓" : "!"}
                </span>
                {status.titulo}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">{status.detalhe}</p>
              <p className="mt-2 text-xs leading-relaxed text-fg-3">
                A fiscalização mede vidro + película juntos, e o vidro do carro já segura um pouco
                da luz. Na loja medimos o valor final antes de aplicar.
              </p>
            </div>

            {/* 3M: escondido por padrão */}
            <details className="group rounded-md border border-line">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm text-fg-2 hover:text-fg [&::-webkit-details-marker]:hidden">
                <span>
                  Ver películas 3M que atendem{" "}
                  <span className="text-fg-3">({compativeis.length} de {LINHAS_3M.length})</span>
                </span>
                <span aria-hidden className="text-fg-3 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="border-t border-line px-4 py-4">
                <p className="mb-3 text-xs leading-relaxed text-fg-3">
                  Somos credenciados 3M. Cada linha abaixo é uma família de películas, fabricada
                  em várias tonalidades. As destacadas existem na tonalidade que você escolheu.
                </p>
                <ul className="grid gap-2">
                  {LINHAS_3M.map((l) => {
                    const ok = compativeis.includes(l);
                    return (
                      <li
                        key={l.nome}
                        className={`flex items-center justify-between gap-3 text-sm transition-opacity ${ok ? "opacity-100" : "opacity-40"}`}
                      >
                        <span className="font-display text-base font-semibold uppercase">
                          <span className={`mr-2 inline-block size-1.5 rounded-full align-middle ${ok ? "bg-[#25D366]" : "bg-fg-3"}`} aria-hidden />
                          3M {l.nome}
                          {l.metalizada && <span className="ml-2 text-xs font-medium tracking-[0.15em] text-fg-3">metalizada</span>}
                          <span className="sr-only">{ok ? ", atende" : ", não existe nessa tonalidade"}</span>
                        </span>
                        <span className="text-xs tabular-nums text-fg-3">{l.min}–{l.max}% de luz</span>
                      </li>
                    );
                  })}
                </ul>
                <Link href="/3m" className="mt-3 inline-block text-xs text-fg-2 underline underline-offset-4 hover:text-fg">
                  Saber mais sobre as películas 3M
                </Link>
              </div>
            </details>

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl(ctaText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-red px-6 py-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-2"
              >
                <WhatsAppIcon className="size-5" />
                Quero essa tonalidade
              </a>
              <p className="text-center text-xs text-fg-3">
                Abre o WhatsApp com a tonalidade e o vidro já preenchidos.{" "}
                <Link href="/contato" className="underline underline-offset-4 hover:text-fg">
                  Prefiro outro contato
                </Link>
              </p>
            </div>

            <p className="text-xs leading-relaxed text-fg-3">
              Simulação ilustrativa: a tonalidade real depende do vidro do veículo, da iluminação
              e do seu monitor. Limites conforme Resolução CONTRAN 960/2022 (alterada pela
              989/2022).
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
