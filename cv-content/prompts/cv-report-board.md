# CV Report Board (fechamento obrigatório)

## cvire contract

- **Gatilho:** ao concluir adaptar / traduzir / analisar / criar CV a partir de um anexo (ou fluxo pedido pelo usuário).
- **Regra hard:** sempre gerar o board, **salvo** o usuário pedir explicitamente para pular.
- **Integridade:** `cv-content/rules/content-integrity.md` — scores e gaps sem inventar experiência.
- **Template HTML:** `cv-content/templates/report-board.html` (preencher placeholders; CSS embutido; sem CDN).
- **Artefatos:**
  - MD → `cv-content/outputs/md/<slug>-board.md`
  - HTML → `cv-content/outputs/html/<slug>-board.html`
- **Servir HTML:** `./cv-content/scripts/serve-board.sh` ou `npm run serve:cv-board`, depois abrir a URL do arquivo.
- **Cursor:** se estiver no Cursor, além dos arquivos, pode abrir um Canvas visual com as mesmas métricas; o deliverable versionável continua sendo MD+HTML.

---

# Objetivo

Produzir um painel resumido e legível (estilo dashboard) com:

1. Comparação **baseline (versão inicial/anexo)** vs **resultado do fluxo** + deltas
2. Prioridades de atenção
3. Pontos fortes, inventário técnico, timeline

Se o fluxo for **só análise** (sem reescrita), scores “depois” podem ser iguais ao baseline ou marcados N/A; foque em gaps e ações.

---

# Métricas (0–100)

Calcule com julgamento ATS factual. Informe baseline, after e delta (`+12`, `-3`, `0`).

| ID | Métrica | Critério |
|----|---------|----------|
| ATS_STRUCTURE | Estrutura ATS | seções, headings, importabilidade `CVProfile` |
| CLARITY | Clareza / qualidade | verbos, concisão, tom |
| IMPACT | Impacto mensurável | % / números / negócio reais |
| TECH_DEPTH | Profundidade técnica | stack evidenciada |
| NARRATIVE | Consistência narrativa | timeline, ownership |
| FIT | Fit / diferenciais | vs JD se houver; senão vs nível declarado |
| KEYWORDS | Keyword match | **só se houver JD**; senão omitir no HTML |

Não invente métricas de negócio que não existam no CV.

---

# Seções obrigatórias

1. **Scores** — barras/valores + Δ vs inicial  
2. **Tabela priorizada** — Prioridade (Alta/Média/Baixa) · Tema · Observação · Ação  
3. **Atenção prioritária / Moderada / Já ok**  
4. **Pontos fortes atuais**  
5. **Inventário técnico** — tags presentes; gaps conscientes em destaque (âmbar), sem fabricar skills  
6. **Linha do tempo** — Período · Papel · Duração · Status  

---

# Formato MD (`outputs/md/<slug>-board.md`)

Usar headings, tabelas GFM e listas. Incluir bloco de scores:

```markdown
| Métrica | Antes | Depois | Δ |
|---------|------:|-------:|---|
| Estrutura ATS | 62 | 78 | +16 |
…
```

Tom pt-BR (ou idioma do fluxo), técnico e direto.

---

# Formato HTML

1. Copiar `cv-content/templates/report-board.html`
2. Substituir todos os `{{PLACEHOLDERS}}`
3. Remover a linha de Keyword match se não houver JD
4. Salvar em `cv-content/outputs/html/<slug>-board.html`
5. Rodar o script de serve e informar a URL ao usuário

---

# Regras

- Zero alucinação de experiência/tech/métricas.
- Gaps da vaga = “não evidenciado no CV”, não “adicione X inventado”.
- Board útil e escaneável; evitar texto longo demais.
