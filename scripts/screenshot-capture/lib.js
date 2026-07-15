// Shared capture helpers. Spec: 1280x800 viewport, scale 1, lossless PNG,
// filenames must match screenshot-index.md exactly.
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const CHROME = '/usr/bin/google-chrome';
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SHOTS = path.join(REPO_ROOT, 'assets', 'screenshots');

const VIEWPORT = { width: 1280, height: 800 };

function outPath(rel) {
  const p = path.join(SHOTS, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  return p;
}

async function launchHeadless() {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  return { browser, context };
}

// Persistent profile so a one-time manual login survives across runs.
async function launchHeaded(profileDir) {
  return chromium.launchPersistentContext(profileDir, {
    executablePath: CHROME,
    headless: false,
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
}

// Full-viewport PNG. Crop-to-subject is done in post if needed.
async function snap(page, rel, opts = {}) {
  const file = outPath(rel);
  if (opts.fullPage) {
    await page.screenshot({ path: file, type: 'png', fullPage: true });
  } else if (opts.selector) {
    const el = page.locator(opts.selector).first();
    await el.waitFor({ state: 'visible', timeout: 15000 });
    await el.screenshot({ path: file, type: 'png' });
  } else {
    await page.screenshot({ path: file, type: 'png' });
  }
  console.log('captured:', path.relative(REPO_ROOT, file));
}

async function settle(page, ms = 2500) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(ms);
}

module.exports = { launchHeadless, launchHeaded, snap, settle, VIEWPORT, SHOTS };
