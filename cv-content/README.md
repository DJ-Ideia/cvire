# cv-content

Pasta de **conteúdo de currículo** do cvire: prompts de orquestração, regras de integridade factual e artefatos de saída.

Isto é separado de [`.agents/skills/`](../.agents/skills/) (skills de engenharia/processo do agente).

## Estrutura

| Caminho | Função |
|---------|--------|
| [`prompts/`](./prompts/) | Intake, analisar, adaptar, traduzir, board de métricas |
| [`rules/content-integrity.md`](./rules/content-integrity.md) | Zero alucinação / ATS factual |
| [`templates/report-board.html`](./templates/report-board.html) | Esqueleto do dashboard HTML |
| [`outputs/json/`](./outputs/json/) | JSON `CVProfile` |
| [`outputs/md/`](./outputs/md/) | Resumos Markdown ATS |
| [`outputs/html/`](./outputs/html/) | Boards visuais (métricas) |
| [`outputs/pdf/`](./outputs/pdf/) | PDFs exportados pelo app |
| [`outputs/docx/`](./outputs/docx/) | Artefatos Word (reservado) |
| [`scripts/serve-board.sh`](./scripts/serve-board.sh) | Servir HTML localmente |

## Fluxo obrigatório

1. **Anexo de currículo** → sempre [`prompts/cv-intake.md`](./prompts/cv-intake.md) (perguntar o que fazer).
2. Executar o prompt escolhido (`cv-translate` / `cv-adapter` / `cv-analyzer` / novo perfil factual).
3. Grave JSON em `outputs/json/` quando gerar arquivo.
4. **Fechar** com [`prompts/cv-report-board.md`](./prompts/cv-report-board.md) → `outputs/md/<slug>-board.md` + `outputs/html/<slug>-board.html`.
5. Servir o board: `./cv-content/scripts/serve-board.sh` ou `npm run serve:cv-board`.
6. Importar JSON no app → Export PDF (`exportService`) → opcional `outputs/pdf/`.

Guia canônico do agente: [`AGENTS.md`](../AGENTS.md).
