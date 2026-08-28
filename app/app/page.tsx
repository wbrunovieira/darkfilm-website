import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { Services } from "@/components/home/Services";
import { Seal3M } from "@/components/home/Seal3M";
import { SimuladorTeaser } from "@/components/home/SimuladorTeaser";
import { Clients } from "@/components/home/Clients";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Novidade } from "@/components/home/Novidade";
import { ContactCTA } from "@/components/ContactCTA";

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
      <Novidade />
      <ContactCTA />
    </>
  );
}
