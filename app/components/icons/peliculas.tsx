import type { SVGProps } from "react";

/**
 * Ícones das páginas de película (benefícios, specs 3M, comparativos).
 * Traço 1.6, cantos arredondados, grade 24 — coerentes entre si e com `components/icons.tsx`.
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

/** Raios UV / sol */
export function UvIcon(p: P) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6" />
    </Base>
  );
}

/** Calor / infravermelho */
export function HeatIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M10 4.5a2 2 0 0 1 4 0v9.3a3.8 3.8 0 1 1-4 0z" />
      <path d="M12 9v6.5" />
      <circle cx="12" cy="16.9" r="1.2" fill="currentColor" stroke="none" />
      <path d="M17.5 5.5c1.2 1.2 1.2 2.8 0 4M20 4c2 2 2 4.8 0 7" />
    </Base>
  );
}

/** Privacidade: olho cortado */
export function PrivacyIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3 12s3.2-5.5 9-5.5c1.4 0 2.6.3 3.7.8M21 12s-3.2 5.5-9 5.5c-1.4 0-2.6-.3-3.7-.8" />
      <path d="M9.5 14.5A3.5 3.5 0 0 1 14.5 9.5" />
      <path d="M4 20 20 4" />
    </Base>
  );
}

/** Segurança: vidro estilhaçado contido */
export function ShatterIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <path d="M12 12l-4.5-6M12 12l7-3M12 12l-6 5.5M12 12l4 8M12 12l6.5 2.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Escudo (proteção) */
export function ShieldIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M12 3 5 5.6v5.6c0 4.4 3 8.2 7 9.8 4-1.6 7-5.4 7-9.8V5.6z" />
      <path d="m9 12 2 2 4-4.5" />
    </Base>
  );
}

/** Ruído */
export function NoiseIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4 9.5v5h3l4.5 3.5v-12L7 9.5z" />
      <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
    </Base>
  );
}

/** Sinal de GPS / celular */
export function SignalIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4.5 9.5a11 11 0 0 1 15 0M7.5 12.8a6.5 6.5 0 0 1 9 0M10.3 16a2.5 2.5 0 0 1 3.4 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Garantia: selo com check */
export function WarrantyIcon(p: P) {
  return (
    <Base {...p}>
      <path d="m12 3 2 1.6 2.5-.4.9 2.4 2.3 1.1-.4 2.5L21 12l-1.7 1.8.4 2.5-2.3 1.1-.9 2.4-2.5-.4L12 21l-2-1.6-2.5.4-.9-2.4-2.3-1.1.4-2.5L3 12l1.7-1.8-.4-2.5 2.3-1.1.9-2.4 2.5.4z" />
      <path d="m9 12 2 2 4-4.5" />
    </Base>
  );
}

/** Brilho / ofuscamento */
export function GlareIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M12 4v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 8.4l2.1-2.1" />
      <path d="M6 20a6 6 0 0 1 12 0" />
      <path d="M3 20h18" />
    </Base>
  );
}

/** Proteção da pele / FPS */
export function SkinIcon(p: P) {
  return (
    <Base {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
      <path d="M18.5 3.5v3M17 5h3" />
    </Base>
  );
}

/** Cor estável (gota / paleta) */
export function ColorIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
    </Base>
  );
}

/** Cadeado (smash and grab) */
export function LockIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="5" y="10.5" width="14" height="10" rx="1.8" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Tempo / cronômetro */
export function TimerIcon(p: P) {
  return (
    <Base {...p}>
      <circle cx="12" cy="13.5" r="7" />
      <path d="M12 9.5v4l2.5 1.5M10 3.5h4M18 6.5l1.5-1.5" />
    </Base>
  );
}

/** Energia / economia */
export function EnergyIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M13 3 5 13.5h6L10.5 21 19 10.5h-6z" />
    </Base>
  );
}

/** Estética / decoração */
export function DecorIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4 20 13.5 10.5M15.5 4.5l4 4-2.5 2.5-4-4z" />
      <path d="M8 4c0 1.5-1 2.5-2.5 2.5C7 6.5 8 7.5 8 9c0-1.5 1-2.5 2.5-2.5C9 6.5 8 5.5 8 4zM18 14c0 1.2-.8 2-2 2 1.2 0 2 .8 2 2 0-1.2.8-2 2-2-1.2 0-2-.8-2-2z" />
    </Base>
  );
}

/** Vidro / janela */
export function WindowIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <path d="M12 3.5v17M3.5 12h17" />
    </Base>
  );
}

/** Custo / cifrão */
export function CostIcon(p: P) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.5 9.3c-.4-1-1.3-1.5-2.5-1.5-1.5 0-2.5.8-2.5 1.9 0 2.6 5.3 1.3 5.3 4.1 0 1.2-1.1 2-2.8 2-1.4 0-2.3-.6-2.7-1.6M12 6.5v1.3M12 16.2v1.3" />
    </Base>
  );
}

/** Edifício / valorização */
export function BuildingIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4 20V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V20M14 10h4.5A1.5 1.5 0 0 1 20 11.5V20M3 20h18" />
      <path d="M7 8h1.5M10 8h1.5M7 11.5h1.5M10 11.5h1.5M7 15h1.5M10 15h1.5M16.5 14h1M16.5 17h1" />
    </Base>
  );
}

/** Cortina */
export function CurtainIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3 4h18M5 4v16M19 4v16" />
      <path d="M5 4c1.5 4 4 6 6.5 6M19 4c-1.5 4-4 6-6.5 6M11.5 10c-2 2.5-3.5 6-3.5 10M12.5 10c2 2.5 3.5 6 3.5 10" />
    </Base>
  );
}

/** Camadas (laminado) */
export function LayersIcon(p: P) {
  return (
    <Base {...p}>
      <path d="m12 4 8 4.5-8 4.5-8-4.5z" />
      <path d="m4 12.5 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
    </Base>
  );
}

/** Anti-risco (superfície) */
export function ScratchIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <path d="m7 15 3-6 2 4 2-3 3 5" />
    </Base>
  );
}

/** Encolhimento térmico / curva do vidro */
export function CurveIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3.5 17c3-8 7-10 17-10" />
      <path d="M3.5 12c3-4.5 6-6 9.5-6" opacity="0.5" />
      <path d="M8 19.5c1.5-1 3-1.5 4.5-1.5s3 .5 4.5 1.5" />
    </Base>
  );
}

/** Alerta */
export function AlertIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M12 4 2.8 19.5h18.4z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Carro (lateral) */
export function CarIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3.5 14.5V12l2-4.5A1.5 1.5 0 0 1 6.9 6.5h9.2c.6 0 1.1.3 1.4.9l2 4.6.5 2.5v2.5H3.5z" />
      <path d="M5.5 12h13M9 6.5v5.5M15 6.5v5.5" />
      <circle cx="7.5" cy="17.5" r="1.6" />
      <circle cx="16.5" cy="17.5" r="1.6" />
    </Base>
  );
}

/** Refletivo / espelho */
export function MirrorIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="6" y="3.5" width="12" height="17" rx="2" />
      <path d="m9 15 6-8M9 18l3-4" opacity="0.7" />
    </Base>
  );
}

/** Verão (sol alto) */
export function SummerIcon(p: P) {
  return (
    <Base {...p}>
      <circle cx="12" cy="11" r="4" />
      <path d="M12 3.5v2M4.5 11h2M17.5 11h2M6.7 5.7l1.4 1.4M15.9 7.1l1.4-1.4" />
      <path d="M3 19c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
    </Base>
  );
}

/** Inverno (floco) */
export function WinterIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
      <path d="M12 3 9.8 5.2M12 3l2.2 2.2M12 21l-2.2-2.2M12 21l2.2-2.2" />
    </Base>
  );
}
