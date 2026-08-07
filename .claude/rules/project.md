---
description: Ponte para o guia canônico do cvire
---

Siga [`AGENTS.md`](../../AGENTS.md) na raiz.

Detalhes Claude: [`CLAUDE.md`](../../CLAUDE.md).

Conteúdo de CV: [`cv-content/`](../../cv-content/).

HARD GATE: se o usuário anexar/apontar um currículo, abra `cv-content/prompts/cv-intake.md` antes de qualquer trabalho; ao fechar o fluxo, use `cv-content/prompts/cv-report-board.md`. Depois do board, pergunte HTML vs Canvas e abra a escolha; ao regenerar, arquive com `cv-content/scripts/archive-output.sh`.

Regras de área:
- [content-integrity](../../cv-content/rules/content-integrity.md)
- [frontend-templates](../../.agents/rules/frontend-templates.md)
- [state-storage](../../.agents/rules/state-storage.md)
- [ats-jobmatcher](../../.agents/rules/ats-jobmatcher.md)
