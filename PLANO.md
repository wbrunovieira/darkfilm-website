# Plano de implementação

Projeto Next.js vive em `app/`. Conteúdo real é copiado do site antigo **a cada etapa**, seção por seção, nunca inventado. Fonte: `site-original/www.thedarkfilm.com.br/*.html` (texto) e `.../fotos/` (imagens), com apoio de `conteudo-extraido/*.json`.

Legenda: `[ ]` a fazer · `[~]` em andamento · `[x]` feito

## Etapa 0 — Base
- [x] `create-next-app` (App Router, TS, Tailwind v4, `app/` sem `src/`)
- [x] `motion` instalado
- [x] Repositório GitHub público: https://github.com/wbrunovieira/darkfilm-website
- [x] Design system em `app/app/globals.css`: paleta (preto/grafite + vermelho da logo), fontes Barlow Condensed + Barlow via `next/font`, utilities (`container-x`, `display`, `eyebrow`, `tint-overlay`, `grain`, `photo`), `prefers-reduced-motion`
- [x] `lib/site.ts`: dados fixos (nome, endereço, telefones, WhatsApp, redes, fundação 1992, clientes, nav)
- [x] Layout global: `Header` (logo + nav + dropdown Películas + menu mobile), `Footer`, `WhatsAppFloat`, `Reveal` (motion)
- [x] Logo: `imagens/principal/logoTDF.png` → `public/img/marca/logo.png`
- Animação: `motion/react` para reveal em scroll, stagger do hero e menu mobile; CSS puro para marquee, zoom lento e hover

## Etapa 1 — Home (`/`) — prioridade máxima, é o que vai pra reunião
Componentes (cada um copia texto/imagem do `index.html` original na hora de ser feito):
- [x] `Hero` — Kombi da The Dark Film (`destaques-…_2.jpg`) com zoom lento + claim + CTA WhatsApp
- [x] `TrustBar` — marquee: desde 1992, credenciada 3M, serviços
- [x] `Services` — 3 destaques (textos do slider original) + 4 cards (para-brisa, envelopamento, lavagem a seco, faróis)
- [x] `Seal3M` — texto da página 3M original, link para `/3m`
- [x] `Clients` — GE Celma, Tec Auto (Ford), Fundação Cultural de Petrópolis, Carl Zeiss
- [x] `GalleryPreview` — 5 fotos de `fotos/galeria-*.jpg` + link
- [x] `Novidade` — medidor de transmissão luminosa (`imgPocketDetective.jpg`, `imgTintMeter.jpg`)
- [x] `ContactCTA` — telefones, WhatsApp, endereço (reutilizável nas outras páginas)
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
