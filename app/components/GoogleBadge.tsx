import { site } from "@/lib/site";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return (
          <svg key={i} viewBox="0 0 20 20" className="size-4">
            <defs>
              <linearGradient id={`star-${i}`}>
                <stop offset={`${fill * 100}%`} stopColor="#FBBC04" />
                <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.18)" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#star-${i})`}
              d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z"
            />
          </svg>
        );
      })}
    </span>
  );
}

function GoogleG(p: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={p.className}>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
      <path fill="#FBBC04" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5L6.4 10C7.2 7.8 9.4 6 12 6z" />
    </svg>
  );
}

/** Selo com a nota do Google. `variant="hero"` é maior e com fundo; `"inline"` é compacto. */
export function GoogleBadge({ variant = "inline" }: { variant?: "hero" | "inline" }) {
  const { rating, reviews, url } = site.google;
  const label = `${rating.toLocaleString("pt-BR")} de 5 no Google, ${reviews} avaliações`;

  if (variant === "hero") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label}. Abrir avaliações no Google`}
        className="group inline-flex items-center gap-4 rounded-full border border-line-strong bg-bg/60 py-2.5 pl-3 pr-5 backdrop-blur transition-colors hover:border-fg-3"
      >
        <span className="grid size-9 place-items-center rounded-full bg-white">
          <GoogleG className="size-5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="flex items-center gap-2">
            <span className="display text-2xl text-fg">{rating.toLocaleString("pt-BR")}</span>
            <Stars rating={rating} />
          </span>
          <span className="text-xs text-fg-2">{reviews} avaliações no Google</span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}. Abrir avaliações no Google`}
      className="inline-flex items-center gap-2 text-sm text-fg-2 transition-colors hover:text-fg"
    >
      <GoogleG className="size-4" />
      <span className="font-display text-base font-semibold text-fg">{rating.toLocaleString("pt-BR")}</span>
      <Stars rating={rating} />
      <span>({reviews})</span>
    </a>
  );
}
