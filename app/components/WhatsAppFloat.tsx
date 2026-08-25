import { site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl("Olá! Vim pelo site da The Dark Film e gostaria de um orçamento.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp ${site.whatsapp.label}`}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] pl-4 pr-5 py-3 text-[#062b16] shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:bottom-7 md:right-7"
    >
      <span className="relative grid size-6 place-items-center">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" aria-hidden />
        <WhatsAppIcon className="relative size-6" />
      </span>
      <span className="font-display text-base font-semibold uppercase tracking-wider">
        WhatsApp
      </span>
    </a>
  );
}
