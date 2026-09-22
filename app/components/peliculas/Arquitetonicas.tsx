"use client";

import { PhotoGrid, type Photo } from "../PhotoGrid";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { WhatsAppIcon } from "../icons";
import { DecorIcon, HeatIcon, PrivacyIcon, ShatterIcon, UvIcon } from "../icons/peliculas";
import { whatsappUrl } from "@/lib/site";
import { BENEFICIOS, DISTRIBUICAO, GALERIA, TIPOS } from "@/content/arquitetonicas";

/**
 * Os blocos da página de películas arquitetônicas, reorganizados a pedido do cliente em
 * 22/09/2026: primeiro os benefícios, depois os tipos, depois distribuição e trabalhos.
 *
 * **Benefícios levam ícone; tipos, não.** Ele pediu ícone só nos benefícios, e a distinção
 * ajuda: os dois blocos falam de película, e repetir a mesma moldura de cartão faria a página
 * parecer dizer duas vezes a mesma coisa — que é o defeito que ele mandou corrigir.
 */

const ICONES: Record<string, (p: { className?: string }) => React.ReactElement> = {
  calor: HeatIcon,
  uv: UvIcon,
  privacidade: PrivacyIcon,
  estilhaco: ShatterIcon,
  decoracao: DecorIcon,
};

export function Beneficios() {
  return (
    <section
      id="principais-beneficios"
      className="container-x scroll-mt-24 border-t border-line py-16 md:py-24"
    >
      <Reveal className="mb-10 max-w-2xl">
        <p className="eyebrow mb-3">Principais benefícios</p>
        <h2 className="display text-3xl md:text-5xl">O que a película faz pelo ambiente.</h2>
      </Reveal>

      {/* O cartão de segurança é o mais longo de todos e, numa grade de três colunas iguais,
          esticava a linha inteira. Ocupando duas colunas ele respira e o bloco fica parelho. */}
      <RevealGroup stagger={0.07} role="list" className="grid gap-4 md:grid-cols-6">
        {BENEFICIOS.map((b) => {
          const Icone = ICONES[b.icone];
          const largo = b.id === "seguranca";
          return (
            <RevealItem
              key={b.id}
              role="listitem"
              className={`md:col-span-2 ${largo ? "lg:col-span-4" : ""}`}
            >
              <article className="flex h-full flex-col rounded-lg border border-line bg-bg-2 p-6">
                <span className="mb-5 grid size-11 place-items-center rounded-full border border-line text-red-2">
                  {Icone && <Icone className="size-5" />}
                </span>
                <h3 className="font-display text-lg font-semibold uppercase leading-tight text-fg">
                  {b.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{b.texto}</p>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}

export function Tipos() {
  return (
    <section
      id="tipos-de-peliculas"
      className="scroll-mt-24 border-t border-line bg-bg-2/40"
    >
      <div className="container-x py-16 md:py-24">
        <Reveal className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3">Tipos</p>
          <h2 className="display text-3xl md:text-5xl">
            Tipos de películas arquitetônicas
          </h2>
        </Reveal>

        {/* Lista numerada, não cartões: são sete itens com texto de tamanhos muito diferentes,
            e a grade de cartões deixaria buracos de altura. A numeração também dá ao visitante
            a noção de quantas opções existem, que é a pergunta que este bloco responde. */}
        <RevealGroup
          stagger={0.05}
          role="list"
          className="border-t border-line"
        >
          {TIPOS.map((t, i) => (
            <RevealItem key={t.id} role="listitem">
              <article
                id={t.id}
                className="grid scroll-mt-28 gap-2 border-b border-line py-6 md:grid-cols-[auto_18rem_1fr] md:items-baseline md:gap-8 md:py-7"
              >
                <span className="font-display text-xs font-medium tabular-nums tracking-[0.2em] text-fg-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-semibold uppercase leading-tight text-fg md:text-xl">
                  {t.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-fg-2 md:text-base">{t.texto}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function Distribuicao() {
  return (
    <section
      id="distribuicao"
      className="container-x scroll-mt-24 border-t border-line py-16 md:py-24"
    >
      <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <Reveal>
          <p className="eyebrow mb-3">Para aplicadores</p>
          <h2 className="display text-3xl md:text-5xl [text-wrap:balance]">
            {DISTRIBUICAO.titulo}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base leading-relaxed text-fg-2 md:text-lg">{DISTRIBUICAO.texto}</p>

          {/* Marcado como proposta porque é o que ele escreveu — "a proposta futura de kits".
              Sem essa moldura, a frase leria como serviço já disponível, e o aplicador ligaria
              pedindo um kit que ainda não existe. */}
          <div className="mt-6 rounded-lg border border-dashed border-line-strong p-5">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-fg-3">
              Em estudo
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-2">{DISTRIBUICAO.futuro}</p>
          </div>

          <a
            href={whatsappUrl(DISTRIBUICAO.mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta mt-8"
          >
            <WhatsAppIcon className="size-5" />
            {DISTRIBUICAO.botao}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Trabalhos({ fotos }: { fotos: Photo[] }) {
  if (fotos.length === 0) return null;
  return (
    <section
      id="alguns-dos-nossos-trabalhos"
      className="container-x scroll-mt-24 border-t border-line py-16 md:py-24"
    >
      <Reveal className="mb-8 max-w-2xl">
        <p className="eyebrow mb-3">Feito aqui</p>
        <h2 className="display text-3xl md:text-5xl">{GALERIA.titulo}</h2>
        <p className="mt-5 text-lg leading-relaxed text-fg-2">{GALERIA.subtitulo}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <PhotoGrid photos={fotos} variant="uniform" label="Películas arquitetônicas" />
      </Reveal>
    </section>
  );
}
