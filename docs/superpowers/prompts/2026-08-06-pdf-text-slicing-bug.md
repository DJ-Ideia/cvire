# Bug: texto fatiado horizontalmente no PDF (2 colunas)

Investigue e corrija o bug de fatiamento no PDF deste repositório.
Baseie-se só no código local e em evidência reproduzível.
Ignore conselhos genéricos da internet sobre html2canvas/jsPDF
(margens, offsets, “clearance”) salvo se baterem com o código abaixo.
NÃO escreva código até entregar Diagnóstico → Causa raiz → Estratégia → Riscos.

## Sintoma

Na exportação do currículo para PDF, palavras são cortadas no meio entre páginas.
Caso canônico: "English" — o pingo do "i" fica na página anterior; o resto na seguinte.
Template afetado: ModernTech (2 colunas).

## Pipeline real (ler primeiro)

1. `src/services/exportService.ts` — `exportResumeToPDF`, `findCleanPageCut`, loop de fatias do canvas
2. `src/components/templates/ModernTech/ModernTechTemplate.tsx` — grid main/sidebar
3. `src/components/templates/SectionContentRenderer.tsx` — `.resume-item-header`
4. `src/components/preview/A4PaperCanvas.tsx` — preview de quebras (não é a fonte da verdade do PDF)
5. Scripts: `scripts/smoke-pdf-export.mjs`, `scripts/verify-pdf-text.mjs`

## Fato técnico já no código

`findCleanPageCut`:

- escolhe um único `targetCutY` (corte horizontal global no canvas);
- varre blocos DOM na ordem do seletor;
- no PRIMEIRO bloco intersectado (com topo > 65% da página), move o corte para o meio do gap ou `top - 15` e dá `break`;
- seletores incluem `.experience-item` / `.education-item` que NÃO existem no DOM atual.

Isso é incompatível com layout de 2 colunas se as linhas das colunas não estiverem alinhadas: um Y “seguro” na main pode atravessar texto na sidebar (e vice-versa).

## Hipótese a validar (não assumir)

O corte “limpo” para um bloco da coluna A passa pelo meio de um bloco na coluna B na mesma Y.
Evidência mínima: na quebra que corta "English", o Y do corte coincide com gap entre itens da outra coluna.

Hipóteses secundárias (só depois de descartar/confirmar a acima):

- font bleed do html2canvas além do bounding box
- erro de mapeamento `scale = canvasHeightPx / clone.offsetHeight`

## Tarefas (nesta ordem)

1. Criticar a hipótese com o código e, se possível, com um export/repro; dizer se explica o sintoma.
2. Rankear causas por probabilidade; declarar a causa raiz com evidência (arquivo + trecho + por quê).
3. Explicar por que folgas/gap-middle/`break` no primeiro bloco não podem corrigir 2 colunas.
4. Propor a menor correção ARQUITETURAL correta (não paliativo).
   - Se o algoritmo de corte Y global for inadequado para multi-coluna, diga por quê e proponha abordagem adequada (ex.: achar banda horizontal vazia em TODAS as colunas; ou paginar/renderizar colunas de forma compatível com um único corte; ou abandonar fatia raster única se necessário).
5. Só então implementar a correção mínima e verificar com export no ModernTech (e idealmente 1 template 1-coluna para regressão).

## Proibido

- Aumentar margens / pixels extras / offsets mágicos / retry heurístico
- “Melhorar” só o gap da coluna que o loop vê primeiro
- Refatorar ATS/text-layer (`pdfTextLayer.ts` / `injectPageTextLayer`) a menos que seja necessário para o corte visual
- Assumir que linhas vermelhas do preview (`A4PaperCanvas`, 1123px) batem com os cortes do export

## Formato da resposta antes do código

- Diagnóstico
- Causa raiz (1 frase + evidência)
- Estratégia de correção
- Riscos

Depois: código + como validar.
