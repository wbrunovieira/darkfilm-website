/**
 * Junta classes condicionais.
 *
 * Versão mínima, de propósito: a maquete não justifica trazer `clsx` e `tailwind-merge` para o
 * bundle do site. A assinatura é a mesma das duas, então trocar depois é só mudar o import.
 *
 * A diferença prática: sem o `tailwind-merge`, classes conflitantes não são resolvidas (passar
 * "p-2 p-4" mantém as duas e vence a ordem do CSS). Aqui isso não acontece.
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}
