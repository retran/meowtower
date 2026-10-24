// TSK-0677: with a language file whose values are the keys, no screen shows or names anything that
// isn't a key, so no string is written into the client (ADR-0160, REQ-3810).
import { expect, test } from "./fixtures.js";

test("REQ-3810: every screen shows only keys under a pseudo-language", async ({
  page,
}) => {
  const real = (await (
    await page.request.get("/i18n/ru.json")
  ).json()) as Record<string, string>;
  const keys = Object.keys(real);
  const pseudo = Object.fromEntries(keys.map((k) => [k, k]));
  await page.route("**/i18n/ru.json", (route) =>
    route.fulfill({ json: pseudo }),
  );

  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  const routes = JSON.parse(
    (await page.evaluate(() => document.documentElement.dataset["routes"])) ??
      "[]",
  ) as string[];
  expect(routes.length).toBeGreaterThan(3);

  const known = new Set(keys);
  const stray: string[] = [];
  for (const path of routes) {
    await page.goto(`/#${path}`);
    await page.waitForFunction(
      (p) => document.body.dataset["screen"] === p,
      path,
    );
    await page.waitForLoadState("networkidle");
    const seen = await page.evaluate(() => {
      const out: string[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const parent = n.parentElement;
        const text = n.textContent?.trim();
        if (!text || !parent || ["SCRIPT", "STYLE"].includes(parent.tagName))
          continue;
        out.push(text);
      }
      for (const el of document.querySelectorAll(
        "[aria-label],[title],[placeholder],[alt]",
      ))
        for (const attr of ["aria-label", "title", "placeholder", "alt"]) {
          const value = el.getAttribute(attr);
          if (value) out.push(value);
        }
      out.push(document.title);
      return out;
    });
    for (const text of seen)
      if (!known.has(text)) stray.push(`${path}: ${text}`);
  }
  await page.waitForLoadState("networkidle");
  expect(stray, "text on a screen that is not a key").toEqual([]);
});
