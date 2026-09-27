import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { t } from "../../src/shared/i18n.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-"));
const db = openDatabase(join(dir, "meowtower.sqlite"));
const app = createApp({ db });
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

describe("REQ-2500: the game runs as a web app in a browser on the iPad and the computer", () => {
  it("serves a page that links the manifest and the home-screen icon", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/^text\/html/);
    const html = await res.text();
    expect(html).toContain(
      '<link rel="manifest" href="/manifest.webmanifest">',
    );
    expect(html).toContain(
      '<link rel="apple-touch-icon" href="/icon-512.png">',
    );
    expect(html).toContain(
      '<meta name="apple-mobile-web-app-capable" content="yes">',
    );
    expect(html).toContain(`<title>${t("ui.app.name")}</title>`);
    expect(html).toContain('lang="ru"');
  });

  it("serves a manifest that installs a standalone app", async () => {
    const res = await app.request("/manifest.webmanifest");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(
      /^application\/manifest\+json/,
    );
    const manifest = (await res.json()) as Record<string, unknown>;
    expect(manifest).toMatchObject({
      name: t("ui.app.name"),
      short_name: t("ui.app.shortName"),
      display: "standalone",
      start_url: "/",
      lang: "ru",
    });
    expect(manifest["icons"]).toEqual([
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ]);
  });

  it("serves a 512 by 512 PNG icon", async () => {
    const res = await app.request("/icon-512.png");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
    const png = Buffer.from(await res.arrayBuffer());
    expect(png.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
    expect(png.readUInt32BE(16)).toBe(512);
    expect(png.readUInt32BE(20)).toBe(512);
  });
});

describe("player-facing strings live in the language file (CLAUDE.md, ADR-0160)", () => {
  it("reads the app name from content/i18n/ru.json", () => {
    expect(t("ui.app.name")).toBe("Мяубашня");
  });
});
