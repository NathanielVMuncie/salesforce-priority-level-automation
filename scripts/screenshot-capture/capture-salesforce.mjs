// Captures SCR-SF-01 through SCR-SF-11 per assets/screenshots/screenshot-index.md
// Auth: sf CLI frontdoor URL (org alias celeste-dev). Spec: 1280x800 viewport, PNG, exact filenames.
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'assets/screenshots/salesforce');
mkdirSync(OUT, { recursive: true });

const ORG = 'celeste-dev';
const VIEWPORT = { width: 1280, height: 800 };

function sf(args) {
  return JSON.parse(execFileSync('sf', [...args, '--json'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }));
}

function soql(query, tooling = false) {
  const args = ['data', 'query', '--query', query, '-o', ORG];
  if (tooling) args.push('-t');
  return sf(args).result.records;
}

console.log('resolving org auth + record ids via sf CLI...');
// org open --url-only rejects UI-session tokens; build frontdoor.jsp URL manually.
// NB: `org display` redacts accessToken — must use `org auth show-access-token`.
const orgInfo = sf(['org', 'display', '-o', ORG]).result;
const token = sf(['org', 'auth', 'show-access-token', '-o', ORG]).result.accessToken;
const frontdoor = `${orgInfo.instanceUrl.replace(/\/$/, '')}/secur/frontdoor.jsp?sid=${encodeURIComponent(token)}`;

const flowVersions = soql(
  "SELECT ActiveVersionId FROM FlowDefinition WHERE DeveloperName = 'Lead_Scoring_and_Priority_Level_Assignment'",
  true
);
const flowVersionId = flowVersions[0]?.ActiveVersionId;
if (!flowVersionId) throw new Error('active flow version not found');

// match by last name — org data spelling can drift from the index (e.g. Reneta vs Renata)
const LEADS = [
  ['SCR-SF-07_lead-L01-thibodeau.png', 'Thibodeau'],
  ['SCR-SF-08_lead-L02-voss.png', 'Voss'],
  ['SCR-SF-09_lead-L03-reyes.png', 'Reyes'],
  ['SCR-SF-10_lead-L04-harmon.png', 'Harmon'],
  ['SCR-SF-11_lead-L05-sandoval.png', 'Sandoval'],
];
const leadIds = {};
for (const [, name] of LEADS) {
  const recs = soql(`SELECT Id, Name FROM Lead WHERE LastName = '${name}' ORDER BY CreatedDate DESC LIMIT 1`);
  if (!recs.length) console.warn(`WARN lead not found: ${name}`);
  else {
    leadIds[name] = recs[0].Id;
    console.log(`lead ${name} -> ${recs[0].Name} (${recs[0].Id})`);
  }
}

const instanceUrl = new URL(frontdoor).origin;
const QUEUES = [
  ['SCR-SF-03_queue-east-coast.png', 'East Coast Region'],
  ['SCR-SF-04_queue-west-coast.png', 'West Coast Region'],
  ['SCR-SF-05_queue-central.png', 'Central Region'],
];
const queueIds = {};
for (const [, label] of QUEUES) {
  const recs = soql(`SELECT Id FROM Group WHERE Type = 'Queue' AND Name = '${label}'`);
  if (!recs.length) console.warn(`WARN queue not found: ${label}`);
  else queueIds[label] = recs[0].Id;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT });

async function go(url, settleMs = 6000) {
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(settleMs);
}

async function shoot(name) {
  await page.screenshot({ path: `${OUT}/${name}` });
  console.log(`captured ${name}`);
}

console.log('authenticating via frontdoor...');
await go(frontdoor, 8000);

// SCR-SF-01 — Flow Builder canvas
await go(`${instanceUrl}/builder_platform_interaction/flowBuilder.app?flowId=${flowVersionId}`, 20000);
await shoot('SCR-SF-01_flow-canvas.png');

// SCR-SF-02 — Lead Assignment Rule detail (classic setup page renders rule entries)
{
  await go(`${instanceUrl}/lightning/setup/LeadRules/home`, 8000);
  // rule list renders inside an iframe (classic setup embedded in Lightning)
  const frame = page.frameLocator('iframe[title*="Lead Assignment Rules"], iframe[name^="vfFrameId"]').first();
  const link = frame.getByRole('link', { name: /regional.?territory.?assignment/i });
  if (await link.count()) {
    await link.first().click();
    await page.waitForTimeout(6000);
  } else {
    console.warn('WARN assignment rule link not found — capturing rules list page');
  }
  await shoot('SCR-SF-02_assignment-rule.png');
}

// SCR-SF-03..05 — Queue member configuration
for (const [file, label] of QUEUES) {
  if (!queueIds[label]) continue;
  await go(`${instanceUrl}/lightning/setup/Queues/page?address=%2Fp%2Fown%2FQueue%2Fd%3Fid%3D${queueIds[label].slice(0, 15)}`, 8000);
  await shoot(file);
}

// SCR-SF-06 — Lead list view showing all five canonical records
await go(`${instanceUrl}/lightning/o/Lead/list?filterName=__Recent`, 9000);
await shoot('SCR-SF-06_lead-list-view.png');

// SCR-SF-07..11 — Lead detail records
for (const [file, name] of LEADS) {
  if (!leadIds[name]) continue;
  await go(`${instanceUrl}/lightning/r/Lead/${leadIds[name]}/view`, 9000);
  await shoot(file);
}

await browser.close();
console.log('done');
