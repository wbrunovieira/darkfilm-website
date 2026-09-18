import type { SVGProps } from "react";

/**
 * Ícones das três linhas Thule.
 *
 * Os cartões nasceram só de texto, esperando as "três imagens bem fortes da própria linha Thule"
 * que o cliente disse que separaria depois. Não há foto Thule no acervo — as duas fotos de
 * expositor de rack que existem são da **Farad**, marca concorrente, e usá-las aqui venderia
 * produto de outra marca como se fosse Thule.
 *
 * Então o cartão passa a se bastar: ícone de traço, do mesmo desenho dos das páginas de película.
 * Quando a foto real chegar, ela entra como topo do cartão e o ícone sai — nada aqui impede isso.
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

/** Carro de perfil com duas barras transversais no teto. */
export function RackIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3 17h18M4.5 17v1.5M19.5 17v1.5" />
      <path d="M4 17c-.6-2 0-3.6 1.6-4.2l2.3-2.6c.4-.5 1-.8 1.7-.8h4.8c.7 0 1.3.3 1.7.8l2.3 2.6C20 13.4 20.6 15 20 17" />
      <path d="M7 7.6h10M8.4 5.4h7.2" />
      <path d="M8.4 5.4 7 7.6M15.6 5.4 17 7.6" />
    </Base>
  );
}

/** Bicicleta: duas rodas e o quadro. */
export function BikeIcon(p: P) {
  return (
    <Base {...p}>
      <circle cx="5.6" cy="16.4" r="3.6" />
      <circle cx="18.4" cy="16.4" r="3.6" />
      <path d="M5.6 16.4 9.4 8.6h4.2l4.8 7.8" />
      <path d="M9.4 8.6h5.8M8.2 8.6h2.6" />
      <path d="M14.4 8.6 12 16.4" />
    </Base>
  );
}

/** Bagageiro de teto: a caixa sobre as barras. */
export function BagageiroIcon(p: P) {
  return (
    <Base {...p}>
      <path d="M3.4 11.6c2.6-2 5.4-3 8.6-3s6 1 8.6 3c-2.6 2-5.4 3-8.6 3s-6-1-8.6-3Z" />
      <path d="M12 8.6v6" />
      <path d="M5.4 16.4v2.2M18.6 16.4v2.2" />
      <path d="M4.6 16.4h14.8" />
    </Base>
  );
}
