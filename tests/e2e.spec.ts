import { test, expect } from "@playwright/test";


test.describe("basic routing", () => {
  const params = [
    ['/', "main.top", 'Top'],
    ['/blog/posts/2024/03/01/baz', "main.post", 'baz'],
  ];
  for (const [ path, selector, title ] of params) {
    test(`${path} title should be ${title}`, async({ page }) => {
      await page.goto(path);
      await page.waitForSelector(selector);
      await expect(page).toHaveTitle(title);
    });
  }
});

test("link", async({ page }) => {
  await page.goto("/blog");

  const selector = 'a[href="/blog/posts/2024/01/01/foo"]'
  await page.waitForSelector(selector);

  // Click navigation link
  await page.click(selector);

  await page.waitForSelector("main.post");
  await expect(page).toHaveTitle("foo");
  await expect(page).toHaveURL("/blog/posts/2024/01/01/foo");
});

test("browser back", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("main.top");
  await page.click('a[href="/blog"]');

  const selector = 'a[href="/blog/posts/2024/01/01/foo"]';
  await page.waitForSelector(selector);

  // Click navigation link
  await page.click(selector);

  await page.waitForSelector("main.post");

  // Back
  await page.goBack();

  await page.waitForSelector("main.blog");
  await expect(page).toHaveTitle("Blog");
  await expect(page).toHaveURL("/blog");

  // Back
  await page.goBack();

  await page.waitForSelector("main.top");
  await expect(page).toHaveTitle("Top");
  await expect(page).toHaveURL("/");
});


test.describe("path variable", () => {
  for (const slug of ["p/1", "q/2"]) {
    test(`with slug=${slug}`, async({ page }) => {
      await page.goto(`/params/${slug}`);
      await page.waitForSelector("main.params");
      await expect(page).toHaveTitle(`Slug ${slug}`);

      expect(await page.innerText(".slug")).toBe(`slug: ${slug}`);
    });
  }
});


test("cast props", async ({ page }) => {
  await page.goto("/int-param/1");
  await page.waitForSelector("main.int-param");
  await expect(page.locator(".value")).toContainText("value: 1");
  await expect(page.locator(".twice")).toContainText("twice: 2");
});


test("conditional components", async ({ page }) => {
  await page.goto("/conditional/1");
  await page.waitForSelector("main.int-param");
  await expect(page.locator(".value")).toContainText("value: 1");

  await page.goto("/conditional/a");
  await page.waitForSelector("main.message");
  await expect(page.locator(".message")).toContainText("Unexpected param: a");
});


test("fragment", async ({ page }) => {
  await page.goto("/blog/posts/2024/04/01/test-fragment");
  await page.waitForSelector("main.post");

  await page.click('a[href="#top"]');
  const topY = await page.evaluate(() => window.scrollY);

  await page.click('a[href="#bottom"]');
  const bottomY = await page.evaluate(() => window.scrollY);

  expect(topY < bottomY).toBeTruthy();
});


test("guard", async ({ page }) => {
  await page.goto("/admin")

  // redirected
  await page.waitForSelector("main.top");
  await expect(page).toHaveURL("/");

  // Do login
  await page.waitForSelector("button#login");
  await page.click('button#login');

  await page.click('a[href="/admin"]');
  await page.waitForSelector("main.admin")
  await expect(page).toHaveURL("/admin");
});


test("query", async ({ page }) => {
  await page.goto("/query")

  await page.waitForSelector("main.query");
  await expect(page.locator("#name")).toContainText("unknown");

  await page.click('a[href="/query?name=foo"]');
  await expect(page).toHaveURL("/query?name=foo");
  await expect(page.locator("#name")).toContainText("foo");
});
