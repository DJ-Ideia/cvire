import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    count += 1;
    idx += needle.length;
  }
  return count;
}

export async function extractPdfText(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  const pages = [];

  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
    pages.push(text.replace(/\s+/g, ' ').trim());
  }

  return {
    numPages: doc.numPages,
    pages,
    full: pages.join('\n'),
    sizeBytes: fs.statSync(pdfPath).size,
  };
}

export async function verifyPdfText(pdfPath, checks = {}) {
  const extracted = await extractPdfText(pdfPath);
  const errors = [];
  const uniquePhrase = checks.uniquePhrase ?? 'Alex Morgan';
  const uniqueCount = countOccurrences(extracted.full, uniquePhrase);

  if (uniqueCount !== 1) {
    errors.push(`Expected "${uniquePhrase}" exactly once, found ${uniqueCount}`);
  }

  if (checks.before && checks.after) {
    const beforeIdx = extracted.full.indexOf(checks.before);
    const afterIdx = extracted.full.indexOf(checks.after);
    if (beforeIdx === -1 || afterIdx === -1 || beforeIdx > afterIdx) {
      errors.push(`Order failed: "${checks.before}" should appear before "${checks.after}"`);
    }
  }

  if (extracted.numPages > 1 && checks.page1OnlyPhrase) {
    const later = extracted.pages.slice(1).join(' ');
    if (
      extracted.pages[0].includes(checks.page1OnlyPhrase) &&
      later.includes(checks.page1OnlyPhrase)
    ) {
      errors.push(
        `Page-1 phrase duplicated on later pages: "${checks.page1OnlyPhrase}"`
      );
    }
  }

  if (checks.mustInclude) {
    for (const phrase of checks.mustInclude) {
      if (!extracted.full.includes(phrase)) {
        errors.push(`Missing required phrase: "${phrase}"`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    ...extracted,
  };
}

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: node scripts/verify-pdf-text.mjs <file.pdf> [uniquePhrase]');
    process.exit(1);
  }

  const absolute = path.resolve(pdfPath);
  if (!fs.existsSync(absolute)) {
    console.error(`File not found: ${absolute}`);
    process.exit(1);
  }

  const uniquePhrase = process.argv[3] || 'Alex Morgan';
  const result = await verifyPdfText(absolute, {
    uniquePhrase,
    before: uniquePhrase,
    after: 'Work Experience',
    mustInclude: [uniquePhrase],
  });

  console.log(
    JSON.stringify(
      {
        file: absolute,
        ok: result.ok,
        errors: result.errors,
        numPages: result.numPages,
        sizeBytes: result.sizeBytes,
        preview: result.full.slice(0, 500),
      },
      null,
      2
    )
  );

  process.exit(result.ok ? 0 : 1);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
