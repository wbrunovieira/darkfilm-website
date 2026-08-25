# Comece aqui

Ordem sugerida pra atacar este projeto:

## 1. Entenda o que precisa ser superado (15 min)

Abra os prints em `referencias/prints-site-antigo/`. É o site atual, em 2026, do jeito que o cliente vê hoje. Repare em: textura de madeira de fundo, placas de carro espalhadas, Century Gothic, caixas com sombra, fotos em miniatura, vídeo quebrado, eventos de 2006.

Depois abra `CLAUDE.md` (raiz) por completo. Ele tem o diagnóstico técnico, o contexto do negócio e a direção de design.

## 2. Veja o conteúdo real

```bash
# páginas principais: título, texto e imagens de cada uma
cat conteudo-extraido/paginas-principais.json | python3 -m json.tool | less

# os 47 produtos
cat conteudo-extraido/produtos.json | python3 -m json.tool | less
```

Se quiser ver uma página original renderizada:

```bash
open site-original/www.thedarkfilm.com.br/index.html
```

## 3. Inventarie os assets aproveitáveis

```bash
# 580 fotos reais (385 usadas hoje nas páginas, o resto disponível no servidor), galeria e eventos
ls site-original/www.thedarkfilm.com.br/fotos/ | head -30

# assets de layout (logo, ícones)
ls site-original/www.thedarkfilm.com.br/imagens/principal/
```

A **logo** original está em `imagens/principal/logoTDF.png`. As fotos de trabalho são o maior ativo do projeto.

## 4. Crie o projeto

```bash
npx create-next-app@latest app --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

(ou a estrutura que preferir, desde que fique claro onde mora o quê)

## 5. Ordem de construção sugerida

1. Design system primeiro: cores, tipografia, espaçamento, componentes base
2. Home (é o que vai ser mostrado na reunião, tem que estar impecável)
3. A Empresa, Contato
4. Linha Automotiva, Linha Arquitetônica, Características do Film, 3M
5. Galeria e Eventos (muita imagem, precisa de lazy loading e lightbox bem-feitos)
6. Som e Acessórios + as 47 páginas de produto (rota dinâmica)

## 6. Antes de considerar pronto

- Testar em viewport de celular de verdade, não só encolhendo a janela
- Rodar `npm run build` e conferir que não tem erro
- Conferir que nenhuma foto pesada está travando o carregamento
- Conferir `prefers-reduced-motion`
- Nenhum texto inventado: tudo que está escrito veio do conteúdo real ou está marcado como pendência
