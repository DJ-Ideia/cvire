# AGENTS.md — cvire

Instruções canônicas para agentes de IA (Cursor, Antigravity, Codex, DeepSeek, Claude Code, etc.).
Ferramentas com harness próprio devem ler também `CLAUDE.md` (Claude) ou `.cursor/rules/` (Cursor).

## Projeto

`cvire` é um CV builder **100% client-side**, offline-first: criação, templates A4, score ATS, match de vaga e exportação PDF. Sem backend proprietário.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + variáveis CSS
- Dexie.js (IndexedDB) + Zustand
- `@dnd-kit` (drag & drop)
- PDF: `html2canvas-pro` + `jspdf` (raster + text layer ATS); `@react-pdf/renderer` também no repo
- i18next (`en-US`, `pt-BR`)
- IA opcional: `@google/genai` (BYOK, chaves criptografadas com Web Crypto AES-GCM)

## Comandos

| Ação | Comando |
|------|---------|
| Dev | `npm run dev` → `http://127.0.0.1:5173` |
| Build (gate) | `npm run build` (`tsc -b && vite build`) |
| Lint | `npm run lint` |
| Preview | `npm run preview` |
| Teste corte PDF | `npm run test:pdf-cut` |
| Smoke PDF | `npm run smoke:pdf` (app rodando) |
| Verify PDF cut | `npm run verify:pdf-cut` (app em `CVIRE_URL` ou `5173`) |

## Invariantes

1. **Client-side / offline-first** — não introduzir dependência de servidor próprio.
2. **BYOK seguro** — chaves de API só criptografadas localmente (Web Crypto); nunca em texto puro nem em git.
3. **Tipos** — manter `src/types/cv.ts` (`CVProfile`, `CVSection`, `SectionItem`, `BulletItem`, `ThemeSettings`) coerentes com o código.
4. **Inputs isolados** — em formulários (ex. `SectionsList`), estado local em filhos (`BulletItemRow`) para o cursor não saltar.
5. **IDs únicos** — novos itens/bullets com ID único (`b-${Date.now()}-…`).
6. **Causa raiz** — sem `try/catch` vazios nem dados falsos para esconder erro.
7. **PDF multipágina** — cortes em banda Y livre global (`pdfPageCut` / `findCleanPageCut`); keep-together mínimo para não órfão de `h2` / `.resume-item-header`; não “corrigir” com offsets mágicos.
8. **Build** — antes de dar tarefa por concluída, `npm run build` (ou o teste/smoke relevante) deve passar.

## Onde está o quê

| Área | Caminho |
|------|---------|
| App / UI | `src/` |
| Tipos | `src/types/` |
| Estado | `src/store/` |
| Persistência | Dexie + serviços em `src/services/` |
| Templates | `src/components/templates/` |
| Export PDF | `src/services/exportService.ts`, `src/services/pdfPageCut.ts` |
| Regras de domínio | `.agents/rules/` |
| Skills do projeto | `.agents/skills/` |
| Specs / planos | `docs/superpowers/` |

## Regras de domínio (ler sob demanda)

- [`.agents/rules/frontend-templates.md`](.agents/rules/frontend-templates.md) — UI, A4, templates, PDF
- [`.agents/rules/state-storage.md`](.agents/rules/state-storage.md) — Zustand + Dexie
- [`.agents/rules/ats-jobmatcher.md`](.agents/rules/ats-jobmatcher.md) — ATS e job matcher

## Estilo de trabalho

- Mudanças mínimas e focadas; sem refatoração oportunista.
- Sem comentários no código salvo se o usuário pedir ou forem necessários para APIs externas.
- Respostas ao usuário em **português (pt-BR)** quando for chat com humanos.
- Não commitar nem dar push sem pedido explícito.
- Não editar `.env` / segredos.

## Harness por ferramenta

- **Qualquer agente**: este arquivo (`AGENTS.md`).
- **Claude Code**: ver também [`CLAUDE.md`](./CLAUDE.md) e opcionalmente `.claude/`.
- **Cursor**: ver `.cursor/rules/` (aponta para este guia).
- **Antigravity / skills locais**: `.agents/skills/` e `.agents/rules/`.
