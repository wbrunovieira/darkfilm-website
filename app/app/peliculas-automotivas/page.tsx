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
  LayersIcon,
  LockIcon,
  NoiseIcon,
  ScratchIcon,
  ShatterIcon,
  ShieldIcon,
  TimerIcon,
  WarrantyIcon,
} from "@/components/icons/peliculas";

export const metadata: Metadata = {
  title: "Linha Automotiva",
  description:
    "Película automotiva profissional com proteção anti-risco e encolhimento térmico. Única em Petrópolis com chancela ABRAWF. Película de proteção e segurança.",
};

// Sem lavagem a seco e polimento de faróis: o cliente não faz mais (03/09/2026).
const related = [
  { href: "/produtos/nao-troque-seu-parabrisa-conserte", title: "Não troque seu para-brisa, conserte", img: "/img/servicos/parabrisa.jpg" },
  { href: "/produtos/envelopamento-automotivo", title: "Envelopamento automotivo", img: "/img/servicos/envelopamento.jpg" },
];

// Texto copiado da página "Linha Automotiva" do site original.
export default function LinhaAutomotivaPage() {
  return (
    <>
      <PageHero
        eyebrow="Películas · Linha Automotiva"
        title={
          <>
            Aplicação perfeita,
            <br />
            <span className="text-red-2">sem emendas.</span>
          </>
        }
        intro="Utilizamos somente film de linha profissional, com proteção antirrisco e técnica avançada de encolhimento térmico, evitando emendas em vidros mais boleados, resultando perfeita aplicação."
        image="/img/novo/aplicacao-carros--peugeot-2008-frente-faixa-solar.jpg"
        imagePosition="center 55%"
      />

      {/* Os três argumentos do texto de abertura, em tiles — o que diferencia a aplicação. */}
      <section className="pel-atmo border-t border-line">
        <div className="container-x py-14 md:py-20">
          <Tiles
            columns={3}
            items={[
              { icon: <LayersIcon />, title: "Film de linha profissional", text: "Utilizamos somente film de linha profissional." },
              { icon: <ScratchIcon />, title: "Proteção antirrisco", text: "Película com proteção antirrisco." },
              { icon: <CurveIcon />, title: "Encolhimento térmico", text: "Técnica avançada que evita emendas em vidros mais boleados: aplicação perfeita." },
            ]}
          />
        </div>
      </section>

      <Section
        index="01"
        eyebrow="Chancela"
        title="Os únicos em Petrópolis com chancela ABRAWF."
        aside={
          <Reveal className="relative overflow-hidden border border-line bg-bg-2 p-6">
            <span aria-hidden className="pel-card__ghost">ABRAWF</span>
            <span className="pel-icon pel-icon--accent">
              <WarrantyIcon />
            </span>
            <p className="display mt-5 text-3xl">Chancela registrada</p>
            <p className="mt-2 text-sm leading-relaxed text-fg-2">
              Associação Brasileira de Representantes e Aplicadores de Window Film, conforme a Resolução 73/98 do CONTRAN.
            </p>
          </Reveal>
        }
        after={
          <RevealGroup className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
            <RevealItem className="group relative overflow-hidden border border-line bg-bg-2">
              <Image
                src="/img/peliculas/imgExemploResolucao.jpg"
                alt="Percentuais de transmissão luminosa permitidos por vidro"
                width={590}
                height={293}
                className="w-full object-cover mix-blend-screen transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <p className="border-t border-line px-5 py-3 text-xs uppercase tracking-[0.16em] text-fg-3">
                Transmissão luminosa permitida por vidro
              </p>
            </RevealItem>
            <RevealItem className="group relative overflow-hidden border border-line bg-bg-2">
              <Image
                src="/img/peliculas/imgMostruarioFilm.jpg"
                alt="Mostruário de tonalidades G5 a G70"
                width={400}
                height={266}
                className="photo w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <p className="border-t border-line px-5 py-3 text-xs uppercase tracking-[0.16em] text-fg-3">
                Mostruário G5 a G70
              </p>
            </RevealItem>
          </RevealGroup>
        }
      >
        <p>
          Em Petrópolis, somos os únicos com chancela registrada na <strong>ABRAWF</strong>{" "}
          (Associação Brasileira de Representantes e Aplicadores de Window Film), de acordo com
          o que estabelece a Resolução 73/98 do CONTRAN.
        </p>
        <h3>Conselho Nacional de Trânsito — Resolução n.º 254, de 26 de outubro de 2007</h3>
        <p>
          Estabelece requisitos para os vidros de segurança e critérios para aplicação de
          inscrições, pictogramas e películas nas áreas envidraçadas dos veículos automotores,
          de acordo com o inciso III, do artigo 111 do Código de Trânsito Brasileiro — CTB.
        </p>
        <p>
          Para maiores informações acesse:{" "}
          <a href="http://www.denatran.gov.br/download/Resolucoes/RESOLUCAO_CONTRAN_254.pdf" target="_blank" rel="noopener noreferrer">
            Resolução CONTRAN 254 (PDF)
          </a>
          .
        </p>
      </Section>

      <TintSimulator />

      <Section
        index="02"
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
            medimos o valor final com equipamento próprio — ver também o{" "}
            <Link href="/simulador" className="text-fg underline underline-offset-4 hover:text-red-2">simulador de tonalidade</Link>.
          </Callout>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
