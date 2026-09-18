import type { Metadata } from "next";
import { EscolhaDoCarro } from "@/components/simulador/EscolhaDoCarro";

/**
 * Página de escolha do carro do simulador.
 *
 * Peça de conversa, não parte do site: existe para o cliente experimentar as duas opções e dizer
 * qual prefere. Endereço curto de propósito, para caber num WhatsApp.
 *
 * Sem link a partir de qualquer página, fora do sitemap e bloqueada no robots, como as outras
 * páginas internas. Sai do ar assim que ele decidir.
 */
export const metadata: Metadata = {
  title: "O carro do simulador, duas opções",
  robots: { index: false, follow: false, nocache: true },
};

export default function CarroPage() {
  return <EscolhaDoCarro />;
}
