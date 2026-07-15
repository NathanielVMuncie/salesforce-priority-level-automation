// SCR-WX-01 .. SCR-WX-06 — public Business Inquiry Form states.
// Usage: node capture-wix-form.js <form-page-url>
// Selectors target the rendered Wix form; adjust FIELD_LABELS if the live
// form labels differ.
const { launchHeadless, snap, settle } = require('./lib');

const FORM_URL = process.argv[2];
if (!FORM_URL) { console.error('usage: node capture-wix-form.js <form-page-url>'); process.exit(1); }

const FIELD_LABELS = {
  businessType: 'Business Type',
  role: 'Role',
  purchasingTimeline: 'Purchasing Timeline',
};

async function openDropdown(page, label) {
  const dd = page.locator(`[aria-label*="${label}"], [data-testid*="dropdown"]:has-text("${label}")`).first();
  await dd.scrollIntoViewIfNeeded();
  await dd.click();
  await page.waitForTimeout(1200);
  return dd;
}

async function closeDropdown(page) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
}

(async () => {
  const { browser, context } = await launchHeadless();
  const page = await context.newPage();
  await page.goto(FORM_URL);
  await settle(page, 5000);

  // SCR-WX-01 — top section, active state, all scoring fields visible
  await snap(page, 'wix/SCR-WX-01_form-top-active.png');

  // SCR-WX-02 — Business_Type__c dropdown open
  await openDropdown(page, FIELD_LABELS.businessType);
  await snap(page, 'wix/SCR-WX-02_form-business-type-dropdown.png');

  // SCR-WX-03 — Personal/Individual selected; Role + Timeline hidden (gatekeeper)
  await page.getByText('Personal/Individual (Non-Business)', { exact: false }).first().click();
  await page.waitForTimeout(1500);
  await snap(page, 'wix/SCR-WX-03_form-gatekeeper-triggered.png');

  // Restore a business selection so Role/Timeline reappear
  await openDropdown(page, FIELD_LABELS.businessType);
  await page.getByRole('option').first().click();
  await page.waitForTimeout(1500);

  // SCR-WX-04 — Role__c dropdown open
  await openDropdown(page, FIELD_LABELS.role);
  await snap(page, 'wix/SCR-WX-04_form-role-dropdown.png');
  await closeDropdown(page);

  // SCR-WX-05 — Purchasing_Timeline__c dropdown open
  await openDropdown(page, FIELD_LABELS.purchasingTimeline);
  await snap(page, 'wix/SCR-WX-05_form-purchasing-timeline-dropdown.png');
  await closeDropdown(page);

  // SCR-WX-06 — bottom section
  await page.keyboard.press('End');
  await page.waitForTimeout(1500);
  await snap(page, 'wix/SCR-WX-06_form-bottom.png');

  await browser.close();
  console.log('wix form pass complete: 6 shots');
})().catch((e) => { console.error(e); process.exit(1); });
