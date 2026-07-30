import html2pdf from 'html2pdf.js';
import type { CVProfile } from '../types/cv';

export function exportResumeToPDF(filename = 'resume.pdf'): void {
  const element = document.querySelector('.a4-paper') as HTMLElement;
  if (!element) {
    window.print();
    return;
  }

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
  };

  html2pdf().set(opt).from(element).save();
}

export function exportProfileToJSON(profile: CVProfile): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
  const anchor = document.createElement('a');
  anchor.setAttribute('href', dataStr);
  anchor.setAttribute('download', `${profile.title.toLowerCase().replace(/\s+/g, '-')}.json`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
