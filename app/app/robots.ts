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
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
