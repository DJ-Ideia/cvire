# CLAUDE.md — cvire

Guia específico do **Claude Code**. O contrato do projeto para qualquer agente está em [`AGENTS.md`](./AGENTS.md) — leia e siga esse arquivo primeiro.

## O que vale além do AGENTS.md

- Skills e fluxos repetíveis do repo: `.agents/skills/` (brainstorming, TDD, debugging, writing-plans, harness-architect, etc.).
- Regras de área de engenharia: `.agents/rules/`.
- Conteúdo de CV: `cv-content/` — **intake** (`cv-intake.md`) ao anexar arquivo; trabalho; **board** (`cv-report-board.md`) ao fechar; **perguntar HTML vs Canvas e abrir**; arquivar versões antigas em `outputs/dump/`; saídas do usuário são gitignored.
- Regras Claude com glob (se existirem): `.claude/rules/`.
- Specs e planos: `docs/superpowers/`.

## Preferências de sessão Claude

- Preferir skills de processo do projeto quando a tarefa casar (ex.: bug → systematic-debugging; feature nova → brainstorming + writing-plans).
- Anexo de currículo → nunca pular o intake.
- Gate de aceite: `npm run build`; para PDF, `npm run test:pdf-cut` e, com app no ar, `npm run verify:pdf-cut` / `smoke:pdf`.
- Board HTML: `npm run serve:cv-board`.
- Não inflar o harness: mudanças mínimas no código de produto.

## Índice rápido

| Precisa de… | Arquivo |
|-------------|---------|
| Invariantes + comandos | `AGENTS.md` |
| Intake (anexou CV) | `cv-content/prompts/cv-intake.md` |
| Analisar / adaptar / traduzir | `cv-content/prompts/cv-*.md` |
| Board de métricas | `cv-content/prompts/cv-report-board.md` |
| Integridade factual | `cv-content/rules/content-integrity.md` |
| Saídas JSON / MD / HTML / PDF / DOCX | `cv-content/outputs/` |
| UI / A4 / PDF (engenharia) | `.agents/rules/frontend-templates.md` |
| Zustand / Dexie | `.agents/rules/state-storage.md` |
| ATS / job match | `.agents/rules/ats-jobmatcher.md` |
