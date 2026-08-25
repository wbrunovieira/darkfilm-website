import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Bullets, Section, Stat } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Linha Arquitetônica",
  description:
    "Película para vidros residenciais, comerciais e industriais: segurança, privacidade, redução de custos de refrigeração, proteção UV e decoração de interiores.",
};

const related = [
  { href: "/produtos/pelicula-comercial", title: "Película comercial", img: "/img/peliculas/pelicula-comercial.jpg" },
  { href: "/produtos/distribuicao-de-peliculas-ferramentas-para-aplicadores-e-chancelas", title: "Distribuição de películas, ferramentas para aplicadores e chancelas", img: "/img/peliculas/distribuicao.jpg" },
];

// Texto copiado da página "Linha Arquitetônica" do site original.
export default function LinhaArquitetonicaPage() {
  return (
    <>
      <PageHero
        eyebrow="Películas · Linha Arquitetônica"
        title={
          <>
            Solução atrativa
            <br />
            <span className="text-red-2">e eficiente.</span>
          </>
        }
        intro="A utilização de film em vidros residenciais, comerciais e industriais produz solução atrativa e eficiente: segurança, privacidade, economia e decoração."
        image="/img/hero/arquitetonica.jpg"
      />

      <section className="container-x grid gap-10 border-t border-line py-16 md:grid-cols-3 md:py-24">
        <Reveal><Stat value="79%" label="Da energia solar refletida no verão" /></Reveal>
        <Reveal delay={0.1}><Stat value="99%" label="Dos raios ultravioleta bloqueados" /></Reveal>
        <Reveal delay={0.2}><Stat value="17×" label="Mais resistência do vidro à pressão, com films especiais" /></Reveal>
      </section>

      <Section
        eyebrow="Segurança e proteção"
        title="O vidro quebra, o film segura."
        aside={<Image src="/img/peliculas/seguraca.jpg" alt="Vidro quebrado mantido íntegro pela película" width={317} height={173} className="w-full rounded-md" />}
      >
        <p>
          Ocorrendo a quebra do vidro, o film mantém os estilhaços firmemente presos, reduzindo
          ou até mesmo eliminando o risco de ferimentos. Auxilia na segurança e proteção
          industrial, comercial e residencial contra acidentes, tempestades e vandalismo; mesmo
          após ter sido quebrado, o vidro revestido com film mantém sua característica
          principal. Films especiais chegam a aumentar a resistência do vidro à pressão de 3 até
          17 vezes.
        </p>
      </Section>

      <Section
        eyebrow="Privacidade"
        title="Ver sem ser visto."
        aside={<Image src="/img/peliculas/privacidade.jpg" alt="Guarita com vidros com película reflexiva" width={319} height={250} className="w-full rounded-md" />}
      >
        <p>
          Alguns films são altamente reflexivos, permitindo a visão de dentro para fora, mas não
          permitindo a visão de fora para dentro. São extremamente adequados para guaritas de
          edifícios, bancos, divisórias de ambientes, áreas de segurança etc. Outros produzem
          total privacidade (jateados), mantendo a claridade do ambiente e impedindo, no entanto,
          a visão nos dois sentidos.
        </p>
      </Section>

      <Section eyebrow="Economia" title="Redução dos custos de refrigeração.">
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
        eyebrow="Estética"
        title="Aparência adequada e decoração de interiores."
        aside={<Image src="/img/peliculas/decorativa.jpg" alt="Vidro com película decorativa jateada" width={317} height={173} className="w-full rounded-md" />}
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
        <Bullets
          items={[
            "Maior privacidade em espaços divididos por portas e janelas.",
            "Renovação do ambiente sem a necessidade de reformas.",
            "Portas de varandas e banheiros ganham destaque e visibilidade.",
          ]}
        />
      </Section>

      <section className="container-x border-t border-line py-16 md:py-24">
        <Reveal className="mb-10">
          <p className="eyebrow mb-3">Confira nossos produtos</p>
          <h2 className="display text-3xl md:text-5xl">Linha arquitetônica</h2>
        </Reveal>
        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {related.map((s) => (
            <RevealItem key={s.href}>
              <Link href={s.href} className="group flex h-full overflow-hidden rounded-lg border border-line bg-bg-2 transition-colors hover:border-line-strong">
                <div className="relative w-2/5 shrink-0 overflow-hidden">
                  <Image src={s.img} alt="" fill sizes="30vw" className="photo object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 items-center justify-between gap-3 p-5">
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
