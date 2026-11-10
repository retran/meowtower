// REQ-8500, REQ-8502, REQ-8508: the parent signs in with the code from her email, adds a child, asks
// for a pairing code for the child's device, and sees and sets the account's budget. The e2e server
// runs on SQLite, which has no accounts, so the account routes are answered here.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

async function ready(page: Page): Promise<void> {
  await page.goto("about:blank");
  await page.goto("/#/account");
  await expect(page.locator("body")).toHaveAttribute("data-screen", "/account");
  await expect(page.locator("[data-busy]")).toHaveCount(0);
}

/** A tiny account server: signed in once the code is right, with the children added so far. */
async function stub(page: Page): Promise<{ limit: () => number }> {
  let signedIn = false;
  const profiles: { id: string; label: string }[] = [];
  let limit = 200;
  await page.route("**/api/account/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    const method = route.request().method();
    const json = (status: number, body: object) =>
      route.fulfill({ status, json: body });
    if (path.endsWith("/code")) return json(200, { status: "sent" });
    if (path.endsWith("/login")) {
      const { code } = route.request().postDataJSON() as { code: string };
      if (code !== "123456") return json(403, { error: "code_invalid" });
      signedIn = true;
      return json(200, { email: "mother@example.org" });
    }
    if (!signedIn) return json(401, { error: "account_session_missing" });
    if (path.endsWith("/me"))
      return json(200, { email: "mother@example.org", profiles });
    if (path.endsWith("/spend"))
      return json(200, { usd: 1.5, limitUsd: limit, profiles: [] });
    if (path.endsWith("/budget") && method === "PUT") {
      limit = (route.request().postDataJSON() as { monthUsd: number }).monthUsd;
      return json(200, { limitUsd: limit });
    }
    if (path.endsWith("/pair-code")) return json(200, { code: "654321" });
    if (path.endsWith("/profiles") && method === "POST") {
      const { label } = route.request().postDataJSON() as { label: string };
      profiles.push({ id: "p-1", label });
      return json(201, { id: "p-1", label });
    }
    return json(404, { error: "unknown" });
  });
  return { limit: () => limit };
}

test("REQ-8502: a wrong code is refused and the right one signs the parent in", async ({
  page,
}) => {
  await stub(page);
  await ready(page);
  await page.locator("#account-email").fill("mother@example.org");
  await page.locator('[data-action="account-send"]').click();
  await expect(page.getByRole("status")).toContainText("Код отправлен");
  await page.locator("#account-code").fill("000000");
  await page.locator('[data-action="account-login"]').click();
  await expect(page.getByRole("status")).toContainText("Код не подошёл");
  await page.locator("#account-code").fill("123456");
  await page.locator('[data-action="account-login"]').click();
  await expect(page.getByText("Вы вошли как mother@example.org")).toBeVisible();
});

test("REQ-8500, REQ-8508, REQ-8518: she adds a child, gets a pairing code and sets the budget", async ({
  page,
}) => {
  const server = await stub(page);
  await ready(page);
  await page.locator("#account-email").fill("mother@example.org");
  await page.locator("#account-code").fill("123456");
  await page.locator('[data-action="account-login"]').click();
  await expect(page.getByText("Пока нет ни одного ребёнка.")).toBeVisible();

  await page.locator("#profile-label").fill("Первый");
  await page.locator('[data-action="profile-add"]').click();
  await expect(page.locator("ul.profiles li")).toContainText("Первый");
  await page.locator('[data-action="pair-code-p-1"]').click();
  await expect(page.locator("ul.profiles li")).toContainText("Код 654321");

  await expect(page.getByText("потрачено 1.50 из 200 долларов")).toBeVisible();
  await page.locator("#account-budget").fill("500");
  await page.locator('[data-action="budget-save"]').click();
  await expect(page.getByRole("status").last()).toContainText("от 1 до 200");
  expect(server.limit()).toBe(200);
  await page.locator("#account-budget").fill("40");
  await page.locator('[data-action="budget-save"]').click();
  await expect.poll(() => server.limit()).toBe(40);
});

test("REQ-8502: a start with no session shows the sign-in form, and sign-out returns to it", async ({
  page,
}) => {
  await stub(page);
  await ready(page);
  await expect(page.locator("#account-email")).toBeVisible();
  await page.locator("#account-code").fill("123456");
  await page.locator('[data-action="account-login"]').click();
  await page.locator('[data-action="account-logout"]').click();
  await expect(page.locator("#account-email")).toBeVisible();
});
