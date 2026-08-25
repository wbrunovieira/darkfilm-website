import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Bullets, Section } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Linha Automotiva",
  description:
    "Película automotiva profissional com proteção anti-risco e encolhimento térmico. Única em Petrópolis com chancela ABRAWF. Película de proteção e segurança.",
};

const related = [
  { href: "/produtos/nao-troque-seu-parabrisa-conserte", title: "Não troque seu para-brisa, conserte", img: "/img/servicos/parabrisa.jpg" },
  { href: "/produtos/polimento-dos-farois", title: "Polimento dos faróis", img: "/img/servicos/farois.jpg" },
  { href: "/produtos/envelopamento-automotivo", title: "Envelopamento automotivo", img: "/img/servicos/envelopamento.jpg" },
  { href: "/produtos/lavagem-a-seco", title: "Lavagem a seco", img: "/img/servicos/lavagem.jpg" },
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
        image="/img/galeria/08.jpg"
        imagePosition="center 60%"
      />

      <Section
        eyebrow="Chancela"
        title={
          <>
            Os únicos em Petrópolis com chancela ABRAWF.
          </>
        }
        aside={
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <Image src="/img/peliculas/imgExemploResolucao.jpg" alt="Percentuais de transmissão luminosa permitidos por vidro" width={590} height={293} className="rounded-md" />
            <Image src="/img/peliculas/imgMostruarioFilm.jpg" alt="Mostruário de tonalidades G5 a G70" width={400} height={266} className="rounded-md" />
          </div>
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

      <Section
        eyebrow="Proteção e segurança"
        title="Película automotiva de proteção e segurança."
        aside={
          <div className="grid grid-cols-2 gap-4">
            <Image src="/img/peliculas/pelSeg4.jpg" alt="Vidro com e sem película de segurança" width={250} height={372} className="rounded-md" />
            <Image src="/img/peliculas/pelSeg2.jpg" alt="Impacto em vidro com película de segurança" width={1000} height={1000} className="rounded-md object-cover" />
          </div>
        }
      >
        <p>
          Acidentes de trânsito acontecem todos os dias, mesmo com os motoristas mais
          responsáveis. Em um piscar de olhos, vidas podem ser transformadas. Em uma colisão de
          impacto lateral:
        </p>
        <Bullets
          items={[
            "Vidros laterais sem proteção podem estilhaçar facilmente, projetando fragmentos para dentro do carro.",
            "Esses fragmentos podem causar lacerações graves e lesões oculares.",
            "A abertura da janela estilhaçada aumenta a probabilidade de os passageiros serem jogados para fora do carro — a causa principal de morte em acidentes de trânsito.",
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
        <Bullets
          items={[
            "Ao sustentar o vidro quebrado no lugar, a película retarda o acesso ao interior do veículo.",
            "O aumento do tempo para a invasão e o barulho adicional chamam atenção para o ladrão.",
            "Caso você esteja no veículo durante o ataque, terá mais tempo para escapar.",
          ]}
        />
        <p>
          <strong>Não seja uma vítima!</strong> Proteja sua família, a si mesmo e seus objetos de
          valor.
        </p>
      </Section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">Confira nossos produtos</p>
          <h2 className="display text-3xl md:text-5xl">Mais para o seu carro</h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {related.map((s) => (
            <RevealItem key={s.href}>
              <Link href={s.href} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg-2 transition-colors hover:border-line-strong">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={s.img} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="photo object-cover transition-transform duration-700 group-hover:scale-105" />
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

      <ContactCTA />
    </>
  );
}
