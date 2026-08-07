# CV Content Integrity (zero hallucination)

> **Quem lê:** agente analisando, adaptando ou traduzindo currículo no cvire.
> **Pergunta que responde:** o que nunca pode ser inventado ao mexer em conteúdo de CV?

## Regras hard

1. **Zero alucinação** — nunca inventar experiência, métricas, empresas, tecnologias, certificações, projetos ou conquistas. Só fatos presentes nos arquivos/JSON do candidato ou no perfil já carregado no app.
2. **ATS factual** — avaliações e recomendações seguem boas práticas ATS (keywords, estrutura de seções, impacto quantificado), sem fabricar evidências.
3. **Nomes de tecnologia** — nunca traduzir nem localizar (ex.: Python, SQL, PostgreSQL, React, TypeScript, Docker, AWS, GCP).
4. **Intake (`cv-content/prompts/cv-intake.md`)** — ao anexar currículo, perguntar o objetivo antes de qualquer trabalho.
5. **Análise (`cv-content/prompts/cv-analyzer.md`)** — só relatório; não reescreve bullets nem gera novo `CVProfile`.
6. **Adaptação (`cv-content/prompts/cv-adapter.md`)** — reordenação/reescrita só com fatos existentes; se a vaga pede algo ausente no CV, declarar que não pode ser adicionado.
7. **Tradução (`cv-content/prompts/cv-translate.md`)** — mesmas chaves JSON; não alterar ids, enums, theme, URLs, tags de tech.
8. **Board (`cv-content/prompts/cv-report-board.md`)** — ao fechar o fluxo, gerar métricas factuais (MD + HTML); sem fabricar scores de impacto inexistentes.
9. **PDF** — o PDF final sai do app (`exportService` / botão Export) e, se versionado no repo, fica em `cv-content/outputs/pdf/`. Não introduzir biblioteca nova de PDF no fluxo de conteúdo.
10. **DOCX** — artefatos Word (se existirem) em `cv-content/outputs/docx/`; não inventar gerador DOCX nesta fase.
11. **MD / HTML** — resumos em `cv-content/outputs/md/`; boards visuais em `cv-content/outputs/html/`.
12. **Schema** — saídas JSON em `cv-content/outputs/json/` devem ser `CVProfile` importáveis por `backupService.importResumesJSON` (array ou objeto com `id` + `personal`).
