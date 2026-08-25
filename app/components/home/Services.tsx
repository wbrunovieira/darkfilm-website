import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { ArrowIcon } from "../icons";

// Textos copiados do slider e dos cards da home original.
const featured = [
  {
    href: "/linha-automotiva",
    title: "Linha Automotiva",
    text: "Film de linha profissional com proteção anti-risco e encolhimento térmico: aplicação perfeita, sem emendas em vidros boleados.",
    img: "/img/galeria/09.jpg",
  },
  {
    href: "/linha-arquitetonica",
    title: "Linha Arquitetônica",
    text: "Segurança e proteção, privacidade, redução da descoloração, decoração de interiores e redução dos custos de refrigeração.",
    img: "/img/hero/arquitetonica.jpg",
  },
  {
    href: "/som-e-acessorios",
    title: "Som & Acessórios",
    text: "As melhores soluções no mercado de som e acessórios você encontra aqui. Venha nos fazer uma visita.",
    img: "/img/hero/som.jpg",
  },
];

const more = [
  { href: "/produtos/nao-troque-seu-parabrisa-conserte", title: "Não troque seu para-brisa, conserte", img: "/img/servicos/parabrisa.jpg" },
  { href: "/produtos/envelopamento-automotivo", title: "Envelopamento automotivo", img: "/img/servicos/envelopamento.jpg" },
  { href: "/produtos/lavagem-a-seco", title: "Lavagem a seco", img: "/img/servicos/lavagem.jpg" },
  { href: "/produtos/polimento-dos-farois", title: "Polimento dos faróis", img: "/img/servicos/farois.jpg" },
];

export function Services() {
  return (
    <section className="container-x py-24 md:py-32">
      <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-4">O que fazemos</p>
          <h2 className="display text-5xl md:text-7xl">
            Três especialidades,
            <br />
            <span className="text-fg-3">uma oficina.</span>
          </h2>
        </div>
        <p className="max-w-sm text-fg-2">
          Aplicação de película de controle solar e segurança, envelopamento, instalação de som,
          alarmes, acessórios e recuperação de para-brisas.
        </p>
      </Reveal>

      <RevealGroup className="grid gap-4 md:grid-cols-3">
        {featured.map((s, i) => (
          <RevealItem key={s.href} className={i === 0 ? "md:row-span-2" : ""}>
            <Link
              href={s.href}
              className={`group relative block overflow-hidden rounded-lg border border-line bg-bg-2 ${
                i === 0 ? "aspect-[3/4] md:aspect-auto md:h-full" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={s.img}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="photo object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
              <div className="tint-overlay" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <span className="mb-3 block h-0.5 w-8 bg-red transition-all duration-500 group-hover:w-16" />
                <h3 className="display text-3xl md:text-4xl">{s.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-2 md:text-base">{s.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg">
                  Saiba mais <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>

      <RevealGroup className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {more.map((s) => (
          <RevealItem key={s.href}>
            <Link
              href={s.href}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg-2 transition-colors hover:border-line-strong"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.img}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="photo object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-2 to-transparent" />
              </div>
              <div className="flex flex-1 items-end justify-between gap-3 p-4 md:p-5">
                <h3 className="font-display text-xl font-semibold uppercase leading-none md:text-2xl">{s.title}</h3>
                <ArrowIcon className="size-5 shrink-0 text-fg-3 transition-all group-hover:translate-x-1 group-hover:text-red-2" />
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
