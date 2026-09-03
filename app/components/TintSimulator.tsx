"use client";

import Image from "next/image";
import { CARRO_FRONTAL, CARRO_PERFIL } from "./simulador/carros";
import Link from "next/link";
import { motion } from "motion/react";
import { useId, useState } from "react";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./icons";
import { whatsappUrl } from "@/lib/site";
import { LIMITES, rotuloLimite, type VidroId } from "@/lib/legislacao";
import { AMOSTRA, MAX, MIN, ROTULOS, TONALIDADES, rotuloFor, shadeFor } from "@/lib/tonalidades";

// O teaser da home importa a escala daqui desde antes de ela virar módulo próprio.
export { ROTULOS, TONALIDADES, shadeFor };

/**
 * Simulador de transparência de película — pensado para quem nunca comprou película.
 *
 * Fontes dos dados:
 * - Tonalidades 5, 20, 35, 50, 70 e 90%: mostruário do site original
 *   (`arquivos_ckfinder/images/imgMostruarioFilm.jpg`), mais o 90% que a loja também
 *   trabalha. O número é a % de luz visível que a película deixa passar. O mercado escreve
 *   "G35"; aqui o número aparece como "35%", a pedido do cliente em 03/09/2026, porque o
 *   cliente final entende porcentagem de luz e não decora código de produto.
 * - A loja trabalha com várias marcas e tecnologias. O simulador é neutro de marca: a
 *   credencial 3M tem página própria (`/3m`) e não é apresentada aqui como se fosse a
 *   única opção disponível.
 * - Limites legais: `lib/legislacao.ts`, fonte única do site.
 * - A lei mede a transmitância do conjunto vidro + película; o número da película sozinha
 *   não é o valor final. Por isso o rótulo é cauteloso e aponta para a medição na loja.
 */
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
  variant = "completo",
}: {
  image?: string;
  /** false na página /simulador, que já tem PageHero. */
  showHeading?: boolean;
  /**
   * "completo": escolhe o vidro, escolhe a tonalidade e vê a cena pela janela.
   * "legislacao": só o carro, os três vidros e o que a lei exige em cada um — é o
   * papel da página /simulador, que existe para explicar a regra e não para repetir
   * a simulação visual que já está na home.
   */
  variant?: "completo" | "legislacao";
}) {
  const [vlt, setVlt] = useState<number>(35);
  const [vidro, setVidro] = useState<VidroId>("traseiras");
  const id = useId();

  const completo = variant === "completo";
  const limite = LIMITES.find((v) => v.id === vidro) ?? LIMITES[1];
  const rotulo = rotuloFor(vlt);

  const status =
    !completo
      ? limite.min === null
        ? {
            ok: true,
            titulo: "Sem mínimo obrigatório",
            detalhe:
              "A lei não define transmissão luminosa mínima para os vidros de trás, desde que o veículo tenha retrovisores externos dos dois lados.",
          }
        : {
            ok: true,
            titulo: `Mínimo de ${limite.min}% de transmissão luminosa`,
            detalhe: `A lei exige que o conjunto vidro + película deixe passar pelo menos ${limite.min}% da luz visível ${limite.em}.`,
          }
    : limite.min === null
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

  const ctaText = completo
    ? `Olá! Usei o simulador do site e quero orçamento de película ${rotulo.toLowerCase()} (${vlt}% de transmissão luminosa) ${limite.para}.`
    : `Olá! Vi a página de legislação do site e quero saber quais películas vocês têm disponíveis ${limite.para}.`;

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
            {/* O cliente pediu para manter "Veja a tonalidade antes de aplicar" na home e em
                /simulador. Aqui o mesmo H2 seria a terceira repetição — confunde a navegação e
                divide a página entre si mesma na busca. */}
            <h2 id={`${id}-title`} className="display text-3xl md:text-5xl">
              Simule <span className="text-red-2">a sua película.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-fg-2">
            Três passos: escolha o vidro, escolha quão escura quer a película e veja como fica —
            e se a lei permite.
          </p>
        </Reveal>
      )}

      <div className={`grid gap-6 lg:items-start ${completo ? "lg:grid-cols-[1fr_1.35fr]" : "lg:grid-cols-2"}`}>
        {/* ---------- Escolha do vidro (e, no modo completo, da tonalidade) ---------- */}
        <Reveal className="flex flex-col gap-6">
          {/* Passo 1: vidro */}
          <fieldset className="min-w-0 rounded-lg border border-line bg-bg-2 p-5 md:p-6">
            <legend className="sr-only">
              {completo ? "Passo 1: qual vidro você quer escurecer?" : "Qual vidro você quer consultar?"}
            </legend>
            <div className="mb-4 flex items-center gap-3" aria-hidden>
              {completo && <StepBadge n={1} />}
              <p className="font-display text-lg font-semibold uppercase leading-tight">
                {completo ? "Qual vidro você quer escurecer?" : "Qual vidro você quer consultar?"}
              </p>
            </div>
            <p className="mb-3 text-sm text-fg-2">Toque no vidro do carro ou escolha na lista.</p>

            <div className="rounded-md border border-line bg-bg px-2 pt-2">
              <CarDiagram vidro={vidro} onPick={setVidro} />
            </div>

            <div className="mt-3 grid gap-2">
              {LIMITES.map((v) => {
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
                    <span className="min-w-0 leading-snug">
                      {v.nome}
                      <span className="mt-0.5 block text-xs text-fg-3">
                        {rotuloLimite(v)}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Passo 2: tonalidade — não existe na página de legislação */}
          {completo && (
          <div className="rounded-lg border border-line bg-bg-2 p-5 md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <StepBadge n={2} />
              <p className="font-display text-lg font-semibold uppercase leading-tight" id={`${id}-p2`}>
                Quão escura você quer?
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2" role="group" aria-labelledby={`${id}-p2`}>
              {TONALIDADES.map((t) => {
                const on = vlt === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setVlt(t)}
                    aria-pressed={on}
                    aria-label={`${ROTULOS[t]}, deixa passar ${t}% da luz`}
                    className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-center transition-colors ${
                      on ? "border-red bg-red/10 text-fg" : "border-line text-fg-2 hover:border-line-strong hover:text-fg"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="size-5 rounded-full border border-white/25"
                      style={{ backgroundColor: AMOSTRA[t] }}
                    />
                    <span className="text-[11px] font-semibold leading-tight sm:text-xs">{ROTULOS[t]}</span>
                    <span className="font-display text-[10px] tabular-nums tracking-[0.15em] text-fg-3">{t}%</span>
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
                O que o número da película significa?
              </summary>
              <p className="mt-2 leading-relaxed">
                Quanto menor o número, mais escura é a película. Quanto maior, mais clara. O
                número indica a transmissão de luz visível da película — trabalhamos de 5% até
                90%, das mais escuras às praticamente transparentes. O resultado final pode
                variar conforme o vidro original do veículo.
              </p>
            </details>
          </div>
          )}
        </Reveal>

        {/* ---------- Resultado ---------- */}
        <Reveal delay={0.1} className="flex flex-col overflow-hidden rounded-lg border border-line bg-bg-2 lg:sticky lg:top-24">
          {!completo && (
            <div className="border-b border-line p-5 md:p-6">
              <p className="font-display text-lg font-semibold uppercase leading-tight">
                O que a lei permite
              </p>
            </div>
          )}

          {completo && (
          <div className="flex items-center gap-3 border-b border-line p-5 md:p-6">
            <StepBadge n={3} />
            <p className="font-display text-lg font-semibold uppercase leading-tight">Como fica</p>
          </div>
          )}

          {completo && (
          <div className="relative aspect-[16/10] bg-[radial-gradient(120%_90%_at_30%_0%,#2a2c31_0%,#141518_55%,#0b0b0d_100%)]">
            {/* cena externa, recortada pela janela */}
            <div className="absolute inset-0" style={{ clipPath: `polygon(${WINDOW_POLY})` }}>
              <Image
                src={image}
                alt="Rua Cel. Veiga vista através do vidro lateral de um carro, com a simulação de tonalidade aplicada"
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
                {rotulo} <span className="text-fg-3">· {vlt}%</span>
              </span>
              <span className="mt-1 block text-xs text-fg-2">
                deixa passar <strong className="tabular-nums text-fg">{vlt}%</strong> da luz
              </span>
            </output>
          </div>
          )}

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

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl(ctaText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-red px-6 py-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-2"
              >
                <WhatsAppIcon className="size-5" />
                {completo ? "Quero essa tonalidade" : "Consulte as películas disponíveis"}
              </a>
              <p className="text-center text-xs text-fg-3">
                {completo
                  ? "Abre o WhatsApp com a tonalidade e o vidro já preenchidos. "
                  : "Trabalhamos com várias marcas e tecnologias de película. Abre o WhatsApp com o vidro já preenchido. "}
                <Link href="/contato" className="underline underline-offset-4 hover:text-fg">
                  Prefiro outro contato
                </Link>
              </p>
            </div>

            <p className="text-xs leading-relaxed text-fg-3">
              {completo
                ? "Simulação ilustrativa: a tonalidade real depende do vidro do veículo, da iluminação e do seu monitor. "
                : "A transmissão final considera o conjunto vidro + película e é medida na loja com equipamento próprio. "}
              Limites conforme Resolução CONTRAN 960/2022 (alterada pela 989/2022).
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
