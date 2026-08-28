import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MotionProvider } from "@/components/MotionProvider";
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
  // Proposta em subdomínio da agência: não indexar (ver robots.ts).
  robots: siteUrl.includes("thedarkfilm.com.br") ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    // Card 1200x630 (proporção que WhatsApp/Facebook renderizam como preview compacto).
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Veículo com película de controle solar aplicada na oficina da The Dark Film & Sound",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
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
        <MotionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </MotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
