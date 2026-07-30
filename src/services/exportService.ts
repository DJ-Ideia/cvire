import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { injectSearchableTextLayer } from './pdfTextLayer';

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
      // ignore
    }

    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        walk(child);
      }
    });
  };

  walk(rootElement);
}

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

  const scale = canvasHeightPx / clone.offsetHeight;

  const blockElements = Array.from(
    clone.querySelectorAll('h1, h2, h3, h4, p, li, tr, .experience-item, .education-item')
  ) as HTMLElement[];

  let bestCutPx = targetCutY;

  for (const block of blockElements) {
    const rect = block.getBoundingClientRect();
    const blockTopPx = Math.round((rect.top - paperRect.top) * scale);
    const blockBottomPx = Math.round((rect.bottom - paperRect.top) * scale);

    if (targetCutY > blockTopPx + 8 && targetCutY < blockBottomPx - 4) {
      if (blockTopPx - yOffsetPx > maxSlicePx * 0.65) {
        bestCutPx = blockTopPx;
        break;
      }
    }
  }

  return Math.max(100, bestCutPx - yOffsetPx);
}

export async function exportResumeToPDF(filename = 'resume.pdf'): Promise<void> {
  const startedAt = performance.now();
  const paperElement = document.querySelector('.a4-paper') as HTMLElement;
  if (!paperElement) {
    alert('Resume canvas not found.');
    return;
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  const container = document.createElement('div');
  container.id = 'cvire-export-pdf-container';
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;overflow:hidden;z-index:-9999;';

  const clone = paperElement.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.width = '794px';

  clone.querySelectorAll('.page-break-line, .page-break-label').forEach((el) => el.remove());

  inlineComputedColors(clone);

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const topMarginMm = 10;
    const bottomMarginMm = 10;
    const printableHeightMm = pdfHeight - topMarginMm - bottomMarginMm;

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const totalHeightMm = pdfWidth * (canvas.height / canvas.width);
    const domScale = canvas.height / clone.offsetHeight;

    if (totalHeightMm <= pdfHeight) {
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, totalHeightMm);
      injectSearchableTextLayer(pdf, {
        clone,
        pdfWidthMm: pdfWidth,
        pdfHeightMm: pdfHeight,
        topMarginMm: 0,
        pageTopPx: 0,
        pageBottomPx: clone.offsetHeight,
      });
    } else {
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

        const pageTopPx = yOffsetPx / domScale;
        const pageBottomPx = (yOffsetPx + currentSlicePx) / domScale;

        injectSearchableTextLayer(pdf, {
          clone,
          pdfWidthMm: pdfWidth,
          pdfHeightMm: pdfHeight,
          topMarginMm,
          pageTopPx,
          pageBottomPx,
        });

        yOffsetPx += currentSlicePx;
      }
    }

    const elapsedMs = Math.round(performance.now() - startedAt);
    console.log(`[PDF_EXPORT] generated ${cleanFilename} in ${elapsedMs}ms`);
    pdf.save(cleanFilename);
  } catch (err) {
    console.error('[PDF_EXPORT] ERROR:', err);
    alert('Failed to generate PDF. Please check the browser console for details.');
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
