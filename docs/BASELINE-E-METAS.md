# Baseline do site antigo e metas do site novo

Medição do site antigo (`thedarkfilm.com.br`) feita em **25/08/2026**, antes de qualquer alteração.
Este documento é o **antes**. Quando o site novo entrar no ar, refazer cada medição e preencher a
coluna "depois" para mostrar ao cliente o ganho real, com número.

Relatório completo formatado para o cliente: [`diagnostico-site-antigo-20260825.html`](./diagnostico-site-antigo-20260825.html)

---

## Como refazer a medição (depois do site no ar)

```bash
# 1. Lighthouse mobile (o teste que importa)
lighthouse "https://www.thedarkfilm.com.br/" --form-factor=mobile --screenEmulation.mobile \
  --only-categories=performance,seo,best-practices,accessibility \
  --output=json --output-path=/tmp/lh-novo-mobile.json \
  --chrome-flags="--headless=new --no-sandbox" --quiet

# 2. Lighthouse desktop
lighthouse "https://www.thedarkfilm.com.br/" --preset=desktop \
  --only-categories=performance,seo,best-practices,accessibility \
  --output=json --output-path=/tmp/lh-novo-desktop.json \
  --chrome-flags="--headless=new --no-sandbox" --quiet

# 3. Ler os scores
node -e 'const r=require("/tmp/lh-novo-mobile.json");const c=r.categories;const m=i=>r.audits[i]&&r.audits[i].displayValue;
console.log("Perf "+Math.round(c.performance.score*100)+" | SEO "+Math.round(c.seo.score*100)+" | A11y "+Math.round(c.accessibility.score*100)+" | BP "+Math.round(c["best-practices"].score*100));
console.log("LCP "+m("largest-contentful-paint")+" | CLS "+m("cumulative-layout-shift")+" | TBT "+m("total-blocking-time")+" | FCP "+m("first-contentful-paint"));'
```

O script `verificar-melhorias.sh` (nesta pasta) roda as checagens que não são do Lighthouse.

---

## 1. Notas Lighthouse

| Métrica | Antes (25/08/26) | Meta | Depois | Status |
| --- | --- | --- | --- | --- |
| Performance (celular) | **62** | 90+ | | |
| Performance (desktop) | **72** | 95+ | | |
| SEO | **82** | 100 | | |
| Acessibilidade | **61** | 100 | | |
| Boas práticas (celular) | **62** | 100 | | |
| Boas práticas (desktop) | **68** | 100 | | |

## 2. Core Web Vitals (celular)

| Métrica | Antes | Meta Google | Depois | Status |
| --- | --- | --- | --- | --- |
| LCP (conteúdo principal) | **10,8s** | ≤ 2,5s | | |
| FCP (primeira coisa na tela) | **4,1s** | ≤ 1,8s | | |
| Speed Index | **6,0s** | ≤ 3,4s | | |
| CLS (estabilidade) | **0,043** ✅ | ≤ 0,1 | | manter |
| TBT (bloqueio) | **50ms** ✅ | ≤ 200ms | | manter |
| Peso da página | **2,8 MB** | < 1 MB | | |
| Requisições | **63** | < 40 | | |

## 3. Infraestrutura e segurança

| Item | Antes | Meta | Depois |
| --- | --- | --- | --- |
| HTTPS | ❌ porta 443 recusa conexão | ✅ com redirecionamento automático | |
| Domínio sem `www` | ❌ não resolve (sem registro DNS A) | ✅ resolve e redireciona | |
| Painel admin exposto | ❌ `/admin` aberto, HTTP 200 | ✅ protegido | |
| Página 404 | ❌ qualquer URL devolve a home (200) | ✅ 404 real | |
| Versão do servidor exposta | ❌ `X-Powered-By: PHP/5.3.6` | ✅ oculta | |
| PHP | ❌ 5.3.6 (fim de vida 2014) | ✅ stack moderna | |
| jQuery | ❌ 1.10.2 (2013) | ✅ sem jQuery | |
| Headers de segurança | ❌ nenhum | ✅ HSTS, CSP, X-Content-Type | |
| Google Maps | ❌ chave deletada, exibe erro | ✅ mapa funcionando | |

## 4. Medição e analytics

| Item | Antes | Meta | Depois |
| --- | --- | --- | --- |
| Google Analytics | ❌ UA-48251966-1 (morto desde jul/2023) | ✅ GA4 ativo | |
| Google Search Console | ❌ nunca configurado (meta tag vazia) | ✅ verificado + sitemap enviado | |
| Google Tag Manager | ❌ ausente | opcional | |
| Eventos de conversão | ❌ nenhum | ✅ clique WhatsApp, envio de formulário | |

## 5. SEO on-page

| Item | Antes | Meta | Depois |
| --- | --- | --- | --- |
| robots.txt | ❌ 404 | ✅ presente | |
| sitemap.xml | ❌ 404 | ✅ com todas as páginas | |
| Meta description | ❌ vazia nas 57 páginas | ✅ única por página | |
| Title com cidade/serviço | ❌ 0 de 57 títulos citam Petrópolis | ✅ em todas | |
| Title duplicado | ⚠️ `/3m` repete o da home | ✅ nenhum | |
| H1 | ❌ vazio nas 57 páginas | ✅ 1 por página, descritivo | |
| Imagens com descrição (alt) | ❌ 870 de 923 sem (94%) | ✅ 100% das relevantes | |
| Palavra "insulfilm" | ❌ 0 ocorrências | ✅ presente em título e conteúdo | |
| Chancela ABRAWF | ❌ enterrada num parágrafo interno | ✅ em destaque | |
| Credencial 3M | ❌ página isolada no menu | ✅ selo visível | |
| Conteúdo das 47 páginas de produto | ❌ média de 32 palavras (26 com menos de 30) | ✅ 300+ palavras cada | |
| Dados estruturados (schema.org) | ❌ nenhum | ✅ LocalBusiness + Product + AggregateRating | |
| Open Graph (prévia no WhatsApp) | ❌ nenhuma tag | ✅ og:title, og:image, og:description | |
| Favicon | ❌ ausente | ✅ presente | |
| Tag canonical | ❌ ausente | ✅ presente | |

## 6. Mobile e experiência

| Item | Antes | Meta | Depois |
| --- | --- | --- | --- |
| Meta viewport | ❌ ausente nas 57 páginas | ✅ presente | |
| Media queries no CSS | ❌ **zero** | ✅ layout responsivo real | |
| Menu no celular | ❌ sai da tela | ✅ menu adaptado | |
| Tamanho de fonte | ❌ Lighthouse acusa fonte ilegível | ✅ legível | |
| Logo no celular | ❌ cortada ao meio | ✅ inteira | |

## 7. Conversão (o buraco mais caro)

| Item | Antes | Meta | Depois |
| --- | --- | --- | --- |
| Links `tel:` clicáveis | ❌ **0** em 57 páginas | ✅ em todas | |
| Botão de WhatsApp (`wa.me`) | ❌ **0** (é só uma imagem) | ✅ botão fixo | |
| E-mail no site | ❌ **0** | ✅ presente | |
| Botões no site inteiro | ❌ 4 (só "Mais Detalhes") | ✅ CTA em cada seção | |
| Palavra "orçamento" | ❌ 1 vez em 57 páginas | ✅ CTA recorrente | |
| Horário de funcionamento | ❌ não aparece em nenhuma página | ✅ visível | |
| Formulário de contato | ⚠️ existe, mas envia sem criptografia | ✅ com HTTPS e anti-spam moderno | |
| Política de privacidade / LGPD | ❌ inexistente | ✅ presente | |

## 8. Presença local (Google Meu Negócio)

Estes itens **não dependem do site novo**, são ajustes na ficha do Google. Fazer junto com o cliente.

| Item | Antes | Meta | Depois |
| --- | --- | --- | --- |
| Nota / avaliações | ✅ **4,6 com 255** (ativo importante) | manter e crescer | |
| Nome cadastrado | ⚠️ "TheDarkFilm" (site diz "The Dark Film & Sound") | ✅ padronizado | |
| Categoria principal | ❌ "store" (genérica) | ✅ serviço de película / acessórios automotivos | |
| Bairro | ⚠️ "Valparaíso" (site diz Cel. Veiga) | ✅ padronizado | |
| Site cadastrado na ficha | ❌ endereço HTTP (leva ao aviso de insegurança) | ✅ HTTPS | |
| Avaliações exibidas no site | ❌ nenhuma | ✅ em destaque | |
| Botão "Como chegar" | ❌ ausente | ✅ presente | |

## 9. Conteúdo desatualizado

| Item | Antes | Meta | Depois |
| --- | --- | --- | --- |
| Foto mais recente do site | ❌ **09/07/2015** (11 anos) | ✅ conteúdo atual | |
| Vídeo da home | ❌ removido do YouTube, mostra "Vídeo indisponível" | ✅ removido ou substituído | |
| Página de Eventos | ❌ fotos de 2006 e 2007 | ✅ atual ou marcado como histórico | |
| Fax na página de contato | ❌ presente | ✅ removido | |
| ID de rádio Nextel | ❌ presente (serviço extinto) | ✅ removido | |
| Menu "Produtos" | ❌ link vazio (`index.html#`) | ✅ leva à listagem | |
| Link do Facebook | ⚠️ formato antigo, redireciona | ✅ atualizado | |

---

## O que já estava correto (não regredir)

Verificado e aprovado no site antigo. O site novo precisa **manter** estes pontos:

- ✅ URLs limpas e legíveis (`/linha-automotiva`), sem duplicação por variação de endereço
- ✅ Títulos únicos por página (exceto `/3m`)
- ✅ Site indexado no Google
- ✅ Compressão gzip e cache configurados
- ✅ CLS de 0,043 (estabilidade visual boa)
- ✅ Proteção anti-spam no formulário
- ✅ Instagram ativo e com link correto

---

## Dados de referência do site antigo

```
Páginas HTML de conteúdo:  57  (10 principais + 47 de produto)
Fotos no servidor:         889 arquivos (446 originais, 391 "-sm", 52 "-th")
Imagens totais no HTML:    923
Distribuição das fotos:    2013 → 275 | 2014 → 612 | 2015 → 2 | 2016-2026 → nenhuma
Google Meu Negócio:        4,6 ★ com 255 avaliações, categoria "store"
Endereço:                  R. Cel. Veiga, 1767, Petrópolis/RJ
Telefones:                 (24) 2246-4978 / (24) 2243-3449
WhatsApp:                  (24) 98816-7547
Instagram:                 @thedarkfilm
```
