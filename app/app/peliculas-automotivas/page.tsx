import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Callout, IconList, Section, Stat, Tiles } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { TintSimulator } from "@/components/TintSimulator";
import { LIMITES, REFERENCIA, valorLimite } from "@/lib/legislacao";
import { TONALIDADES, shadeFor } from "@/lib/tonalidades";
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
  title: "Películas Automotivas",
  description:
    "Película automotiva profissional com proteção anti-risco e encolhimento térmico. Única em Petrópolis com chancela ABRAWF. Película de proteção e segurança.",
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
              Associação Brasileira de Representantes e Aplicadores de Window Film — a entidade que
              chancela aplicadores de película no país.
            </p>
          </Reveal>
        }
        after={
          <RevealGroup className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
            {/* Aqui havia um JPG de 2013 com um sedã genérico estampando 75% / 70% / 28% / 28%
                — os limites da resolução anterior, já revogada. Ficou contradizendo o texto
                correto na mesma página, e nenhuma busca por texto pega número dentro de imagem.
                Agora os valores vêm de lib/legislacao e não têm como divergir de novo. */}
            <RevealItem className="relative overflow-hidden border border-line bg-bg-2 p-6">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg-2">
                Transmissão luminosa permitida por vidro
              </p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                {["parabrisa", "dianteiras", "traseiras"].map((id) => {
                  const l = LIMITES.find((v) => v.id === id)!;
                  return (
                    <div key={l.id} className="border-t border-line-strong pt-3">
                      <dt className="text-sm leading-snug text-fg-2">{l.curto}</dt>
                      <dd className="display mt-1 text-4xl">{valorLimite(l)}</dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-fg-3">
                Mínimo do conjunto vidro + película. Os vidros de trás não têm mínimo desde que o
                veículo tenha retrovisores externos dos dois lados. {REFERENCIA}.{" "}
                <Link href="/simulador" className="underline underline-offset-4 hover:text-fg">
                  Ver por vidro no simulador
                </Link>
              </p>
            </RevealItem>
            {/* O mostruário era um JPG de 2013 rotulado "G5 G20 G35 G50 G70": a nomenclatura que
                o cliente mandou trocar por porcentagem, numa escala que parava no 70 enquanto o
                texto ao lado diz que a loja vai até 90%. Imagem não acompanha mudança de conteúdo
                e não aparece em busca por texto — foi assim que o erro sobreviveu. Agora as faixas
                saem de lib/tonalidades, a mesma fonte do simulador. */}
            <RevealItem className="relative overflow-hidden border border-line bg-bg-2">
              <div className="relative aspect-[3/2]">
                <Image
                  src="/img/novo/simulador--rua-cel-veiga.jpg"
                  alt={`Mesma cena vista através das ${TONALIDADES.length} tonalidades do mostruário, da mais escura à quase incolor`}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover object-[center_35%]"
                />
                <div aria-hidden className="absolute inset-0 flex">
                  {TONALIDADES.map((t) => (
                    <div key={t} className="relative flex-1 border-l border-white/10 first:border-l-0">
                      <div className="absolute inset-0 bg-black" style={{ opacity: shadeFor(t) }} />
                      <span className="absolute inset-x-0 bottom-2 text-center font-display text-[11px] font-semibold tabular-nums tracking-[0.1em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                        {t}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="border-t border-line px-5 py-3 text-xs uppercase tracking-[0.16em] text-fg-3">
                Mostruário de tonalidades
              </p>
            </RevealItem>
          </RevealGroup>
        }
      >
        <p>
          Em Petrópolis, somos os únicos com chancela registrada na <strong>ABRAWF</strong>{" "}
          (Associação Brasileira de Representantes e Aplicadores de Window Film), a entidade que
          chancela aplicadores de película no país.
        </p>
        {/* Este bloco citava a Resolução 254/2007 como se fosse a norma vigente e linkava um PDF
            do DENATRAN — órgão extinto, link morto (redireciona para a home do SENATRAN). A 254
            foi revogada; quem vale hoje é a 960/2022 com a redação da 989/2022, a mesma que
            corrigimos no simulador. Fonte conferida no texto oficial em 03/09/2026. */}
        <h3>Conselho Nacional de Trânsito — Resolução n.º 960, de 3 de novembro de 2022</h3>
        <p>
          É a norma em vigor. Estabelece os requisitos para os vidros de segurança e os critérios
          para aplicação de inscrições, pictogramas e películas nas áreas envidraçadas dos veículos
          automotores, conforme o inciso III do artigo 111 do Código de Trânsito Brasileiro. Foi
          alterada pela Resolução n.º 989, de 15 de dezembro de 2022, que é o texto que vale para o
          mínimo de transmissão luminosa de cada vidro. Ela substituiu a Resolução 254/2007, que
          ainda circula em muito material antigo sobre película.
        </p>
        <p>
          O texto oficial de todas as resoluções está no{" "}
          <a
            href="https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-contran/resolucoes"
            target="_blank"
            rel="noopener noreferrer"
          >
            portal do CONTRAN
          </a>
          . Os mínimos por vidro estão logo acima, e você pode conferir vidro a vidro no{" "}
          <Link href="/simulador">simulador</Link>.
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
