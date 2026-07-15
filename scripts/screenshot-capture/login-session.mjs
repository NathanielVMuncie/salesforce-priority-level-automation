// Opens a visible browser with a persistent profile for one-time Wix + Make.com login.
// Session cookies persist in .browser-profile/ (gitignored) for the capture scripts to reuse.
// Log in to both tabs, then close the browser window to finish.
import { chromium } from 'playwright';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const PROFILE = resolve(dirname(fileURLToPath(import.meta.url)), '.browser-profile');

const ctx = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  viewport: { width: 1280, height: 800 },
  args: [
    '--disable-blink-features=AutomationControlled', // avoid Google SSO "browser not secure" rejection
    '--disable-dev-shm-usage', // low-RAM host: use /tmp instead of small /dev/shm
    '--renderer-process-limit=2', // cap renderer processes on 8GB host
    '--disable-background-networking',
  ],
});

// forget any Make.com session so the correct account (nathaniel.celestevineyards@gmail.com) can be used
const cookies = await ctx.cookies();
const makeCookies = cookies.filter((c) => c.domain.includes('make.com'));
if (makeCookies.length) {
  await ctx.clearCookies();
  console.log(`cleared ${makeCookies.length} make.com cookies (note: all cookies cleared — redo Wix login too)`);
}

// slow first paint on this hardware — navigation failures must not kill the window
async function open(tab, url) {
  try {
    await tab.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  } catch (e) {
    console.warn(`navigation slow/failed for ${url}: ${e.message.split('\n')[0]} — window stays open, navigate manually if needed`);
  }
}
const wixTab = ctx.pages()[0] ?? (await ctx.newPage());
await open(wixTab, 'https://manage.wix.com/');
const makeTab = await ctx.newPage();
await open(makeTab, 'https://www.make.com/en/login');

console.log('Browser open. Log in to Wix (tab 1) and Make.com (tab 2), then close the window.');
await new Promise((done) => ctx.on('close', done));
console.log('Sessions saved to .browser-profile/. Done.');
