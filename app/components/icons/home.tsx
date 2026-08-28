import type { SVGProps } from "react";

/**
 * Ícones da home. Traço único (1.6), cantos arredondados, grade 24px.
 * Todos são decorativos: `aria-hidden` por padrão, o texto ao lado dá o significado.
 */
type P = SVGProps<SVGSVGElement>;

function Base({ children, ...p }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      {children}
    </svg>
  );
}

/** Película automotiva: perfil de carro com vidro escurecido. */
export function FilmAutoIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3 14.5 4.4 10a2 2 0 0 1 1.9-1.4h11.4a2 2 0 0 1 1.9 1.4L21 14.5" />
      <path d="M2.5 14.5h19v3a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1z" />
      <path d="M8.2 8.6 9 11h6l.8-2.4" fill="currentColor" fillOpacity="0.22" stroke="none" />
      <path d="M8.2 8.6 9 11h6l.8-2.4" />
      <circle cx="7" cy="18.5" r="1.6" />
      <circle cx="17" cy="18.5" r="1.6" />
    </Base>
  );
}

/** Película arquitetônica: fachada com vidro e sol. */
export function FilmArchIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4 21V6.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 14 6.5V21" />
      <path d="M4 21h16" />
      <path d="M7 9h4M7 12.5h4M7 16h4" />
      <path d="M14 11h4.5a1.5 1.5 0 0 1 1.5 1.5V21" />
      <path d="M18.5 3v1.6M21.6 4.2l-1.1 1.1M15.4 4.2l1.1 1.1" />
      <path d="M4 5 14 15" strokeOpacity="0.45" />
    </Base>
  );
}

/** Som: alto-falante com onda. */
export function SoundIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="5" y="3" width="10" height="18" rx="2" />
      <circle cx="10" cy="14.5" r="3.2" />
      <circle cx="10" cy="14.5" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7" r="1.3" />
      <path d="M18.5 9.5a4.5 4.5 0 0 1 0 5" />
      <path d="M20.8 7.5a7.5 7.5 0 0 1 0 9" />
    </Base>
  );
}

/** Envelopamento: folha de vinil sendo aplicada sobre o capô. */
export function WrapIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3 16.5 5 12a2 2 0 0 1 1.8-1.2h10.4A2 2 0 0 1 19 12l2 4.5" />
      <path d="M2.5 16.5h19v2a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1z" />
      <path d="M8.5 10.8 9.6 8h4.8l1.1 2.8" />
      <path d="M4 6.5C6 4.5 8.5 4.5 10.5 6.5s4.5 2 6.5 0" strokeOpacity="0.55" />
      <path d="M12 3.2c2.6 0 4.4 1.2 5.2 3.2" />
      <path d="m15.4 5.6 1.8.8.8-1.8" />
    </Base>
  );
}

/** Polimento de faróis: farol com feixe. */
export function HeadlightIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M9 6c-3.3 0-6 2.7-6 6s2.7 6 6 6h1.5c.8 0 1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5z" />
      <path d="M6.5 9.5v5M9 8.5v7" strokeOpacity="0.5" />
      <path d="M15 8h5M15 12h6M15 16h5" />
    </Base>
  );
}

/** Lavagem a seco: gota cortada + brilho (sem água). */
export function DryWashIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M10 3.5s5.5 5.7 5.5 9.3a5.5 5.5 0 0 1-11 0C4.5 9.2 10 3.5 10 3.5z" />
      <path d="M4 20 20 4" />
      <path d="M18.5 15v4M16.5 17h4" />
    </Base>
  );
}

/** Recuperação de para-brisa: vidro com trinca reparada. */
export function WindshieldIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4.5 17 6.4 8.2A2 2 0 0 1 8.4 6.6h7.2a2 2 0 0 1 2 1.6L19.5 17z" />
      <path d="M3 17h18" />
      <path d="m10.5 9.5 1.3 2.6-1.1 1.4 1.6 2" />
      <circle cx="10.5" cy="9.5" r="1.2" fill="currentColor" fillOpacity="0.25" />
    </Base>
  );
}

/** Estrela cheia para a nota do Google. */
export function StarIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="m12 2.8 2.7 5.8 6.3.7-4.7 4.3 1.3 6.3L12 16.7l-5.6 3.2 1.3-6.3L3 9.3l6.3-.7z" />
    </svg>
  );
}

/** Selo com marca de verificação (credenciamento). */
export function ShieldCheckIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M12 3 5 5.8v5.4c0 4.4 3 8.2 7 9.8 4-1.6 7-5.4 7-9.8V5.8z" />
      <path d="m9 12 2 2 4-4.5" />
    </Base>
  );
}

/** Medidor de transmissão luminosa (novidade). */
export function MeterIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="3" y="7" width="18" height="11" rx="2" />
      <path d="M7 14.5a5 5 0 0 1 10 0" />
      <path d="m12 14.5 2.5-2.5" />
      <circle cx="12" cy="14.5" r="0.7" fill="currentColor" stroke="none" />
      <path d="M8 4.5h8" strokeOpacity="0.5" />
    </Base>
  );
}

/** Sol filtrado: usado como marcador em atributos da película. */
export function SunFilterIcon(p: P) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
      <path d="M4 20 20 4" strokeOpacity="0.4" />
    </Base>
  );
}
