import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/* Ícones do catálogo e da galeria: traço 1.6, cantos arredondados, grade 24. */
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

/** Som e multimídia: alto-falante com ondas. */
export function SpeakerIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </Base>
  );
}

/** Alarmes e segurança: escudo com cadeado. */
export function ShieldIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.4 7 8.9 4.1-1.5 7-4.7 7-8.9V6.2z" />
      <path d="M9.8 12.2h4.4v3.3H9.8z" />
      <path d="M10.6 12.2v-1.1a1.4 1.4 0 0 1 2.8 0v1.1" />
    </Base>
  );
}

/** Iluminação: farol com feixe. */
export function HeadlightIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M11 6.5c-3 0-5.5 2.5-5.5 5.5S8 17.5 11 17.5c1.6 0 2.5-1 2.5-5.5S12.6 6.5 11 6.5z" />
      <path d="M16 8h4.5M16.5 12h4M16 16h4.5" />
    </Base>
  );
}

/** Acessórios: chave de boca. */
export function WrenchIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M14.2 6.2a4 4 0 0 1 5-1.1l-2.6 2.6.9 2.2 2.2.9 2.6-2.6a4 4 0 0 1-5.7 4.9L8.4 21.3a1.8 1.8 0 0 1-2.6-2.6l8.2-8.2a4 4 0 0 1 .2-4.3z" />
    </Base>
  );
}

/** Grade: "todos". */
export function GridIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </Base>
  );
}

export function SearchIcon(p: P) {
  return (
    <Base {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.8-3.8" />
    </Base>
  );
}

export function CloseIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  );
}

export function ChevronLeftIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M15 5.5 8.5 12l6.5 6.5" />
    </Base>
  );
}

export function ChevronRightIcon(p: P) {
  return (
    <Base {...p}>
      <path d="m9 5.5 6.5 6.5L9 18.5" />
    </Base>
  );
}

export function ChevronSmallIcon(p: P) {
  return (
    <Base {...p}>
      <path d="m9.5 6.5 5 5.5-5 5.5" />
    </Base>
  );
}

/** Lupa de ampliar (canto da foto no hover). */
export function ExpandIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </Base>
  );
}

export function PhotosIcon(p: P) {
  return (
    <Base {...p}>
      <rect x="3.5" y="6.5" width="14" height="12" rx="1.5" />
      <path d="M7.5 4.5h12a1 1 0 0 1 1 1v10" />
      <path d="m3.5 16 4.2-4.2 3.3 3.3 2.2-2.2 4.3 4.3" />
      <circle cx="13.5" cy="10" r="1.3" />
    </Base>
  );
}

/** Ícone do grupo do catálogo (lib/produtos.ts → grupos[].id). */
export function GrupoIcon({ id, ...p }: P & { id: string }) {
  switch (id) {
    case "som":
      return <SpeakerIcon {...p} />;
    case "seguranca":
      return <ShieldIcon {...p} />;
    case "iluminacao":
      return <HeadlightIcon {...p} />;
    case "acessorios":
      return <WrenchIcon {...p} />;
    default:
      return <GridIcon {...p} />;
  }
}
