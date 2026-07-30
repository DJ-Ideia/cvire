import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { verifyPdfText } from './verify-pdf-text.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'tmp', 'pdf-smoke');
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

async function padForMultipage(page) {
  await page.evaluate(() => {
    const paper = document.querySelector('.a4-paper');
    if (!paper) throw new Error('.a4-paper not found');

    const top = document.createElement('p');
    top.dataset.pdfMarker = 'page1';
    top.textContent = 'PAGE1_UNIQUE_MARKER_XYZ';
    paper.insertBefore(top, paper.firstChild);

    for (let i = 0; i < 90; i += 1) {
      const p = document.createElement('p');
      p.textContent = `Filler paragraph ${i} multipage content line for PDF pagination testing with enough words.`;
      paper.appendChild(p);
    }

    const end = document.createElement('p');
    end.dataset.pdfMarker = 'page2';
    end.textContent = 'PAGE2_END_MARKER_XYZ';
    paper.appendChild(end);
  });
  await page.waitForTimeout(300);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const timings = {};
  const results = [];

  try {
    await waitForApp(page);
    await openDemoEditor(page);

    const t1 = Date.now();
    const singlePath = await exportPdf(page, 'single-page.pdf');
    timings.singleMs = Date.now() - t1;

    const single = await verifyPdfText(singlePath, {
      uniquePhrase: 'Alex Morgan',
      before: 'Alex Morgan',
      after: 'Work Experience',
      mustInclude: ['Alex Morgan', 'Senior Frontend Engineer'],
    });
    results.push({ case: 'single-page', file: singlePath, ...single, elapsedMs: timings.singleMs });

    await padForMultipage(page);

    const t2 = Date.now();
    const multiPath = await exportPdf(page, 'multi-page.pdf');
    timings.multiMs = Date.now() - t2;

    const multi = await verifyPdfText(multiPath, {
      uniquePhrase: 'PAGE1_UNIQUE_MARKER_XYZ',
      page1OnlyPhrase: 'PAGE1_UNIQUE_MARKER_XYZ',
      before: 'PAGE1_UNIQUE_MARKER_XYZ',
      after: 'PAGE2_END_MARKER_XYZ',
      mustInclude: ['PAGE1_UNIQUE_MARKER_XYZ', 'PAGE2_END_MARKER_XYZ', 'Alex Morgan'],
    });
    results.push({ case: 'multi-page', file: multiPath, ...multi, elapsedMs: timings.multiMs });

    const summary = {
      baseUrl,
      timings,
      results: results.map((r) => ({
        case: r.case,
        ok: r.ok,
        errors: r.errors,
        numPages: r.numPages,
        sizeBytes: r.sizeBytes,
        elapsedMs: r.elapsedMs,
        preview: r.full.slice(0, 400),
      })),
    };

    const reportPath = path.join(outDir, 'smoke-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));

    const failed = results.some((r) => !r.ok);
    if (failed) process.exit(1);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
