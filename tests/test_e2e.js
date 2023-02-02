import  puppeteer from 'puppeteer';

import { assert } from 'tiny-esm-test-runner';

import { server } from '../server.js';


const { is, isNot, ok, ng } = assert;

/**
 * Fixture to provide browser
 */
async function browserFixture(test) {
  server.listen(18901);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const serverUrl = "http://127.0.0.1:18901";

  try {
    await test(browser, page, serverUrl);
  } finally {
    await browser.close();
    server.close();
  }
}

testBasicRouting.parameters = [
  ['/', "div.home", 'Home'],
  ['/posts/test-param', "div.article", 'Test param'],
  ['/posts/test/param/with/slash', "div.article", "Test param with path"],
];
export async function testBasicRouting([path, selector, expected]) {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(`${serverUrl}${path}`);
    await page.waitForSelector(selector);

    is(expected, await page.title());
  });
}

export async function testLink() {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);
    await page.waitForSelector('a[href="/posts/test-param"]');

    await page.click('a[href="/posts/test-param"]');
    await page.waitForSelector("div.article");

    ok((await page.url()).includes('/posts/test-param'));;
    is(await page.title(), 'Test param');
  });
}

export async function testBrowserBack() {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);
    await page.waitForSelector('a[href="/posts/test-param"]');

    // Click navigation link
    await page.click('a[href="/posts/test-param"]');
    await page.waitForSelector("div.article");

    // Back
    await page.goBack();
    await page.waitForTimeout(30);

    ng((await page.url()).includes('/posts/test-param'));
    is(await page.title(), 'Home');
  });
}

export async function testFragment() {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(`${serverUrl}/posts/test-fragment`);
    await page.waitForSelector("div.article");

    await page.click('a[href="#top"]');
    const topY = await page.evaluate(() => window.scrollY);

    await page.click('a[href="#bottom"]');
    const bottomY = await page.evaluate(() => window.scrollY);

    ok(topY < bottomY);
  });
}

export async function testGuard() {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);
    await page.waitForSelector("div.home");

    await page.click('a[href="/admin"]');
    // Redirected to login
    ok((await page.url()).includes('/login'));

    // Do login
    await page.waitForSelector("button");
    await page.click('button#login');

    await page.click('a[href="/admin"]');
    ok((await page.url()).includes('/admin'));
  });
}

export async function testQuery() {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);
    await page.waitForSelector("div.home");

    await page.click('a[href="/query"]');
    await page.waitForSelector("div.query");
    let name = await page.$eval('#name', e => e.innerText);
    is(name, "unknown");

    await page.click('a[href="/query?name=foo"]');
    name = await page.$eval('#name', e => e.innerText);
    is(name, "foo");

    // Back
    await page.goBack();
    await page.waitForTimeout(30);
    name = await page.$eval('#name', e => e.innerText);
    is(name, "unknown");

  });
}
