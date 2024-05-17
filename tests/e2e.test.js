import assert from "node:assert";
import test from "node:test";

import { chromium } from "playwright";

import { server } from "../examples/app-svelte4/server.js";

/**
 * Fixture to provide browser
 */
async function browserFixture(test) {
  server.listen(18901);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const serverUrl = "http://127.0.0.1:18901";

  try {
    await test(browser, page, serverUrl);
  } finally {
    await browser.close();
    server.close();
  }
}


test("basic routing", async (t) => {
  const params = [
    ['/', "div.home", 'Home'],
    ['/posts/test-param', "div.article", 'Test param'],
    ['/posts/test/param/with/slash', "div.article", "Test param with path"],
  ];
  for (const [ path, selector, title ] of params) {
    await t.test(`basic routing: route ${path}`, async (t) => {
      await browserFixture(async (browser, page, serverUrl) => {
        await page.goto(`${serverUrl}${path}`);
        await page.waitForSelector(selector);

        assert.strictEqual(title, await page.title());
      });
    });
  }
});

test("link", async () => {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);
    await page.waitForSelector('a[href="/posts/test-param"]');

    await page.click('a[href="/posts/test-param"]');

    await page.waitForSelector("div.article");
    assert.ok((await page.url()).includes('/posts/test-param'));
    assert.strictEqual(await page.title(), 'Test param');
  });
});

test("browser back", async () => {
    await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);
    await page.waitForSelector('a[href="/posts/test-param"]');

    // Click navigation link
    await page.click('a[href="/posts/test-param"]');
    await page.waitForSelector("div.article");

    // Back
    await page.goBack();
    await page.waitForTimeout(30);

    assert.ok((await page.url()).includes('/posts/test-param') === false);
    assert.strictEqual(await page.title(), 'Home');
  });
});

test("fragment", async () => {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(`${serverUrl}/posts/test-fragment`);
    await page.waitForSelector("div.article");

    await page.click('a[href="#top"]');
    const topY = await page.evaluate(() => window.scrollY);

    await page.click('a[href="#bottom"]');
    const bottomY = await page.evaluate(() => window.scrollY);

    assert.ok(topY < bottomY);
  });
});

test("guard", async () => {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);
    await page.waitForSelector("div.home");

    await page.click('a[href="/admin"]');
    // Redirected to login
    assert.ok((await page.url()).includes('/login'));

    // Do login
    await page.waitForSelector("button#login");
    await page.click('button#login');

    await page.click('a[href="/admin"]');
    assert.ok((await page.url()).includes('/admin'));
  });
});

test("query", async () => {
  await browserFixture(async (browser, page, serverUrl) => {
    await page.goto(serverUrl);
    await page.waitForSelector("div.home");

    await page.click('a[href="/query"]');
    await page.waitForSelector("div.query");
    let name = await page.$eval('#name', e => e.innerText);
    assert.equal(name, "unknown");

    await page.click('a[href="/query?name=foo"]');
    name = await page.$eval('#name', e => e.innerText);
    assert.equal(name, "foo");

    // Back
    await page.goBack();
    await page.waitForTimeout(30);
    name = await page.$eval('#name', e => e.innerText);
    assert.equal(name, "unknown");
  });
});
