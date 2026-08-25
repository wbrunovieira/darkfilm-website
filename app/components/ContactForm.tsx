"use client";

import { useState, type FormEvent } from "react";
import { site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

// Campos iguais aos do formulário original: nome, e-mail, telefone, mensagem.
// PENDÊNCIA: destino do envio. Por ora abre o WhatsApp com a mensagem preenchida.
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = [
      `Olá! Vim pelo site da ${site.shortName}.`,
      `Nome: ${data.get("nome")}`,
      `E-mail: ${data.get("email")}`,
      `Telefone: ${data.get("telefone")}`,
      "",
      String(data.get("mensagem")),
    ].join("\n");
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const field =
    "w-full rounded-md border border-line-strong bg-bg-2 px-4 py-3.5 text-fg placeholder:text-fg-3 outline-none transition-colors focus:border-red";

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-fg-2">
          Nome
          <input name="nome" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-2 text-sm text-fg-2">
          Telefone
          <input name="telefone" type="tel" required autoComplete="tel" className={field} />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-fg-2">
        E-mail
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="grid gap-2 text-sm text-fg-2">
        Mensagem
        <textarea name="mensagem" required rows={5} className={field} />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-3 rounded-full bg-red px-7 py-4 font-display text-lg font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-2"
      >
        <WhatsAppIcon className="size-5" />
        Enviar pelo WhatsApp
      </button>
      {sent && (
        <p className="text-sm text-fg-2" role="status">
          Abrimos o WhatsApp com sua mensagem. Se não abriu, chame direto em{" "}
          <a href={whatsappUrl()} className="text-fg underline">
            {site.whatsapp.label}
          </a>
          .
        </p>
      )}
    </form>
  );
}
