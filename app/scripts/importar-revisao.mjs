/**
 * Registra no painel os pedidos que chegam FORA dele — na prática, pelo WhatsApp.
 *
 * **Isto não é uma migração de uma vez só; é o caminho normal.** Não dá para obrigar o cliente a
 * documentar tudo na página: o WhatsApp é o canal dele, e exigir outro seria trocar um atrito por
 * outro. O combinado é que ele mande por onde preferir, a gente transcreva aqui com a data e a
 * origem corretas, implemente, registre o "já ajustei" — e ele só aprove.
 *
 * Existe por dois motivos:
 *
 * 1. **O cliente não pode ser obrigado a reescrever o que já escreveu.** Fazer ele digitar de
 *    novo na ferramenta seria pedir trabalho para consertar um problema nosso.
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

import { AwsClient } from "aws4fetch";
import { readFileSync } from "node:fs";

const PASTA = "revisao/eventos/";
const CONSOLIDADO = "revisao/registro.json";

/**
 * Grava no Cloudflare R2, mesmo destino da aplicação.
 *
 * Antes escrevia no Vercel Blob. O registro migrou em 16/09/2026, depois de a cota gratuita do
 * Blob estourar e suspender os armazenamentos da conta inteira; este script ficou para trás e
 * quebrou na primeira vez que foi usado depois da migração.
 */
const r2 = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  service: "s3",
  region: "auto",
});
const alvo = (chave) => `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${chave}`;

async function r2Gravar(chave, texto) {
  const corpo = new TextEncoder().encode(texto);
  // O R2 recusa PUT sem content-length e devolve 411.
  const r = await r2.fetch(alvo(chave), {
    method: "PUT",
    body: corpo,
    headers: { "content-type": "application/json", "content-length": String(corpo.byteLength) },
  });
  if (!r.ok) throw new Error(`R2 PUT ${chave}: ${r.status} ${await r.text()}`);
}

async function r2Ler(chave) {
  const r = await r2.fetch(alvo(chave), { method: "GET" });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`R2 GET ${chave}: ${r.status}`);
  return r.text();
}
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
  await r2Gravar(`${PASTA}${id}.json`, JSON.stringify(evento));

  // Atualiza o consolidado, que é o que a página lê. Sem isto o evento existiria só no arquivo
  // individual e não apareceria na tela.
  const cru = await r2Ler(CONSOLIDADO);
  const todos = cru ? JSON.parse(cru) : [];
  todos.push(evento);
  todos.sort((a, b) => (a.em === b.em ? a.id.localeCompare(b.id) : a.em.localeCompare(b.em)));
  await r2Gravar(CONSOLIDADO, JSON.stringify(todos));

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
  // Apagar o registro inteiro deixou de existir aqui.
  //
  // Existia como atalho de desenvolvimento, de quando o registro estava vazio e recomeçar era
  // barato. Hoje ele guarda o histórico de aprovação do cliente, e um `--zerar` disparado por
  // engano apagaria meses de conversa sem nada para desfazer. Quem precisar mesmo limpar que
  // escreva um script para a ocasião, olhando o que vai apagar.
  console.error("--zerar foi removido: apagaria o histórico inteiro sem confirmação.");
  process.exit(1);
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
