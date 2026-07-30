import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

// List of CSS color properties to inline as computed rgb() values
const COLOR_PROPERTIES = [
  'color',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'fill',
  'stroke',
];

/**
 * Walk the target DOM element and inline computed CSS colors as rgb(...) or rgba(...).
 * The browser's native window.getComputedStyle() automatically resolves oklch() / hsl()
 * into standard rgb() format.
 */
function inlineComputedColors(rootElement: HTMLElement): void {
  const walk = (el: HTMLElement) => {
    try {
      const computedStyle = window.getComputedStyle(el);
      COLOR_PROPERTIES.forEach((prop) => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)') {
          el.style.setProperty(prop, value, 'important');
        }
      });
    } catch {
      // Ignore non-styleable DOM nodes
    }

    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        walk(child);
      }
    });
  };

  walk(rootElement);
}

/**
 * Find the optimal vertical cut Y coordinate so page breaks don't slice through text lines or headings.
 */
function findCleanPageCut(
  clone: HTMLElement,
  yOffsetPx: number,
  maxSlicePx: number,
  canvasHeightPx: number
): number {
  if (yOffsetPx + maxSlicePx >= canvasHeightPx) {
    return canvasHeightPx - yOffsetPx;
  }

  const targetCutY = yOffsetPx + maxSlicePx;
  const paperRect = clone.getBoundingClientRect();

  if (!paperRect.height) {
    return maxSlicePx;
  }

  // Scale factor between DOM px and 2x canvas px
  const scale = (canvasHeightPx / clone.offsetHeight);

  const blockElements = Array.from(
    clone.querySelectorAll('h1, h2, h3, h4, p, li, tr, .experience-item, .education-item')
  ) as HTMLElement[];

  let bestCutPx = targetCutY;

  for (const block of blockElements) {
    const rect = block.getBoundingClientRect();
    const blockTopPx = Math.round((rect.top - paperRect.top) * scale);
    const blockBottomPx = Math.round((rect.bottom - paperRect.top) * scale);

    // Check if page boundary cuts inside this text/block element
    if (targetCutY > blockTopPx + 8 && targetCutY < blockBottomPx - 4) {
      // If pushing to top of block leaves at least 65% of page filled, cut before block
      if (blockTopPx - yOffsetPx > maxSlicePx * 0.65) {
        bestCutPx = blockTopPx;
        break;
      }
    }
  }

  return Math.max(100, bestCutPx - yOffsetPx);
}

/**
 * Inject invisible searchable vector text into jsPDF so ATS systems (Workday, Taleo, Greenhouse)
 * and PDF readers can extract 100% of the raw text strings, titles, bullet points, and contact info.
 */
function injectSearchableTextLayer(
  pdf: jsPDF,
  clone: HTMLElement,
  pdfWidthMm: number,
  pdfHeightMm: number,
  topMarginMm: number
): void {
  const paperRect = clone.getBoundingClientRect();
  if (!paperRect.width || !paperRect.height) return;

  const mmPerPxWidth = pdfWidthMm / clone.offsetWidth;
  const mmPerPxHeight = pdfHeightMm / clone.offsetHeight;

  const textNodes: { text: string; el: HTMLElement }[] = [];

  const selectors = 'h1, h2, h3, h4, p, li, span, a';
  const elements = Array.from(clone.querySelectorAll(selectors)) as HTMLElement[];

  elements.forEach((el) => {
    const hasChildTextNode = Array.from(el.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0
    );

    if (hasChildTextNode) {
      const text = el.innerText || el.textContent;
      if (text && text.trim().length > 0) {
        textNodes.push({ text: text.trim(), el });
      }
    }
  });

  try {
    pdf.setTextColor(255, 255, 255);
  } catch {
    // Ignore
  }

  textNodes.forEach(({ text, el }) => {
    try {
      const rect = el.getBoundingClientRect();
      const relLeftPx = rect.left - paperRect.left;
      const relTopPx = rect.top - paperRect.top;

      const xMm = Math.max(2, relLeftPx * mmPerPxWidth);
      const yMm = Math.max(4, relTopPx * mmPerPxHeight + topMarginMm);

      const computedStyle = window.getComputedStyle(el);
      const fontSizePx = parseFloat(computedStyle.fontSize) || 12;
      const fontSizePt = Math.max(6, Math.min(24, fontSizePx * 0.75));

      pdf.setFontSize(fontSizePt);
      
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      lines.forEach((line, idx) => {
        const lineYMm = yMm + (idx * (fontSizePt * 0.35));
        if (lineYMm < pdfHeightMm - 2) {
          pdf.text(line, xMm, lineYMm, { renderingMode: 'invisible' as any });
        }
      });
    } catch {
      // Ignore individual text injection errors
    }
  });
}

export async function exportResumeToPDF(filename = 'resume.pdf'): Promise<void> {
  console.log('[PDF_EXPORT_LOG] 1. Starting exportResumeToPDF with smart element-aware slice math & ATS text layer...');
  const paperElement = document.querySelector('.a4-paper') as HTMLElement;
  if (!paperElement) {
    alert('Resume canvas not found.');
    return;
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Create an off-screen container for rendering
  const container = document.createElement('div');
  container.id = 'cvire-export-pdf-container';
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;overflow:hidden;z-index:-9999;';

  const clone = paperElement.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.width = '794px';

  // Remove red page-break warning overlays from PDF output
  clone.querySelectorAll('.page-break-line, .page-break-label').forEach((el) => el.remove());

  console.log('[PDF_EXPORT_LOG] 2. Inlining computed colors...');
  inlineComputedColors(clone);

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    console.log('[PDF_EXPORT_LOG] 3. Calling html2canvas-pro...');
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    console.log(`[PDF_EXPORT_LOG] 4. html2canvas-pro finished! Canvas size: ${canvas.width}x${canvas.height}`);

    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const topMarginMm = 10; // Top margin in mm
    const bottomMarginMm = 10; // Bottom margin in mm
    const printableHeightMm = pdfHeight - topMarginMm - bottomMarginMm; // 277 mm printable height

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const totalHeightMm = pdfWidth * (canvas.height / canvas.width);

    if (totalHeightMm <= pdfHeight) {
      console.log('[PDF_EXPORT_LOG] 5. Generating single page PDF with ATS text layer...');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, totalHeightMm);
      injectSearchableTextLayer(pdf, clone, pdfWidth, pdfHeight, 0);
    } else {
      console.log('[PDF_EXPORT_LOG] 5. Generating multi-page PDF with smart cuts & ATS text layer...');
      
      const maxPageSliceHeightPx = Math.round((canvas.width / pdfWidth) * printableHeightMm);
      let yOffsetPx = 0;

      while (yOffsetPx < canvas.height) {
        const currentSlicePx = findCleanPageCut(clone, yOffsetPx, maxPageSliceHeightPx, canvas.height);
        
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = currentSlicePx;

        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(canvas, 0, yOffsetPx, canvas.width, currentSlicePx, 0, 0, canvas.width, currentSlicePx);
        }

        // Calculate EXACT height in mm for this slice to NEVER distort aspect ratio
        const currentSliceMm = (currentSlicePx / canvas.width) * pdfWidth;

        if (yOffsetPx > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          sliceCanvas.toDataURL('image/jpeg', 0.98),
          'JPEG',
          0,
          topMarginMm,
          pdfWidth,
          currentSliceMm
        );

        injectSearchableTextLayer(pdf, clone, pdfWidth, pdfHeight, topMarginMm);

        yOffsetPx += currentSlicePx;
      }
    }

    console.log('[PDF_EXPORT_LOG] 6. Triggering pdf.save()...');
    pdf.save(cleanFilename);
    console.log('[PDF_EXPORT_LOG] 7. pdf.save() completed successfully!');
  } catch (err) {
    console.error('[PDF_EXPORT_LOG] ERROR:', err);
    alert('Failed to generate PDF. Please check the browser console for details.');
  } finally {
    console.log('[PDF_EXPORT_LOG] 8. Running finally container cleanup...');
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
