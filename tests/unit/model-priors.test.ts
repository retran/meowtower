// TSK-0519: the starting estimates follow the subtype's level and the school group the
// parent set; a change of the setting is a new model version; the player's group is
// read from the log, never written in the code (ADR-0060, REQ-0982 to REQ-3712).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadParams } from "../../src/engine/model/params.js";
import {
  modelVersionOf,
  priorOf,
  rowOf,
  schoolGroupOf,
} from "../../src/engine/model/priors.js";

const params = loadParams(
  readFileSync(new URL("../../content/model.v1.json", import.meta.url), "utf8"),
);
const setting = (value: number) => ({
  type: "settings_changed",
  payload: { key: "schoolGroup", value },
});

describe("REQ-0982: the priors of group 7 and group 8", () => {
  it("gives 0.55, 0.25 and 0.05 for group 7", () => {
    expect([
      priorOf(params, 7, "1F"),
      priorOf(params, 7, "1S"),
      priorOf(params, 7, "stretch"),
    ]).toEqual([0.55, 0.25, 0.05]);
  });

  it("gives 0.70, 0.40 and 0.10 for group 8", () => {
    expect([
      priorOf(params, 8, "1F"),
      priorOf(params, 8, "1S"),
      priorOf(params, 8, "stretch"),
    ]).toEqual([0.7, 0.4, 0.1]);
  });

  it("starts a node's 1F subtypes higher than its 1S subtypes", () => {
    expect(priorOf(params, 7, "1F")).toBeGreaterThan(priorOf(params, 7, "1S"));
  });
});

describe("REQ-0984: a changed setting is a new model version, and the earlier rows stay", () => {
  it("gives a different version for group 7 and group 8, and keeps both rows in the file", () => {
    const seven = rowOf([setting(7)]);
    const eight = rowOf([setting(7), setting(8)]);
    expect(modelVersionOf(params.version, seven)).not.toBe(
      modelVersionOf(params.version, eight),
    );
    expect(params.pInit["7"]).toBeDefined();
    expect(params.pInit["8"]).toBeDefined();
  });
});

describe("REQ-3712: no setting means group 7, and the clock doesn't change the prior", () => {
  it("uses the group 7 row when the log holds no school-group setting", () => {
    expect(schoolGroupOf([])).toBeNull();
    expect(rowOf([])).toBe(7);
    expect(priorOf(params, rowOf([]), "1F")).toBe(0.55);
  });

  it("gives the same prior whatever time it is read at", () => {
    const log = [setting(8)];
    const before = priorOf(params, rowOf(log), "1S");
    const after = priorOf(params, rowOf(log), "1S");
    expect(after).toBe(before);
  });
});

describe("REQ-3712: no source file names the player's school group as a value to use", () => {
  const roots = ["src", "content", "tests", "tools"];
  const allowed = [
    "src/engine/model/priors.ts",
    "tests/unit/model-priors.test.ts",
  ];
  const pattern = /schoolGroup\W{0,4}[1-8]\b/;

  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? files(path) : [path];
    });

  it("finds no literal school group in the code, the content or the tests", () => {
    const hits = roots
      .flatMap((r) => files(join(process.cwd(), r)))
      .filter((f) => /\.(ts|json|yaml|md)$/.test(f))
      .map((f) => f.slice(process.cwd().length + 1))
      .filter((f) => !allowed.includes(f))
      .filter((f) =>
        pattern.test(readFileSync(join(process.cwd(), f), "utf8")),
      );
    expect(hits).toEqual([]);
  });
});
