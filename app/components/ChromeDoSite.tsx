"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

/**
 * Menu, rodapé e botão flutuante do site.
 *
 * Existem em todas as páginas menos duas, que não fazem parte do site e não devem carregar a
 * navegação dele:
 *
 * - `/revisao`, ferramenta de trabalho entre a agência e o cliente;
 * - `/loja`, maquete da loja online usada para vender o projeto, com o próprio cabeçalho, busca
 *   e carrinho, porque é disso que a apresentação trata;
 * - `/painel-preview`, demonstração do painel administrativo, que tem barra lateral própria.
 */
export function ChromeDoSite({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/revisao") || pathname?.startsWith("/loja") || pathname?.startsWith("/painel-preview")) return <>{children}</>;
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
