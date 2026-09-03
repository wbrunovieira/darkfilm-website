import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CardVideo } from "@/components/CardVideo";
import { IconList, Section, Stat, Tiles } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { ArrowIcon } from "@/components/icons";
import {
  BuildingIcon,
  DecorIcon,
  HeatIcon,
  MirrorIcon,
  PrivacyIcon,
  ShatterIcon,
  ShieldIcon,
  SummerIcon,
  UvIcon,
  WindowIcon,
  WinterIcon,
} from "@/components/icons/peliculas";

export const metadata: Metadata = {
  title: "Películas Arquitetônicas",
  description:
    "Película para vidros residenciais, comerciais e industriais: segurança, privacidade, redução de custos de refrigeração, proteção UV e decoração de interiores.",
};

const related = [
  { href: "/produtos/pelicula-comercial", title: "Película comercial", img: "/img/peliculas/pelicula-comercial.jpg" },
  { href: "/produtos/distribuicao-de-peliculas-ferramentas-para-aplicadores-e-chancelas", title: "Distribuição de películas, ferramentas para aplicadores e chancelas", img: "/img/peliculas/distribuicao.jpg" },
];

/** Foto de apoio com moldura, legenda e leve zoom no hover. */
function Photo({ src, alt, caption, w, h, pos = "center" }: { src: string; alt: string; caption: string; w: number; h: number; pos?: string }) {
  return (
    <figure className="group overflow-hidden border border-line bg-bg-2">
      {/* Proporção fixa de propósito: o texto ao lado tem ~250px e as fotos verticais
          do material novo renderizavam a 800px, deixando um vão enorme na coluna da
          direita. 4/3 devolve a altura que as imagens antigas tinham (~330px). */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={src} alt={alt} width={w} height={h} className="photo absolute inset-0 size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" style={{ objectPosition: pos }} />
      </div>
      <figcaption className="border-t border-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-fg-3">{caption}</figcaption>
    </figure>
  );
}

/** Mesma moldura do Photo, com vídeo mudo no lugar da imagem. Os vídeos de
    arquitetura do cliente são todos verticais, e a coluna estreita da Section é
    justamente onde esse formato funciona bem. */
function VideoFigure({ src, poster, caption }: { src: string; poster: string; caption: string }) {
  return (
    <figure className="group overflow-hidden border border-line bg-bg-2">
      <div className="relative aspect-[4/3] overflow-hidden">
        <CardVideo src={src} poster={poster} className="absolute inset-0 size-full object-cover" />
      </div>
      <figcaption className="border-t border-line px-4 py-3 text-xs uppercase tracking-[0.16em] text-fg-3">{caption}</figcaption>
    </figure>
  );
}

// Texto copiado da página "Películas Arquitetônicas" do site original.
export default function LinhaArquitetonicaPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Início", href: "/" }, { label: "Películas" }, { label: "Arquitetônicas" }]}
        title={
          <>
            Solução atrativa
            <br />
            <span className="text-red-2">e eficiente.</span>
          </>
        }
        intro="A utilização de film em vidros residenciais, comerciais e industriais produz solução atrativa e eficiente: segurança, privacidade, economia e decoração."
        /* Sem foto de fundo, de propósito. Todo o material de arquitetura que o
           cliente enviou é vídeo vertical de baixa resolução: numa faixa larga com a
           máscara escura do hero, qualquer quadro vira estática visual. O quadro da
           obra que estava aqui era vidro coberto de adesivos de proteção e não se lia
           como nada. Melhor tipografia limpa do que imagem ruim — volta quando vier
           foto de arquitetura de verdade (ver a issue de pedidos ao cliente).
        */
      />

      {/* Os quatro pilares do texto de abertura + números do corpo, num só bloco de atmosfera. */}
      <section className="pel-atmo border-t border-line">
        <div className="container-x py-16 md:py-24">
          <RevealGroup className="grid gap-x-8 gap-y-6 border-b border-line pb-12 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {[
              { icon: <ShieldIcon />, t: "Segurança" },
              { icon: <PrivacyIcon />, t: "Privacidade" },
              { icon: <HeatIcon />, t: "Economia" },
              { icon: <DecorIcon />, t: "Decoração" },
            ].map((p, i) => (
              <RevealItem key={p.t} className="flex items-center gap-4">
                <span className="pel-icon">{p.icon}</span>
                <div>
                  <p className="font-display text-xs tracking-[0.2em] text-fg-3">0{i + 1}</p>
                  <p className="display text-2xl">{p.t}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="grid gap-10 pt-12 md:grid-cols-3">
            <Reveal><Stat value="79%" label="Da energia solar refletida no verão" icon={<SummerIcon />} /></Reveal>
            <Reveal delay={0.1}><Stat value="99%" label="Dos raios ultravioleta bloqueados" icon={<UvIcon />} /></Reveal>
            <Reveal delay={0.2}><Stat value="17×" label="Mais resistência do vidro à pressão, com films especiais" icon={<ShatterIcon />} /></Reveal>
          </div>
        </div>
      </section>

      <Section
        index="01"
        eyebrow="Segurança e proteção"
        title="O vidro quebra, o film segura."
        aside={<Photo src="/img/peliculas/seguraca.jpg" alt="Vidro quebrado mantido íntegro pela película" caption="Vidro quebrado, estilhaços presos" w={317} h={173} />}
      >
        <p>
          Ocorrendo a quebra do vidro, o film mantém os estilhaços firmemente presos, reduzindo
          ou até mesmo eliminando o risco de ferimentos. Auxilia na segurança e proteção
          industrial, comercial e residencial contra acidentes, tempestades e vandalismo; mesmo
          após ter sido quebrado, o vidro revestido com film mantém sua característica
          principal. Films especiais chegam a aumentar a resistência do vidro à pressão de 3 até
          17 vezes.
        </p>
        <div className="not-prose mt-8 flex flex-wrap gap-2">
          {["Acidentes", "Tempestades", "Vandalismo"].map((t) => (
            <span key={t} className="border border-line-strong px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-[0.16em] text-fg-2">
              {t}
            </span>
          ))}
        </div>
      </Section>

      <Section
        index="02"
        eyebrow="Privacidade"
        title="Ver sem ser visto."
        tone="atmo-cool"
        aside={<Photo src="/img/novo/arquitetonica--vidro-jateado-corredor.jpg" alt="Porta de vidro jateado separando um corredor revestido de pastilha preta" caption="Vidro jateado em corredor" w={478} h={850} pos="center 38%" />}
      >
        <p>
          Alguns films são altamente reflexivos, permitindo a visão de dentro para fora, mas não
          permitindo a visão de fora para dentro. São extremamente adequados para guaritas de
          edifícios, bancos, divisórias de ambientes, áreas de segurança etc. Outros produzem
          total privacidade (jateados), mantendo a claridade do ambiente e impedindo, no entanto,
          a visão nos dois sentidos.
        </p>
        <IconList
          columns={2}
          items={[
            { icon: <MirrorIcon />, title: "Reflexivo", text: "Visão de dentro para fora; de fora para dentro, não. Guaritas, bancos, divisórias, áreas de segurança." },
            { icon: <PrivacyIcon />, title: "Jateado", text: "Total privacidade nos dois sentidos, mantendo a claridade do ambiente." },
          ]}
        />
      </Section>

      <Section
        index="03"
        eyebrow="Economia"
        title="Redução dos custos de refrigeração."
        aside={
          <VideoFigure
            src="/video/arquitetonica-espatula.mp4"
            poster="/video/arquitetonica-espatula.jpg"
            caption="Aplicação em painel de vidro"
          />
        }
        after={
          <RevealGroup className="grid gap-3 md:grid-cols-2" stagger={0.1}>
            <RevealItem className="pel-tile">
              <span className="pel-icon"><SummerIcon /></span>
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">No verão</p>
                <p className="display mt-2 text-5xl md:text-6xl">até 79%</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">da energia solar refletida, evitando o aquecimento do ambiente.</p>
              </div>
            </RevealItem>
            <RevealItem className="pel-tile">
              <span className="pel-icon"><WinterIcon /></span>
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">No inverno</p>
                <p className="display mt-2 text-5xl md:text-6xl">Isolação</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">a troca de calor do interior com o exterior é muito reduzida. Por isso, são largamente utilizados em CPDs.</p>
              </div>
            </RevealItem>
          </RevealGroup>
        }
      >
        <p>
          Ao instalar um film adequado para controle solar, obtém-se significativa redução dos
          altos custos com refrigeração. No verão o film reflete a energia solar em até 79%,
          evitando o aquecimento do ambiente; e no inverno, pela isolação térmica do film, a
          troca de calor do interior do ambiente com o exterior é muito reduzida. Por isso, são
          largamente utilizados em centros de processamento de dados (CPD).
        </p>
        <h3>Redução da descoloração</h3>
        <p>
          Embora invisíveis aos olhos humanos, os raios ultravioleta provocam desde câncer de
          pele até a descoloração e deterioração de carpetes, quadros, cortinas, móveis e de
          muitos materiais sintéticos. O film pode bloquear até 99% destes raios nocivos,
          impedindo praticamente os danos por eles causados.
        </p>
      </Section>

      <Section
        index="04"
        eyebrow="Estética"
        title="Aparência adequada e decoração de interiores."
        tone="atmo"
        aside={<Photo src="/img/novo/arquitetonica--divisoria-faixa-laranja.jpg" alt="Divisórias de vidro de escritório com faixa decorativa laranja aplicada" caption="Divisória de escritório com faixa" w={478} h={850} pos="center 45%" />}
        after={
          <Tiles
            columns={3}
            items={[
              { icon: <WindowIcon />, title: "Mais privacidade", text: "Em espaços divididos por portas e janelas." },
              { icon: <BuildingIcon />, title: "Renovação sem reforma", text: "Renovação do ambiente sem a necessidade de reformas." },
              { icon: <DecorIcon />, title: "Destaque e visibilidade", text: "Portas de varandas e banheiros ganham destaque e visibilidade." },
            ]}
          />
        }
      >
        <p>
          O film produz aparência clara e uniforme e, com sua variada gama de cores e tipos,
          poderá se adequar à sua decoração, criatividade arquitetônica ou a seu design
          comercial. Ele pode ser usado em áreas envidraçadas já existentes ou a construir,
          produzindo boa aparência e, consequentemente, aumentando seu valor comercial.
        </p>
        <p>
          O film permite a decoração de vidros e janelas utilizando o mesmo processo do papel de
          parede. Durável e resistente, permanece novo por muitos anos garantindo a transparência
          e luminosidade das cores.
        </p>
        <p><strong>Confira as vantagens de possuir em seu ambiente este produto de qualidade internacional:</strong></p>
      </Section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">Confira nossos produtos</p>
          <h2 className="display text-3xl md:text-5xl">Películas arquitetônicas</h2>
        </Reveal>
        <RevealGroup className="grid gap-3 sm:grid-cols-2">
          {related.map((s) => (
            <RevealItem key={s.href}>
              <Link href={s.href} className="pel-card group flex h-full">
                <div className="relative w-2/5 shrink-0 overflow-hidden">
                  <Image src={s.img} alt="" fill sizes="30vw" className="photo object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                </div>
                <div className="relative flex flex-1 items-center justify-between gap-3 p-5">
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
