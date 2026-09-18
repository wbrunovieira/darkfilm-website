import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/icons";
import { BagageiroIcon, BikeIcon, RackIcon } from "@/components/icons/thule";
import { whatsappUrl } from "@/lib/site";
import { ABERTURA, CONSULTA, LINHAS } from "@/content/thule";

/**
 * Revenda Autorizada Thule.
 *
 * Página, e não seção, porque foi o que ele pediu: "direcionar para uma área/página interna do
 * próprio site". O volume também pede — são três linhas de produto com descrição, mais a consulta
 * de compatibilidade no fim.
 *
 * **Nenhum link para a Thule.** Ele foi explícito: nada de configurador nem loja virtual da marca.
 * A consulta acontece pelo WhatsApp da loja, com a mensagem já preenchida.
 *
 * Os cartões das três linhas não têm foto, e não estão esperando por uma. Ele disse que depois
 * separaria "umas três imagens bem fortes da própria linha Thule", mas não há foto Thule no
 * acervo: as duas fotos de expositor de rack que existem são da **Farad**, marca concorrente, e
 * usá-las aqui venderia produto de outra marca como se fosse Thule.
 *
 * Então cada cartão ganhou um ícone de traço e se basta. Quando a foto real chegar, ela entra
 * como topo do cartão e o ícone sai — nada aqui impede isso, mas a página não depende disso para
 * estar pronta.
 */
export const metadata: Metadata = {
  title: "Revenda Autorizada Thule",
  description:
    "A The Dark Film é revenda autorizada Thule em Petrópolis: racks de teto, transbikes, bagageiros e acessórios, com orientação de compatibilidade e instalação profissional.",
};

const ICONE = {
  racks: RackIcon,
  transbikes: BikeIcon,
  bagageiros: BagageiroIcon,
} as const;

export default function ThulePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Início", href: "/" }, { label: "Thule" }]}
        title={
          <>
            Revenda autorizada
            <br />
            <span className="text-red-2">Thule.</span>
          </>
        }
        intro={ABERTURA.paragrafos[0]}
        image="/img/thule/campanha-caiaque.jpg"
        imagePosition="center 42%"
      />

      {/* O logo em destaque, na versão branca que ele pediu. */}
      <section className="border-t border-line bg-bg-2">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-10">
          <Image
            src="/img/marcas/thule.svg"
            alt="Thule"
            width={155}
            height={40}
            priority
            className="h-8 w-auto md:h-10"
          />
          <p className="font-display text-sm uppercase tracking-[0.18em] text-fg-3">
            Venda, orientação e instalação profissional
          </p>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        <Reveal className="mb-10 max-w-3xl">
          <h2 className="display text-3xl md:text-5xl">{ABERTURA.titulo}</h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-2">
            {ABERTURA.paragrafos[1]}
          </p>
        </Reveal>

        <RevealGroup className="grid gap-4 md:grid-cols-3" stagger={0.08}>
          {LINHAS.map((l) => {
            const Icone = ICONE[l.id as keyof typeof ICONE];
            return (
              <RevealItem key={l.id}>
                <article className="flex h-full flex-col rounded-xl border border-line bg-bg-2 p-6 md:p-7">
                  <span className="pel-icon pel-icon--accent mb-5">
                    <Icone />
                  </span>
                  <h3 className="font-display text-xl font-semibold uppercase leading-tight md:text-2xl">
                    {l.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-2">
                    {l.texto}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* Consulta de compatibilidade: é aqui que o atendimento fica dentro da casa dele. */}
      <section className="border-y border-line bg-bg-2">
        <div className="container-x grid items-center gap-8 py-16 md:grid-cols-[1.4fr_auto] md:gap-14 md:py-20">
          <Reveal>
            <h2 className="display text-3xl md:text-5xl">{CONSULTA.titulo}</h2>
            <p className="mt-4 max-w-2xl text-fg-2">{CONSULTA.texto}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={whatsappUrl(CONSULTA.mensagem)}
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#25D366] px-7 py-4 font-display text-sm font-semibold uppercase tracking-[0.14em] text-[#05300f] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="size-5" />
              {CONSULTA.botao}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
