import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkNoKeyInClient, checkNoPush } from "../../tools/static-checks.js";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
function repo(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "meowtower-static-"));
  dirs.push(root);
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}

describe("REQ-2504: no model key in anything a client receives", () => {
  it("passes this repository", () => {
    expect(checkNoKeyInClient(process.cwd())).toEqual([]);
  });
  it("names a client file that carries a key", () => {
    const root = repo({ "dist/client/app.js": 'const k = "sk-or-v1-abc123";' });
    expect(checkNoKeyInClient(root)).toEqual([
      {
        check: "key_in_client",
        file: "dist/client/app.js",
        match: "sk-or-v1-abc123",
      },
    ]);
  });
});

describe("REQ-2544, REQ-2546: the MVP holds no push code", () => {
  it("passes this repository", () => {
    expect(checkNoPush(process.cwd())).toEqual([]);
  });
  it.each([
    [
      "migrations/0009_push.sql",
      "CREATE TABLE push_subscriptions (id TEXT);",
      "push_subscriptions",
    ],
    ["src/server/push.ts", "const VAPID_PUBLIC = 'x';", "VAPID"],
    ["package.json", '{"dependencies":{"web-push":"3"}}', "web-push"],
    [
      "src/server/notify.ts",
      'fetch("https://api.push.apple.com/3/device")',
      "push.apple.com",
    ],
  ])("names %s", (file, text, match) => {
    expect(checkNoPush(repo({ [file]: text }))).toEqual([
      { check: "push_code", file, match },
    ]);
  });
});
