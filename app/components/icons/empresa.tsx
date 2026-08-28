import type { SVGProps } from "react";

/* Ícones de serviço (A Empresa) — traço 1.6, cantos arredondados, 24×24.
   Todos `currentColor`, sem preenchimento, para herdar a cor do contexto. */

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...p }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      {children}
    </svg>
  );
}

/** Película: vidro com metade escurecida por uma faixa diagonal. */
export function FilmIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 16 15 4" />
      <path d="M9 20 21 8" />
      <path d="M15 20l6-6" />
    </Base>
  );
}

/** Envelopamento: silhueta de carro com faixa. */
export function WrapIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3 14l1.6-4.4A2 2 0 0 1 6.5 8.3h11a2 2 0 0 1 1.9 1.3L21 14" />
      <path d="M2.5 14h19v3.5a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1z" />
      <circle cx="7" cy="18.5" r="1.6" />
      <circle cx="17" cy="18.5" r="1.6" />
      <path d="M9 11.5h6" />
    </Base>
  );
}

/** Som: alto-falante com ondas. */
export function SoundIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5z" />
      <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M18.3 6.5a8 8 0 0 1 0 11" />
    </Base>
  );
}

/** Alarme: escudo com ponto central. */
export function AlarmIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6.2z" />
      <circle cx="12" cy="11.5" r="1.4" />
      <path d="M12 13v3" />
    </Base>
  );
}

/** Para-brisa: vidro trapezoidal com uma trinca reparada. */
export function WindshieldIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M6 5.5h12l3 12H3z" />
      <path d="M10 9l2 2.5-1.2 2 2.4 2.5" />
    </Base>
  );
}

/** Acessórios: chave inglesa. */
export function ToolIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M14.7 6.3a4 4 0 0 0-5.2 4.9L4 16.7a1.5 1.5 0 0 0 2.1 2.1l5.5-5.5a4 4 0 0 0 4.9-5.2l-2.4 2.4-2-2z" />
    </Base>
  );
}

/** Seta longa pra direita (linha do tempo). */
export function LongArrowIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3 12h18" />
      <path d="M15 6l6 6-6 6" />
    </Base>
  );
}
