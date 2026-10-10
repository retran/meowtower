// TSK-0460: every projection declares its class, and the import check of
// REQ-2224 reads the registry instead of a list of file names beside it
// (ADR-0370 entry 2, SPC-0020). The check takes its projections as a second
// argument that defaults to `PROJECTIONS`, so a fixture passes its own.
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { PROJECTIONS } from "../../src/engine/projections/registry.js";
import {
  checkGameProjectionImports,
  type Finding,
} from "../../tools/static-checks.js";

interface Entry {
  name: string;
  class: "game" | "knowledge";
  module: string;
}
// The two-argument form is the one this task adds.
const run = checkGameProjectionImports as unknown as (
  root: string,
  projections?: Entry[],
) => Finding[];

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
function repo(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "meowtower-class-"));
  dirs.push(root);
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}
const P = "src/engine/projections";
const entry = (
  root: string,
  name: string,
  cls: Entry["class"],
  file = `${name}.ts`,
): Entry => ({
  name,
  class: cls,
  module: pathToFileURL(join(root, P, file)).href,
});

describe("REQ-2224: each registry entry declares its class", () => {
  it("gives every entry a class and the classes SPC-0020 lists", () => {
    const classes = Object.fromEntries(
      PROJECTIONS.map((p) => [p.name, (p as { class?: string }).class]),
    );
    expect(classes).toEqual({
      adventures: "game",
      sessions: "game",
      resume_snapshot: "game",
      inventory: "game",
      reward_queue: "game",
      items_view: "game",
      attempts_view: "game",
      parent_settings: "game",
      node_snapshots: "knowledge",
    });
  });
  it("gives every entry the module that holds it", () => {
    for (const p of PROJECTIONS)
      expect((p as { module?: string }).module).toMatch(
        /^file:\/\/.*\/src\/engine\/projections\/[a-z-]+\.ts$/,
      );
  });
});

describe("REQ-2224: each entry's module is the file that defines it", () => {
  it("names the defining file for every registered entry", async () => {
    const own = {
      "flat-views": await import("../../src/engine/projections/flat-views.js"),
      lifecycle: await import("../../src/engine/projections/lifecycle.js"),
      resume: await import("../../src/engine/projections/resume.js"),
      rewards: await import("../../src/engine/projections/rewards.js"),
      settings: await import("../../src/engine/projections/settings.js"),
      knowledge: await import("../../src/engine/projections/knowledge.js"),
    };
    const defined = new Map<string, string>();
    for (const [file, mod] of Object.entries(own)) {
      const url = pathToFileURL(join(process.cwd(), P, `${file}.ts`)).href;
      for (const value of Object.values(mod))
        for (const p of [value].flat() as { name?: string }[])
          if (p && typeof p === "object" && p.name) defined.set(p.name, url);
    }
    for (const p of PROJECTIONS)
      expect((p as { module?: string }).module, p.name).toBe(
        defined.get(p.name),
      );
    expect(defined.size).toBeGreaterThanOrEqual(PROJECTIONS.length);
  });
});

describe("REQ-2224: a module that mixes classes fails", () => {
  it("names projection_class_mixed for one module with a game and a knowledge entry", () => {
    const root = repo({ [`${P}/both.ts`]: "export const x = 1;\n" });
    const found = run(root, [
      entry(root, "a", "game", "both.ts"),
      entry(root, "b", "knowledge", "both.ts"),
    ]);
    expect(found.map((f) => f.check)).toContain("projection_class_mixed");
  });
  it("passes a module whose entries share a class, and a helper with no entry", () => {
    const root = repo({
      [`${P}/two.ts`]: 'import "./helper.js";\n',
      [`${P}/helper.ts`]: "export const h = 1;\n",
    });
    expect(
      run(root, [
        entry(root, "a", "game", "two.ts"),
        entry(root, "b", "game", "two.ts"),
      ]),
    ).toEqual([]);
  });
});

describe("REQ-2224: the import rule follows the declared class, through a helper", () => {
  const files = {
    [`${P}/quests.ts`]: 'import { h } from "./helper.js";\n',
    [`${P}/helper.ts`]: 'import { m } from "../model/estimate.js";\n',
    "src/engine/model/estimate.ts": "export const m = 1;\n",
    [`${P}/reads-server.ts`]: 'import { v } from "../../server/versions.js";\n',
    "src/server/versions.ts": "export const v = 1;\n",
    [`${P}/reads-engine.ts`]: 'import { v } from "./versions.js";\n',
    [`${P}/versions.ts`]: "export const v = 1;\n",
  };
  it("names the entry and the chain through the helper for a game projection", () => {
    const root = repo(files);
    const [found] = run(root, [entry(root, "quests", "game")]);
    expect(found).toMatchObject({
      check: "game_projection_imports",
      file: join(P, "quests.ts"),
      match: [
        join(P, "quests.ts"),
        join(P, "helper.ts"),
        join("src", "engine", "model", "estimate.ts"),
      ].join(" -> "),
    });
  });
  it("fails a game projection that imports either versions.ts", () => {
    const root = repo(files);
    expect(run(root, [entry(root, "reads-server", "game")])).toHaveLength(1);
    expect(run(root, [entry(root, "reads-engine", "game")])).toHaveLength(1);
  });
  it("passes all three declared knowledge", () => {
    const root = repo(files);
    expect(
      run(root, [
        entry(root, "quests", "knowledge"),
        entry(root, "reads-server", "knowledge"),
        entry(root, "reads-engine", "knowledge"),
      ]),
    ).toEqual([]);
  });
});

describe("REQ-2224: no projection's code names llm_log", () => {
  it("names the file for an identifier or a string, of either class", () => {
    const root = repo({
      [`${P}/ident.ts`]: "export const llm_log = 1;\n",
      [`${P}/text.ts`]: 'export const q = "SELECT * FROM llm_log";\n',
    });
    for (const cls of ["game", "knowledge"] as const) {
      const found = run(root, [
        entry(root, "ident", cls),
        entry(root, "text", cls),
      ]).filter((f) => f.check === "projection_reads_llm_log");
      expect(found.map((f) => f.file).sort()).toEqual([
        join(P, "ident.ts"),
        join(P, "text.ts"),
      ]);
    }
  });
  it("names a helper that a projection imports and that names it", () => {
    const root = repo({
      [`${P}/uses.ts`]: 'import { q } from "./helper.js";\n',
      [`${P}/helper.ts`]: 'export const q = "SELECT 1 FROM llm_log";\n',
    });
    const found = run(root, [entry(root, "uses", "game")]).filter(
      (f) => f.check === "projection_reads_llm_log",
    );
    expect(found.map((f) => f.file)).toEqual([join(P, "helper.ts")]);
    expect(found[0]?.match).toContain(join(P, "uses.ts"));
  });
  it("does not count a comment", () => {
    const root = repo({
      [`${P}/note.ts`]: "// llm_log is read elsewhere\nexport const x = 1;\n",
    });
    expect(run(root, [entry(root, "note", "game")])).toEqual([]);
  });
});

describe("REQ-2224: the check keeps no list of projection modules", () => {
  const source = readFileSync(
    join(process.cwd(), "tools", "static-checks.ts"),
    "utf8",
  );
  it("drops NOT_GAME", () => {
    expect(source).not.toContain("NOT_GAME");
  });
  it("names no file under src/engine/projections/ but versions.ts", () => {
    const named = [
      ...source.matchAll(/src\/engine\/projections\/([A-Za-z0-9_.-]+\.ts)/g),
    ].map((m) => m[1]);
    expect(named.filter((f) => f !== "versions.ts")).toEqual([]);
  });
  it("forbids both versions.ts modules for a game projection", () => {
    expect(source).toContain("src/engine/projections/versions.ts");
    expect(source).toContain("src/server/versions.ts");
  });
});
