import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Loja from "@/components/loja/Loja";

/**
 * Maquete da loja online da The Dark Film.
 *
 * Material de apresentação para vender o projeto de e-commerce — a loja não existe. Por isso
 * a página **só responde em desenvolvimento**: mesmo que alguém publique o site, ela some.
 * Para mostrar ao cliente por link, é só remover o `notFound()` abaixo e publicar de propósito.
 *
 * Fora do menu do site, fora do sitemap e fora do chrome (ver `ChromeDoSite`).
 */
export const metadata: Metadata = {
  title: "Loja — maquete",
  robots: { index: false, follow: false },
};

export default function LojaPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Loja />;
}
