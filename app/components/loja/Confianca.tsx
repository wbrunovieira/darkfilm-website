"use client";

/**
 * Faixa de confiança e formas de pagamento — o bloco que toda loja moderna tem logo abaixo da
 * vitrine, porque é o que responde as três dúvidas de quem nunca comprou ali: chega na minha
 * casa? é seguro? em quantas vezes?
 *
 * **As marcas de pagamento são desenhadas de forma genérica, não são os logos oficiais.** Numa
 * maquete, logo de bandeira mal reproduzido chama mais atenção pelo erro do que pela função, e
 * não vale usar marca de terceiro sem necessidade. Quando a loja for real, entram os selos que a
 * adquirente fornece.
 *
 * Prazo, valor de frete e número de parcelas ficaram sem número de propósito: isso é acordo dele
 * com a transportadora e com a adquirente, não nossa promessa.
 */

const PAGAMENTOS = [
  { nome: "Pix", glifo: "pix" },
  { nome: "Crédito", glifo: "cartao" },
  { nome: "Débito", glifo: "cartao" },
  { nome: "Boleto", glifo: "boleto" },
] as const;

export function Confianca() {
  return (
    <section className="mt-10 rounded-xl border border-line loja-vidro p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <Bloco
          icone={<CaminhaoIcon />}
          titulo="Entrega para todo o Brasil"
          texto="Enviamos para qualquer endereço do país. Em Petrópolis, dá para retirar na loja."
        />
        <Bloco
          icone={<CadeadoIcon />}
          titulo="Pagamento seguro"
          texto="Os dados do cartão vão direto para a operadora, em conexão criptografada. A loja não guarda o número."
        />
        <Bloco
          icone={<TrocaIcon />}
          titulo="Troca garantida"
          texto="Direito de arrependimento em 7 dias, como manda o Código de Defesa do Consumidor."
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-6">
        <p className="font-display text-xs uppercase tracking-[0.18em] text-fg-3">Formas de pagamento</p>
        <ul className="flex flex-wrap items-center gap-2">
          {PAGAMENTOS.map((p) => (
            <li
              key={p.nome}
              className="flex h-10 items-center gap-2 rounded-md border border-line bg-bg-3 px-3"
              title={p.nome}
            >
              <Bandeira glifo={p.glifo} />
              <span className="text-xs font-semibold text-fg-2">{p.nome}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-fg-3">
          Parcelamento e prazo de entrega a definir com a loja.
        </p>
      </div>
    </section>
  );
}

function Bloco({ icone, titulo, texto }: { icone: React.ReactNode; titulo: string; texto: string }) {
  return (
    <div className="flex gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-bg-3 text-red-2">
        {icone}
      </span>
      <div>
        <p className="font-display text-base font-semibold uppercase leading-tight">{titulo}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{texto}</p>
      </div>
    </div>
  );
}

/** Marcas genéricas, de propósito — ver o comentário do topo. */
function Bandeira({ glifo }: { glifo: string }) {
  if (glifo === "pix")
    return (
      <svg viewBox="0 0 24 24" className="size-5 text-fg-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Z" strokeLinejoin="round" />
      </svg>
    );
  if (glifo === "boleto")
    return (
      <svg viewBox="0 0 24 24" className="size-5 text-fg-3" fill="currentColor" aria-hidden>
        <rect x="3" y="5" width="1.6" height="14" />
        <rect x="6" y="5" width="1" height="14" />
        <rect x="8.5" y="5" width="2" height="14" />
        <rect x="12" y="5" width="1" height="14" />
        <rect x="14.5" y="5" width="1.8" height="14" />
        <rect x="18" y="5" width="1" height="14" />
        <rect x="20.4" y="5" width="1.6" height="14" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-fg-3" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 10h19" />
    </svg>
  );
}

function CaminhaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M2.5 6.5h11v9h-11z" strokeLinejoin="round" />
      <path d="M13.5 10h4l3 3v2.5h-7z" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </svg>
  );
}

function CadeadoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 1 1 8 0V10" strokeLinecap="round" />
      <circle cx="12" cy="15.2" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TrocaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6" strokeLinecap="round" />
      <path d="M17 2.6v4.2h-4.2M7 21.4v-4.2h4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
