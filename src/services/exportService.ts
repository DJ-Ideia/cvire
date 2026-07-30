import html2pdf from 'html2pdf.js';

export function exportResumeToPDF(filename = 'resume.pdf'): void {
  const element = document.querySelector('.a4-paper') as HTMLElement;
  if (!element) {
    window.print();
    return;
  }

  // Create an un-transformed clone for crisp html2canvas PDF rendering
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.zIndex = '-9999';
  document.body.appendChild(clone);

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  const opt = {
    margin: 0,
    filename: cleanFilename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
  };

  try {
    const worker = html2pdf().set(opt).from(clone);
    worker.save().then(() => {
      clone.remove();
    }).catch((err: unknown) => {
      console.warn('html2pdf worker error, falling back to window.print():', err);
      clone.remove();
      window.print();
    });
  } catch (err) {
    console.warn('html2pdf exception, falling back to window.print():', err);
    clone.remove();
    window.print();
  }
}
