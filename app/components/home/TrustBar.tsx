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

/** Faixa de ripas (material da loja) com letreiro contínuo. Decorativa: o mesmo
 *  conteúdo aparece em texto acessível nas seções seguintes. */
export function TrustBar() {
  const row = [...items, ...items];
  return (
    <div className="ripas grain relative overflow-hidden border-y border-line py-5 md:py-6" aria-hidden>
      {/* filete vermelho no topo: costura o hero à faixa */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red/70 to-transparent" />
      <div className="marquee-mask">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-sm font-medium uppercase tracking-[0.25em] text-fg-2">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t}
              <span className="size-1.5 rotate-45 bg-red" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
