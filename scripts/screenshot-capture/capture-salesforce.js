// SCR-SF-01 .. SCR-SF-11 — Salesforce configuration + Lead record evidence.
// Usage: node capture-salesforce.js
// Requires targets.json (generated from org queries) with:
//   { "frontdoorUrl": "...", "instanceUrl": "...", "flowId": "...",
//     "queueIds": { "eastCoast": "...", "westCoast": "...", "central": "..." },
//     "leadListViewUrl": "...", "leadIds": { "L01": "...", "L02": "...",
//     "L03": "...", "L04": "...", "L05": "..." } }
const { launchHeadless, snap, settle } = require('./lib');
const targets = require('./targets.json');

(async () => {
  const { browser, context } = await launchHeadless();
  const page = await context.newPage();
  const base = targets.instanceUrl.replace(/\/$/, '');

  // Authenticate via frontdoor URL (session-token login, no credentials in script).
  await page.goto(targets.frontdoorUrl);
  await settle(page, 6000);

  const shots = [
    // Flow Builder canvas
    {
      rel: 'salesforce/SCR-SF-01_flow-canvas.png',
      url: `${base}/builder_platform_interaction/flowBuilder.app?flowId=${targets.flowId}`,
      wait: 12000,
    },
    // Lead Assignment Rule entries
    {
      rel: 'salesforce/SCR-SF-02_assignment-rule.png',
      url: `${base}/lightning/setup/LeadRules/home`,
      wait: 8000,
    },
    // Queues
    {
      rel: 'salesforce/SCR-SF-03_queue-east-coast.png',
      url: `${base}/lightning/setup/Queues/page?address=%2Fp%2Fown%2FQueue%2Fd%3Fid%3D${targets.queueIds.eastCoast}`,
      wait: 8000,
    },
    {
      rel: 'salesforce/SCR-SF-04_queue-west-coast.png',
      url: `${base}/lightning/setup/Queues/page?address=%2Fp%2Fown%2FQueue%2Fd%3Fid%3D${targets.queueIds.westCoast}`,
      wait: 8000,
    },
    {
      rel: 'salesforce/SCR-SF-05_queue-central.png',
      url: `${base}/lightning/setup/Queues/page?address=%2Fp%2Fown%2FQueue%2Fd%3Fid%3D${targets.queueIds.central}`,
      wait: 8000,
    },
    // Lead list view — all five canonical records
    {
      rel: 'salesforce/SCR-SF-06_lead-list-view.png',
      url: targets.leadListViewUrl,
      wait: 8000,
    },
    // Canonical Lead records L-01 .. L-05
    { rel: 'salesforce/SCR-SF-07_lead-L01-thibodeau.png', url: `${base}/lightning/r/Lead/${targets.leadIds.L01}/view`, wait: 8000 },
    { rel: 'salesforce/SCR-SF-08_lead-L02-voss.png',      url: `${base}/lightning/r/Lead/${targets.leadIds.L02}/view`, wait: 8000 },
    { rel: 'salesforce/SCR-SF-09_lead-L03-reyes.png',     url: `${base}/lightning/r/Lead/${targets.leadIds.L03}/view`, wait: 8000 },
    { rel: 'salesforce/SCR-SF-10_lead-L04-harmon.png',    url: `${base}/lightning/r/Lead/${targets.leadIds.L04}/view`, wait: 8000 },
    { rel: 'salesforce/SCR-SF-11_lead-L05-sandoval.png',  url: `${base}/lightning/r/Lead/${targets.leadIds.L05}/view`, wait: 8000 },
  ];

  for (const s of shots) {
    await page.goto(s.url);
    await settle(page, s.wait);
    await snap(page, s.rel);
  }

  await browser.close();
  console.log('salesforce pass complete: 11 shots');
})().catch((e) => { console.error(e); process.exit(1); });
