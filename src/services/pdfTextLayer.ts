import type jsPDF from 'jspdf';

export type TextRun = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSizePx: number;
  fontWeight: number;
};

export type TextLayerOptions = {
  clone: HTMLElement;
  pdfWidthMm: number;
  pdfHeightMm: number;
  topMarginMm: number;
  pageTopPx: number;
  pageBottomPx: number;
};

const LINE_Y_TOLERANCE_PX = 3;

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function isSkippedAncestor(el: Element | null): boolean {
  if (!el) return true;
  return Boolean(el.closest('.page-break-line, .page-break-label, script, style, noscript'));
}

function parseFontWeight(value: string): number {
  if (value === 'bold' || value === 'bolder') return 700;
  if (value === 'normal' || value === 'lighter') return 400;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : 400;
}

export function collectTextNodes(root: HTMLElement): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent ?? '';
      if (!text.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (isSkippedAncestor(parent)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

export function measureTextRun(node: Text, rootRect: DOMRect): TextRun[] {
  const raw = node.textContent ?? '';
  if (!raw.trim()) return [];

  const parent = node.parentElement;
  if (!parent || isSkippedAncestor(parent)) return [];

  const computed = window.getComputedStyle(parent);
  const fontSizePx = parseFloat(computed.fontSize) || 12;
  const fontWeight = parseFontWeight(computed.fontWeight);

  const lines: { text: string; x: number; y: number; width: number; height: number }[] = [];

  for (let i = 0; i < raw.length; i++) {
    const range = document.createRange();
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const rects = range.getClientRects();
    if (!rects.length) continue;

    const rect = rects[0];
    if (rect.width === 0 && rect.height === 0) continue;

    const x = rect.left - rootRect.left;
    const y = rect.top - rootRect.top;
    const last = lines[lines.length - 1];

    if (last && Math.abs(last.y - y) <= LINE_Y_TOLERANCE_PX) {
      last.text += raw[i];
      last.width = Math.max(last.width, x + rect.width - last.x);
      last.height = Math.max(last.height, rect.height);
      last.y = Math.min(last.y, y);
    } else {
      lines.push({
        text: raw[i],
        x,
        y,
        width: rect.width,
        height: rect.height || fontSizePx,
      });
    }
  }

  return lines
    .map((line) => ({
      text: normalizeWhitespace(line.text),
      x: line.x,
      y: line.y,
      width: line.width,
      height: line.height,
      fontSizePx,
      fontWeight,
    }))
    .filter((run) => run.text.length > 0);
}

export function collectTextRuns(root: HTMLElement): TextRun[] {
  const rootRect = root.getBoundingClientRect();
  if (!rootRect.width || !rootRect.height) return [];

  const runs: TextRun[] = [];
  for (const node of collectTextNodes(root)) {
    runs.push(...measureTextRun(node, rootRect));
  }
  return runs;
}

export function clipRunsToPage(
  runs: TextRun[],
  pageTopPx: number,
  pageBottomPx: number
): TextRun[] {
  return runs.filter((run) => {
    const centerY = run.y + run.height / 2;
    return centerY >= pageTopPx && centerY < pageBottomPx;
  });
}

export function sortReadingOrder(runs: TextRun[]): TextRun[] {
  return [...runs].sort((a, b) => {
    if (Math.abs(a.y - b.y) <= LINE_Y_TOLERANCE_PX) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });
}

export function injectSearchableTextLayer(pdf: jsPDF, opts: TextLayerOptions): void {
  const { clone, pdfWidthMm, pdfHeightMm, topMarginMm, pageTopPx, pageBottomPx } = opts;

  if (!clone.offsetWidth || pageBottomPx <= pageTopPx) return;

  const mmPerPx = pdfWidthMm / clone.offsetWidth;
  const runs = sortReadingOrder(
    clipRunsToPage(collectTextRuns(clone), pageTopPx, pageBottomPx)
  );

  try {
    pdf.setTextColor(255, 255, 255);
  } catch {
    // ignore
  }

  for (const run of runs) {
    try {
      const xMm = Math.max(1, run.x * mmPerPx);
      const fontSizePt = Math.max(6, Math.min(28, run.fontSizePx * 0.75));
      const fontSizeMm = fontSizePt * 0.352778;
      const yMm =
        (run.y - pageTopPx) * mmPerPx + topMarginMm + fontSizeMm * 0.8;

      if (yMm < 1 || yMm > pdfHeightMm - 1) continue;

      pdf.setFont('helvetica', run.fontWeight >= 600 ? 'bold' : 'normal');
      pdf.setFontSize(fontSizePt);
      pdf.text(run.text, xMm, yMm, { renderingMode: 'invisible' });
    } catch {
      // ignore individual injection errors
    }
  }
}
