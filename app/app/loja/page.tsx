import type { Metadata } from "next";
import Loja from "@/components/loja/Loja";

/**
 * Maquete da loja online da The Dark Film.
 *
 * Material de apresentação para vender o projeto de e-commerce — a loja não existe.
 *
 * Nasceu travada em desenvolvimento, para não vazar num deploy. A trava saiu em 04/09/2026, a
 * pedido do Bruno, para ele mandar o link ao cliente. Continua `noindex` e sem link em lugar
 * nenhum do site: só chega quem recebe o endereço.
 *
 * Fora do menu do site, fora do sitemap e fora do chrome (ver `ChromeDoSite`).
 */
export const metadata: Metadata = {
  title: "Loja — maquete",
  robots: { index: false, follow: false },
};

export default function LojaPage() {
  return <Loja />;
}
