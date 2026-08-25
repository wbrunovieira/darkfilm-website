import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Bullets, Section, Stat } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Características do Film",
  description:
    "O que é film: laminado de poliéster adesivado, aplicável em qualquer vidro. Tipos (reflexivo, fumê, transparente, jateado, decorativo, segurança) e benefícios.",
};

const categorias = [
  { nome: "Reflexivos", desc: "efeito espelho" },
  { nome: "Não reflexivos", desc: "fumê" },
  { nome: "Transparentes", desc: "" },
  { nome: "Privativos", desc: "jateado" },
  { nome: "Decorativos", desc: "decorfilm" },
  { nome: "Segurança", desc: "" },
];

// Texto copiado da página "Características Film" do site original.
export default function CaracteristicasPage() {
  return (
    <>
      <PageHero
        eyebrow="Películas · Características do Film"
        title={
          <>
            O que é <span className="text-red-2">film</span>, afinal?
          </>
        }
        intro={
          <p>
            &ldquo;Film&rdquo; é um laminado de poliéster com variação de cor, metalização e
            espessura. É adesivado, aplicável em qualquer tipo de vidro.
          </p>
        }
        image="/img/peliculas/insulfim2.jpg"
      />

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">Categorias</p>
          <h2 className="display text-3xl md:text-5xl">Dividido nas seguintes categorias:</h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 border-t border-l border-line md:grid-cols-3">
          {categorias.map((c, i) => (
            <RevealItem key={c.nome} className="border-b border-r border-line p-6 md:p-8">
              <p className="font-display text-sm text-fg-3">0{i + 1}</p>
              <p className="display mt-3 text-2xl md:text-3xl">{c.nome}</p>
              {c.desc && <p className="mt-1 text-sm text-fg-2">{c.desc}</p>}
            </RevealItem>
          ))}
        </RevealGroup>
        <RevealGroup className="mt-4 grid grid-cols-3 gap-4">
          {["insulfim1", "insulfim3", "insulfim4"].map((f) => (
            <RevealItem key={f} className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image src={`/img/peliculas/${f}.jpg`} alt="" fill sizes="33vw" className="photo object-cover" />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="container-x grid gap-10 border-t border-line py-16 md:grid-cols-3 md:py-24">
        <Reveal><Stat value="99%" label="Dos raios ultravioleta filtrados" /></Reveal>
        <Reveal delay={0.1}><Stat value="79%" label="Dos raios solares filtrados" /></Reveal>
        <Reveal delay={0.2}><Stat value="30%" label="De redução de ruídos" /></Reveal>
      </section>

      <Section eyebrow="Benefícios" title="Conforto, segurança e economia.">
        <Bullets
          items={[
            "Filtra até 99% os raios ultravioleta, protegendo móveis e utensílios do desgaste causado pela ação solar.",
            "Filtra até 79% dos raios solares, tornando a temperatura interna agradável.",
            "Reduz até 30% dos ruídos, deixando o ambiente mais silencioso.",
            "Proporciona conforto, segurança e privacidade com sofisticação, não permitindo a visão de fora para dentro, evitando inclusive a ação de ladrões.",
            "Valoriza a construção proporcionando um toque de requinte à arquitetura, conferindo uma imagem moderna e futurista.",
            "Transforma vidro incolor em vidro colorido, espelhado, temperado, espião etc., e é imperceptível.",
            "Transforma qualquer vidro em forte laminado, que ao romper não estilhaça, protegendo pessoas e objetos.",
            "Reduz custos: vidro incolor + film tem custo muito inferior ao de um vidro colorido, temperado ou espião, além destes não controlarem a ação dos raios solares.",
            "Economiza energia em ambientes com ar condicionado, porque controla a ação dos raios solares e aumenta o rendimento da refrigeração.",
            "Elimina o uso e manutenção de cortinas.",
          ]}
        />
      </Section>

      <Section eyebrow="Garantia" title="Econômico ou profissional.">
        <p>
          Fabricado nos tipos: <strong>Econômico</strong>, com garantia até 2 anos, e{" "}
          <strong>Profissional</strong>, com garantia de até 5 anos para as Linhas
          Arquitetônica e Automotiva.
        </p>
        <p>
          Desenvolvidos para serem aplicados em áreas envidraçadas, bloqueando o calor e os
          raios ultravioleta, protegendo o ambiente dos danos causados pela ação solar.
        </p>
      </Section>

      <ContactCTA />
    </>
  );
}
