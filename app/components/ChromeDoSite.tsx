"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

/**
 * Menu, rodapé e botão flutuante do site.
 *
 * Existem em todas as páginas menos `/revisao`, que é ferramenta de trabalho entre a agência e o
 * cliente — não faz parte do site e não deve carregar a navegação dele.
 */
export function ChromeDoSite({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/revisao")) return <>{children}</>;
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
