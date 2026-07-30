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

export async function exportResumeToPDF(filename = 'resume.pdf'): Promise<void> {
  console.log('[PDF_EXPORT_LOG] 1. Starting exportResumeToPDF with html2canvas-pro...');
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
    const totalHeightMm = pdfWidth * (canvas.height / canvas.width);

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    if (totalHeightMm <= pdfHeight) {
      console.log('[PDF_EXPORT_LOG] 5. Generating single page PDF...');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, totalHeightMm);
    } else {
      console.log('[PDF_EXPORT_LOG] 5. Generating multi-page PDF...');
      const pageHeightPx = Math.round((canvas.width / pdfWidth) * pdfHeight);
      let yOffset = 0;

      while (yOffset < canvas.height) {
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = Math.min(pageHeightPx, canvas.height - yOffset);

        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(canvas, 0, -yOffset);
        }

        if (yOffset > 0) {
          pdf.addPage();
        }

        pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pdfWidth, pdfHeight);
        yOffset += pageHeightPx;
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
