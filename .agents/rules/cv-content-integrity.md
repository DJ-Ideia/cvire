# CV Content Integrity (zero hallucination)

> **Quem lê:** agente analisando, adaptando ou traduzindo currículo no cvire.
> **Pergunta que responde:** o que nunca pode ser inventado ao mexer em conteúdo de CV?

## Regras hard

1. **Zero alucinação** — nunca inventar experiência, métricas, empresas, tecnologias, certificações, projetos ou conquistas. Só fatos presentes nos arquivos/JSON do candidato ou no perfil já carregado no app.
2. **ATS factual** — avaliações e recomendações seguem boas práticas ATS (keywords, estrutura de seções, impacto quantificado), sem fabricar evidências.
3. **Nomes de tecnologia** — nunca traduzir nem localizar (ex.: Python, SQL, PostgreSQL, React, TypeScript, Docker, AWS, GCP).
4. **Análise (`cv-analyzer`)** — só relatório; não reescreve bullets nem gera novo `CVProfile`.
5. **Adaptação (`cv-adapter`)** — reordenação/reescrita só com fatos existentes; se a vaga pede algo ausente no CV, declarar que não pode ser adicionado.
6. **Tradução (`cv-translate`)** — mesmas chaves JSON; não alterar ids, enums, theme, URLs, tags de tech.
7. **PDF** — o PDF final sai do app (`exportService` / botão Export). Não introduzir biblioteca nova de PDF no fluxo de conteúdo.
8. **Schema** — saídas JSON devem ser `CVProfile` importáveis por `backupService.importResumesJSON` (array ou objeto com `id` + `personal`).
