import type { Metadata } from "next";
import { PainelLoja } from "@/components/painel/Painel";

/**
 * Demonstração do painel administrativo da loja.
 *
 * Peça de apresentação: dado fixo em arquivo, sem servidor, sem banco e sem chamada de rede.
 * Serve para o lojista ver como cadastra produto e variações, mexe em preço e estoque, cria
 * promoção e acompanha pedido.
 *
 * Sem link a partir de qualquer página do site, fora do sitemap e bloqueada no robots. Só chega
 * quem receber o endereço.
 */
export const metadata: Metadata = {
  title: "Painel da loja, demonstração",
  robots: { index: false, follow: false, nocache: true },
};

export default function PainelPreviewPage() {
  return <PainelLoja />;
}
