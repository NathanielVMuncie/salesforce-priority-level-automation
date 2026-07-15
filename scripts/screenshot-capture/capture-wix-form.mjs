// Captures SCR-WX-01 through SCR-WX-06 per assets/screenshots/screenshot-index.md
// Spec: 1280x800 locked viewport, PNG, crop tightly to subject, exact filenames.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(ROOT, 'assets/screenshots/wix');
mkdirSync(OUT, { recursive: true });

const FORM_URL = 'https://nathanielvmedia.wixsite.com/portfolio/';
const VIEWPORT = { width: 1280, height: 800 };
const PAD = 16; // crop padding around subject

const LABELS = {
  businessType: 'Which best describes your business type?',
  role: 'Which best describes your role at the company?',
  timeline: 'What best describes your purchasing timeline?',
};

function clampClip(box, vp) {
  const x = Math.max(0, box.x - PAD);
  const y = Math.max(0, box.y - PAD);
  return {
    x,
    y,
    width: Math.min(vp.width - x, box.width + PAD * 2),
    height: Math.min(vp.height - y, box.height + PAD * 2),
  };
}

async function viewportBox(el) {
  // bounding box relative to viewport (Playwright boundingBox is already viewport-relative for screenshots via clip on page after scroll)
  return await el.evaluate((node) => {
    const r = node.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
}

async function shoot(page, name, clip) {
  await page.screenshot({ path: `${OUT}/${name}`, clip });
  console.log(`captured ${name} (${Math.round(clip.width)}x${Math.round(clip.height)})`);
}

async function findDropdown(form, label) {
  // Wix forms render dropdowns as custom comboboxes or native selects; try both.
  let el = form.getByRole('combobox', { name: label });
  if (await el.count()) return { el: el.first(), native: false };
  el = form.getByLabel(label);
  if (await el.count()) {
    const tag = await el.first().evaluate((n) => n.tagName.toLowerCase());
    return { el: el.first(), native: tag === 'select' };
  }
  throw new Error(`dropdown not found: ${label}`);
}

async function openDropdownAndShoot(page, form, label, name) {
  const { el, native } = await findDropdown(form, label);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  if (native) {
    // Native <select> popups don't render in screenshots; capture focused field instead.
    await el.focus();
    console.warn(`WARN ${name}: native select — popup cannot render in screenshot, capturing focused field`);
    const box = await viewportBox(el);
    await shoot(page, name, clampClip(box, VIEWPORT));
    return;
  }
  // scroll field near viewport top so the option list opens downward with room
  await el.evaluate((n) => {
    n.scrollIntoView({ block: 'start' });
    window.scrollBy(0, -100);
  });
  await page.waitForTimeout(500);
  await el.click();
  const options = page.getByRole('option');
  await options.first().waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(700); // let open animation settle
  const boxes = [await viewportBox(el)];
  const n = await options.count();
  for (let i = 0; i < n; i++) boxes.push(await viewportBox(options.nth(i)));
  const x1 = Math.min(...boxes.map((b) => b.x));
  const y1 = Math.min(...boxes.map((b) => b.y)) - 30; // include the field label above
  const x2 = Math.max(...boxes.map((b) => b.x + b.width));
  const y2 = Math.max(...boxes.map((b) => b.y + b.height));
  await shoot(page, name, clampClip({ x: x1, y: y1, width: x2 - x1, height: y2 - y1 }, VIEWPORT));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT });
console.log(`loading ${FORM_URL}`);
await page.goto(FORM_URL, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);

// hide the Wix free-plan banner so it doesn't intrude on captures
await page.addStyleTag({ content: '#WIX_ADS, [id*="WIX_ADS"] { display: none !important; }' });
await page.waitForTimeout(300);

// Locate the Business Inquiry Form (the one containing the business-type field)
const form = page.locator('form', { hasText: 'business type' }).first();
if (!(await form.count())) {
  await page.screenshot({ path: `${OUT}/_debug-full-page.png`, fullPage: true });
  throw new Error('no <form> found — see _debug-full-page.png');
}
await form.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

// SCR-WX-01 — form top section, active state, all scoring fields visible
{
  await form.evaluate((n) => {
    n.scrollIntoView({ block: 'start' });
    window.scrollBy(0, -20);
  });
  await page.waitForTimeout(600);
  const box = await viewportBox(form);
  const clip = clampClip({ ...box, height: Math.min(box.height, VIEWPORT.height - Math.max(0, box.y) - PAD) }, VIEWPORT);
  await shoot(page, 'SCR-WX-01_form-top-active.png', clip);
}

// SCR-WX-02 — Business Type dropdown open
await openDropdownAndShoot(page, form, LABELS.businessType, 'SCR-WX-02_form-business-type-dropdown.png');

// SCR-WX-04 — Role dropdown open
await openDropdownAndShoot(page, form, LABELS.role, 'SCR-WX-04_form-role-dropdown.png');

// SCR-WX-05 — Purchasing Timeline dropdown open
await openDropdownAndShoot(page, form, LABELS.timeline, 'SCR-WX-05_form-purchasing-timeline-dropdown.png');

// SCR-WX-06 — form bottom section
{
  await form.evaluate((n) => n.scrollIntoView({ block: 'end' }));
  await page.waitForTimeout(600);
  const box = await viewportBox(form);
  const yStart = Math.max(0, box.y);
  const clip = clampClip({ x: box.x, y: yStart, width: box.width, height: box.y + box.height - yStart }, VIEWPORT);
  await shoot(page, 'SCR-WX-06_form-bottom.png', clip);
}

// SCR-WX-03 — gatekeeper triggered: select Personal/Individual (Non-Business)
{
  const { el, native } = await findDropdown(form, LABELS.businessType);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  if (native) {
    await el.selectOption({ label: 'Personal/Individual (Non-Business)' });
  } else {
    await el.click();
    const opt = page.getByRole('option', { name: 'Personal/Individual (Non-Business)' });
    await opt.first().waitFor({ state: 'visible', timeout: 5000 });
    await opt.first().click();
  }
  // wait for conditional fields to hide and the B2B gatekeeper message to render
  await page.waitForTimeout(1500);
  const msg = page.getByText('strictly B2B model', { exact: false });
  if (!(await msg.count())) {
    console.warn('WARN SCR-WX-03: gatekeeper message text not found — capturing form state anyway');
  }
  // capture from form top: selected value + message + absence of Role/Timeline fields
  await form.evaluate((n) => {
    n.scrollIntoView({ block: 'start' });
    window.scrollBy(0, -20);
  });
  await page.waitForTimeout(600);
  const box = await viewportBox(form);
  const clip = clampClip(
    { x: box.x, y: Math.max(0, box.y), width: box.width, height: Math.min(box.height, VIEWPORT.height - Math.max(0, box.y) - PAD) },
    VIEWPORT
  );
  await shoot(page, 'SCR-WX-03_form-gatekeeper-triggered.png', clip);
}

await browser.close();
console.log('done');
