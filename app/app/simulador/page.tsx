import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { TintSimulator } from "@/components/TintSimulator";
import { Section, Bullets } from "@/components/Section";
import { ContactCTA } from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Simulador de Película",
  description:
    "Simule a tonalidade da película automotiva (G5 a G70), veja o que a lei permite em cada vidro e quais películas 3M atendem a faixa. The Dark Film, Petrópolis/RJ.",
  openGraph: { images: [{ url: "/img/simulador/cena.jpg", width: 540, height: 720 }] },
};

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
        intro="Arraste para escolher a transmissão de luz. O número da tonalidade (G5, G20…) é a porcentagem de luz visível que atravessa a película. A lei considera o conjunto vidro + película — na loja medimos o valor final com equipamento próprio."
      />

      <TintSimulator showHeading={false} />

      <Section eyebrow="Como funciona" title="O que o número da película significa.">
        <p>
          O mostruário da loja vai de <strong>G5</strong> (mais escura) a <strong>G70</strong>{" "}
          (mais clara). O número é a porcentagem de luz visível que atravessa a película sozinha.
          Como todo vidro de carro já bloqueia parte da luz, o valor final medido no veículo é
          menor que o da película — e é esse valor final que a fiscalização mede.
        </p>
        <Bullets
          items={[
            "Para-brisa: mínimo de 75% de transmissão luminosa (vidro incolor).",
            "Laterais dianteiras: mínimo de 70%.",
            "Vidros traseiros e vidro de trás: sem mínimo, desde que o veículo tenha retrovisores externos dos dois lados.",
          ]}
        />
        <p>
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
