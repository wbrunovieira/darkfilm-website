import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { ABERTURA, IMPORTANTE, PASSOS } from "@/content/mercado-livre";
import {
  AvisoIcon,
  DevolucaoIcon,
  EnvioIcon,
  RetiradaIcon,
  TrocaIcon,
} from "@/components/icons/mercadolivre";

/**
 * Agência Mercado Livre.
 *
 * O texto é do cliente, de 12/09/2026, e está em `content/mercado-livre.ts` sem uma vírgula
 * alterada: cada bloco delimita o que a loja faz e o que não faz. Aqui só se cuida do layout.
 *
 * Página própria, e não seção da home, por três motivos: o selo do Mercado Livre no topo da home
 * precisava de um destino, a home já é longa, e a mesma forma serve de molde para a página da
 * Thule, que ele pediu no mesmo dia.
 */
export const metadata: Metadata = {
  title: "Agência Mercado Livre",
  description:
    "A The Dark Film é Agência Mercado Livre em Petrópolis: envio de vendas, retirada de compras, devoluções e trocas, mediante autorização e QR Code da plataforma.",
};

const ICONE = {
  envio: EnvioIcon,
  retirada: RetiradaIcon,
  devolucao: DevolucaoIcon,
  troca: TrocaIcon,
} as const;

export default function AgenciaMercadoLivrePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Início", href: "/" }, { label: "Agência Mercado Livre" }]}
        title={
          <>
            {ABERTURA.titulo.split(" na ")[0]}
            <br />
            <span className="text-red-2">na The Dark Film.</span>
          </>
        }
        intro={ABERTURA.texto}
        /* Sem foto de fundo: as imagens que vieram com o pedido são geradas por IA, de 307px, e
           duas mostram uma marca com slogan em inglês que não existe. Foto real da loja como
           agência ainda não temos. */
      />

      {/* O logo fica aqui, grande, porque é o assunto da página. */}
      <section className="border-t border-line bg-bg-2">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-10">
          <Image
            src="/img/marcas/mercado-livre.png"
            alt="Mercado Livre"
            width={288}
            height={72}
            priority
            className="h-10 w-auto md:h-12"
          />
          <p className="font-display text-sm uppercase tracking-[0.18em] text-fg-3">
            Ponto de apoio logístico credenciado
          </p>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">Como funciona</p>
          <h2 className="display text-3xl md:text-5xl">O que dá para resolver aqui</h2>
        </Reveal>

        <RevealGroup className="grid gap-4 md:grid-cols-2" stagger={0.08}>
          {PASSOS.map((p) => {
            const Icone = ICONE[p.id as keyof typeof ICONE];
            return (
              <RevealItem key={p.id}>
                <article className="flex h-full gap-4 rounded-xl border border-line bg-bg-2 p-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-bg-3 text-gold">
                    <Icone />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold uppercase leading-tight md:text-xl">
                      {p.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-2">{p.texto}</p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Bloco de responsabilidade. Discreto no peso, mas não escondido: é o que separa o papel
            da loja do papel da plataforma, e foi escrito por ele com esse cuidado. */}
        <Reveal delay={0.1}>
          <aside className="mt-6 rounded-xl border border-line-strong bg-bg-3 p-6 md:p-8">
            <p className="flex items-center gap-2.5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg">
              <AvisoIcon className="size-5 text-red-2" />
              {IMPORTANTE.titulo}
            </p>
            {IMPORTANTE.paragrafos.map((t) => (
              <p key={t.slice(0, 24)} className="mt-3 text-sm leading-relaxed text-fg-2">
                {t}
              </p>
            ))}
          </aside>
        </Reveal>
      </section>

      <ContactCTA />
    </>
  );
}
