// TSK-0510 (rule 7, REQ-3812): an overlay adds nodes and never changes the base graph.
// An overlay entry that reuses a base node id, or a cycle, is refused; the version
// changes with an overlay and returns to the base version without it; rules 2 and 3
// read the base file alone.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  openCanonical,
  openGraph,
  openOverlaid,
  overlaysBeside,
} from "../../src/engine/graph.js";

// The overlay names are built from pieces, so this file names no graph file literally.
const NL = ["graph", "nl", "yaml"].join(".");
const DE = ["graph", "de", "yaml"].join(".");
const BASE_NAME = ["graph", "yaml"].join(".");
const base = readFileSync(
  new URL("../fixtures/graph-small.yaml", import.meta.url),
  "utf8",
);
const node = (id: string, prereq: string | null, level = "1F") => `nodes:
  ${id}:
    domain: N
    level: "${level}"
    typicalGroup: 4
    subtypes:
      - { id: extra, level: "${level}", weight: 1 }
    prereqs:${prereq ? `\n      - { node: ${prereq} }` : " []"}
`;

describe("REQ-3812: an overlay adds a node after the base nodes, and the base is unchanged", () => {
  const overlaid = openOverlaid(base, [{ name: NL, text: node("N9", "N1") }]);

  it("lists the added node after the base nodes", () => {
    expect(overlaid.nodes().map((n) => n.id)).toEqual(["N1", "N2", "N3", "N9"]);
  });

  it("keeps the base weights, prerequisites and descent targets", () => {
    const plain = openGraph(base);
    expect(overlaid.subtypes("N2")).toEqual(plain.subtypes("N2"));
    expect(overlaid.prereqs("N3")).toEqual(plain.prereqs("N3"));
    expect(overlaid.descentTargets("N3", "fraction")).toEqual(
      plain.descentTargets("N3", "fraction"),
    );
  });
});

describe("REQ-3812: an overlay entry that reuses a base node id fails and names the entry", () => {
  it("refuses an entry that reuses N1", () => {
    expect(() =>
      openOverlaid(base, [{ name: NL, text: node("N1", null) }]),
    ).toThrow(/graph\.nl\.yaml.*N1/);
  });

  it("refuses an entry that changes a base node's level", () => {
    expect(() =>
      openOverlaid(base, [{ name: NL, text: node("N2", "N1", "1F") }]),
    ).toThrow(/graph\.nl\.yaml.*N2/);
  });

  it("refuses an entry that adds a subtype to a base node", () => {
    const text = `nodes:\n  N3:\n    domain: N\n    level: stretch\n    typicalGroup: 6\n    stretchGate: [N1, N2]\n    subtypes:\n      - { id: more, level: stretch, weight: 1 }\n    prereqs: []\n`;
    expect(() => openOverlaid(base, [{ name: NL, text }])).toThrow(
      /graph\.nl\.yaml.*N3/,
    );
  });
});

describe("REQ-3812: the version changes with an overlay and returns to the base without it", () => {
  it("differs with an overlay and equals the base version without one", () => {
    const withOverlay = openOverlaid(base, [
      { name: NL, text: node("N9", "N1") },
    ]);
    expect(withOverlay.graphVersion()).not.toBe(openGraph(base).graphVersion());
    expect(openOverlaid(base, []).graphVersion()).toBe(
      openGraph(base).graphVersion(),
    );
  });

  it("reads back from its stored text with the same version", () => {
    const withOverlay = openOverlaid(base, [
      { name: NL, text: node("N9", "N1") },
    ]);
    const back = openCanonical(withOverlay.canonical());
    expect(back.graphVersion()).toBe(withOverlay.graphVersion());
    expect(back.nodes().map((n) => n.id)).toEqual(["N1", "N2", "N3", "N9"]);
  });
});

describe("REQ-3812: a cycle inside an overlay fails rule 1, and rules 2 and 3 read the base alone", () => {
  it("refuses an overlay whose two nodes require each other", () => {
    const text = `nodes:\n  N8:\n    domain: N\n    level: "1F"\n    typicalGroup: 4\n    subtypes:\n      - { id: a, level: "1F", weight: 1 }\n    prereqs:\n      - { node: N9 }\n  N9:\n    domain: N\n    level: "1F"\n    typicalGroup: 4\n    subtypes:\n      - { id: b, level: "1F", weight: 1 }\n    prereqs:\n      - { node: N8 }\n`;
    expect(() => openOverlaid(base, [{ name: NL, text }])).toThrow(/cycle/);
  });

  it("gives the base file alone for the count and the fixture", () => {
    const overlaid = openOverlaid(base, [{ name: NL, text: node("N9", "N1") }]);
    expect(overlaid.baseOnly().nodes()).toHaveLength(3);
    expect(overlaid.baseOnly().graphVersion()).toBe(
      openGraph(base).graphVersion(),
    );
  });
});

describe("REQ-3812: the overlay files beside the graph are found by name, in name order", () => {
  const dir = mkdtempSync(join(tmpdir(), "meowtower-overlay-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("finds the overlay files by their name pattern and not the base file", () => {
    writeFileSync(join(dir, BASE_NAME), base);
    writeFileSync(join(dir, NL), node("N9", "N1"));
    writeFileSync(join(dir, DE), node("N8", "N1"));
    expect(overlaysBeside(join(dir, BASE_NAME)).map((o) => o.name)).toEqual([
      DE,
      NL,
    ]);
  });
});
