"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { nav, site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-bg/80 to-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="Início" className="relative z-50 shrink-0">
          <Image
            src="/img/marca/logo.png"
            alt={site.name}
            width={412}
            height={137}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            "children" in item ? (
              <div key={item.label} className="group relative">
                <button
                  className="flex items-center gap-1 px-3 py-2 font-display text-[15px] font-medium uppercase tracking-[0.12em] text-fg-2 transition-colors hover:text-fg"
                  aria-haspopup="true"
                >
                  {item.label}
                  <svg viewBox="0 0 12 12" className="size-3 opacity-60" aria-hidden>
                    <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="min-w-56 rounded-md border border-line bg-bg-2 p-2 shadow-2xl">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={`block rounded px-3 py-2 text-sm transition-colors hover:bg-bg-3 hover:text-fg ${
                            isActive(c.href) ? "text-red-2" : "text-fg-2"
                          }`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 font-display text-[15px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-fg ${
                  isActive(item.href) ? "text-fg" : "text-fg-2"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-red"
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
            className="relative z-50 grid size-11 place-items-center lg:hidden"
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

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 overflow-y-auto bg-bg lg:hidden"
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
                          className={`block border-b border-line py-4 font-display text-3xl font-semibold uppercase ${
                            isActive(c.href) ? "text-red-2" : "text-fg"
                          }`}
                        >
                          {c.label}
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
