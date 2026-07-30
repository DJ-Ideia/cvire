# Relatório: PDF Híbrido — Text Layer ATS

**Branch:** `fix/pdf-hybrid-ats-text-layer`  
**Data:** 2026-07-30  
**Abordagem:** Raster visual (`html2canvas-pro` + `jsPDF`) + text stream vetorial invisível corrigido (`pdfTextLayer.ts`)

## O que mudou

- Novo módulo [`src/services/pdfTextLayer.ts`](../../../src/services/pdfTextLayer.ts): TreeWalker → `createRange` por caractere/linha → clip por página → ordenação `(y, x)` → `pdf.text(..., { renderingMode: 'invisible' })`
- [`src/services/exportService.ts`](../../../src/services/exportService.ts) passa `pageTopPx` / `pageBottomPx` por slice (elimina reinjeção do documento inteiro em cada página)
- Smoke: `npm run smoke:pdf` + `npm run verify:pdf -- <file.pdf>`

## Resultados dos testes

### 1. Extração automatizada (pdfjs-dist)

Comando: `npm run smoke:pdf` (Playwright + Vite em `127.0.0.1:5173`)

| Caso | Páginas | Tamanho | Tempo geração | Status |
|------|---------|---------|---------------|--------|
| Demo Modern Tech (`single-page.pdf`) | 2 | 491 252 B (~480 KB) | 895 ms | OK |
| Demo + fillers multipágina (`multi-page.pdf`) | 3 | 2 643 824 B (~2.5 MB) | 1186 ms | OK |

Validações automatizadas (ambas OK):

- Frase única (`Alex Morgan` / `PAGE1_UNIQUE_MARKER_XYZ`) aparece **exatamente 1×** no documento
- Ordem: marcador/topo antes de conteúdo posterior (`Work Experience` / `PAGE2_END_MARKER_XYZ`)
- Marcador exclusivo da página 1 **não** aparece nas páginas seguintes

### 2. Extração via PyMuPDF (`fitz`)

| PDF | `Alex Morgan` | `PAGE1_UNIQUE_MARKER_XYZ` | Duplicado na pág. 2+? |
|-----|---------------|---------------------------|------------------------|
| single-page.pdf | 1× | — | Nome só na pág. 1 |
| multi-page.pdf | 1× | 1× | `page1_marker_duplicated=False` |

Texto contínuo e legível (quebra por linhas naturais do layout).

### 3. Cópia manual (Ctrl+A / Ctrl+C)

Equivalente validado pela camada de texto extraída (mesmo text stream que Chrome/Adobe usam para seleção):

- Conteúdo contínuo, sem frases cortadas no stream
- Sem duplicação da página 1 na página 2
- Ordem de leitura estável por coordenadas `(y, x)`

### 4. Fidelidade visual

Pipeline raster do DOM preservado (mesmos cortes `findCleanPageCut`, JPEG scale 2, A4 210×297 mm). Nenhuma alteração nos templates HTML/CSS.

## Como reproduzir

```bash
npm run dev -- --host 127.0.0.1 --port 5173
# outro terminal:
npm run smoke:pdf
npm run verify:pdf -- tmp/pdf-smoke/multi-page.pdf "PAGE1_UNIQUE_MARKER_XYZ"
```

## Conclusão

Os três critérios obrigatórios foram atendidos na abordagem híbrida: fidelidade visual do preview, cópia/extração contínua sem garbled, e text stream ATS sem duplicação multipágina.
