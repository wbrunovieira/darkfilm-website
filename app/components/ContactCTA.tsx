import { site, whatsappUrl } from "@/lib/site";
import { Reveal } from "./Reveal";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";

export function ContactCTA() {
  return (
    <section className="container-x pb-8">
      <Reveal className="relative overflow-hidden rounded-lg bg-red p-8 text-white grain md:p-16">
        <div className="relative grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <p className="font-display text-xs font-medium uppercase tracking-[0.22em] text-white/70">
              Fale com a gente
            </p>
            <h2 className="display mt-4 text-5xl md:text-7xl">
              Venha nos
              <br />
              fazer uma visita.
            </h2>
          </div>
          <div className="space-y-5 text-lg">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-full bg-white px-6 py-4 font-display text-xl font-semibold uppercase tracking-[0.12em] text-red-deep transition-transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="size-6" /> {site.whatsapp.label}
            </a>
            <div className="flex items-start gap-4">
              <PhoneIcon className="mt-1 size-5 shrink-0 text-white/70" />
              <p className="flex flex-col">
                {site.phones.map((p) => (
                  <a key={p.href} href={p.href} className="hover:underline">
                    {p.label}
                  </a>
                ))}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <PinIcon className="mt-1 size-5 shrink-0 text-white/70" />
              <p>
                {site.address.street}
                <br />
                {site.address.district} — {site.address.city}/{site.address.state}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
