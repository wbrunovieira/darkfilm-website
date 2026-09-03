import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { GoogleBadge } from "@/components/GoogleBadge";
import { ContactCTA } from "@/components/ContactCTA";
import { decadasEmAtividade, site, yearsInBusiness } from "@/lib/site";
import {
  AlarmIcon,
  FilmIcon,
  LongArrowIcon,
  SoundIcon,
  ToolIcon,
  WindshieldIcon,
  WrapIcon,
} from "@/components/icons/empresa";

export const metadata: Metadata = {
  title: "A Empresa",
  description:
    "Fundada em 1992 em Petrópolis/RJ, a The Dark Film é a mais experiente e reconhecida em película, envelopamento, som, alarmes e recuperação de para-brisas da região.",
};

const ease = [0.16, 1, 0.3, 1] as const;

// Serviços conforme a página "A Empresa" do site original.
const services = [
  { icon: FilmIcon, label: "Película de controle solar e segurança" },
  { icon: WrapIcon, label: "Envelopamento" },
  { icon: SoundIcon, label: "Instalação de som" },
  { icon: AlarmIcon, label: "Alarmes" },
  { icon: ToolIcon, label: "Acessórios" },
  { icon: WindshieldIcon, label: "Recuperação de para-brisas" },
];

// Marcos reais, tirados do conteúdo do site (A Empresa, Películas Automotivas, Home, 3M).
// Só 1992 e "hoje" têm data confirmada; os demais são apresentados sem ano.
const timeline: { when: string; title: string; text: string; hot?: boolean }[] = [
  {
    when: String(site.founded),
    title: "Fundação em Petrópolis",
    text: "A The Dark Film começa a prestar serviços de alto nível em Petrópolis-RJ, tornando-se a mais experiente e reconhecida no mercado da região.",
    hot: true,
  },
  {
    when: "Marco",
    title: "Chancela ABRAWF",
    text: "Em Petrópolis, a única com chancela registrada na Associação Brasileira de Representantes e Aplicadores de Window Film, conforme a Resolução 73/98 do CONTRAN.",
  },
  {
    when: "Marco",
    title: "Aplicadora credenciada 3M",
    text: "Credenciamento para aplicar as Películas para Vidros da 3M, referência em rejeição de calor e proteção contra raios solares.",
  },
  {
    when: "Marco",
    title: "Película de segurança e medição de luz",
    text: "A The Dark Film inova mais uma vez e lança a película de segurança, e passa a usar equipamento próprio para medir a transmissão luminosa do filme.",
  },
  {
    when: "Hoje",
    title: `${yearsInBusiness()} anos de mercado`,
    text: `A mesma missão de sempre: qualidade e rapidez, buscando a satisfação total do cliente. ${site.google.rating.toLocaleString("pt-BR")} de 5 no Google, com ${site.google.reviews} avaliações.`,
    hot: true,
  },
];

export default function AEmpresaPage() {
  const years = yearsInBusiness();

  return (
    <>
      <PageHero
        eyebrow="A Empresa"
        title={
          <>
            A mais experiente
            <br />
            e reconhecida <span className="text-red-2">da região.</span>
          </>
        }
        intro="Fundada em 1992, em Petrópolis-RJ, a The Dark Film vem prestando serviços de alto nível para seus clientes, tornando-se a mais experiente e reconhecida no mercado."
        image="/img/novo/institucional--fachada-3m-entardecer.jpg"
        imagePosition="center 38%"
      />

      {/* ---------- Números ---------- */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_0%_50%,rgba(209,20,31,0.1),transparent_70%)]"
        />
        <div className="container-x py-16 md:py-24">
          <RevealGroup stagger={0.12} className="grid gap-y-12 md:grid-cols-12 md:gap-x-8">
            <RevealItem className="md:col-span-5">
              <p className="eyebrow mb-4">Desde</p>
              <p className="num-xl text-fg">
                <CountUp value={String(site.founded)} duration={2} />
              </p>
              <p className="mt-4 max-w-xs text-fg-2">
                Ano de fundação, em Petrópolis/RJ.
              </p>
            </RevealItem>

            <RevealItem className="border-line md:col-span-3 md:border-l md:pl-8">
              <p className="eyebrow mb-4">Mercado</p>
              <p className="num-xl text-fg">
                <CountUp value={String(years)} duration={1.8} delay={0.2} />
              </p>
              <p className="mt-4 text-fg-2">anos de mercado em Petrópolis e região.</p>
            </RevealItem>

            <RevealItem className="border-line md:col-span-4 md:border-l md:pl-8">
              <p className="eyebrow mb-4">Credencial</p>
              <p className="num-xl text-fg">3M</p>
              <p className="mt-4 text-fg-2">aplicadora credenciada das Películas para Vidros da 3M.</p>
            </RevealItem>
          </RevealGroup>

          <Reveal delay={0.2} className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
            <GoogleBadge variant="card" />
            <p className="max-w-sm text-sm text-fg-3">
              Nota e contagem da ficha da empresa no Google, atualizadas em{" "}
              {new Date(site.google.updatedAt).toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Linha do tempo ---------- */}
      <section className="relative isolate overflow-hidden border-t border-line">
        <div className="container-x grid gap-12 py-16 md:grid-cols-[1fr_1.4fr] md:gap-16 md:py-28">
          <div className="relative md:sticky md:top-32 md:self-start">
            <Reveal>
              <p className="eyebrow mb-3">História</p>
              <h2 className="display text-4xl md:text-6xl">
                De 1992
                <br />
                até <span className="text-red-2">hoje.</span>
              </h2>
              <p className="mt-6 max-w-sm text-fg-2">
                Mais de {decadasEmAtividade()} prestando serviços de alto nível em Petrópolis: película,
                envelopamento, som, alarmes, acessórios e recuperação de para-brisas.
              </p>
              <LongArrowIcon className="mt-8 hidden size-8 text-fg-3 md:block" />
            </Reveal>
            <p
              aria-hidden
              className="num-ghost pointer-events-none absolute -left-4 -bottom-24 -z-10 hidden md:block"
            >
              {site.founded}
            </p>
          </div>

          <div className="tl pl-10 md:pl-12">
            <Reveal
              aria-hidden
              className="tl-rail"
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
              transition={{ duration: 1.6, ease }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            />
            <RevealGroup stagger={0.14} className="grid gap-12 md:gap-16">
              {timeline.map((t) => (
                <RevealItem key={t.title} className="tl-item relative">
                  <span aria-hidden className="tl-node -left-10 md:-left-12" data-hot={t.hot ? "true" : "false"} />
                  <p className={`eyebrow mb-3 ${t.hot ? "" : "text-fg-3"}`}>{t.when}</p>
                  <h3 className="display text-2xl text-fg md:text-4xl">{t.title}</h3>
                  <p className="mt-3 max-w-lg text-fg-2">{t.text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ---------- Missão + serviços ---------- */}
      <section className="relative isolate overflow-hidden border-t border-line">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(45%_70%_at_100%_100%,rgba(209,20,31,0.12),transparent_70%)]"
        />
        <div className="container-x grid gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-28">
          <Reveal>
            <p className="eyebrow mb-3">Missão</p>
            <h2 className="display text-4xl md:text-6xl [text-wrap:balance]">
              Qualidade e rapidez, buscando sempre a satisfação total do cliente.
            </h2>
          </Reveal>
          <div>
            <Reveal delay={0.1} className="prose-dark">
              <p>
                Nossa missão é executar serviços com qualidade e rapidez, buscando sempre a
                satisfação total do cliente.
              </p>
              <p>Dentre os serviços oferecidos podemos citar:</p>
            </Reveal>
            <RevealGroup stagger={0.06} className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {services.map(({ icon: Icon, label }) => (
                <RevealItem
                  key={label}
                  className="group flex items-center gap-4 bg-bg p-5 transition-colors duration-300 hover:bg-bg-2"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-fg-2 transition-[color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:border-red group-hover:text-red-2">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm leading-snug text-fg-2 transition-colors group-hover:text-fg md:text-base">
                    {label}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ---------- Clientes ---------- */}
      <section className="border-t border-line">
        <div className="container-x py-16 md:py-28">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">Clientes</p>
              <h2 className="display max-w-2xl text-4xl md:text-6xl [text-wrap:balance]">
                Nossa qualidade é atestada pelo serviço prestado aos clientes.
              </h2>
            </div>
            <p className="max-w-xs text-sm text-fg-3">
              Entre eles, empresas e instituições de Petrópolis e da região.
            </p>
          </Reveal>
          <RevealGroup stagger={0.1} className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
            {site.clients.map((c, i) => {
              const [name, sub] = c.split(" — ");
              return (
                <RevealItem
                  key={c}
                  className={`client-cell flex min-h-52 flex-col justify-between border-b border-line p-6 text-fg-2 md:min-h-72 md:p-10 ${
                    i % 2 === 0 ? "sm:border-r" : ""
                  }`}
                >
                  <span className="font-display text-sm tabular-nums tracking-[0.2em] text-fg-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="display block text-4xl md:text-6xl">{name}</span>
                    {sub && (
                      <span className="mt-3 block text-sm uppercase tracking-[0.18em] text-fg-3">
                        {sub}
                      </span>
                    )}
                  </span>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ---------- Foto da loja ---------- */}
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
