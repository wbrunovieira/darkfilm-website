import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Enquanto o site roda fora do domínio final (proposta em subdomínio da agência),
// bloqueia indexação para não concorrer com o site atual do cliente no Google.
const isProposal = !siteUrl.includes("thedarkfilm.com.br");

export default function robots(): MetadataRoute.Robots {
  if (isProposal) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    // As maquetes comerciais e a página de escolha do carro não são o site e não podem entrar
    // em buscador nem quando o domínio final estiver no ar. Cada uma traz noindex na própria
    // página também.
    rules: { userAgent: "*", allow: "/", disallow: ["/loja", "/painel-preview", "/carro"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
