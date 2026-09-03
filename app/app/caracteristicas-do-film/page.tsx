import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Section, Stat } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { ProximoPasso } from "@/components/ProximoPasso";
import {
  BuildingIcon,
  ColorIcon,
  CostIcon,
  CurtainIcon,
  EnergyIcon,
  HeatIcon,
  LayersIcon,
  NoiseIcon,
  PrivacyIcon,
  ShatterIcon,
  UvIcon,
  WarrantyIcon,
} from "@/components/icons/peliculas";

export const metadata: Metadata = {
  title: "Características do Film",
  description:
    "O que é film: laminado de poliéster adesivado, aplicável em qualquer vidro. Tipos (reflexivo, fumê, transparente, jateado, decorativo, segurança) e benefícios.",
};

const categorias = [
  { nome: "Reflexivos", desc: "efeito espelho", swatch: "reflexivo" },
  { nome: "Não reflexivos", desc: "fumê", swatch: "fume" },
  { nome: "Transparentes", desc: "", swatch: "transparente" },
  { nome: "Privativos", desc: "jateado", swatch: "jateado" },
  { nome: "Decorativos", desc: "decorfilm", swatch: "decorativo" },
  { nome: "Segurança", desc: "", swatch: "seguranca" },
];

// Os 10 benefícios da página original, cada um com seu ícone.
const beneficios = [
  { icon: <UvIcon />, big: "99%", t: "Filtra até 99% os raios ultravioleta, protegendo móveis e utensílios do desgaste causado pela ação solar." },
  { icon: <HeatIcon />, big: "79%", t: "Filtra até 79% dos raios solares, tornando a temperatura interna agradável." },
  { icon: <NoiseIcon />, big: "30%", t: "Reduz até 30% dos ruídos, deixando o ambiente mais silencioso." },
  { icon: <PrivacyIcon />, t: "Proporciona conforto, segurança e privacidade com sofisticação, não permitindo a visão de fora para dentro, evitando inclusive a ação de ladrões." },
  { icon: <BuildingIcon />, t: "Valoriza a construção proporcionando um toque de requinte à arquitetura, conferindo uma imagem moderna e futurista." },
  { icon: <ColorIcon />, t: "Transforma vidro incolor em vidro colorido, espelhado, temperado, espião etc., e é imperceptível." },
  { icon: <ShatterIcon />, t: "Transforma qualquer vidro em forte laminado, que ao romper não estilhaça, protegendo pessoas e objetos." },
  { icon: <CostIcon />, t: "Reduz custos: vidro incolor + film tem custo muito inferior ao de um vidro colorido, temperado ou espião, além destes não controlarem a ação dos raios solares." },
  { icon: <EnergyIcon />, t: "Economiza energia em ambientes com ar condicionado, porque controla a ação dos raios solares e aumenta o rendimento da refrigeração." },
  { icon: <CurtainIcon />, t: "Elimina o uso e manutenção de cortinas." },
];

// Texto copiado da página "Características Film" do site original.
export default function CaracteristicasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Início", href: "/" }, { label: "Películas" }, { label: "Características do Film" }]}
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
        /* Quadro de vídeo do cliente: a mão com a espátula assentando o filme no
           para-brisa, vista através do próprio vidro. Substitui uma foto de 450x300
           que era esticada como banner. O quadro é vertical (720x1280) e o hero é
           faixa larga, então o enquadramento pega a altura da mão. */
        image="/img/novo/caracteristicas--espatula-parabrisa.jpg"
        imagePosition="center 45%"
      />

      {/* Anatomia do film, em três palavras do próprio texto: cor, metalização, espessura. */}
      <section className="pel-atmo border-t border-line">
        <div className="container-x grid gap-10 py-14 md:grid-cols-[auto_1fr] md:items-center md:gap-16 md:py-20">
          <Reveal className="flex items-center gap-5">
            <span className="pel-icon pel-icon--accent"><LayersIcon /></span>
            <p className="display text-3xl md:text-4xl">Laminado<br />de poliéster</p>
          </Reveal>
          <RevealGroup className="grid grid-cols-3 divide-x divide-line border-y border-line" stagger={0.08}>
            {["Cor", "Metalização", "Espessura"].map((t, i) => (
              <RevealItem key={t} className="px-4 py-5 md:px-6">
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">Variação 0{i + 1}</p>
                <p className="mt-2 font-display text-lg font-semibold uppercase leading-none md:text-2xl">{t}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-10 md:mb-14">
          <p className="eyebrow mb-3">Categorias</p>
          <h2 className="display max-w-3xl text-3xl md:text-5xl">Dividido nas seguintes categorias:</h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-3 md:grid-cols-3" stagger={0.07}>
          {categorias.map((c, i) => (
            <RevealItem key={c.nome} className="pel-tile !p-0">
              <div className={`pel-swatch pel-swatch--${c.swatch}`}>
                <span className="pel-swatch__label">{c.desc || c.nome}</span>
              </div>
              <div className="px-5 pb-5 md:px-6 md:pb-6">
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">0{i + 1}</p>
                <p className="display mt-1.5 text-2xl md:text-3xl">{c.nome}</p>
                {c.desc && <p className="mt-1 text-sm text-fg-2">{c.desc}</p>}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        <RevealGroup className="mt-3 grid grid-cols-3 gap-3">
          {["insulfim1", "insulfim3", "insulfim4"].map((f) => (
            <RevealItem key={f} className="grain relative aspect-[4/3] overflow-hidden border border-line">
              <Image src={`/img/peliculas/${f}.jpg`} alt="" fill sizes="33vw" className="photo object-cover" />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="pel-atmo pel-atmo--cool border-t border-line">
        <div className="container-x grid gap-10 py-16 md:grid-cols-3 md:py-24">
          <Reveal><Stat value="99%" label="Dos raios ultravioleta filtrados" icon={<UvIcon />} /></Reveal>
          <Reveal delay={0.1}><Stat value="79%" label="Dos raios solares filtrados" icon={<HeatIcon />} /></Reveal>
          <Reveal delay={0.2}><Stat value="30%" label="De redução de ruídos" icon={<NoiseIcon />} /></Reveal>
        </div>
      </section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-10 md:mb-14">
          <p className="eyebrow mb-3">Benefícios</p>
          <h2 className="display text-3xl md:text-5xl">Conforto, segurança e economia.</h2>
        </Reveal>
        <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {beneficios.map((b, i) => (
            <RevealItem key={i} className={`pel-tile ${i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="pel-icon">{b.icon}</span>
                <span className="font-display text-xs tracking-[0.2em] text-fg-3">{String(i + 1).padStart(2, "0")}</span>
              </div>
              {b.big && <p className="display text-5xl text-fg md:text-6xl">{b.big}</p>}
              <p className="text-sm leading-relaxed text-fg-2">{b.t}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <Section
        eyebrow="Garantia"
        title="Econômico ou profissional."
        tone="atmo"
        after={
          <RevealGroup className="grid gap-3 sm:grid-cols-2" stagger={0.12}>
            <RevealItem className="pel-tile">
              <span className="pel-icon"><WarrantyIcon /></span>
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">Econômico</p>
                <p className="display mt-2 text-6xl md:text-7xl">2 <span className="text-3xl md:text-4xl">anos</span></p>
                <p className="mt-3 text-sm text-fg-2">garantia de até 2 anos</p>
              </div>
            </RevealItem>
            <RevealItem className="pel-tile">
              <span className="pel-icon pel-icon--accent"><WarrantyIcon /></span>
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-red-2">Profissional</p>
                <p className="display mt-2 text-6xl md:text-7xl">5 <span className="text-3xl md:text-4xl">anos</span></p>
                <p className="mt-3 text-sm text-fg-2">garantia de até 5 anos, Linhas Arquitetônica e Automotiva</p>
              </div>
            </RevealItem>
          </RevealGroup>
        }
      >
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

      <ProximoPasso
        titulo="Onde aplicar"
        itens={[
          { href: "/peliculas-automotivas", label: "Películas Automotivas", texto: "Controle solar e segurança para o seu carro." },
          { href: "/peliculas-arquitetonicas", label: "Películas Arquitetônicas", texto: "Vidros de casa, escritório e fachada." },
          { href: "/3m", label: "Credenciada 3M", texto: "Por que a credencial importa na hora de escolher." },
        ]}
      />

      <ContactCTA />
    </>
  );
}
