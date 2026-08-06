import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { findSafeCutY, type YInterval } from './pdfPageCut';

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

function elementToYInterval(
  el: HTMLElement,
  paperRect: DOMRect,
  scale: number
): YInterval {
  const rect = el.getBoundingClientRect();
  return {
    top: Math.round((rect.top - paperRect.top) * scale),
    bottom: Math.round((rect.bottom - paperRect.top) * scale),
  };
}

function firstFollowingContent(root: HTMLElement, after: HTMLElement): HTMLElement | null {
  const candidates = Array.from(
    root.querySelectorAll('p, li, .resume-item-header, h3')
  ) as HTMLElement[];

  for (const candidate of candidates) {
    if (after.contains(candidate)) {
      continue;
    }
    if (
      after.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING
    ) {
      return candidate;
    }
  }
  return null;
}

function collectKeepBands(
  clone: HTMLElement,
  paperRect: DOMRect,
  scale: number
): YInterval[] {
  const bands: YInterval[] = [];

  const headers = Array.from(
    clone.querySelectorAll('.resume-item-header')
  ) as HTMLElement[];

  for (const header of headers) {
    const item = (header.closest('.resume-item') as HTMLElement | null) || header.parentElement;
    if (!item) {
      continue;
    }
    const follow = firstFollowingContent(item, header);
    const headerInterval = elementToYInterval(header, paperRect, scale);
    if (follow) {
      const followInterval = elementToYInterval(follow, paperRect, scale);
      bands.push({
        top: headerInterval.top,
        bottom: Math.max(headerInterval.bottom, followInterval.bottom),
      });
    } else {
      bands.push(headerInterval);
    }
  }

  const sectionTitles = Array.from(
    clone.querySelectorAll('.resume-section h2')
  ) as HTMLElement[];

  for (const title of sectionTitles) {
    const section = title.closest('.resume-section') as HTMLElement | null;
    if (!section) {
      continue;
    }
    const follow = firstFollowingContent(section, title);
    const titleInterval = elementToYInterval(title, paperRect, scale);
    if (!follow) {
      bands.push(titleInterval);
      continue;
    }

    let bandBottom = elementToYInterval(follow, paperRect, scale).bottom;
    if (follow.classList.contains('resume-item-header')) {
      const item = follow.closest('.resume-item') as HTMLElement | null;
      if (item) {
        const afterHeader = firstFollowingContent(item, follow);
        if (afterHeader) {
          bandBottom = Math.max(
            bandBottom,
            elementToYInterval(afterHeader, paperRect, scale).bottom
          );
        }
      }
    }

    bands.push({
      top: titleInterval.top,
      bottom: Math.max(titleInterval.bottom, bandBottom),
    });
  }

  return bands;
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

  const paperRect = clone.getBoundingClientRect();

  if (!paperRect.height) {
    return maxSlicePx;
  }

  const scale = canvasHeightPx / clone.offsetHeight;

  const blockElements = Array.from(
    clone.querySelectorAll('h1, h2, h3, h4, p, li, tr, .resume-item-header')
  ) as HTMLElement[];

  const occupied = blockElements.map((block) =>
    elementToYInterval(block, paperRect, scale)
  );
  const keepBands = collectKeepBands(clone, paperRect, scale);

  return findSafeCutY(occupied, yOffsetPx, maxSlicePx, canvasHeightPx, keepBands);
}

interface TextLineFragment {
  text: string;
  xMm: number;
  yMm: number;
  fontSizePt: number;
  columnIndex: number; // 0 for Header/Summary/FullWidth, 1 for Main Left Column, 2 for Sidebar Right Column
}

/**
 * Extract character-level DOM Range lines for the CURRENT page slice.
 * Sorts column-by-column (Header -> Main Column -> Sidebar) for 100% ATS column reading order.
 */
function injectPageTextLayer(
  pdf: jsPDF,
  clone: HTMLElement,
  canvasWidthPx: number,
  canvasHeightPx: number,
  pageSliceTopPx: number,
  pageSliceHeightPx: number,
  pdfWidthMm: number,
  topMarginMm: number
): void {
  const paperRect = clone.getBoundingClientRect();
  if (!paperRect.width || !paperRect.height) return;

  const scale = canvasHeightPx / clone.offsetHeight;
  const mmPerCanvasPx = pdfWidthMm / canvasWidthPx;

  const lineFragments: TextLineFragment[] = [];

  // Recursive DOM Text Node Collector
  const walkTextNodes = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const fullText = node.textContent;
      if (fullText && fullText.trim().length > 0 && node.parentElement) {
        try {
          const parent = node.parentElement;
          const computed = window.getComputedStyle(parent);
          const fontSizePx = parseFloat(computed.fontSize) || 12;
          const fontSizePt = Math.max(6, Math.min(24, fontSizePx * 0.75));

          // Group character bounding rects into exact visual lines
          const lineMap = new Map<number, { text: string; leftPx: number; topPx: number }>();

          for (let i = 0; i < fullText.length; i++) {
            const char = fullText[i];
            const range = document.createRange();
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rects = Array.from(range.getClientRects());

            if (rects.length > 0) {
              const rect = rects[0];
              if (rect.width > 0 && rect.height > 0) {
                const domTopPx = (rect.top - paperRect.top) * scale;
                const domLeftPx = (rect.left - paperRect.left) * scale;

                // Bucket characters into line rows by ~4px threshold
                const lineBucketKey = Math.round(domTopPx / 5) * 5;

                if (!lineMap.has(lineBucketKey)) {
                  lineMap.set(lineBucketKey, { text: char, leftPx: domLeftPx, topPx: domTopPx });
                } else {
                  const lineObj = lineMap.get(lineBucketKey)!;
                  lineObj.text += char;
                }
              }
            }
          }

          // Convert line buckets into PDF text fragments
          lineMap.forEach((lineObj) => {
            const domTopPx = lineObj.topPx;
            const domLeftPx = lineObj.leftPx;
            const textStr = lineObj.text.trim();

            if (textStr.length > 0 && domTopPx >= pageSliceTopPx - 4 && domTopPx < pageSliceTopPx + pageSliceHeightPx - 4) {
              const relativeYCanvasPx = domTopPx - pageSliceTopPx;
              const xMm = Math.max(2, domLeftPx * mmPerCanvasPx);
              const yMm = Math.max(2, relativeYCanvasPx * mmPerCanvasPx + topMarginMm + (fontSizePt * 0.28));

              // Determine column index:
              // - Header/Summary (yMm < 55 or full width): columnIndex 0
              // - Left Main Column (xMm < 135): columnIndex 1
              // - Right Sidebar Column (xMm >= 135): columnIndex 2
              let columnIndex = 0;
              if (yMm >= 50) {
                columnIndex = xMm < 135 ? 1 : 2;
              }

              lineFragments.push({
                text: textStr,
                xMm,
                yMm,
                fontSizePt,
                columnIndex,
              });
            }
          });
        } catch {
          // Ignore range errors
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (
        el.tagName !== 'SCRIPT' &&
        el.tagName !== 'STYLE' &&
        !el.classList.contains('page-break-line') &&
        !el.classList.contains('page-break-label')
      ) {
        Array.from(node.childNodes).forEach(walkTextNodes);
      }
    }
  };

  walkTextNodes(clone);

  // Column-Aware Sorting:
  // 1. Group by Column Index (0: Header -> 1: Main Left -> 2: Sidebar Right)
  // 2. Sort top-to-bottom within each column
  lineFragments.sort((a, b) => {
    if (a.columnIndex !== b.columnIndex) {
      return a.columnIndex - b.columnIndex;
    }
    const lineDiff = Math.abs(a.yMm - b.yMm);
    if (lineDiff > 2.5) {
      return a.yMm - b.yMm;
    }
    return a.xMm - b.xMm;
  });

  // Inject transparent vector text stream into PDF
  try {
    pdf.setTextColor(255, 255, 255);
  } catch {
    // Ignore
  }

  lineFragments.forEach((frag) => {
    try {
      pdf.setFontSize(frag.fontSizePt);
      pdf.text(frag.text, frag.xMm, frag.yMm, { renderingMode: 'invisible' as any });
    } catch {
      // Ignore individual character rendering glitches
    }
  });
}

export async function exportResumeToPDF(filename = 'resume.pdf'): Promise<void> {
  console.log('[PDF_EXPORT_LOG] 1. Starting exportResumeToPDF with optimized JPEG compression...');
  await document.fonts.ready;
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
    const topMarginMm = 6;
    const bottomMarginMm = 6;
    const printableHeightMm = pdfHeight - topMarginMm - bottomMarginMm;

    // Use compressed JPEG quality 0.82 to keep PDF size small (< 600KB) while maintaining pristine crispness
    const JPEG_QUALITY = 0.82;

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    const totalHeightMm = pdfWidth * (canvas.height / canvas.width);

    if (totalHeightMm <= pdfHeight) {
      console.log('[PDF_EXPORT_LOG] 5. Generating single page PDF with ATS text layer...');
      pdf.addImage(canvas.toDataURL('image/jpeg', JPEG_QUALITY), 'JPEG', 0, 0, pdfWidth, totalHeightMm, undefined, 'FAST');
      injectPageTextLayer(pdf, clone, canvas.width, canvas.height, 0, canvas.height, pdfWidth, 0);
    } else {
      console.log('[PDF_EXPORT_LOG] 5. Generating multi-page PDF with smart cuts & ATS text layer...');
      
      const maxPageSliceHeightPx = Math.round((canvas.width / pdfWidth) * printableHeightMm);
      let yOffsetPx = 0;
      let isFirstPage = true;

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

        if (!isFirstPage) {
          pdf.addPage();
        }

        pdf.addImage(
          sliceCanvas.toDataURL('image/jpeg', JPEG_QUALITY),
          'JPEG',
          0,
          topMarginMm,
          pdfWidth,
          currentSliceMm,
          undefined,
          'FAST'
        );

        // Inject ONLY the text fragments belonging to this page slice
        injectPageTextLayer(
          pdf,
          clone,
          canvas.width,
          canvas.height,
          yOffsetPx,
          currentSlicePx,
          pdfWidth,
          topMarginMm
        );

        yOffsetPx += currentSlicePx;
        isFirstPage = false;
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
