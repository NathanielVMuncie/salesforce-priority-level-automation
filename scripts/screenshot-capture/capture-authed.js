// SCR-WX-07 + SCR-MK-01..04 — login-walled captures (Wix Automations, Make.com).
// Opens a visible Chrome window with a persistent profile. Log in once when
// prompted; the script pauses at each target so you can confirm the canvas /
// module state, then snaps on Enter.
// Usage: node capture-authed.js
const readline = require('readline');
const path = require('path');
const { launchHeaded, snap, settle } = require('./lib');

const PROFILE = path.join(__dirname, '.chrome-profile');

const TARGETS = [
  {
    rel: 'wix/SCR-WX-07_wix-automation.png',
    prompt: 'Navigate to Wix Automations > WA_Inquiry_To_Make canvas (trigger + POST action visible)',
  },
  {
    rel: 'make/SCR-MK-01_make-scenario-canvas.png',
    prompt: 'Open scenario Wix_Inquiry_To_Salesforce_Lead; zoom until BOTH modules fit one frame',
  },
  {
    rel: 'make/SCR-MK-02_make-webhook-module.png',
    prompt: 'Open module WH_Wix_Inquiry_To_Make — webhook config + inbound payload visible',
  },
  {
    rel: 'make/SCR-MK-03_make-salesforce-module.png',
    prompt: 'Open module SF_Make_Lead_To_Salesforce — field mapping visible',
  },
  {
    rel: 'make/SCR-MK-04_make-execution-log.png',
    prompt: 'Open History — successful canonical run output visible',
  },
];

function waitForEnter(msg) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(`\n${msg}\n[Enter] to capture > `, () => { rl.close(); res(); }));
}

(async () => {
  const context = await launchHeaded(PROFILE);
  const page = context.pages()[0] || (await context.newPage());
  await page.goto('https://www.wix.com/my-account');
  await settle(page);

  for (const t of TARGETS) {
    await waitForEnter(t.prompt);
    await snap(page, t.rel);
  }

  await context.close();
  console.log('authed pass complete: 5 shots');
})().catch((e) => { console.error(e); process.exit(1); });
