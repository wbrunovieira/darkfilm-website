import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { GoogleBadge } from "@/components/GoogleBadge";
import { Reveal } from "@/components/Reveal";
import { site, whatsappUrl } from "@/lib/site";
import { InstagramIcon, FacebookIcon, GoogleMapsIcon, PhoneIcon, PinIcon, WazeIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a The Dark Film em Petrópolis/RJ: WhatsApp ${site.whatsapp.label}, telefones ${site.phones.map((p) => p.label).join(" e ")}. ${site.address.full}.`,
};

const enderecoQuery = encodeURIComponent(
  `${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}`,
);
const mapSrc = `https://www.google.com/maps?q=${enderecoQuery}&z=16&output=embed`;
const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${enderecoQuery}`;
const wazeUrl = `https://waze.com/ul?q=${enderecoQuery}&navigate=yes`;

export default function ContatoPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Contato"
        title={
          <>
            Fale com <span className="text-red-2">a gente.</span>
          </>
        }
        intro="Utilize o formulário abaixo para enviar seu contato, ou se preferir, ligue para nós."
      />

      <section className="container-x grid gap-14 border-t border-line pt-14 pb-24 md:grid-cols-[1.15fr_1fr] md:gap-20 md:pt-20">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.1} className="space-y-8">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-line bg-bg-2 p-5 transition-colors hover:border-[#25D366]"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-[#062b16]">
              <WhatsAppIcon className="size-6" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.2em] text-fg-3">WhatsApp</span>
              <span className="font-display text-2xl font-semibold">{site.whatsapp.label}</span>
            </span>
          </a>

          <div className="flex items-start gap-4">
            <PhoneIcon className="mt-1 size-5 shrink-0 text-red-2" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-fg-3">Telefones</p>
              {site.phones.map((p) => (
                <a key={p.href} href={p.href} className="block font-display text-2xl font-semibold hover:text-red-2">
                  {p.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <PinIcon className="mt-1 size-5 shrink-0 text-red-2" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-fg-3">Endereço</p>
              <p className="text-lg text-fg">
                {site.address.street}
                <br />
                {site.address.district} — {site.address.city}/{site.address.state}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-bg-2 p-5">
            <GoogleBadge variant="hero" />
            <p className="mt-3 text-sm text-fg-2">
              Avaliações reais de clientes na nossa ficha do Google.
            </p>
          </div>

          <div className="flex gap-3">
            <a href={site.social.instagram.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg-2 hover:border-red hover:text-fg">
              <InstagramIcon className="size-4" /> {site.social.instagram.handle}
            </a>
            <a href={site.social.facebook.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg-2 hover:border-red hover:text-fg">
              <FacebookIcon className="size-4" /> Facebook
            </a>
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-8">
        <Reveal className="group relative overflow-hidden rounded-lg border border-line">
          {/* P&B no repouso; hover/foco revela as cores originais do mapa. */}
          <iframe
            title={`Mapa: ${site.address.full}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[420px] w-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.9] transition-[filter] duration-700 ease-out group-hover:grayscale-0 group-hover:invert-0 group-hover:hue-rotate-0 group-hover:contrast-100 group-focus-within:grayscale-0 group-focus-within:invert-0 group-focus-within:hue-rotate-0 group-focus-within:contrast-100 md:h-[480px]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-bg via-bg/70 to-transparent p-4 md:p-6">
            <p className="text-sm text-fg-2">
              <span className="block font-display text-xs uppercase tracking-[0.2em] text-fg-3">Como chegar</span>
              {site.address.full}
            </p>
            <div className="pointer-events-auto flex gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-bg transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-red hover:text-white"
              >
                <GoogleMapsIcon className="size-4" /> Google Maps
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg/70 px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-fg backdrop-blur transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#33ccff] hover:text-[#33ccff]"
              >
                <WazeIcon className="size-4" /> Waze
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
