import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { TintSimulator } from "@/components/TintSimulator";
import { Section } from "@/components/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ContactCTA } from "@/components/ContactCTA";
import { CarIcon, WindowIcon } from "@/components/icons/peliculas";

export const metadata: Metadata = {
  title: "Simulador de Película",
  description:
    "Simule a tonalidade da película automotiva (G5 a G70), veja o que a lei permite em cada vidro e quais películas 3M atendem a faixa. The Dark Film, Petrópolis/RJ.",
  openGraph: { images: [{ url: "/img/simulador/cena.jpg", width: 540, height: 720 }] },
};

// Mínimos de transmissão luminosa por vidro (Resolução CONTRAN 960/2022, alterada pela 989/2022).
const limites = [
  { vidro: "Para-brisa", valor: "75%", nota: "mínimo de transmissão luminosa (vidro incolor)" },
  { vidro: "Laterais dianteiras", valor: "70%", nota: "mínimo de transmissão luminosa" },
  { vidro: "Traseiros e vidro de trás", valor: "Livre", nota: "sem mínimo, desde que o veículo tenha retrovisores externos dos dois lados" },
];

export default function SimuladorPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Películas · Simulador"
        title={
          <>
            Veja a tonalidade <span className="text-red-2">antes de aplicar.</span>
          </>
        }
        intro="Em três passos: escolha o vidro do carro, escolha quão escura quer a película e veja como fica — e se a lei permite naquele vidro. Na loja medimos o valor final com equipamento próprio."
      />

      <TintSimulator showHeading={false} />

      <Section
        eyebrow="Como funciona"
        title="O que o número da película significa."
        tone="atmo-cool"
        aside={
          /* Escala G5 → G70: a mesma leitura do mostruário da loja. */
          <Reveal className="border border-line bg-bg-2/60 p-5">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">Mais escura</p>
                <p className="display text-3xl">G5</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xs tracking-[0.2em] text-fg-3">Mais clara</p>
                <p className="display text-3xl">G70</p>
              </div>
            </div>
            <div className="pel-scale" role="img" aria-label="Escala de tonalidade do mostruário, de G5, mais escura, a G70, mais clara" />
            <p className="mt-3 text-xs leading-relaxed text-fg-3">
              O número é a porcentagem de luz visível que atravessa a película sozinha.
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
          O mostruário da loja vai de <strong>G5</strong> (mais escura) a <strong>G70</strong>{" "}
          (mais clara). O número é a porcentagem de luz visível que atravessa a película sozinha.
          Como todo vidro de carro já bloqueia parte da luz, o valor final medido no veículo é
          menor que o da película — e é esse valor final que a fiscalização mede.
        </p>
        <ol className="not-prose mt-8 grid">
          {[
            ["Escolha o vidro", "Para-brisa, laterais dianteiras ou traseiros — cada um tem sua regra."],
            ["Escolha a tonalidade", "Do G5 ao G70, como no mostruário da loja."],
            ["Veja o resultado", "Como fica e se a lei permite naquele vidro."],
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
          Referência: Resolução CONTRAN 960/2022, alterada pela 989/2022. Detalhes sobre a
          chancela ABRAWF e a película de segurança na página{" "}
          <Link href="/linha-automotiva">Linha Automotiva</Link>; as linhas 3M em{" "}
          <Link href="/3m">Credenciada 3M</Link>.
        </p>
      </Section>

      <ContactCTA />
    </>
  );
}
