import { site, whatsappUrl } from "@/lib/site";
import { Reveal } from "./Reveal";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";

export function ContactCTA() {
  return (
    <section className="container-x pb-8 pt-4">
      <Reveal className="cta-red grain relative overflow-hidden rounded-lg p-8 text-white md:p-16">
        {/* marca-d'água "1992": ano de fundação, cortado pela borda */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-2 select-none font-display text-[9rem] font-bold leading-none text-white/[0.07] md:-bottom-10 md:text-[15rem]"
        >
          {site.founded}
        </span>

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
            <p className="mt-6 max-w-sm text-white/80">
              {site.city}/{site.state}, desde {site.founded}. Orçamento pelo WhatsApp ou na loja.
            </p>
          </div>

          <div className="space-y-5 text-lg">
            <a
              href={whatsappUrl("Olá! Gostaria de um orçamento.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 items-center gap-4 rounded-full bg-white px-6 py-4 font-display text-xl font-semibold uppercase tracking-[0.12em] text-red-deep shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_28px_50px_-20px_rgba(0,0,0,0.7)]"
            >
              <WhatsAppIcon className="size-6 transition-transform duration-300 group-hover:scale-110" />
              {site.whatsapp.label}
            </a>
            <div className="flex items-start gap-4 border-t border-white/20 pt-5">
              <PhoneIcon className="mt-1 size-5 shrink-0 text-white/70" />
              <p className="flex flex-col">
                {site.phones.map((p) => (
                  <a key={p.href} href={p.href} className="link-grow w-fit">
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
