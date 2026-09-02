import Image from "next/image";
import Link from "next/link";
import { CardVideo } from "../CardVideo";
import type { ComponentType, SVGProps } from "react";
import { Reveal, RevealGroup, RevealItem } from "../Reveal";
import { ArrowIcon } from "../icons";
import {
  DryWashIcon,
  FilmArchIcon,
  FilmAutoIcon,
  HeadlightIcon,
  SoundIcon,
  WindshieldIcon,
  WrapIcon,
} from "../icons/home";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// Textos copiados do slider e dos cards da home original.
const featured: { href: string; title: string; text: string; img: string; video?: string; icon: Icon }[] = [
  {
    href: "/linha-automotiva",
    title: "Linha Automotiva",
    text: "Film de linha profissional com proteção anti-risco e encolhimento térmico: aplicação perfeita, sem emendas em vidros boleados.",
    // Aplicação da película no vidro traseiro, filmada por dentro do carro.
    img: "/video/automotiva-aplicacao.jpg",
    video: "/video/automotiva-aplicacao.mp4",
    icon: FilmAutoIcon,
  },
  {
    href: "/linha-arquitetonica",
    title: "Linha Arquitetônica",
    text: "Segurança e proteção, privacidade, redução da descoloração, decoração de interiores e redução dos custos de refrigeração.",
    // Não veio nenhuma FOTO de linha arquitetônica no material do cliente, mas
    // vieram 12 vídeos. Em quadro parado a cena não se lia como arquitetura;
    // em movimento, o serviço fica evidente. O poster é o mesmo quadro.
    img: "/video/arquitetonica-aplicacao.jpg",
    video: "/video/arquitetonica-aplicacao.mp4",
    icon: FilmArchIcon,
  },
  {
    href: "/som-e-acessorios",
    title: "Som & Acessórios",
    text: "As melhores soluções no mercado de som e acessórios você encontra aqui. Venha nos fazer uma visita.",
    // Câmera 360 funcionando na central multimídia; o piso xadrez que aparece na
    // tela é o da própria loja.
    img: "/video/som-camera-360.jpg",
    video: "/video/som-camera-360.mp4",
    icon: SoundIcon,
  },
];

const more: { href: string; title: string; img: string; icon: Icon }[] = [
  { href: "/produtos/nao-troque-seu-parabrisa-conserte", title: "Não troque seu para-brisa, conserte", img: "/img/servicos/parabrisa.jpg", icon: WindshieldIcon },
  { href: "/produtos/envelopamento-automotivo", title: "Envelopamento automotivo", img: "/img/novo/aplicacao-carros--mustang-envelopamento-listras.jpg", icon: WrapIcon },
  { href: "/produtos/lavagem-a-seco", title: "Lavagem a seco", img: "/img/servicos/lavagem.jpg", icon: DryWashIcon },
  { href: "/produtos/polimento-dos-farois", title: "Polimento dos faróis", img: "/img/servicos/farois.jpg", icon: HeadlightIcon },
];

export function Services() {
  return (
    <section className="atmo grid-lines overflow-hidden py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div>
            <p className="eyebrow mb-4">O que fazemos</p>
            <h2 className="display text-5xl md:text-7xl">
              Três especialidades,
              <br />
              <span className="text-fg-3">uma oficina.</span>
            </h2>
          </div>
          <p className="max-w-sm border-l border-line-strong pl-5 text-fg-2 md:pb-2">
            Aplicação de película de controle solar e segurança, envelopamento, instalação de som,
            alarmes, acessórios e recuperação de para-brisas.
          </p>
        </Reveal>

        {/* Três grandes: a primeira ocupa duas linhas (peso à esquerda). */}
        <RevealGroup stagger={0.12} className="grid gap-4 md:grid-cols-3">
          {featured.map((s, i) => {
            const Icon = s.icon;
            return (
              <RevealItem key={s.href} className={i === 0 ? "md:row-span-2" : ""}>
                <Link
                  href={s.href}
                  className={`group card-lift sheen relative flex flex-col justify-between overflow-hidden rounded-lg border border-line bg-bg-2 ${
                    i === 0 ? "min-h-[30rem] md:h-full md:min-h-0" : "min-h-[22rem] md:min-h-[24rem]"
                  }`}
                >
                  {s.video ? (
                    <CardVideo
                      src={s.video}
                      poster={s.img}
                      className="photo absolute inset-0 size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={s.img}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="photo object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                    />
                  )}
                  <div className="tint-overlay" />

                  {/* topo: ícone + numeração */}
                  <div className="relative flex items-start justify-between p-5 md:p-6">
                    <span className="svc-icon grid size-11 place-items-center rounded-full border border-white/15 bg-bg/60 text-fg backdrop-blur-sm">
                      <Icon className="size-5" />
                    </span>
                    <span className="num-ghost text-4xl md:text-5xl">0{i + 1}</span>
                  </div>

                  <div className="relative p-6 pt-10 md:p-8 md:pt-12">
                    <span className="mb-3 block h-0.5 w-8 bg-red transition-all duration-500 ease-out-expo group-hover:w-16" />
                    <h3 className={`display ${i === 0 ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}>{s.title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-2 md:text-base">{s.text}</p>
                    <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-fg">
                      Saiba mais
                      <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Quatro serviços complementares: cards baixos, ícone em evidência. */}
        <RevealGroup stagger={0.08} className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {more.map((s) => {
            const Icon = s.icon;
            return (
              <RevealItem key={s.href}>
                <Link
                  href={s.href}
                  className="group card-lift flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg-2"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={s.img}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="photo object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-2 via-bg-2/30 to-transparent" />
                    <span className="svc-icon absolute left-4 top-4 grid size-10 place-items-center rounded-full border border-white/15 bg-bg/60 text-fg backdrop-blur-sm">
                      <Icon className="size-[18px]" />
                    </span>
                  </div>
                  <div className="flex flex-1 items-end justify-between gap-3 p-4 md:p-5">
                    <h3 className="font-display text-xl font-semibold uppercase leading-none md:text-2xl">{s.title}</h3>
                    <ArrowIcon className="size-5 shrink-0 text-fg-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-red-2" />
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
