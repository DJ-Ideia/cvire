# CV Report Board (fechamento obrigatório)

## cvire contract

- **Gatilho:** ao concluir adaptar / traduzir / analisar / criar CV a partir de um anexo; **ou** intake opção **E** (metrificar / estatísticas — board é o entregável principal); ou fluxo pedido pelo usuário.
- **Regra hard:** sempre gerar o board, **salvo** o usuário pedir explicitamente para pular.
- **Modo só análise (opção E):** sem reescrita do CV; scores “depois” = baseline ou N/A; foque em gaps, estatísticas e plano de melhoria. HTML (`outputs/html/`) + MD (`outputs/md/`) + Canvas sob demanda.
- **Integridade:** `cv-content/rules/content-integrity.md` — scores e gaps sem inventar experiência.
- **Template HTML:** `cv-content/templates/report-board.html` (preencher placeholders; CSS embutido; sem CDN).
- **Artefatos atuais (gitignored — conteúdo do usuário):**
  - MD → `cv-content/outputs/md/<slug>-board.md`
  - HTML → `cv-content/outputs/html/<slug>-board.html`
  - JSON do usuário → `cv-content/outputs/json/`
  - Anexos brutos → `cv-content/inbox/`
- **Despejo (obrigatório ao regenerar):** se já existir board/artefato com o mesmo nome, arquivar antes com `./cv-content/scripts/archive-output.sh <arquivos…>` → `cv-content/outputs/dump/<stem>/<timestamp>/`.
- **Servir HTML:** `./cv-content/scripts/serve-board.sh` ou `npm run serve:cv-board`.
- **Cursor Canvas:** ao escolher Canvas, criar/atualizar `.canvas.tsx` em `~/.cursor/projects/<workspace>/canvases/` com as mesmas métricas; o MD continua em `outputs/md/`.

---

## HARD GATE — apresentação (nunca pular)

Ao finalizar a geração do board (MD + HTML prontos):

1. **Perguntar sempre** (pt-BR), em mensagem própria clara:

   > Relatório pronto. Como você quer ver agora?
   > 1. **HTML** (dashboard no browser)
   > 2. **Canvas** (painel no Cursor; MD em `outputs/md/`)

2. **Abrir imediatamente** a opção escolhida (não só linkar e esperar):
   - **HTML** → garantir `serve:cv-board` / server em `127.0.0.1:8765` e abrir com `./cv-content/scripts/open-board.sh <slug>-board.html` (WSL/Windows/Linux).
   - **Canvas** → garantir `.canvas.tsx` atualizado e apontar o link absoluto do arquivo para abrir ao lado do chat; mencionar o MD correspondente.
3. Se o usuário já tiver dito a preferência nesta conversa, abrir essa superfície **na mesma mensagem** em que confirma o board.
4. Se pedir **os dois**, abrir HTML e Canvas.
5. Não encerrar o fluxo sem a pergunta (salvo skip explícito do board inteiro).

---

# Objetivo

Produzir um painel resumido e legível (estilo dashboard) com:

1. **Score geral** (antes / depois / Δ / melhora %) + métricas detalhadas
2. Comparação **baseline** vs **resultado** + deltas por métrica
3. Prioridades de atenção
4. **Plano de melhoria** com recomendações elaboradas
5. Pontos fortes, inventário técnico, timeline

Se o fluxo for **só análise** (sem reescrita), scores “depois” podem ser iguais ao baseline ou marcados N/A; foque em gaps e ações.

---

# Score geral (obrigatório)

Calcule a média aritmética simples das métricas pontuadas (0–100), **excluindo KEYWORDS se não houver JD**.

```
OVERALL_BEFORE = média(métricas baseline)
OVERALL_AFTER  = média(métricas resultado)
OVERALL_DELTA  = OVERALL_AFTER − OVERALL_BEFORE
OVERALL_IMPROVE_PCT = se OVERALL_BEFORE > 0:
  round(((OVERALL_AFTER − OVERALL_BEFORE) / OVERALL_BEFORE) * 100)
  senão: N/A
```

Arredonde médias para inteiro (0–100). Opcional: `OVERALL_SEM_IMPACTO` só como contexto quando IMPACT cair por limpeza de % não auditáveis.

---

# Métricas (0–100)

| ID | Métrica | Critério |
|----|---------|----------|
| ATS_STRUCTURE | Estrutura ATS | seções, headings, importabilidade `CVProfile` |
| CLARITY | Clareza / qualidade | verbos, concisão, tom |
| IMPACT | Impacto mensurável | % / números / negócio reais |
| TECH_DEPTH | Profundidade técnica | stack evidenciada |
| NARRATIVE | Consistência narrativa | timeline, ownership |
| FIT | Fit / diferenciais | vs JD se houver; senão vs nível declarado |
| KEYWORDS | Keyword match | **só se houver JD**; senão omitir no HTML e na média geral |

Não invente métricas de negócio que não existam no CV.

---

# Seções obrigatórias

1. **Score geral** — antes · depois · Δ · melhora %  
2. **Scores por métrica** — barras/valores + Δ  
3. **Tabela priorizada** — Prioridade · Tema · Observação · Ação  
4. **Plano de melhoria** — 3–6 itens elaborados  
5. **Atenção prioritária / Moderada / Já ok**  
6. **Pontos fortes atuais**  
7. **Inventário técnico**  
8. **Linha do tempo**  

---

# Plano de melhoria (obrigatório — elaborado)

Para cada item (mín. 3, máx. 6): **Título**, **Prioridade**, **Por quê**, **O que fazer** (passos), **Não fazer**, **Pronto quando**, **Efeito esperado**.

No HTML, use `class="rec prio-high|prio-mid|prio-low"` conforme a prioridade.

---

# Formato MD

Incluir tabela de score geral + métricas + plano elaborado. Tom pt-BR, técnico e direto.

---

# Formato HTML

1. Se já existir `outputs/html/<slug>-board.html` ou `outputs/md/<slug>-board.md`, rodar `archive-output.sh` neles **antes** de sobrescrever.
2. Copiar `cv-content/templates/report-board.html`
3. Substituir todos os `{{PLACEHOLDERS}}`
4. Remover a linha de Keyword match se não houver JD
5. Salvar em `cv-content/outputs/html/<slug>-board.html`
6. Aplicar o **HARD GATE — apresentação**

---

# Arquivamento / gitignore

- Versões antigas → `cv-content/outputs/dump/` (ignorado pelo git)
- Currículos anexados → `cv-content/inbox/` (ignorado)
- Artefatos gerados do usuário em `outputs/{json,md,html,pdf,docx}/` (ignorados; manter só `README.md` e o modelo `modelo-curriculo-cvire-ia.json` versionados)
- Nunca commitar PII / CVs de usuário

---

# Regras

- Zero alucinação de experiência/tech/métricas.
- Gaps da vaga = “não evidenciado no CV”.
- Score geral sempre presente quando houver ≥2 métricas numéricas.
- Sempre perguntar HTML vs Canvas e abrir a escolha.
