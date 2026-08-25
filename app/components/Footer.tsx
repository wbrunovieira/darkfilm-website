import Image from "next/image";
import Link from "next/link";
import { nav, site, whatsappUrl, type NavLink } from "@/lib/site";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./icons";
import { GoogleBadge } from "./GoogleBadge";

const links: NavLink[] = nav.flatMap((n) => ("children" in n ? n.children : [n]));

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-bg-2">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/img/marca/logo.png" alt={site.name} width={200} height={66} className="h-14 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-2">
            Desde {site.founded} em {site.city}/{site.state}. Película de controle solar e
            segurança, envelopamento, som e acessórios, alarmes e recuperação de para-brisa.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={site.social.instagram.href} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-full border border-line-strong text-fg-2 transition-colors hover:border-red hover:text-fg">
              <InstagramIcon className="size-5" />
            </a>
            <a href={site.social.facebook.href} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid size-10 place-items-center rounded-full border border-line-strong text-fg-2 transition-colors hover:border-red hover:text-fg">
              <FacebookIcon className="size-5" />
            </a>
          </div>
          <div className="mt-5">
            <GoogleBadge />
          </div>
        </div>

        <nav aria-label="Rodapé">
          <p className="eyebrow">Navegação</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-fg-2 transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Contato</p>
          <address className="mt-4 space-y-3 text-sm not-italic text-fg-2">
            <p>
              {site.address.street}
              <br />
              {site.address.district} — {site.address.city}/{site.address.state}
            </p>
            <p className="flex flex-col gap-1">
              {site.phones.map((p) => (
                <a key={p.href} href={p.href} className="transition-colors hover:text-fg">
                  {p.label}
                </a>
              ))}
            </p>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-fg transition-colors hover:text-[#25D366]">
              <WhatsAppIcon className="size-4" /> {site.whatsapp.label}
            </a>
          </address>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p>
          <p className="font-display uppercase tracking-[0.2em]">Credenciada 3M · Petrópolis/RJ</p>
        </div>
      </div>
    </footer>
  );
}
