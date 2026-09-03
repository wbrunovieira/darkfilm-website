import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Callout, IconList, Section, Stat, Tiles } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { TintSimulator } from "@/components/TintSimulator";
import { ArrowIcon } from "@/components/icons";
import {
  AlertIcon,
  CurveIcon,
  HeatIcon,
  LayersIcon,
  LockIcon,
  NoiseIcon,
  ShatterIcon,
  ShieldIcon,
  TimerIcon,
} from "@/components/icons/peliculas";

export const metadata: Metadata = {
  title: "Películas Automotivas",
  description:
    "Películas automotivas profissionais em Petrópolis: 3M, Garware, Llumar, Ultra IR Pro e Window Blue. Conforto térmico, proteção UV e aplicação com acabamento.",
};

// Sem lavagem a seco e polimento de faróis: o cliente não faz mais (03/09/2026).
const related = [
  { href: "/produtos/nao-troque-seu-parabrisa-conserte", title: "Não troque seu para-brisa, conserte", img: "/img/servicos-v2/parabrisa.jpg" },
  { href: "/produtos/envelopamento-automotivo", title: "Envelopamento automotivo", img: "/img/servicos/envelopamento.jpg" },
];

// Texto copiado da página "Películas Automotivas" do site original.
export default function LinhaAutomotivaPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Início", href: "/" }, { label: "Películas" }, { label: "Automotivas" }]}
        title={
          <>
            Aplicação perfeita,
            <br />
            <span className="text-red-2">do material ao acabamento.</span>
          </>
        }
        intro="Trabalhamos com películas profissionais e de alta performance, com tecnologias que proporcionam maior conforto térmico, proteção UV, privacidade e excelente visibilidade. Tudo aliado a uma aplicação profissional, com cuidado no acabamento e mínima contaminação."
        image="/img/novo/aplicacao-carros--peugeot-2008-frente-faixa-solar.jpg"
        imagePosition="center 55%"
      />

      {/* Os três argumentos do texto de abertura, em tiles. Os nomes das marcas são os que o
          cliente listou em 02/09/2026 — a loja é multimarca, e foi por isso que ele também
          mandou tirar a exclusividade 3M do simulador. */}
      <section className="pel-atmo border-t border-line">
        <div className="container-x py-14 md:py-20">
          <Tiles
            columns={3}
            items={[
              {
                icon: <LayersIcon />,
                title: "Películas profissionais",
                text: "Marcas reconhecidas — 3M, Garware, Llumar, Ultra IR Pro e Window Blue — de linhas tradicionais a películas de alta performance.",
              },
              {
                icon: <HeatIcon />,
                title: "Tecnologia e conforto térmico",
                text: "Opções com nanotecnologia e tecnologias avançadas para maior redução de calor e proteção UV.",
              },
              {
                icon: <CurveIcon />,
                title: "Aplicação e acabamento",
                text: "Instalação profissional, com técnica, cuidado nos detalhes e mínima contaminação.",
              },
            ]}
          />
        </div>
      </section>

      {/* Aqui ficava a seção da chancela ABRAWF, com o texto das resoluções, a tabela de
          limites por vidro e o mostruário de tonalidades. Saiu a pedido do cliente em
          02/09/2026: legislação passa a ser tratada só na página específica, e desta página
          os três quadros vão direto ao simulador, sem repetir informação.

          A chancela ABRAWF é diferencial real — a loja é a única de Petrópolis com ela — e
          está registrada como pergunta em aberto no painel de revisão: confirmar com ele se
          era a chancela que incomodava ou só o texto legal antigo que a acompanhava. */}

      <TintSimulator />

      <Section
        index="01"
        eyebrow="Proteção e segurança"
        title="Película automotiva de proteção e segurança."
        tone="atmo-cool"
        aside={
          /* pelSeg4 já é uma foto "sem / com": cada metade vira um painel do comparativo. */
          <figure className="pel-compare">
            <div className="pel-compare__half pel-compare__half--left">
              <Image src="/img/peliculas/pelSeg4.jpg" alt="" width={250} height={372} sizes="(min-width: 768px) 20vw, 45vw" />
              <figcaption className="pel-compare__tag pel-compare__tag--bad">Sem película</figcaption>
            </div>
            <div className="pel-compare__half pel-compare__half--right">
              <Image src="/img/peliculas/pelSeg4.jpg" alt="" width={250} height={372} sizes="(min-width: 768px) 20vw, 45vw" />
              <figcaption className="pel-compare__tag">Com película</figcaption>
            </div>
          </figure>
        }
        after={
          <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
            <Reveal className="relative flex flex-col justify-end overflow-hidden border border-line bg-bg-2 p-6 md:p-8">
              <span aria-hidden className="pel-num absolute -right-2 -top-4 text-[8rem] md:text-[11rem]">5s</span>
              <Stat value="< 5 s" label="Em menos de cinco segundos, um ladrão pode quebrar a janela do seu carro e roubar os objetos de valor." icon={<TimerIcon />} size="lg" />
            </Reveal>
            <Reveal delay={0.1} className="grain relative min-h-64 overflow-hidden border border-line">
              <Image src="/img/peliculas/pelSeg2.jpg" alt="Impacto em vidro com película de segurança: os fragmentos ficam presos à película" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover saturate-[0.35] contrast-110" />
              <div className="tint-overlay" />
              <p className="absolute bottom-5 left-5 right-5 font-display text-lg font-semibold uppercase leading-tight text-fg md:text-2xl">
                A janela pode quebrar. Os fragmentos ficam na película.
              </p>
            </Reveal>
          </div>
        }
      >
        <p>
          Acidentes de trânsito acontecem todos os dias, mesmo com os motoristas mais
          responsáveis. Em um piscar de olhos, vidas podem ser transformadas. Em uma colisão de
          impacto lateral:
        </p>
        <IconList
          items={[
            { icon: <ShatterIcon />, text: "Vidros laterais sem proteção podem estilhaçar facilmente, projetando fragmentos para dentro do carro." },
            { icon: <AlertIcon />, text: "Esses fragmentos podem causar lacerações graves e lesões oculares." },
            { icon: <ShieldIcon />, text: "A abertura da janela estilhaçada aumenta a probabilidade de os passageiros serem jogados para fora do carro — a causa principal de morte em acidentes de trânsito." },
          ]}
        />
        <p>
          As Películas de Proteção e Segurança fornecem uma forte barreira de proteção entre você
          e o vidro. Na ocorrência de um acidente, a janela ainda pode vir a quebrar, porém os
          fragmentos do vidro aderem à película. Os ocupantes do carro estão protegidos dos
          perigosos cacos de vidro soltos pelo ar e destroços lançados em um acidente.
        </p>

        <h3>Proteja seus objetos de valor</h3>
        <p>
          Em menos de cinco segundos, um ladrão pode quebrar a janela de seu carro e roubar-lhe
          os objetos de valor. Isto poderá ser ainda mais perigoso caso você esteja no veículo
          durante o ataque. A película de proteção e de segurança é a melhor defesa contra um
          ataque &ldquo;smash and grab&rdquo;.
        </p>
        <IconList
          items={[
            { icon: <LockIcon />, text: "Ao sustentar o vidro quebrado no lugar, a película retarda o acesso ao interior do veículo." },
            { icon: <NoiseIcon />, text: "O aumento do tempo para a invasão e o barulho adicional chamam atenção para o ladrão." },
            { icon: <TimerIcon />, text: "Caso você esteja no veículo durante o ataque, terá mais tempo para escapar." },
          ]}
        />
        <p>
          <strong>Não seja uma vítima!</strong> Proteja sua família, a si mesmo e seus objetos de
          valor.
        </p>
      </Section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Confira nossos produtos</p>
            <h2 className="display text-3xl md:text-5xl">Mais para o seu carro</h2>
          </div>
          <Link href="/som-e-acessorios" className="group inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg-2 transition-colors hover:text-red-2">
            Som e acessórios
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {related.map((s) => (
            <RevealItem key={s.href}>
              <Link href={s.href} className="pel-card group flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={s.img} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="photo object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-2 to-transparent" />
                </div>
                <div className="relative flex flex-1 items-end justify-between gap-3 p-4 md:p-5">
                  <h3 className="font-display text-xl font-semibold uppercase leading-none md:text-2xl">{s.title}</h3>
                  <ArrowIcon className="size-5 shrink-0 text-fg-3 transition-all group-hover:translate-x-1 group-hover:text-red-2" />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-8">
          <Callout icon={<AlertIcon />}>
            Consulte a legislação vigente para a transparência mínima de cada vidro. Na loja
            medimos o valor final com equipamento próprio — veja também{" "}
            <Link href="/simulador" className="text-fg underline underline-offset-4 hover:text-red-2">o que a lei permite em cada vidro</Link>{" "}
            e as{" "}
            <Link href="/caracteristicas-do-film" className="text-fg underline underline-offset-4 hover:text-red-2">características do film</Link>.
          </Callout>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
