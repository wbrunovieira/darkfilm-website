import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { site, siteUrl } from "@/lib/site";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: site.name,
  url: siteUrl,
  telephone: "+55-24-2246-4978",
  foundingDate: String(site.founded),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: "BR",
  },
  sameAs: [site.social.instagram.href, site.social.facebook.href],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    images: [{ url: "/img/hero/automotiva.jpg", width: 952, height: 370 }],
  },
  title: {
    default: `${site.name} — Película, Som e Acessórios em Petrópolis`,
    template: `%s · ${site.shortName}`,
  },
  description:
    "Desde 1992 em Petrópolis/RJ. Película de controle solar e segurança (automotiva e arquitetônica), envelopamento, som e acessórios, alarmes e recuperação de para-brisa. Credenciada 3M.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
