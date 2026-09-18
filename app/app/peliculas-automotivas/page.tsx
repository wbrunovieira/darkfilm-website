import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Callout, IconList, Section, Stat, Tiles } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { TintSimulator } from "@/components/TintSimulator";
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

// Aqui existia `related`, com os dois produtos que a seção do fim oferecia: conserto de
// para-brisa e envelopamento. Saiu junto com a seção, a pedido do cliente em 12/09/2026. Os dois
// continuam acessíveis pelo menu e pelo catálogo, mas deixaram de ser oferecidos a quem está
// lendo sobre película — é o efeito colateral do pedido, e está registrado na issue.

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

      {/* O aviso de legislação morava no fim da página, dentro da seção "Mais para o seu carro".
          Ele mandou tirar a seção em 12/09/2026; o aviso veio para cá em vez de sumir junto.
          Aqui é o lugar certo dele: fica encostado no simulador, que é justamente sobre o que a
          lei permite em cada vidro, e é a parte que o cliente elogiou. Os dois links continuam
          sendo o caminho desta página para /simulador e /caracteristicas-do-film. */}
      <div className="container-x pb-16 md:pb-20">
        <Callout icon={<AlertIcon />}>
          Consulte a legislação vigente para a transparência mínima de cada vidro. Na loja
          medimos o valor final com equipamento próprio — veja também{" "}
          <Link href="/simulador" className="text-fg underline underline-offset-4 hover:text-red-2">o que a lei permite em cada vidro</Link>{" "}
          e as{" "}
          <Link href="/caracteristicas-do-film" className="text-fg underline underline-offset-4 hover:text-red-2">características do film</Link>.
        </Callout>
      </div>

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

      <ContactCTA />
    </>
  );
}
