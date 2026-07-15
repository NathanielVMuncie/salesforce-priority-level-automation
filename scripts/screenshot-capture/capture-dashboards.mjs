// Captures SCR-WX-07 (Wix automation) + SCR-MK-01..04 (Make.com) per screenshot-index.md
// Uses the logged-in persistent profile (.browser-profile). 1280x800 PNG, exact filenames.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const WIX_OUT = resolve(ROOT, 'assets/screenshots/wix');
const MAKE_OUT = resolve(ROOT, 'assets/screenshots/make');
mkdirSync(MAKE_OUT, { recursive: true });

const SITE_ID = '2e9bc217-2920-40ac-965d-573e0b4f008e';
// headed (Cloudflare blocks headless) + lean flags (container has only ~2.7GB RAM)
const ctx = await chromium.launchPersistentContext(resolve(HERE, '.browser-profile'), {
  headless: false,
  viewport: { width: 1280, height: 800 },
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--renderer-process-limit=1',
    '--js-flags=--max-old-space-size=384',
  ],
});
const page = ctx.pages()[0] ?? (await ctx.newPage());

async function go(url, settleMs = 10000) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(settleMs);
}
async function shoot(dir, name) {
  // animations:'disabled' — Make's animated charts otherwise stall the stability wait
  await page.screenshot({ path: `${dir}/${name}`, animations: 'disabled', caret: 'hide', timeout: 60000 });
  console.log(`captured ${name} at ${page.url().slice(0, 80)}`);
}
async function tryStep(label, fn) {
  try {
    await fn();
  } catch (e) {
    console.warn(`FAIL ${label}: ${e.message.split('\n')[0]}`);
    await shoot('/tmp', `_debug-${label}.png`).catch(() => {});
  }
}

// --- SCR-WX-07: Wix Automation WA_Inquiry_To_Make canvas ---
const { existsSync } = await import('fs');
if (!existsSync(`${WIX_OUT}/SCR-WX-07_wix-automation.png`)) await tryStep('wix-automations', async () => {
  await go(`https://manage.wix.com/dashboard/${SITE_ID}/home`, 25000);
  // navigate via the sidebar menu — direct /automations URL 404s; dashboard loads slowly here
  const sidebar = page.getByText('Automations', { exact: true }).first();
  await sidebar.waitFor({ state: 'visible', timeout: 60000 });
  await sidebar.click();
  await page.waitForTimeout(15000);
  await shoot('/tmp', '_debug-wix-automations-list.png');
  const auto = page.getByText('WA_Inquiry_To_Make', { exact: false }).first();
  await auto.waitFor({ state: 'visible', timeout: 20000 });
  await auto.click();
  await page.waitForTimeout(12000);
  await shoot(WIX_OUT, 'SCR-WX-07_wix-automation.png');
});

// --- SCR-MK-01: scenario canvas with both modules ---
let inEditor = false;
await tryStep('make-scenario-canvas', async () => {
  await go('https://us2.make.com/', 10000);
  // drive the SSO ourselves: Make login page -> Google button -> account chooser -> back to zone
  for (let i = 0; i < 96; i++) {
    const url = page.url();
    if (/us2\.make\.com\/organization\//.test(url)) break; // fully landed on org dashboard
    if (/make\.com\/en\/login/.test(url)) {
      const g = page.getByText(/google/i).first();
      if (await g.count()) {
        await g.click().catch(() => {});
        await page.waitForTimeout(8000);
        continue;
      }
    }
    if (/accounts\.google\.com/.test(url)) {
      const acct = page.getByText('nathaniel.celestevineyards@gmail.com', { exact: false }).first();
      if (await acct.count()) {
        await acct.click().catch(() => {});
        await page.waitForTimeout(10000);
        continue;
      }
      console.log('>>> ACTION: complete the Google sign-in in the window <<<');
    }
    await page.waitForTimeout(5000);
  }
  await page.waitForTimeout(8000);
  await shoot('/tmp', '_debug-make-home.png');
  // go straight to the org dashboard; the SPA hydrates very slowly on this hardware
  if (!/organization\/\d+/.test(page.url())) {
    await go('https://us2.make.com/organization/4812698/dashboard', 25000);
  }
  // the scenario is linked directly from the org dashboard's Active scenarios card
  const link = page.getByText('Wix_Inquiry_To_Salesforce_Lead', { exact: false }).first();
  await link.waitFor({ state: 'visible', timeout: 90000 });
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await page.waitForTimeout(10000);
  // scenario detail page → open the editor canvas
  const edit = page.getByRole('link', { name: /edit scenario|edit/i }).first();
  if (await edit.count()) {
    await edit.click();
    await page.waitForTimeout(12000);
  }
  inEditor = true;
  await shoot(MAKE_OUT, 'SCR-MK-01_make-scenario-canvas.png');
});

// --- SCR-MK-02/03: module configuration panels ---
async function moduleShot(moduleName, file) {
  const mod = page.getByText(moduleName, { exact: false }).first();
  await mod.waitFor({ state: 'visible', timeout: 15000 });
  await mod.click();
  await page.waitForTimeout(6000);
  await shoot(MAKE_OUT, file);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);
}
if (inEditor) {
  await tryStep('make-webhook-module', () => moduleShot('WH_Wix_Inquiry_To_Make', 'SCR-MK-02_make-webhook-module.png'));
  await tryStep('make-salesforce-module', () => moduleShot('SF_Make_Lead_To_Salesforce', 'SCR-MK-03_make-salesforce-module.png'));
}

// --- SCR-MK-04: execution history log ---
await tryStep('make-execution-log', async () => {
  const hist = page.getByText(/history/i).first();
  await hist.waitFor({ state: 'visible', timeout: 15000 });
  await hist.click();
  await page.waitForTimeout(8000);
  await shoot('/tmp', '_debug-make-history-list.png');
  // open the most recent (only retained) execution detail
  const row = page.getByText(/success/i).first();
  if (await row.count()) {
    await row.click();
    await page.waitForTimeout(8000);
  }
  await shoot(MAKE_OUT, 'SCR-MK-04_make-execution-log.png');
});

await ctx.close();
console.log('done');
