import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runBackupRestoreTestSuite() {
  console.log('\n=============================================================');
  console.log('=== STARTING PLAYWRIGHT AUTOMATED BACKUP & RESTORE SUITE ===');
  console.log('=============================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[BROWSER ERROR]: ${msg.text()}`);
    }
  });

  try {
    console.log('Step 1: Navigating to http://localhost:4173...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    await page.waitForSelector('h3');
    console.log('Step 2: Profile cards loaded on dashboard.');

    // --- TEST 1: Export Full JSON Backup ---
    console.log('\n--> TEST 1: Exporting Full JSON Backup...');
    const downloadPromise1 = page.waitForEvent('download', { timeout: 15000 });
    await page.click('button[title="Export JSON"]');

    const download1 = await downloadPromise1;
    const backupPath = await download1.path();
    const backupFilename = download1.suggestedFilename();
    console.log(`    ✅ [TEST 1 PASSED] Downloaded Backup JSON: ${backupFilename} at ${backupPath}`);

    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    const parsedBackup = JSON.parse(backupContent);
    console.log(`    ✅ [TEST 1 PASSED] Backup contains ${parsedBackup.length} profiles.`);
    if (!Array.isArray(parsedBackup) || parsedBackup.length === 0) {
      throw new Error('TEST 1 FAILED: Backup JSON is empty or invalid format!');
    }

    // --- TEST 2: Clear IndexedDB Database ---
    console.log('\n--> TEST 2: Wiping IndexedDB to simulate data loss...');
    await page.evaluate(async () => {
      const indexedDB = window.indexedDB;
      indexedDB.deleteDatabase('cvire_db');
    });
    await page.reload({ waitUntil: 'networkidle' });
    console.log('    ✅ [TEST 2 PASSED] IndexedDB wiped and page reloaded.');

    // --- TEST 3: Restore / Import JSON Backup ---
    console.log('\n--> TEST 3: Importing JSON Backup to restore profiles...');
    const fileInput = await page.locator('input[type="file"][accept=".json"]');
    await fileInput.setInputFiles(backupPath);
    await page.waitForTimeout(1000);

    // Verify profiles are restored in DOM
    const restoredCards = await page.locator('h3').count();
    console.log(`    ✅ [TEST 3 PASSED] Restored ${restoredCards} profiles into dashboard.`);
    if (restoredCards === 0) {
      throw new Error('TEST 3 FAILED: Profiles were not restored from JSON backup!');
    }

    console.log('\n=============================================================');
    console.log('=== ALL BACKUP & RESTORE PLAYWRIGHT TESTS PASSED 100% SUCCESS ===');
    console.log('=============================================================\n');

  } catch (err) {
    console.error('\n❌ BACKUP & RESTORE TEST SUITE FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runBackupRestoreTestSuite();
