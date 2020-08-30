/**
 * Browser test using poppeteer
 *
 * The test target is the http server of example app.
 * Therefore, the expectations of the tests depends on app's implementation.
 */
const { server } = require('../server');

// using puppeteer@1.13.0 (https://github.com/puppeteer/puppeteer/issues/4286)
const puppeteer = require('puppeteer');

const test = require('tape');

async function sleep(s) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  });
};

function _browser(cb) {
  return async (t) => {
    // t.plan(1); // XXX: donot use plan because next test will start before closing

    server.listen(8080);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await cb(t, browser, page);

    await browser.close();
    server.close();

    t.end();// call end() after closed.
  };
}

test('Ensure static route rendered', _browser(async (t, browser, page) => {
  await page.goto('http://127.0.0.1:8080/');
  await sleep(0.2);

  t.equal(await page.title(), 'Home');
}));


test('Ensure route with param rendered', _browser(async (t, browser, page) => {
  await page.goto('http://127.0.0.1:8080/posts/test-param');
  await sleep(0.1);

  t.equal(await page.title(), 'Test param');
}));


test('Ensure that link works', _browser(async (t, browser, page) => {
  await page.goto('http://127.0.0.1:8080/');
  await sleep(0.2);

  // Click navigation link
  await page.click('a[href="/posts/test-param"]');
  await sleep(0.1);

  t.assert((await page.url()).includes('/posts/test-param'));;
  t.equal(await page.title(), 'Test param');
}));


test('Ensure that browser back works', _browser(async (t, browser, page) => {
  await page.goto('http://127.0.0.1:8080/');
  await sleep(0.2);

  // Click navigation link
  await page.click('a[href="/posts/test-param"]');
  await sleep(0.1);

  // Back
  await page.goBack();
  await sleep(0.1);

  t.assert(!(await page.url()).includes('/posts/test-param'));
  t.equal(await page.title(), 'Home');
}));

test('Ensure that fragment works', _browser(async (t, browser, page) => {
  await page.goto('http://127.0.0.1:8080/posts/test-fragment');
  await sleep(0.1);

  // Click #top
  await page.click('a[href="#top"]');
  const topY = await page.evaluate(() => window.scrollY);
  // Click #bottom
  await page.click('a[href="#bottom"]');
  const bottomY = await page.evaluate(() => window.scrollY);

  t.assert(topY < bottomY);
}));
