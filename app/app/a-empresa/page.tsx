import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { GoogleBadge } from "@/components/GoogleBadge";
import { ContactCTA } from "@/components/ContactCTA";
import { site } from "@/lib/site";
import { ABERTURA, HISTORIA, MISSAO } from "@/content/empresa";
import { LongArrowIcon } from "@/components/icons/empresa";

export const metadata: Metadata = {
  title: "A Empresa",
  /* A descrição antiga repetia "a mais experiente e reconhecida da região" — afirmação que o
     cliente pediu para tirar do título em 22/09/2026. Mantê-la no meta faria o Google continuar
     anunciando o que ele acabou de remover da página. */
  description:
    "Como a The Dark Film começou, em Petrópolis/RJ: das primeiras aplicações de película na garagem de casa, nos anos 90, até a loja da Rua Coronel Veiga.",
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * A Empresa, refeita a pedido do cliente em 22/09/2026.
 *
 * Palavras dele: "a página está com muitas informações repetidas, tanto dentro dela própria
 * quanto em relação à Home". Estava mesmo — a linha do tempo repetia a credencial 3M que já tem
 * página inteira, o bloco de missão repetia a lista de serviços que cada seção do site já
 * detalha, e a grade de clientes era a mesma que acabou de ganhar destaque na Home.
 *
 * Saíram: linha do tempo (Fundação, ABRAWF, 3M, película de segurança, "34 anos"), lista de
 * serviços e bloco de clientes. Entrou a história que ele escreveu, com as fotos de arquivo.
 *
 * **Os indicadores continuam, mas discretos** — foi o que ele pediu: "podem ser mantidos no
 * início, de forma discreta, apenas os indicadores que agregam credibilidade... sem repeti-los
 * novamente ao longo da página". Antes eram três números gigantes ocupando uma tela inteira;
 * agora é uma régua de uma linha logo abaixo da abertura.
 */
export default function AEmpresaPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Início", href: "/" }, { label: "A Empresa" }]}
        title={
          <>
            Uma história que começou
            <br />
            <span className="text-red-2">da paixão por carros.</span>
          </>
        }
        intro={ABERTURA.intro}
        image="/img/novo/institucional--fachada-3m-entardecer.jpg"
        imagePosition="center 38%"
      />

      {/* ---------- Credenciais, em uma linha ---------- */}
      <section className="border-t border-line">
        <div className="container-x py-8">
          <Reveal className="flex flex-wrap items-center gap-x-10 gap-y-5">
            <p className="text-sm text-fg-2">
              <strong className="font-display text-base font-semibold text-fg">
                Desde {site.founded}
              </strong>{" "}
              em Petrópolis/RJ
            </p>
            <span aria-hidden className="hidden h-5 w-px bg-line sm:block" />
            <p className="text-sm text-fg-2">
              <strong className="font-display text-base font-semibold text-fg">3M</strong>{" "}
              aplicadora credenciada
            </p>
            <span aria-hidden className="hidden h-5 w-px bg-line sm:block" />
            <GoogleBadge />
          </Reveal>
        </div>
      </section>

      {/* ---------- A história ---------- */}
      {HISTORIA.map((bloco, i) => (
        <section key={bloco.id} id={bloco.id} className="border-t border-line">
          <div
            className={`container-x grid items-center gap-10 py-14 md:gap-16 md:py-20 ${
              bloco.fotos ? "md:grid-cols-2" : ""
            }`}
          >
            {/* A foto alterna de lado a cada bloco: três blocos seguidos com a imagem sempre
                à direita viram uma lista, e a página deixa de ser lida como narrativa. */}
            <Reveal
              delay={0.05}
              className={i % 2 === 1 ? "md:order-2" : undefined}
            >
              {bloco.titulo && (
                <h2 className="display text-3xl md:text-5xl [text-wrap:balance]">
                  {bloco.titulo}
                </h2>
              )}
              <div className={bloco.titulo ? "mt-6 space-y-5" : "space-y-5"}>
                {bloco.paragrafos.map((p) => (
                  <p key={p.slice(0, 24)} className="text-base leading-relaxed text-fg-2 md:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            {bloco.fotos && (
              <Reveal
                delay={0.15}
                className={`space-y-4 ${i % 2 === 1 ? "md:order-1" : ""}`}
                variants={{ hidden: { opacity: 0, scale: 1.03 }, show: { opacity: 1, scale: 1 } }}
                transition={{ duration: 1.1, ease }}
              >
                {bloco.fotos.map((foto) => (
                  <figure key={foto.src}>
                    <div className="grain relative overflow-hidden rounded-lg border border-line">
                      <Image
                        src={foto.src}
                        alt={foto.alt}
                        width={foto.w}
                        height={foto.h}
                        sizes="(min-width: 768px) 46vw, 92vw"
                        className="block h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-2 text-xs text-fg-3">{foto.legenda}</figcaption>
                  </figure>
                ))}
              </Reveal>
            )}
          </div>
        </section>
      ))}

      {/* ---------- Missão ---------- */}
      <section className="relative isolate overflow-hidden border-t border-line">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(45%_70%_at_100%_100%,rgba(209,20,31,0.12),transparent_70%)]"
        />
        <div className="container-x grid gap-10 py-16 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-24">
          <Reveal>
            <p className="eyebrow mb-3">Missão</p>
            <h2 className="display text-4xl md:text-6xl [text-wrap:balance]">{MISSAO.titulo}</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 md:pt-4">
            {MISSAO.paragrafos.map((p) => (
              <p key={p.slice(0, 24)} className="text-base leading-relaxed text-fg-2 md:text-lg">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- Foto da loja + endereço ---------- */}
      <section className="relative isolate overflow-hidden border-t border-line">
        <Reveal
          className="relative h-[52vw] max-h-[560px] min-h-[320px] w-full grain"
          variants={{ hidden: { opacity: 0, scale: 1.04 }, show: { opacity: 1, scale: 1 } }}
          transition={{ duration: 1.4, ease }}
        >
          <Image
            src="/img/novo/institucional--fachada-3m-entardecer.jpg"
            alt="Fachada da The Dark Film ao entardecer, com o selo de aplicador autorizado 3M"
            fill
            sizes="100vw"
            className="duotone object-cover"
          />
          <div aria-hidden className="duotone-tint" />
          <div aria-hidden className="duotone-vignette" />
        </Reveal>
        <div className="container-x pointer-events-none absolute inset-x-0 bottom-0 pb-8 md:pb-12">
          <Reveal delay={0.3} className="pointer-events-auto flex flex-wrap items-end justify-between gap-6 border-l border-red pl-5 md:pl-7">
            <div>
              <p className="eyebrow mb-2">A loja</p>
              <p className="display text-2xl text-fg md:text-4xl">{site.address.street}</p>
              <p className="mt-1 text-sm text-fg-2">
                {site.address.district} — {site.address.city}/{site.address.state}
              </p>
            </div>
            <Link
              href="/contato"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-bg/60 px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-fg backdrop-blur transition-[border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-red hover:text-red-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Como chegar <LongArrowIcon className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
