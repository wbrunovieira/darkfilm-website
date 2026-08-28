import { useId } from "react";
import { site } from "@/lib/site";

function Stars({ rating, uid, className = "size-4" }: { rating: number; uid: string; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        const gid = `${uid}-star-${i}`;
        return (
          <svg key={i} viewBox="0 0 20 20" className={className}>
            <defs>
              <linearGradient id={gid}>
                <stop offset={`${fill * 100}%`} stopColor="#FBBC04" />
                <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.18)" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gid})`}
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

/**
 * Selo com a nota do Google.
 * - `"inline"`: compacto (rodapé, listas).
 * - `"hero"`: uma linha, um pouco maior, sem pílula.
 * - `"card"`: nota grande com estrelas e contagem em duas linhas — para
 *   blocos de prova social (A Empresa, Contato).
 * Os ids dos gradientes usam `useId` para não colidir quando há mais de um
 * selo na mesma página.
 */
export function GoogleBadge({ variant = "inline" }: { variant?: "hero" | "inline" | "card" }) {
  const uid = useId();
  const { rating, reviews, url } = site.google;
  const ratingText = rating.toLocaleString("pt-BR");
  const label = `${ratingText} de 5 no Google, ${reviews} avaliações`;
  const aria = `${label}. Abrir avaliações no Google`;

  if (variant === "card") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={aria}
        className="group flex items-center gap-5 text-fg-2 transition-colors hover:text-fg"
      >
        <span className="display text-6xl leading-none text-fg md:text-7xl">{ratingText}</span>
        <span className="grid gap-1.5">
          <Stars rating={rating} uid={uid} className="size-5" />
          <span className="inline-flex items-center gap-2 text-sm">
            <GoogleG className="size-4" />
            {reviews} avaliações no Google
          </span>
          <span className="text-xs text-fg-3 transition-colors group-hover:text-red-2">
            Ver avaliações →
          </span>
        </span>
      </a>
    );
  }

  if (variant === "hero") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={aria}
        className="group inline-flex items-center gap-3 text-sm text-fg-2 transition-colors hover:text-fg"
      >
        <GoogleG className="size-5" />
        <span className="display text-xl text-fg">{ratingText}</span>
        <Stars rating={rating} uid={uid} />
        <span>{reviews} avaliações no Google</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      className="inline-flex items-center gap-2 text-sm text-fg-2 transition-colors hover:text-fg"
    >
      <GoogleG className="size-4" />
      <span className="font-display text-base font-semibold text-fg">{ratingText}</span>
      <Stars rating={rating} uid={uid} />
      <span>({reviews})</span>
    </a>
  );
}
