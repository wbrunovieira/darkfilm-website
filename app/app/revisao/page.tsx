import type { Metadata } from "next";
import { PainelRevisao } from "@/components/revisao/PainelRevisao";
import { lerEventos, reduzir, type Evento } from "@/lib/revisao";

export const metadata: Metadata = {
  title: "Revisão do site — The Dark Film",
  // Ferramenta de trabalho, não página do site: fora do Google em qualquer cenário.
  robots: { index: false, follow: false, nocache: true },
};

// O registro muda a cada clique; nada aqui pode vir de cache.
export const dynamic = "force-dynamic";

export default async function RevisaoPage() {
  let eventos: Evento[] = [];
  try {
    eventos = await lerEventos();
  } catch (e) {
    // Sem o registro a página ainda serve para abrir e conferir as páginas do site.
    console.error("[revisao] não foi possível ler o registro", e);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <PainelRevisao eventosIniciais={eventos} situacoesIniciais={reduzir(eventos)} />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500 sm:px-6">
          {/* LGPD: IP é dado pessoal. O aviso vem antes de qualquer registro, não depois. */}
          <p className="font-medium text-slate-700">Sobre o registro desta revisão</p>
          <p className="mt-2 max-w-3xl leading-relaxed">
            Cada aprovação e cada pedido de alteração fica gravado com a data, a hora, o nome
            selecionado em &ldquo;quem está revisando&rdquo; e o endereço de IP de onde partiu o
            clique. Serve para que, na entrega, esteja documentado o que foi revisado e aprovado —
            e para substituir a busca no histórico do WhatsApp. Nada é apagado e nada é usado para
            outra finalidade.
          </p>
          <p className="mt-4 text-slate-400">
            The Dark Film &amp; Sound · versão de proposta, ainda não publicada no endereço
            definitivo.
          </p>
        </div>
      </footer>
    </div>
  );
}
