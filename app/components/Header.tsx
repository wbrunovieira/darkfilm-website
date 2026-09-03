"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { nav, site, whatsappUrl } from "@/lib/site";
import { secaoDaRota } from "@/lib/navegacao";
import { WhatsAppIcon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /** Rótulo do submenu aberto no desktop; null quando todos estão fechados. */
  const [submenu, setSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setSubmenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!submenu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSubmenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submenu]);

  /**
   * "Atual" pela SEÇÃO, não pela URL. Antes era `pathname.startsWith(href + "/")`, que não
   * cobria as 45 páginas de produto: em `/produtos/subwoofer` nenhum item acendia. E a home,
   * que agora tem item próprio, precisa casar só por igualdade — com `href="/"` o startsWith
   * casaria com o site inteiro.
   */
  const secao = secaoDaRota(pathname);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : secao === href);
  /** O item com submenu conta como atual quando a página é um dos filhos. */
  const grupoAtivo = (filhos: { href: string }[]) => filhos.some((c) => isActive(c.href));

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* A barra tem o backdrop-blur; o painel do menu fica FORA dela, porque
          backdrop-filter cria containing block e prenderia o `fixed` do painel. */}
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-b border-line bg-bg/85 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-bg/80 to-transparent"
        }`}
      >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="Início" onClick={() => setOpen(false)} className="relative z-50 shrink-0">
          <Image
            src="/img/marca/logo.png"
            alt={site.name}
            width={412}
            height={137}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>

        {/* Liga em xl: (1280px), não em lg:. Em 1024px o logo encostava na nav com zero folga e
            "A Empresa", "Som e Acessórios" e o telefone quebravam em duas linhas — largura de iPad
            em paisagem e de notebook pequeno. Com o item "Início" seriam sete a disputar espaço. */}
        <nav aria-label="Principal" className="hidden items-center gap-0.5 xl:flex">
          {nav.map((item) =>
            "children" in item ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setSubmenu(item.label)}
                onMouseLeave={() => setSubmenu(null)}
                onBlur={(e) => {
                  // só fecha quando o foco sai do conjunto botão + lista
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setSubmenu(null);
                }}
              >
                <button
                  type="button"
                  onClick={() => setSubmenu(item.label)}
                  onFocus={() => setSubmenu(item.label)}
                  aria-expanded={submenu === item.label}
                  aria-controls={`submenu-${item.label}`}
                  data-atual={grupoAtivo(item.children)}
                  className={`nav-link flex items-center gap-1 px-2.5 py-2 font-display text-sm font-medium uppercase tracking-[0.1em] hover:text-fg ${
                    submenu === item.label || grupoAtivo(item.children) ? "text-fg" : "text-fg-2"
                  }`}
                >
                  {item.label}
                  <motion.svg
                    viewBox="0 0 12 12"
                    className="size-3 opacity-60"
                    aria-hidden
                    animate={{ rotate: submenu === item.label ? 180 : 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </motion.svg>
                  {grupoAtivo(item.children) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2.5 -bottom-0.5 h-0.5 bg-red"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {submenu === item.label && (
                    <motion.div
                      id={`submenu-${item.label}`}
                      className="absolute left-0 top-full overflow-hidden pt-2"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto", y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ul className="min-w-56 rounded-md border border-line bg-bg-2 p-2 shadow-2xl">
                        {item.children.map((c, ci) => (
                          <motion.li
                            key={c.href}
                            initial={reduce ? false : { opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: reduce ? 0 : 0.06 + ci * 0.045, duration: 0.3 }}
                          >
                            <Link
                              href={c.href}
                              onClick={() => setSubmenu(null)}
                              className={`block rounded px-3 py-2 text-sm transition-colors hover:bg-bg-3 hover:text-fg ${
                                isActive(c.href) ? "text-red-2" : "text-fg-2"
                              }`}
                            >
                              {c.label}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-atual={isActive(item.href)}
                className={`nav-link px-2.5 py-2 font-display text-sm font-medium uppercase tracking-[0.1em] hover:text-fg ${
                  isActive(item.href) ? "text-fg" : "text-fg-2"
                }`}
              >
                {item.highlight && <span aria-hidden className="nav-novo" />}
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2.5 -bottom-0.5 h-0.5 bg-red"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:border-red hover:bg-red hover:text-white md:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            {site.whatsapp.label}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative z-50 grid size-11 place-items-center xl:hidden"
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 h-0.5 w-6 bg-fg transition-transform duration-300 ${
                  open ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-6 bg-fg transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 bg-fg transition-transform duration-300 ${
                  open ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 overflow-y-auto bg-bg xl:hidden"
          >
            <nav aria-label="Menu" className="container-x py-8">
              <ul className="space-y-1">
                {nav.map((item, i) => {
                  const entries = "children" in item ? item.children : [item];
                  return (
                    <motion.li
                      key={item.label}
                      initial={reduce ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                    >
                      {"children" in item && (
                        <p className="eyebrow mt-6 mb-2">{item.label}</p>
                      )}
                      {entries.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          /* Filhos recuados e menores: o painel era uma lista plana de nove
                             itens do mesmo tamanho, separados só por um rótulo de 12px. A
                             hierarquia que o dropdown ensina no desktop sumia no celular —
                             que é onde a maioria acessa. */
                          className={`block border-b border-line font-display font-semibold uppercase ${
                            "children" in item ? "py-3 pl-4 text-2xl" : "py-4 text-3xl"
                          } ${isActive(c.href) ? "text-red-2" : "text-fg"}`}
                        >
                          {c.label}
                          {c.highlight && (
                            <span className="ml-3 rounded-full bg-red px-2 py-0.5 align-middle font-display text-xs font-semibold tracking-[0.18em] text-white">
                              Novo
                            </span>
                          )}
                        </Link>
                      ))}
                    </motion.li>
                  );
                })}
              </ul>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-3 rounded-full bg-[#25D366] py-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-[#062b16]"
              >
                <WhatsAppIcon className="size-5" /> {site.whatsapp.label}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
