import { site, yearsInBusiness } from "@/lib/site";

const items = [
  `Desde ${site.founded}`,
  `${site.google.rating.toLocaleString("pt-BR")} no Google · ${site.google.reviews} avaliações`,
  "Credenciada 3M",
  "Película automotiva",
  "Película arquitetônica",
  "Som & acessórios",
  "Envelopamento",
  "Recuperação de para-brisa",
  `${yearsInBusiness()} anos em Petrópolis`,
];

export function TrustBar() {
  const row = [...items, ...items];
  return (
    <div className="ripas grain border-y border-line py-5 overflow-hidden" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-sm font-medium uppercase tracking-[0.25em] text-fg-2">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="size-1.5 rounded-full bg-red" />
          </span>
        ))}
      </div>
    </div>
  );
}
