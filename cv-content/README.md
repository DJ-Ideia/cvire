# cv-content

Pasta de **conteúdo de currículo** do cvire: prompts de orquestração, regras de integridade factual e artefatos de saída.

Isto é separado de [`.agents/skills/`](../.agents/skills/) (skills de engenharia/processo do agente).

## Estrutura

| Caminho | Função |
|---------|--------|
| [`prompts/`](./prompts/) | Intake, analisar, adaptar, traduzir, board de métricas |
| [`rules/content-integrity.md`](./rules/content-integrity.md) | Zero alucinação / ATS factual |
| [`templates/report-board.html`](./templates/report-board.html) | Esqueleto do dashboard HTML |
| [`inbox/`](./inbox/) | Currículos anexados (gitignored) |
| [`outputs/json/`](./outputs/json/) | JSON `CVProfile` (gitignored, exceto modelo) |
| [`outputs/md/`](./outputs/md/) | Resumos / boards MD (gitignored) |
| [`outputs/html/`](./outputs/html/) | Boards HTML (gitignored) |
| [`outputs/dump/`](./outputs/dump/) | Versões antigas ao regenerar (gitignored) |
| [`outputs/pdf/`](./outputs/pdf/) | PDFs exportados (gitignored) |
| [`outputs/docx/`](./outputs/docx/) | Word (gitignored) |
| [`scripts/serve-board.sh`](./scripts/serve-board.sh) | Servir HTML localmente |
| [`scripts/archive-output.sh`](./scripts/archive-output.sh) | Mover artefato antigo → dump |

## Fluxo obrigatório

1. **Anexo de currículo** → sempre [`prompts/cv-intake.md`](./prompts/cv-intake.md) (perguntar o que fazer: A–E).
2. Executar o prompt escolhido (`cv-translate` / `cv-adapter` / `cv-analyzer` / `cv-report-board` na **E** / novo perfil factual).
3. Grave JSON em `outputs/json/` quando gerar arquivo.
4. **Fechar** com [`prompts/cv-report-board.md`](./prompts/cv-report-board.md) → arquivar versão antiga se existir → MD + HTML (na **E**, este passo já é o entregável).
5. **Perguntar HTML vs Canvas** e abrir a escolha imediatamente.
6. Importar JSON no app → Export PDF (`exportService`) → opcional `outputs/pdf/`.

Guia canônico do agente: [`AGENTS.md`](../AGENTS.md).
