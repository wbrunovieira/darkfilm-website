import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { ArrowIcon } from "@/components/icons";
import {
  Beneficios,
  Distribuicao,
  Tipos,
  Trabalhos,
} from "@/components/peliculas/Arquitetonicas";
import { ABERTURA } from "@/content/arquitetonicas";
import areas from "@/content/galeria-areas.json";

export const metadata: Metadata = {
  title: "Películas Arquitetônicas",
  description:
    "Películas para vidro residencial e comercial em Petrópolis/RJ: controle solar, proteção UV, privacidade, segurança e decoração. Instalação profissional e fornecimento para aplicadores.",
};

/**
 * Reorganizada a pedido do cliente em 22/09/2026.
 *
 * A ordem é a que ele definiu: "primeiro explicar os benefícios, depois mostrar os tipos de
 * películas disponíveis e, por fim, distribuição e trabalhos realizados".
 *
 * **Esta página absorveu outras três.** Ele pediu a unificação — "não precisa abrir outra
 * página para Características do Film nem outra para Película Comercial" —, e com isso saíram
 * do site `/caracteristicas-do-film`, `/produtos/pelicula-comercial` e a página de distribuição.
 * As três ganharam redirecionamento permanente para cá em `next.config.ts`: eram URLs públicas,
 * e a de características existia também no site antigo, então some da navegação mas não deixa
 * ninguém em 404.
 *
 * **O bloco 3M virou um link, não um resumo.** Palavras dele: "manter o bloco de Credenciada 3M
 * apenas como acesso para a página específica da 3M, sem repetir nesta página todas as
 * informações das linhas 3M".
 */
export default function PeliculasArquitetonicasPage() {
  const arquitetura = areas.find((a) => a.id === "arquitetura");
  const fotos = arquitetura?.photos ?? [];

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Início", href: "/" },
          { label: "Películas" },
          { label: "Arquitetônicas" },
        ]}
        title={
          <>
            Conforto, proteção e
            <br />
            <span className="text-red-2">privacidade para seu ambiente.</span>
          </>
        }
        intro={ABERTURA.paragrafos[0]}
        /* Continua sem foto de fundo: todo o material de arquitetura do acervo é vídeo vertical
           de baixa resolução, e numa faixa larga com a máscara escura do hero qualquer quadro
           vira estática. Volta quando vier foto de arquitetura de verdade. */
      />

      <section className="container-x border-t border-line py-12 md:py-16">
        <Reveal className="max-w-3xl">
          <p className="text-base leading-relaxed text-fg-2 md:text-lg">
            {ABERTURA.paragrafos[1]}
          </p>
        </Reveal>
      </section>

      <Beneficios />
      <Tipos />
      <Distribuicao />
      <Trabalhos fotos={fotos} />

      {/* 3M: só a porta de entrada, sem repetir as linhas aqui. */}
      <section className="container-x border-t border-line py-14 md:py-20">
        <Reveal>
          <Link
            href="/3m"
            className="group flex flex-wrap items-center justify-between gap-6 rounded-lg border border-line bg-bg-2 p-6 transition-colors hover:border-line-strong md:p-8"
          >
            <div className="max-w-xl">
              <p className="eyebrow mb-3">Credencial</p>
              <h2 className="display text-2xl md:text-3xl">Aplicadora credenciada 3M</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-2">
                As linhas de Películas para Vidros da 3M e o que o credenciamento exige da loja.
              </p>
            </div>
            <span className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg-2 transition-colors group-hover:text-fg">
              Ver a página da 3M
              <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      </section>

      <ContactCTA />
    </>
  );
}
