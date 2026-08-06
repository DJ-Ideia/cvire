import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { extractPdfText } from './verify-pdf-text.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'tmp', 'pdf-cut');
const baseUrl = process.env.CVIRE_URL || 'http://127.0.0.1:5173';

async function waitForApp(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.getByText('Initializing cvire local database...').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForSelector('text=Senior Frontend Engineer', { timeout: 30000 });
}

async function openDemoEditor(page) {
  await page.getByText('Senior Frontend Engineer (US Remote)').first().click();
  await page.waitForSelector('.a4-paper', { timeout: 30000 });
  await page.waitForTimeout(500);
}

async function exportPdf(page, filename) {
  const downloadPromise = page.waitForEvent('download', { timeout: 120000 });
  const exportBtn = page.getByRole('button', { name: /Export PDF|Exportar PDF/i });
  await exportBtn.click();
  const download = await downloadPromise;
  const target = path.join(outDir, filename);
  await download.saveAs(target);
  return target;
}

async function padMainColumn(page) {
  await page.evaluate(() => {
    const main = document.querySelector('.a4-paper .grid > .col-span-2');
    if (!main) throw new Error('ModernTech main column not found');
    for (let i = 0; i < 40; i += 1) {
      const p = document.createElement('p');
      p.className = 'text-sm leading-relaxed';
      p.textContent = `Main column filler ${i} for multi-page PDF cut verification with enough vertical length.`;
      main.appendChild(p);
    }
  });
  await page.waitForTimeout(400);
}

function assertPhraseOnSinglePage(extracted, phrase) {
  const pagesWithPhrase = extracted.pages
    .map((text, idx) => ({ idx: idx + 1, text }))
    .filter(({ text }) => text.includes(phrase));

  if (pagesWithPhrase.length === 0) {
    throw new Error(`Phrase "${phrase}" missing from PDF text layer`);
  }

  if (pagesWithPhrase.length > 1) {
    throw new Error(`Phrase "${phrase}" found on multiple pages: ${pagesWithPhrase.map((p) => p.idx).join(', ')}`);
  }

  const pageText = pagesWithPhrase[0].text;
  if (pageText.includes('Englis') && !pageText.includes('English')) {
    throw new Error('Detected sliced English token on page text');
  }
}

function assertTitleNotOrphaned(extracted, title, companions) {
  const titleRe = new RegExp(title, 'i');
  for (let i = 0; i < extracted.pages.length; i += 1) {
    const page = extracted.pages[i];
    if (!titleRe.test(page)) continue;
    const hasCompanion = companions.some((c) => page.includes(c));
    if (!hasCompanion) {
      throw new Error(
        `Orphan title "${title}" on page ${i + 1} without companions [${companions.join(', ')}]`
      );
    }
  }
}

async function selectTemplate(page, name) {
  const trigger = page.getByRole('button', { name: /Template|Modern Tech|Executive Classic|Minimalist/i }).first();
  if (await trigger.count()) {
    await trigger.click();
  } else {
    await page.getByText(/Modern Tech|Template/i).first().click();
  }
  await page.getByText(name, { exact: true }).first().click();
  await page.waitForTimeout(500);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  try {
    await waitForApp(page);
    await openDemoEditor(page);
    await padMainColumn(page);

    const modernPath = await exportPdf(page, 'modern-tech-multipage.pdf');
    const modern = await extractPdfText(modernPath);
    if (modern.numPages < 2) {
      throw new Error(`Expected multipage ModernTech PDF, got ${modern.numPages} page(s)`);
    }
    assertPhraseOnSinglePage(modern, 'English');
    assertTitleNotOrphaned(modern, 'Languages', ['English', 'Portuguese']);
    assertTitleNotOrphaned(modern, 'Work Experience', ['Senior Frontend Engineer', 'Frontend Web Developer']);
    console.log(`OK ModernTech: ${modern.numPages} pages, English intact, no orphan titles → ${modernPath}`);

    await selectTemplate(page, 'Executive Classic');
    const classicPath = await exportPdf(page, 'executive-classic-multipage.pdf');
    const classic = await extractPdfText(classicPath);
    if (classic.numPages < 1) {
      throw new Error('Executive Classic export failed');
    }
    assertPhraseOnSinglePage(classic, 'English');
    console.log(`OK Executive Classic: ${classic.numPages} pages, English intact → ${classicPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
