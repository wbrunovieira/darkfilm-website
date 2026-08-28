import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { GoogleBadge } from "@/components/GoogleBadge";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { site, whatsappUrl } from "@/lib/site";
import {
  InstagramIcon,
  FacebookIcon,
  GoogleMapsIcon,
  PhoneIcon,
  PinIcon,
  WazeIcon,
  WhatsAppIcon,
} from "@/components/icons";

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

const social =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-fg-2 transition-[border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-red hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

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

      {/* ---------- Formulário (protagonista) + canais ---------- */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_0%_0%,rgba(209,20,31,0.1),transparent_70%),radial-gradient(35%_45%_at_100%_100%,rgba(255,255,255,0.035),transparent_70%)]"
        />
        <div className="container-x grid gap-12 pt-14 pb-20 md:grid-cols-[1.25fr_1fr] md:gap-16 md:pt-20 md:pb-28 lg:gap-20">
          <Reveal className="panel grain p-6 sm:p-8 md:p-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
              <div>
                <p className="eyebrow mb-2">Formulário</p>
                <h2 className="display text-3xl md:text-4xl">Envie sua mensagem.</h2>
              </div>
              <p className="max-w-[16rem] text-sm text-fg-3">
                A mensagem chega direto no nosso WhatsApp, com seus dados preenchidos.
              </p>
            </div>
            <ContactForm />
          </Reveal>

          <aside className="md:sticky md:top-28 md:self-start">
            <Reveal delay={0.1}>
              <p className="eyebrow mb-2">Canais</p>
              <h2 className="display text-3xl md:text-4xl">
                Ou chame <span className="text-red-2">direto.</span>
              </h2>
            </Reveal>

            <RevealGroup stagger={0.1} className="mt-8 grid gap-4">
              <RevealItem>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel channel-wa flex items-center gap-4 rounded-lg border border-line p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-[#062b16]">
                    <span aria-hidden className="animate-pulse-ring absolute inset-0 rounded-full border border-[#25D366]" />
                    <WhatsAppIcon className="size-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-[0.2em] text-fg-3">WhatsApp</span>
                    <span className="block font-display text-2xl font-semibold leading-tight text-fg md:text-3xl">
                      {site.whatsapp.label}
                    </span>
                    <span className="block text-sm text-fg-2">Chame direto no nosso número.</span>
                  </span>
                </a>
              </RevealItem>

              <RevealItem className="channel rounded-lg border border-line bg-bg-2/60 p-5">
                <div className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-red-2">
                    <PhoneIcon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-fg-3">Telefones</p>
                    {site.phones.map((p) => (
                      <a
                        key={p.href}
                        href={p.href}
                        className="block font-display text-2xl font-semibold leading-tight text-fg transition-colors hover:text-red-2 focus-visible:outline-none focus-visible:text-red-2"
                      >
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>
              </RevealItem>

              <RevealItem className="channel rounded-lg border border-line bg-bg-2/60 p-5">
                <div className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-red-2">
                    <PinIcon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-fg-3">Endereço</p>
                    <p className="font-display text-xl font-semibold leading-tight text-fg">
                      {site.address.street}
                    </p>
                    <p className="text-sm text-fg-2">
                      {site.address.district} — {site.address.city}/{site.address.state}
                    </p>
                    <p className="mt-2 text-xs text-fg-3">
                      {site.hours ?? "Horário de atendimento: confirme pelo WhatsApp."}
                    </p>
                  </div>
                </div>
              </RevealItem>

              <RevealItem className="rounded-lg border border-line p-5">
                <GoogleBadge variant="card" />
              </RevealItem>

              <RevealItem className="flex flex-wrap gap-3 pt-2">
                <a href={site.social.instagram.href} target="_blank" rel="noopener noreferrer" className={social}>
                  <InstagramIcon className="size-4" /> {site.social.instagram.handle}
                </a>
                <a href={site.social.facebook.href} target="_blank" rel="noopener noreferrer" className={social}>
                  <FacebookIcon className="size-4" /> Facebook
                </a>
              </RevealItem>
            </RevealGroup>
          </aside>
        </div>
      </section>

      {/* ---------- Mapa ---------- */}
      <section className="border-t border-line">
        <div className="container-x py-16 md:py-24">
          <Reveal className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="eyebrow mb-3">Onde estamos</p>
              <h2 className="display text-4xl md:text-6xl [text-wrap:balance]">
                {site.address.street}
                <span className="block text-fg-3">
                  {site.address.district}, {site.address.city}/{site.address.state}
                </span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-bg transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-red hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <GoogleMapsIcon className="size-4" /> Google Maps
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-fg transition-[border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#33ccff] hover:text-[#33ccff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <WazeIcon className="size-4" /> Waze
              </a>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="map-wrap relative overflow-hidden rounded-lg border border-line"
            variants={{ hidden: { opacity: 0, scale: 0.985 }, show: { opacity: 1, scale: 1 } }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* P&B no repouso; hover/foco revela as cores originais do mapa. */}
            <iframe
              title={`Mapa: ${site.address.full}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-frame h-[400px] md:h-[500px]"
            />
            <div aria-hidden className="map-veil" />
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg/70 px-3 py-1.5 text-xs text-fg-2 backdrop-blur md:left-6 md:top-6">
              <span aria-hidden className="size-1.5 rounded-full bg-red-2" />
              The Dark Film &amp; Sound
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
