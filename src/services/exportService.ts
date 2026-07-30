import html2pdf from 'html2pdf.js';

export async function exportResumeToPDF(filename = 'resume.pdf'): Promise<void> {
  const paperElement = document.querySelector('.a4-paper') as HTMLElement;
  if (!paperElement) {
    alert('Resume paper canvas not found.');
    return;
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Create an off-screen container for crisp, un-scaled PDF generation
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';

  const clone = paperElement.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.width = '794px';

  // Remove red page-break warning overlays from PDF output
  clone.querySelectorAll('.page-break-line, .page-break-label').forEach((el) => el.remove());

  container.appendChild(clone);
  document.body.appendChild(container);

  const opt = {
    margin: 0,
    filename: cleanFilename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
    },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
  };

  try {
    await html2pdf().set(opt).from(clone).save();
  } catch (err) {
    console.error('PDF export error:', err);
    alert('Export error occurred. Opening print view.');
    window.print();
  } finally {
    // ALWAYS remove container to prevent UI freezing
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
