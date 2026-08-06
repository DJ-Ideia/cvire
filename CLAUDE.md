# CLAUDE.md — cvire

Guia específico do **Claude Code**. O contrato do projeto para qualquer agente está em [`AGENTS.md`](./AGENTS.md) — leia e siga esse arquivo primeiro.

## O que vale além do AGENTS.md

- Skills e fluxos repetíveis do repo: `.agents/skills/` (brainstorming, TDD, debugging, writing-plans, harness-architect, etc.).
- Regras de área (carregar sob demanda): `.agents/rules/`.
- Regras Claude com glob (se existirem): `.claude/rules/`.
- Specs e planos: `docs/superpowers/`.

## Preferências de sessão Claude

- Preferir skills de processo do projeto quando a tarefa casar (ex.: bug → systematic-debugging; feature nova → brainstorming + writing-plans).
- Gate de aceite: `npm run build`; para PDF, `npm run test:pdf-cut` e, com app no ar, `npm run verify:pdf-cut` / `smoke:pdf`.
- Não inflar o harness: mudanças mínimas no código de produto.

## Índice rápido

| Precisa de… | Arquivo |
|-------------|---------|
| Invariantes + comandos | `AGENTS.md` |
| UI / A4 / PDF | `.agents/rules/frontend-templates.md` |
| Zustand / Dexie | `.agents/rules/state-storage.md` |
| ATS / job match | `.agents/rules/ats-jobmatcher.md` |
