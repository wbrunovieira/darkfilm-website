# Plano de implementação

Projeto Next.js vive em `app/`. Conteúdo real é copiado do site antigo **a cada etapa**, seção por seção, nunca inventado. Fonte: `site-original/www.thedarkfilm.com.br/*.html` (texto) e `.../fotos/` (imagens), com apoio de `conteudo-extraido/*.json`.

Legenda: `[ ]` a fazer · `[~]` em andamento · `[x]` feito

## Etapa 0 — Base
- [x] `create-next-app` (App Router, TS, Tailwind v4, `app/` sem `src/`)
- [x] `motion` instalado
- [x] Repositório GitHub público: https://github.com/wbrunovieira/darkfilm-website
- [ ] Design system em `app/app/globals.css`: paleta (preto/grafite + vermelho da logo), fontes (display + texto via `next/font`), espaçamento, `prefers-reduced-motion`
- [ ] `lib/site.ts`: dados fixos (nome, endereço, telefones, WhatsApp, redes, fundação 1992, clientes)
- [ ] Layout global: `Header` (logo + nav + menu mobile), `Footer`, `WhatsAppFloat`, transição de página
- [ ] Logo: `imagens/principal/logoTDF.png` → `public/logo.png` (avaliar recorte/limpeza)

## Etapa 1 — Home (`/`) — prioridade máxima, é o que vai pra reunião
Componentes (cada um copia texto/imagem do `index.html` original na hora de ser feito):
- [ ] `Hero` — foto grande com movimento sutil + claim + CTA WhatsApp. Fotos: `fotos/destaques-*.jpg` (3 slides antigos: Arquitetônica / Automotiva / Som)
- [ ] `TrustBar` — "desde 1992", "credenciada 3M", "Petrópolis/RJ"
- [ ] `ServicesGrid` — Película automotiva, Película arquitetônica, Som & acessórios, Envelopamento, Polimento de faróis, Lavagem a seco, Conserto de para-brisa (textos dos cards originais)
- [ ] `Seal3M` — chamada para a página 3M
- [ ] `Clients` — GE Celma, Tec Auto (Ford), Fundação Cultural de Petrópolis, Carl Zeiss
- [ ] `GalleryPreview` — 6–8 fotos de `fotos/galeria-*.jpg` + link
- [ ] `Novidade` — medidor de transmissão luminosa (`imgPocketDetective.jpg`, `imgTintMeter.jpg`)
- [ ] `ContactCTA` — telefones, WhatsApp, endereço
- Vídeo do YouTube da home original está morto → **não incluir** (pendência: cliente decide se quer vídeo novo)

## Etapa 2 — A Empresa (`/a-empresa`) e Contato (`/contato`)
- [ ] A Empresa: texto de `a-empresa.html` (1992, missão, serviços, clientes), foto `imagens/empresa/fotoTheDark.jpg`
- [ ] Contato: formulário (nome, e-mail, telefone, mensagem) → **pendência: destino do envio** (por ora action que abre WhatsApp/mailto); telefones, endereço, mapa (Google Maps embed do endereço)

## Etapa 3 — Páginas de película
- [ ] Linha Automotiva (`/linha-automotiva`) — texto de `linha-automotiva.html`
- [ ] Linha Arquitetônica (`/linha-arquitetonica`) — texto de `linha-arquitetonica.html`
- [ ] Características do Film (`/caracteristicas-do-film`) — conteúdo técnico de `caracteristicas-film.html`
- [ ] 3M (`/3m`) — maior texto do site, tratado como página de autoridade

## Etapa 4 — Galeria e Eventos
- [ ] Galeria (`/galeria`) — ~85 fotos de `galeria-de-fotos.html`, grid masonry, lazy load, lightbox acessível
- [ ] Eventos (`/eventos`) — álbuns de `eventos.html` (2006–2007), rotulados como **histórico**; seção pronta para álbum novo

## Etapa 5 — Som e Acessórios + Produtos
- [ ] `content/produtos.ts` gerado a partir de `produtos/*.html` (47 itens: slug, título, descrição, fotos)
- [ ] Som e Acessórios (`/som-e-acessorios`) — catálogo com filtro/busca
- [ ] Rota dinâmica `/produtos/[slug]` com `generateStaticParams`

## Etapa 6 — Qualidade
- [ ] Imagens otimizadas (`next/image`, redimensionar originais pesadas para `public/fotos`)
- [ ] Metadata por página (title, description), OpenGraph, sitemap, robots
- [ ] JSON-LD `LocalBusiness`
- [ ] Teste em celular real, `npm run build` limpo, Lighthouse
- [ ] Deploy (Vercel) com HTTPS

## Pendências para o cliente
- Destino do formulário de contato (e-mail? WhatsApp?)
- Vídeo novo para a home (o antigo está indisponível)
- Fotos novas de eventos (as atuais são de 2006–2007)
- Confirmar lista de serviços/produtos ainda ativos (catálogo é de 2013–2015)
