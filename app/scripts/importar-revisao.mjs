/**
 * Importa para o registro de revisão pedidos que foram feitos FORA do painel — hoje, no WhatsApp.
 *
 * Existe por dois motivos:
 *
 * 1. **O cliente não pode ser obrigado a reescrever o que já escreveu.** Ele mandou tudo por
 *    WhatsApp; fazer ele digitar de novo na ferramenta seria pedir trabalho para consertar um
 *    problema nosso.
 * 2. **Isso não pode passar pela API pública da página.** A API carimba sempre o agora e o IP de
 *    quem clicou — de propósito. Se ela aceitasse data e origem arbitrárias, qualquer pessoa com
 *    a URL poderia forjar histórico, e o registro deixaria de provar qualquer coisa. Importação é
 *    ato de bastidor, feito daqui, com o token do Blob.
 *
 * O evento importado nunca finge ter vindo do painel: no lugar do IP vai `WhatsApp`, e fica
 * marcado quem transcreveu.
 *
 * Uso:
 *   node --env-file=.env.local scripts/importar-revisao.mjs \
 *     --pagina home --secao na-oficina --acao alteracao \
 *     --autor "Bruno The Dark Film" --data 2026-09-02 \
 *     --texto "Trocar a foto da oficina, está antiga."
 *
 *   node --env-file=.env.local scripts/importar-revisao.mjs --listar        # ids disponíveis
 *   node --env-file=.env.local scripts/importar-revisao.mjs --lote arq.json # vários de uma vez
 */

import { put, list } from "@vercel/blob";
import { readFileSync } from "node:fs";

const PASTA = "revisao/eventos/";
const ACOES = ["criado", "alteracao", "resposta", "ajustado", "aprovado", "desfeito", "confirmado"];
const AUTORES = ["Bruno The Dark Film", "Michele The Dark Film", "Bruno WB Digital Solutions"];

function args() {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const k = process.argv[i];
    if (!k.startsWith("--")) continue;
    const prox = process.argv[i + 1];
    a[k.slice(2)] = !prox || prox.startsWith("--") ? true : (i++, prox);
  }
  return a;
}

async function listarIds() {
  const { paginasRevisao } = await import("../content/revisao.ts").catch(() => ({}));
  if (paginasRevisao) return paginasRevisao;
  // content/revisao.ts é TypeScript; sem loader, lê como texto e extrai os ids
  const txt = readFileSync(new URL("../content/revisao.ts", import.meta.url), "utf8");
  const paginas = [];
  const rePag = /id: "([^"]+)",\s*\n\s*titulo: "([^"]+)",\s*\n\s*href: "([^"]+)"/g;
  let m;
  while ((m = rePag.exec(txt))) paginas.push({ id: m[1], titulo: m[2], href: m[3], secoes: [] });
  const blocos = txt.split(/\n  \{\n/).slice(1);
  blocos.forEach((b, i) => {
    if (!paginas[i]) return;
    for (const s of b.matchAll(/\{ id: "([^"]+)", titulo: "((?:[^"\\]|\\.)*)" \}/g)) {
      paginas[i].secoes.push({ id: s[1], titulo: s[2] });
    }
  });
  return paginas;
}

/** Data no fuso de Brasília, para o registro não deslocar o dia por causa de UTC. */
function isoDe(data) {
  if (!data || data === true) return new Date().toISOString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return new Date(`${data}T12:00:00-03:00`).toISOString();
  return new Date(data).toISOString();
}

async function gravar(e, i = 0) {
  const em = isoDe(e.data);
  const id = `${em.replace(/[:.]/g, "-")}-${String(i).padStart(2, "0")}-${Math.random().toString(36).slice(2, 8)}`;
  const evento = {
    id,
    paginaId: e.pagina,
    secaoId: e.secao ?? null,
    acao: e.acao,
    autor: e.autor,
    texto: e.texto,
    em,
    // No lugar do IP: nada disto passou pelo painel, e o registro não vai fingir que passou.
    // `whatsapp` = mensagem que o cliente mandou por lá e foi transcrita.
    // `interno`  = a nossa resposta, registrada daqui para fechar o assunto no mesmo lugar.
    ip: e.origem === "interno" ? "Registro interno" : "WhatsApp",
    userAgent:
      e.origem === "interno"
        ? `registrado por ${e.por ?? "Bruno WB Digital Solutions"}`
        : `transcrito do WhatsApp por ${e.por ?? "Bruno WB Digital Solutions"}`,
    origem: e.origem ?? "whatsapp",
  };
  if (!ACOES.includes(evento.acao)) throw new Error(`ação inválida: ${evento.acao}`);
  if (!AUTORES.includes(evento.autor)) throw new Error(`autor inválido: ${evento.autor}`);
  if (!evento.paginaId || !evento.secaoId) throw new Error("pagina e secao são obrigatórios");
  await put(`${PASTA}${id}.json`, JSON.stringify(evento), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return evento;
}

const a = args();

if (a.listar) {
  const paginas = await listarIds();
  for (const p of paginas) {
    console.log(`\n${p.id}  (${p.titulo})  ${p.href}`);
    for (const s of p.secoes) console.log(`    ${s.id}\n        ${s.titulo}`);
  }
  console.log(`\n${paginas.length} páginas`);
} else if (a.zerar) {
  const l = await list({ prefix: PASTA });
  if (l.blobs.length) {
    const { del } = await import("@vercel/blob");
    await del(l.blobs.map((b) => b.pathname));
  }
  console.log(`registro zerado (${l.blobs.length} eventos removidos)`);
} else if (a.lote) {
  const itens = JSON.parse(readFileSync(a.lote, "utf8"));
  let n = 0;
  for (const item of itens) {
    const ev = await gravar(item, n++);
    console.log(`✓ ${ev.paginaId}/${ev.secaoId} · ${ev.acao} · ${ev.em.slice(0, 10)}`);
  }
  console.log(`\n${n} eventos importados`);
} else {
  const ev = await gravar(a);
  console.log(`✓ ${ev.paginaId}/${ev.secaoId} · ${ev.acao} · ${ev.autor} · ${ev.em}`);
}
