import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { Services } from "@/components/home/Services";
import { Seal3M } from "@/components/home/Seal3M";
import { SimuladorTeaser } from "@/components/home/SimuladorTeaser";
import { Clients } from "@/components/home/Clients";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Playlist } from "@/components/home/Playlist";
import { ContactCTA } from "@/components/ContactCTA";

/**
 * Esta página mostra o tempo de casa calculado da data atual ("34 anos", "três décadas").
 * Sendo estática, esse número é carimbado no build e ficaria errado na virada do ano até
 * o próximo deploy — e, no Hero, que é componente de cliente, o navegador recalcularia e
 * daria divergência de hidratação. Um dia de revalidação resolve os dois.
 */
export const revalidate = 86400;


/** Separador entre seções de mesmo fundo (hairline com ponto). */
function Sep() {
  return (
    <div className="container-x" aria-hidden>
      <div className="section-sep" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <Sep />
      <SimuladorTeaser />
      <Seal3M />
      <Clients />
      <GalleryPreview />
      <Playlist />
      <ContactCTA />
    </>
  );
}
