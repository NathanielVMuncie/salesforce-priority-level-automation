// Re-captures SCR-SF-02 (rule entry detail) and SCR-SF-06 candidates (list views with columns visible)
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'assets/screenshots/salesforce');
const ORG = 'celeste-dev';

function sf(args) {
  return JSON.parse(execFileSync('sf', [...args, '--json'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
}
const orgInfo = sf(['org', 'display', '-o', ORG]).result;
const token = sf(['org', 'auth', 'show-access-token', '-o', ORG]).result.accessToken;
const instanceUrl = orgInfo.instanceUrl.replace(/\/$/, '');
const frontdoor = `${instanceUrl}/secur/frontdoor.jsp?sid=${encodeURIComponent(token)}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(frontdoor, { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(8000);

// --- SCR-SF-02: click into Regional Territory Assignment rule entries ---
await page.goto(`${instanceUrl}/lightning/setup/LeadRules/home`, { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(9000);
let clicked = false;
for (const frame of page.frames()) {
  try {
    const link = frame.getByRole('link', { name: 'Regional Territory Assignment' });
    if (await link.count()) {
      await link.first().click();
      clicked = true;
      break;
    }
  } catch { /* cross-origin or detached frame */ }
}
if (!clicked) console.warn('WARN: rule link still not found in any frame');
await page.waitForTimeout(8000);
await page.screenshot({ path: `${OUT}/SCR-SF-02_assignment-rule.png` });
console.log(`captured SCR-SF-02 (rule detail clicked: ${clicked})`);

// --- SCR-SF-06 candidates: try list views that may show Priority Level ---
const CANDIDATES = [
  ['AllOpenLeads', '00BgL00000TIwL6UAL'],
  ['ViewCustom1', '00BgL00000TIwQ2UAL'],
  ['ViewCustom2', '00BgL00000TIwQ1UAL'],
];
for (const [name, id] of CANDIDATES) {
  await page.goto(`${instanceUrl}/lightning/o/Lead/list?filterName=${id}`, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(9000);
  await page.screenshot({ path: `${OUT}/_sf06-candidate-${name}.png` });
  console.log(`captured candidate ${name}`);
}

await browser.close();
console.log('done');
