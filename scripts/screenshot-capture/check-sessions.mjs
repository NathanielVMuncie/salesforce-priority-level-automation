import { chromium } from 'playwright';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const PROFILE = resolve(dirname(fileURLToPath(import.meta.url)), '.browser-profile');
const ctx = await chromium.launchPersistentContext(PROFILE, { headless: true, viewport: { width: 1280, height: 800 } });
const page = ctx.pages()[0] ?? (await ctx.newPage());
for (const [name, url, loggedOutSign] of [
  ['wix', 'https://manage.wix.com/account/sites', /login|signin|users\/wix/i],
  ['make', 'https://www.make.com/en/login', /login|sign/i],
]) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(6000);
    const finalUrl = page.url();
    console.log(`${name}: landed at ${finalUrl.slice(0, 90)} -> ${loggedOutSign.test(finalUrl) ? 'NOT LOGGED IN' : 'LOGGED IN (probably)'}`);
  } catch (e) { console.log(`${name}: ERROR ${e.message.split('\n')[0]}`); }
}
await ctx.close();
