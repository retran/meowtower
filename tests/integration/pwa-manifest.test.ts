// REQ-6508: the manifest has what a browser's install check wants, and both icons are PNG files.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-pwa-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("the web app manifest", () => {
  it("names an id, a scope, a standalone display and icons of 192 and 512 pixels", async () => {
    const db = await openDatabase(join(root, "m.sqlite"));
    const app = await createApp({ db, now: () => 1_000_000 });
    const res = await app.request("/manifest.webmanifest");
    expect(res.status).toBe(200);
    const manifest = (await res.json()) as {
      id: string;
      scope: string;
      display: string;
      start_url: string;
      icons: { src: string; sizes: string; type: string }[];
    };
    expect(manifest.id).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.map((i) => i.sizes).sort()).toEqual([
      "192x192",
      "512x512",
    ]);
    for (const icon of manifest.icons) {
      const file = await app.request(icon.src);
      expect(file.status).toBe(200);
      expect(file.headers.get("content-type")).toBe("image/png");
      const bytes = new Uint8Array(await file.arrayBuffer());
      // The PNG signature, then the width in the header chunk.
      expect(Array.from(bytes.slice(1, 4))).toEqual([0x50, 0x4e, 0x47]);
      const width = new DataView(bytes.buffer).getUint32(16);
      expect(`${String(width)}x${String(width)}`).toBe(icon.sizes);
    }
    await db.close();
  });
});
