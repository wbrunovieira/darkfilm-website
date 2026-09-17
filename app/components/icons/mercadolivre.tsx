/**
 * Ícones dos quatro serviços da agência.
 *
 * Desenhados aqui em vez de usar as imagens que vieram com o pedido: aquelas têm 307 por 281
 * pixels, tamanho de miniatura, e mostram pessoas geradas por IA, uma delas vestindo uma camisa
 * com um slogan que não faz parte da marca do cliente. Ícone de traço resolve o mesmo e combina
 * com o resto do site.
 */

const base = "size-6";

/** Caixa com seta para cima: o pacote que sai. */
export function EnvioIcon({ className = base }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5z" strokeLinejoin="round" />
      <path d="m3 8.5 9 4.5 9-4.5" />
      <path d="M12 13v7" />
      <path d="M12 2.5v4M10.2 4.3 12 2.5l1.8 1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Sacola com o quadrado do QR: a compra que se retira apresentando o código. */
export function RetiradaIcon({ className = base }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M5 8h14l-1.1 10.2A2 2 0 0 1 15.9 20H8.1a2 2 0 0 1-2-1.8L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 1 1 6 0v2" strokeLinecap="round" />
      <rect x="10" y="12" width="4" height="4" rx="0.6" />
    </svg>
  );
}

/** Seta que volta: o produto que retorna ao vendedor. */
export function DevolucaoIcon({ className = base }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" strokeLinecap="round" />
      <path d="M20 3.5V8h-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 12h5M11.5 10l-2 2 2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Duas setas em sentidos opostos: um produto sai, outro entra. */
export function TrocaIcon({ className = base }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 8.5h13M14 5.5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 15.5H7M10 12.5l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Aviso, para o bloco de responsabilidade. */
export function AvisoIcon({ className = base }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M12 3.5 21.5 20H2.5L12 3.5Z" strokeLinejoin="round" />
      <path d="M12 10v4.2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
