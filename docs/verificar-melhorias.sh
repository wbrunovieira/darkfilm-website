#!/bin/bash
# Verifica os itens do BASELINE-E-METAS.md que nao dependem do Lighthouse.
# Rodar depois do site novo no ar e comparar com a coluna "Antes".
#
#   ./verificar-melhorias.sh                          # testa o dominio de producao
#   ./verificar-melhorias.sh https://staging.url/     # testa outro endereco
#
# Referencia (site antigo, medido em 25/08/2026) vai indicada em cada linha.

SITE="${1:-https://www.thedarkfilm.com.br}"
HOST=$(echo "$SITE" | sed -E 's#https?://##; s#/.*##')
BARE=$(echo "$HOST" | sed 's/^www\.//')

ok(){   printf "  \033[32mOK\033[0m    %s\n" "$1"; }
bad(){  printf "  \033[31mFALHA\033[0m %s\n" "$1"; }
warn(){ printf "  \033[33mAVISO\033[0m %s\n" "$1"; }
sec(){  printf "\n\033[1m%s\033[0m\n" "$1"; }

echo "Verificando: $SITE"
echo "(antes = site antigo medido em 25/08/2026)"

sec "1. HTTPS e dominio"

code=$(curl -s -o /dev/null -m 20 -w "%{http_code}" "https://$HOST/" 2>/dev/null)
[ "$code" = "200" ] && ok "HTTPS responde 200 (antes: porta 443 recusava conexao)" \
                    || bad "HTTPS nao responde (codigo: ${code:-erro})"

redir=$(curl -s -o /dev/null -m 20 -w "%{redirect_url}" "http://$HOST/" 2>/dev/null)
case "$redir" in
  https://*) ok "HTTP redireciona pra HTTPS (antes: nao redirecionava)" ;;
  *)         bad "HTTP nao redireciona pra HTTPS" ;;
esac

if dig +short "$BARE" A 2>/dev/null | grep -qE '[0-9]'; then
  ok "Dominio sem www resolve (antes: nao resolvia, erro de conexao)"
else
  bad "Dominio sem www AINDA nao resolve"
fi

sec "2. Arquivos de SEO"

for f in robots.txt sitemap.xml; do
  c=$(curl -s -o /dev/null -m 15 -w "%{http_code}" "$SITE/$f")
  [ "$c" = "200" ] && ok "/$f presente (antes: 404)" || bad "/$f retorna $c (antes: 404)"
done

c404=$(curl -s -o /dev/null -m 15 -w "%{http_code}" "$SITE/pagina-que-nao-existe-xyz-123")
[ "$c404" = "404" ] && ok "URL invalida retorna 404 (antes: retornava 200 com a home)" \
                    || bad "URL invalida retorna $c404 (deveria ser 404)"

sec "3. Seguranca"

hdrs=$(curl -sI -m 20 "$SITE/" 2>/dev/null)
echo "$hdrs" | grep -qi "strict-transport-security" && ok "HSTS configurado (antes: ausente)" || warn "HSTS ausente"
echo "$hdrs" | grep -qi "x-content-type-options"    && ok "X-Content-Type-Options (antes: ausente)" || warn "X-Content-Type-Options ausente"
echo "$hdrs" | grep -qi "content-security-policy"   && ok "CSP configurado (antes: ausente)" || warn "CSP ausente"

if echo "$hdrs" | grep -qiE "x-powered-by|php/5"; then
  bad "Versao do servidor exposta (antes: X-Powered-By: PHP/5.3.6)"
else
  ok "Versao do servidor nao exposta (antes: expunha PHP 5.3.6)"
fi

adm=$(curl -s -o /dev/null -m 15 -w "%{http_code}" "$SITE/admin/")
[ "$adm" = "200" ] && bad "/admin acessivel publicamente (antes: aberto, HTTP 200)" \
                   || ok "/admin nao esta publico (codigo $adm, antes: 200 aberto)"

sec "4. Conteudo da home"

html=$(curl -s -m 25 "$SITE/")

echo "$html" | grep -qi 'name="viewport"'         && ok "meta viewport (antes: ausente nas 57 paginas)"   || bad "meta viewport ausente"
echo "$html" | grep -qiE '<html[^>]+lang='        && ok "atributo lang (antes: ausente)"                  || bad "atributo lang ausente"

desc=$(echo "$html" | grep -oiE '<meta[^>]*name="description"[^>]*content="[^"]+"' | head -1)
[ -n "$desc" ] && ok "meta description preenchida (antes: vazia nas 57 paginas)" || bad "meta description vazia ou ausente"

echo "$html" | grep -qi 'property="og:image"'     && ok "Open Graph og:image (antes: nenhuma tag og)"      || bad "Open Graph ausente"
echo "$html" | grep -qi 'application/ld+json'     && ok "Dados estruturados schema.org (antes: nenhum)"    || bad "schema.org ausente"
echo "$html" | grep -qiE 'rel="(shortcut )?icon"' && ok "Favicon (antes: ausente)"                          || warn "Favicon ausente"
echo "$html" | grep -qi 'rel="canonical"'         && ok "Tag canonical (antes: ausente)"                    || warn "canonical ausente"

if echo "$html" | grep -qiE 'G-[A-Z0-9]{8,}|gtag/js'; then
  ok "Google Analytics 4 ativo (antes: UA morto desde jul/2023)"
elif echo "$html" | grep -qi "UA-"; then
  bad "AINDA usa Universal Analytics (desativado pelo Google em 2023)"
else
  bad "Nenhum analytics encontrado"
fi

sec "5. Conversao (o buraco mais caro do site antigo)"

n_tel=$(echo "$html" | grep -oc 'href="tel:' || true)
n_wpp=$(echo "$html" | grep -ocE 'wa\.me|api\.whatsapp' || true)
n_mail=$(echo "$html" | grep -oc 'href="mailto:' || true)

[ "${n_tel:-0}" -gt 0 ]  && ok "Telefone clicavel ($n_tel, antes: 0 em 57 paginas)"      || bad "Nenhum telefone clicavel"
[ "${n_wpp:-0}" -gt 0 ]  && ok "WhatsApp clicavel ($n_wpp, antes: 0, era so imagem)"     || bad "Nenhum link de WhatsApp"
[ "${n_mail:-0}" -gt 0 ] && ok "E-mail no site ($n_mail, antes: 0)"                      || warn "Nenhum e-mail no site"

echo "$html" | grep -qiE "insulfilm" && ok "Palavra 'insulfilm' presente (antes: 0 ocorrencias)" || bad "'insulfilm' ainda ausente"
echo "$html" | grep -qiE "petr[oó]polis" && ok "Cidade citada na home" || warn "Cidade nao citada na home"

sec "6. Imagens sem descricao (alt)"

python3 - "$SITE" <<'PY' 2>/dev/null || warn "python3 indisponivel, pulando"
import sys,re,urllib.request
try:
    h=urllib.request.urlopen(sys.argv[1],timeout=25).read().decode('utf-8','replace')
    imgs=re.findall(r'<img[^>]*>',h)
    sem=[i for i in imgs if not re.search(r'alt="[^"]+"',i)]
    pct=100*len(sem)//len(imgs) if imgs else 0
    tag="\033[32mOK\033[0m   " if pct<10 else "\033[31mFALHA\033[0m"
    print(f"  {tag} {len(sem)} de {len(imgs)} imagens sem alt ({pct}%). Antes: 94% (870 de 923)")
except Exception as e:
    print("  erro:",e)
PY

sec "Proximo passo"
echo "  Rodar o Lighthouse (ver comandos em BASELINE-E-METAS.md) e preencher a coluna 'Depois'."
echo ""
