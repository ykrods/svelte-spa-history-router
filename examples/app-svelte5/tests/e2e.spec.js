import { test, expect } from "@playwright/test";

test.describe("basic routing", () => {
  const params = [
    ['/', "main.home", 'Home'],
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
  await page.waitForSelector("main.home");
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

  await page.waitForSelector("main.home");
  await expect(page).toHaveTitle("Home");
  await expect(page).toHaveURL("/");
});

test.describe("route params", () => {
  for (const id of [1, 2]) {
    test(`with id=${id}`, async({ page }) => {
      await page.goto(`/guide/${id}`);
      await page.waitForSelector("main.guide");
      await expect(page).toHaveTitle(`Guide ${id}`);
      expect(await page.innerText(".routeParams")).toBe(`routeParams: ${id}`);
      expect(await page.innerText(".params")).toBe(`params: ${id}`);
    });
  }
});
