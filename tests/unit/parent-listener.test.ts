import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createParentApp } from "../../src/server/parent.js";
import { openDatabase } from "../../src/server/database.js";
import { t } from "../../src/shared/i18n.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-"));
const db = openDatabase(join(dir, "meowtower.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

describe("REQ-2510: the Parent Room has its own listener", () => {
  it("serves the Parent Room page", async () => {
    const res = await createParentApp().request("/");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain(t("parent.room.title"));
  });
});
