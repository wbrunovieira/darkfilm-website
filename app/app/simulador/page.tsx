import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { TintSimulator } from "@/components/TintSimulator";
import { Section } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { CarIcon, WindowIcon } from "@/components/icons/peliculas";
import { LIMITES, NOTA_CONJUNTO, NOTA_SEM_MINIMO, valorLimite } from "@/lib/legislacao";

export const metadata: Metadata = {
  title: "Legislação de Película Automotiva",
  description:
    "Veja o mínimo de transmissão luminosa que a lei exige em cada vidro do carro — para-brisa, laterais dianteiras e traseiros. The Dark Film, Petrópolis/RJ.",
};

// Ordem de leitura da tabela: da frente para trás, que não é a ordem do seletor.
const limites = ["parabrisa", "dianteiras", "traseiras"].map((id) => {
  const l = LIMITES.find((v) => v.id === id)!;
  return {
    vidro: l.curto,
    valor: valorLimite(l),
    nota: l.min === null ? NOTA_SEM_MINIMO : NOTA_CONJUNTO,
  };
});

export default function SimuladorPage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Início", href: "/" }, { label: "Películas" }, { label: "Legislação" }]}
        title={
          <>
            Veja a tonalidade <span className="text-red-2">antes de aplicar.</span>
          </>
        }
        intro="Escolha o vidro do carro e confira o índice mínimo de transmissão luminosa permitido pela legislação. A transmissão final considera o conjunto vidro + película e pode ser medida na loja com equipamento próprio."
      />

      <TintSimulator showHeading={false} variant="legislacao" />

      {/* A simulação visual saiu daqui a pedido do cliente. Dizer onde ela ficou evita que a
          pessoa que veio "ver a tonalidade" saia sem encontrar. */}
      <div className="container-x pb-4">
        <p className="text-sm text-fg-2">
          Quer ver como cada tonalidade fica olhando de dentro do carro?{" "}
          <Link href="/peliculas-automotivas#simulador" className="text-fg underline underline-offset-4 hover:text-red-2">
            Simule em Películas Automotivas
          </Link>
          . Para entender o que a película faz com o calor e o brilho, veja as{" "}
          <Link href="/caracteristicas-do-film" className="text-fg underline underline-offset-4 hover:text-red-2">
            características do film
          </Link>
          .
        </p>
      </div>

      <Section
        eyebrow="Como funciona"
        title="O que o número da película significa."
        tone="atmo-cool"
        aside={
          /* Escala em % de transmissão luminosa: o cliente entende luz, não código de produto. */
          <Reveal className="border border-line bg-bg-2/60 p-5">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">Mais escura</p>
                <p className="display text-3xl">5%</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">Mais clara</p>
                <p className="display text-3xl">90%</p>
              </div>
            </div>
            <div className="pel-scale" role="img" aria-label="Escala de transmissão luminosa, de 5%, mais escura, a 90%, mais clara" />
            <p className="mt-3 flex flex-wrap justify-between gap-x-2 font-display text-xs tabular-nums tracking-[0.15em] text-fg-3" aria-hidden>
              {["5%", "20%", "35%", "50%", "70%", "90%"].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </p>
          </Reveal>
        }
        after={
          <div>
            <Reveal className="mb-6 flex items-center gap-3">
              <span className="pel-icon pel-icon--sm pel-icon--accent"><CarIcon /></span>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-fg-2">Mínimo permitido por vidro</p>
            </Reveal>
            <RevealGroup className="grid gap-3 md:grid-cols-3" stagger={0.1}>
              {limites.map((l, i) => (
                <RevealItem key={l.vidro} className="pel-tile">
                  <div className="flex items-center justify-between">
                    <span className="pel-icon"><WindowIcon /></span>
                    <span className="font-display text-xs tracking-[0.2em] text-fg-3">0{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold uppercase leading-tight text-fg-2">{l.vidro}</p>
                    <p className="display mt-2 text-5xl md:text-6xl">{l.valor}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fg-2">{l.nota}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        }
      >
        <p>
          Quanto menor o número, mais escura é a película. Quanto maior, mais clara. O número
          indica a transmissão de luz visível da película — trabalhamos de <strong>5%</strong>{" "}
          até <strong>90%</strong>, das mais escuras às praticamente transparentes. O resultado
          final pode variar conforme o vidro original do veículo: como todo vidro de carro já
          bloqueia parte da luz, o valor medido no veículo é menor que o da película — e é esse
          valor final, do conjunto vidro + película, que a fiscalização mede.
        </p>
        <ol className="not-prose mt-8 grid">
          {[
            ["Escolha o vidro", "Para-brisa, laterais dianteiras ou traseiros — cada um tem sua regra."],
            ["Veja o mínimo da lei", "A transmissão luminosa que aquele vidro precisa manter."],
            ["Confirme na loja", "Medimos o conjunto vidro + película com equipamento próprio."],
          ].map(([t, d], i) => (
            <li key={t} className="pel-step grid gap-1 md:grid-cols-[6rem_1fr] md:gap-6">
              <span className="pel-step__n">Passo 0{i + 1}</span>
              <div>
                <p className="font-display text-xl font-semibold uppercase leading-none text-fg">{t}</p>
                <p className="mt-1.5 text-sm text-fg-2">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8">
          Referência: Resolução CONTRAN 960/2022, alterada pela 989/2022. Trabalhamos com
          diferentes marcas e tecnologias de película — detalhes sobre a chancela ABRAWF e a
          película de segurança na página{" "}
          <Link href="/peliculas-automotivas">Películas Automotivas</Link>.
        </p>
      </Section>

      <ContactCTA />
    </>
  );
}
