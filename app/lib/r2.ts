import { AwsClient } from "aws4fetch";

/**
 * Armazenamento do painel de revisão no Cloudflare R2.
 *
 * **Por que saímos do Vercel Blob.** O plano gratuito dá 2.000 operações avançadas por mês para a
 * CONTA inteira, não por projeto. O registro guardava um arquivo por evento e a leitura abria um
 * por um: com 51 eventos, cada visita à página custava 52 operações. Em 16/09/2026 a cota estourou
 * e o Vercel suspendeu os sete armazenamentos do time, derrubando as fotos do site de outra
 * cliente que não tinha nada a ver com isso.
 *
 * O R2 dá 1 milhão de operações de escrita e 10 milhões de leitura por mês, também gratuitas. Com
 * o registro num arquivo só, uma visita custa uma leitura. A diferença entre 2.000 e 10.000.000
 * é o que tira esse risco da mesa.
 *
 * **Uma diferença de comportamento que importa:** o Vercel suspende quando estoura, o R2 cobra.
 * Se algum dia um laço de repetição escapar, não haverá suspensão avisando; virá na fatura.
 *
 * É S3-compatível, e aqui usamos `aws4fetch` (5 KB) em vez do SDK da AWS (mais de 2 MB): tudo que
 * precisamos é assinar três requisições HTTP.
 */

function env(nome: string): string {
  const v = process.env[nome];
  if (!v) throw new Error(`variável de ambiente ausente: ${nome}`);
  return v;
}

let cliente: AwsClient | null = null;
function aws() {
  if (!cliente) {
    cliente = new AwsClient({
      accessKeyId: env("R2_ACCESS_KEY_ID"),
      secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
      service: "s3",
      region: "auto",
    });
  }
  return cliente;
}

/** Endereço completo de um objeto. O bucket é compartilhável, daí o prefixo por projeto. */
function url(chave: string) {
  return `${env("R2_ENDPOINT")}/${env("R2_BUCKET")}/${chave}`;
}

/** Existe credencial de R2 configurada? Serve para o código decidir sem estourar exceção. */
export function r2Configurado(): boolean {
  return Boolean(
    process.env.R2_ENDPOINT &&
      process.env.R2_BUCKET &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY,
  );
}

/** Lê um objeto. Devolve null quando não existe, para o chamador tratar sem `try` em volta. */
export async function r2Ler(chave: string): Promise<string | null> {
  const r = await aws().fetch(url(chave), { method: "GET" });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`R2 GET ${chave}: ${r.status} ${await r.text()}`);
  return r.text();
}

/**
 * Grava um objeto, sobrescrevendo.
 *
 * O corpo vai como bytes e com `content-length` explícito porque o R2 recusa PUT sem ele
 * (`411 MissingContentLength`). Passando uma string, o `fetch` do Node define o cabeçalho
 * sozinho, mas o do runtime do Next prefere `transfer-encoding: chunked` e a gravação falha.
 * Com o tamanho em mãos, funciona nos dois.
 */
export async function r2Gravar(chave: string, conteudo: string): Promise<void> {
  const corpo = new TextEncoder().encode(conteudo);
  const r = await aws().fetch(url(chave), {
    method: "PUT",
    body: corpo,
    headers: {
      "content-type": "application/json",
      "content-length": String(corpo.byteLength),
    },
  });
  if (!r.ok) throw new Error(`R2 PUT ${chave}: ${r.status} ${await r.text()}`);
}
