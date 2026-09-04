/**
 * Junta classes condicionais.
 *
 * No Stylos isto é `clsx` + `tailwind-merge`. Aqui é uma versão mínima, de propósito: a maquete
 * da loja não justifica trazer duas dependências para o bundle do site do cliente. Quando a loja
 * virar projeto próprio — copiado do Stylos, como combinado — usa-se o `cn` de lá sem alteração,
 * porque a assinatura é a mesma.
 *
 * A diferença prática: sem o `tailwind-merge`, classes conflitantes não são resolvidas (passar
 * "p-2 p-4" mantém as duas e vence a ordem do CSS). Nos componentes copiados isso não acontece.
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}
