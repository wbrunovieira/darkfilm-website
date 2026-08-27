import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { Services } from "@/components/home/Services";
import { Seal3M } from "@/components/home/Seal3M";
import { SimuladorTeaser } from "@/components/home/SimuladorTeaser";
import { Clients } from "@/components/home/Clients";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Novidade } from "@/components/home/Novidade";
import { ContactCTA } from "@/components/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <SimuladorTeaser />
      <Seal3M />
      <Clients />
      <GalleryPreview />
      <Novidade />
      <ContactCTA />
    </>
  );
}
