import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/icons";
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
 * Os cartões das três linhas são só de texto. Ele vai separar depois "umas três imagens bem
 * fortes da própria linha Thule", e disse preferir isso a imagem genérica: até lá, cartão com
 * moldura de foto vazia faria a página parecer inacabada. Quando as fotos chegarem, entram como
 * topo do cartão.
 */
export const metadata: Metadata = {
  title: "Revenda Autorizada Thule",
  description:
    "A The Dark Film é revenda autorizada Thule em Petrópolis: racks de teto, transbikes, bagageiros e acessórios, com orientação de compatibilidade e instalação profissional.",
};

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
          <p className="mt-5 text-lg leading-relaxed text-fg-2">{ABERTURA.paragrafos[1]}</p>
        </Reveal>

        <RevealGroup className="grid gap-4 md:grid-cols-3" stagger={0.08}>
          {LINHAS.map((l) => (
            <RevealItem key={l.id}>
              {/* Sem foto de produto, de propósito: as três imagens fortes da linha ele ainda vai
                  separar, e ele mesmo disse preferir foto real da marca a imagem genérica. Cartão
                  só de texto fecha a página agora e não finge que falta alguma coisa. */}
              <article className="flex h-full flex-col rounded-xl border border-line bg-bg-2 p-6 md:p-7">
                <span aria-hidden className="mb-5 block h-px w-12 bg-red" />
                <h3 className="font-display text-xl font-semibold uppercase leading-tight md:text-2xl">
                  {l.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{l.texto}</p>
              </article>
            </RevealItem>
          ))}
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
