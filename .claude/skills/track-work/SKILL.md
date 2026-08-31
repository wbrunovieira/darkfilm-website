---
name: track-work
description: Rastreia todo trabalho do THe Dark Film - Website (melhorias, correções, features, débito técnico) como issues no WB Project Manager via a API, e mantém o status atualizado. Use SEMPRE ao planejar/iniciar trabalho não-trivial, ao descobrir um bug/melhoria, ao começar (→ In Progress) e ao concluir (→ Done). Também ao pedir "cria as issues", "atualiza o board".
---

# track-work — rastrear trabalho do THe Dark Film - Website como issues

Toda melhoria/correção vira issue no projeto **THe Dark Film - Website** do WB
Project Manager, com status em dia. Não rastreie trivialidades (typo, 1 linha).

## Use o CLI `pm.sh` (não remonte curl na mão)

Este diretório traz `pm.sh` — CLI fino pro board. Prefira-o a montar `curl`+`python` toda vez:

```bash
PM=.claude/skills/track-work/pm.sh
$PM find hero                   # listar por palavra no título
$PM list inprogress             # listar por status (backlog|todo|inprogress|done|canceled)
$PM get <issueId>               # mostrar 1 issue (id | status | título + descrição)
$PM done <issueId>              # atalho: status -> done  (start = -> inprogress)
$PM status <issueId> todo       # setar status por nome
$PM create "Título" --status todo --priority HIGH --desc-file /tmp/d.txt
$PM desc <issueId> --append --desc-file /tmp/nota.txt   # anexa nota sem apagar o escopo
```

Descrições longas: escreva num arquivo e passe `--desc-file` (evita aspas/escape no shell).
As constantes/statusIds abaixo já estão embutidas no script. Use os comandos crus só p/ casos
que o `pm.sh` não cobre (milestones, bulk).

## Constantes

- Base URL: `https://projects.wbdigitalsolutions.com`
- projectId: `cmth8gfvz00wdqj01gh9igfo9`  |  workspaceId: `cmge96f200001wa7ouziczg0w`
- API key: `~/.wb-project-manager-api-key` — NUNCA ecoar; ler via `$(cat ...)`.

| Status | statusId (POST/PATCH) | type (filtro GET) |
| --- | --- | --- |
| Backlog | `cmge9i3pt0005walququqw1rx` | `BACKLOG` |
| Todo | `cmge9i3pv0007walqv7is970v` | `TODO` |
| In Progress | `cmge9i3pv0009walqbwhmule6` | `IN_PROGRESS` |
| Done | `cmge9i3pw000bwalqn1glwrn4` | `DONE` |
| Canceled | `cmge9i3pw000dwalqi5qgpguo` | `CANCELED` |

Enums: `priority` = `URGENT|HIGH|MEDIUM|LOW|NO_PRIORITY` · `type` = `FEATURE|MAINTENANCE|BUG|IMPROVEMENT`

## Milestones deste projeto

Criados em 31/08/2026 a partir do `PLANO.md` (`GET /api/milestones?projectId=...` para reconferir):

| Milestone | milestoneId |
| --- | --- |
| Etapa 0 — Base e design system | `cmth8og2700whqj018cnywiez` |
| Etapa 1 — Home | `cmth8ogbl00wjqj01pawndvss` |
| Etapa 2 — A Empresa e Contato | `cmth8ogw000wlqj01wjbq55df` |
| Etapa 3 — Páginas de película | `cmth8oh7e00wnqj014n7zj7gu` |
| Etapa 4 — Galeria | `cmth8ohgb00wpqj013ou0cha9` |
| Etapa 5 — Som e Acessórios + Produtos | `cmth8ohov00wrqj01vte06tbw` |
| Etapa 6 — Qualidade e lançamento | `cmth8ohxw00wtqj014pdgz51v` |
| Infra — Domínio, DNS e e-mail | `cmth8oi7500wvqj01l4n4baw4` |
| Pendências com o cliente | `cmth8oigy00wxqj01h05iqoqe` |

## Comandos crus (o que o pm.sh não cobre)

```bash
KEY=$(cat ~/.wb-project-manager-api-key)
BASE=https://projects.wbdigitalsolutions.com

# Listar (evite duplicar) — no GET o filtro é status=<TYPE>
curl -s -H "Authorization: Bearer $KEY" "$BASE/api/issues?projectId=cmth8gfvz00wdqj01gh9igfo9"

# Criar issue — no POST/PATCH use statusId=<cuid>
curl -s -X POST "$BASE/api/issues" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"title":"...","description":"...","workspaceId":"cmge96f200001wa7ouziczg0w","projectId":"cmth8gfvz00wdqj01gh9igfo9","statusId":"cmge9i3pv0007walqv7is970v","type":"IMPROVEMENT","priority":"MEDIUM"}'

# Mudar status (In Progress / Done) — dispara SLA automático
curl -s -X PATCH "$BASE/api/issues/ISSUE_ID" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"statusId":"cmge9i3pv0009walqbwhmule6"}'

# Milestone
curl -s -X POST "$BASE/api/milestones" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"name":"...","projectId":"cmth8gfvz00wdqj01gh9igfo9","targetDate":"2026-09-30T00:00:00.000Z"}'

# Lote (até 100 issues por request; aceita milestoneId por item)
curl -s -X POST "$BASE/api/issues/bulk" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"workspaceId":"cmge96f200001wa7ouziczg0w","issues":[{"title":"...","projectId":"cmth8gfvz00wdqj01gh9igfo9","statusId":"cmge9i3pv0007walqv7is970v","milestoneId":"...","type":"FEATURE","priority":"HIGH"}]}'
```

Doc navegável: `/api/docs` (Swagger UI, botão Authorize 🔓). Spec: `/api/openapi`.

## Gotchas

- No GET o filtro é `status=<TYPE>` (ex.: `status=IN_PROGRESS`); no POST/PATCH é `statusId=<cuid>`. São diferentes.
- Datas em ISO 8601; `milestoneId`/`assigneeId` aceitam `null`. Bulk máx 100.
- Obrigatórios ao criar: `title`, `workspaceId`, `statusId`. No POST single (`/api/issues`) o
  `workspaceId` vai no CORPO (não só no bulk) — sem ele = 400 Invalid input em `workspaceId`.
  No bulk o `workspaceId` vai no envelope, não em cada item.
- Key errada → 401; não parseie o corpo do 401, confie no status.
- Não existe `/api/generate-token` — só API key. Key nova é tarefa de admin no repo do WB Project
  Manager: `openssl rand -hex 32` → setar `API_KEY` e `API_KEY_USER_ID` (obrigatório) → redeploy.
- A UI não auto-atualiza após criar via API — dar refresh para ver (bug conhecido).
- Use `curl`, não `urllib`/`requests` com UA padrão. Um WAF barra o user-agent do Python
  urllib com 403 Forbidden mesmo com a key correta (a key funciona — testado com curl → 200).
  403 nesses casos é bloqueio de UA, não permissão. Se precisar de Python, gere o corpo JSON com
  Python e faça a chamada HTTP via curl (ou sete um UA de browser).
- Mover para In Progress/Done dispara métricas de SLA automaticamente (`firstResponseAt` / `resolvedAt`).
