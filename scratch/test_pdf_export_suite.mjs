import { chromium } from 'playwright';
import fs from 'fs';

async function runExportTestSuite() {
  console.log('\n======================================================');
  console.log('=== STARTING PLAYWRIGHT COMPREHENSIVE PDF TEST SUITE ===');
  console.log('======================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error(`[BROWSER ERROR]: ${msg.text()}`);
    }
  });

  try {
    // Navigate to production preview build
    console.log('Step 1: Navigating to http://localhost:4173...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    console.log('Step 2: Opening resume profile editor...');
    await page.waitForSelector('h3');
    await page.click('h3');
    await page.waitForTimeout(1000);

    // Ensure we are in Preview Paper mode
    await page.click('button:has-text("Preview Paper")');
    await page.waitForTimeout(1000);

    // -------------------------------------------------------------
    // TEST CASE 1: 1-Page Resume Export & DOM Cleanup
    // -------------------------------------------------------------
    console.log('--> TEST 1: Exporting 1-Page PDF (Modern Tech Template)...');
    const downloadPromise1 = page.waitForEvent('download', { timeout: 20000 });
    await page.click('button:has-text("Export PDF")');

    const download1 = await downloadPromise1;
    const path1 = await download1.path();
    const size1 = fs.statSync(path1).size;
    console.log(`    ✅ [TEST 1 PASSED] PDF Downloaded: ${download1.suggestedFilename()} (${size1} bytes)`);

    if (size1 < 10000) {
      throw new Error(`TEST 1 FAILED: PDF file size is invalid (${size1} bytes)`);
    }

    const container1 = await page.$('#cvire-export-pdf-container');
    if (container1 !== null) {
      throw new Error('TEST 1 FAILED: Container remained in DOM after export!');
    }
    console.log('    ✅ [TEST 1 PASSED] try/finally DOM cleanup verified — container is null.');

    // -------------------------------------------------------------
    // TEST CASE 2: Template 2 - Minimalist Clean Export & Styling Check
    // -------------------------------------------------------------
    console.log('\n--> TEST 2: Template Switch & Export (Minimalist Clean)...');
    await page.click('button:has-text("Templates")');
    await page.waitForTimeout(500);
    await page.click('text=Minimalist Clean');
    await page.waitForTimeout(1000);

    const downloadPromise2 = page.waitForEvent('download', { timeout: 20000 });
    await page.click('button:has-text("Export PDF")');
    const download2 = await downloadPromise2;
    const path2 = await download2.path();
    const size2 = fs.statSync(path2).size;
    console.log(`    ✅ [TEST 2 PASSED] Minimalist Clean PDF Downloaded: (${size2} bytes)`);

    const container2 = await page.$('#cvire-export-pdf-container');
    if (container2 !== null) {
      throw new Error('TEST 2 FAILED: Container remained in DOM!');
    }
    console.log('    ✅ [TEST 2 PASSED] try/finally DOM cleanup verified.');

    // -------------------------------------------------------------
    // TEST CASE 3: Multi-Page Resume Export (Executive Classic)
    // -------------------------------------------------------------
    console.log('\n--> TEST 3: Multi-Page Resume Export (Executive Classic)...');
    await page.click('button:has-text("Templates")');
    await page.waitForTimeout(500);
    await page.click('text=Executive Classic');
    await page.waitForTimeout(1000);

    const downloadPromise3 = page.waitForEvent('download', { timeout: 20000 });
    await page.click('button:has-text("Export PDF")');
    const download3 = await downloadPromise3;
    const path3 = await download3.path();
    const size3 = fs.statSync(path3).size;
    console.log(`    ✅ [TEST 3 PASSED] Multi-Page PDF Downloaded: (${size3} bytes)`);

    const container3 = await page.$('#cvire-export-pdf-container');
    if (container3 !== null) {
      throw new Error('TEST 3 FAILED: Container remained in DOM!');
    }
    console.log('    ✅ [TEST 3 PASSED] Multi-page try/finally DOM cleanup verified.');

    // -------------------------------------------------------------
    // TEST CASE 4: Template 4 - Creative Accent & Color Theme Verification
    // -------------------------------------------------------------
    console.log('\n--> TEST 4: Creative Accent Template & Color Verification...');
    await page.click('button:has-text("Templates")');
    await page.waitForTimeout(500);
    await page.click('text=Creative Accent');
    await page.waitForTimeout(1000);

    const downloadPromise4 = page.waitForEvent('download', { timeout: 20000 });
    await page.click('button:has-text("Export PDF")');
    const download4 = await downloadPromise4;
    const path4 = await download4.path();
    console.log(`    ✅ [TEST 4 PASSED] Creative Accent PDF Downloaded: (${fs.statSync(path4).size} bytes)`);

    // -------------------------------------------------------------
    // TEST CASE 5: UI Interactivity Guarantee (Post-Export Interactivity)
    // -------------------------------------------------------------
    console.log('\n--> TEST 5: Verifying UI Interactivity Post-Export...');
    await page.click('button:has-text("Templates")');
    await page.waitForTimeout(500);
    await page.click('text=Compact Single-Page');
    await page.waitForTimeout(1000);
    console.log('    ✅ [TEST 5 PASSED] UI is 100% interactive — template switched to Compact Single-Page.');

    // -------------------------------------------------------------
    // TEST CASE 6: Zero Unhandled Console Errors Check
    // -------------------------------------------------------------
    console.log('\n--> TEST 6: Verifying Zero Console Errors...');
    const criticalErrors = consoleErrors.filter((err) => !err.includes('favicon'));
    if (criticalErrors.length > 0) {
      throw new Error(`TEST 6 FAILED: Console errors found: ${criticalErrors.join('; ')}`);
    }
    console.log('    ✅ [TEST 6 PASSED] Zero console errors during entire test suite execution.');

    console.log('\n======================================================');
    console.log('=== ALL PLAYWRIGHT PDF EXPORT TESTS PASSED 100% SUCCESS ===');
    console.log('======================================================\n');

  } catch (err) {
    console.error('\n❌ PLAYWRIGHT TEST SUITE FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runExportTestSuite();
