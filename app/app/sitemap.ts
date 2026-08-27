import type { MetadataRoute } from "next";
import { produtos } from "@/lib/produtos";
import { siteUrl } from "@/lib/site";

const paginas = [
  "",
  "/a-empresa",
  "/linha-automotiva",
  "/linha-arquitetonica",
  "/caracteristicas-do-film",
  "/3m",
  "/som-e-acessorios",
  "/galeria",
  "/contato",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...paginas.map((p) => ({
      url: `${siteUrl}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    })),
    ...produtos.map((p) => ({
      url: `${siteUrl}/produtos/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
