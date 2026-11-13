// REQ-8304 (ADR-3280): a checklist names where each game feature is tested, and a test fails when a
// feature has no place. A feature is a screen of the client or a route of the studio.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  featuresOf,
  gaps,
  readChecklist,
} from "../../src/server/studio/checklist.js";

const root = process.cwd();

describe("REQ-8304: the gaps of a checklist", () => {
  const exists = (p: string): boolean => p !== "tests/gone.test.ts";

  it("names a feature that has no entry, an entry with no test and an entry that is stale", () => {
    const found = gaps(
      ["screen:/a", "screen:/b", "screen:/c"],
      {
        features: [
          { id: "screen:/a", tests: ["tests/a.test.ts"] },
          { id: "screen:/b", tests: [] },
          { id: "screen:/old", tests: ["tests/old.test.ts"] },
        ],
      },
      exists,
    );
    expect(found.unplaced).toEqual(["screen:/b", "screen:/c"]);
    expect(found.stale).toEqual(["screen:/old"]);
    expect(found.missingFiles).toEqual([]);
  });

  it("names a test file that does not exist", () => {
    const found = gaps(
      ["screen:/a"],
      { features: [{ id: "screen:/a", tests: ["tests/gone.test.ts"] }] },
      exists,
    );
    expect(found.missingFiles).toEqual(["screen:/a: tests/gone.test.ts"]);
    expect(found.unplaced).toEqual([]);
  });

  it("finds nothing wrong with a checklist that matches", () => {
    const found = gaps(
      ["screen:/a"],
      { features: [{ id: "screen:/a", tests: ["tests/a.test.ts"] }] },
      exists,
    );
    expect(found).toEqual({ unplaced: [], stale: [], missingFiles: [] });
  });
});

describe("REQ-8304: this repository's checklist", () => {
  const features = featuresOf(root);

  it("reads the screens of the client and the routes of the studio", () => {
    expect(features).toContain("screen:/play");
    expect(features).toContain("screen:/studio");
    expect(features).toContain("api:POST /sandbox/levers");
    expect(features).toContain("api:POST /sandbox/play/start");
  });

  it("reads the routes of the child's game, the pairing, the Parent Room, the accounts and the parent app", () => {
    for (const feature of [
      "api:POST /api/session/:id/answer",
      "api:GET /api/session/:id/next",
      "api:GET /api/device",
      "api:POST /api/pair",
      "api:PUT /api/parent/settings",
      "api:POST /api/account/login",
      "api:GET /health",
      "parent-app:POST /pin",
    ])
      expect(features, feature).toContain(feature);
  });

  it("places every feature, keeps no stale entry and names only tests that exist", () => {
    const found = gaps(features, readChecklist(root), (p) =>
      existsSync(join(root, p)),
    );
    expect(found).toEqual({ unplaced: [], stale: [], missingFiles: [] });
  });
});
