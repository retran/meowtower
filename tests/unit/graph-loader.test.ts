// TSK-0500: the skill graph loads from one YAML file, is checked by one strict
// schema, has a version that a comment doesn't change, and answers the read-only
// queries (REQ-0804, REQ-0808). A file that breaks the schema or the alias cap
// is refused (REQ-0808).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GraphInvalid, openGraph } from "../../src/engine/graph.js";

const fixture = readFileSync(
  new URL("../fixtures/graph-small.yaml", import.meta.url),
  "utf8",
);

describe("REQ-0804: the version is g- and 12 hex digits, and a comment changes nothing", () => {
  it("gives a version of the form g-<12 hex digits>", () => {
    expect(openGraph(fixture).graphVersion()).toMatch(/^g-[0-9a-f]{12}$/);
  });

  it("differs when one subtype weight changes", () => {
    const changed = fixture.replace(
      "{ id: whole, level: 1F, weight: 1 }",
      "{ id: whole, level: 1F, weight: 2 }",
    );
    expect(changed).not.toBe(fixture);
    expect(openGraph(changed).graphVersion()).not.toBe(
      openGraph(fixture).graphVersion(),
    );
  });

  it("is unchanged when only a YAML comment changes", () => {
    const commented = `# a new comment\n${fixture}`;
    expect(openGraph(commented).graphVersion()).toBe(
      openGraph(fixture).graphVersion(),
    );
  });
});

describe("REQ-0808: the schema names the node and the field it refuses", () => {
  it("refuses a node without typicalGroup and names the node and the field", () => {
    const missing = fixture.replace("    typicalGroup: 4\n", "");
    expect(() => openGraph(missing)).toThrow(GraphInvalid);
    expect(() => openGraph(missing)).toThrow(
      /N2.*typicalGroup|typicalGroup.*N2/,
    );
  });

  it("refuses a level of 2F", () => {
    const bad = fixture.replace("    level: 1S\n", "    level: 2F\n");
    expect(() => openGraph(bad)).toThrow(/N2.*level/);
  });

  it("refuses stretchGate on a node that isn't a stretch node", () => {
    const bad = fixture.replace(
      "    level: 1S\n    typicalGroup: 4\n",
      "    level: 1S\n    typicalGroup: 4\n    stretchGate: [N1]\n",
    );
    expect(() => openGraph(bad)).toThrow(/N2.*stretchGate/);
  });

  it("refuses a field the schema doesn't name", () => {
    const extra = fixture.replace(
      "    domain: N\n    level: 1F",
      "    domain: N\n    colour: red\n    level: 1F",
    );
    expect(() => openGraph(extra)).toThrow(/colour/);
  });

  it("refuses a prerequisite cycle", () => {
    const cyclic = fixture.replace(
      "    prereqs: []",
      "    prereqs:\n      - { node: N2 }",
    );
    expect(() => openGraph(cyclic)).toThrow(/cycle/);
  });
});

describe("REQ-0808: the query module answers from a complete record", () => {
  const graph = openGraph(fixture);

  it("node(id) gives the domain, level, ruOnly and stretchGate", () => {
    expect(graph.node("N1")).toEqual({
      domain: "N",
      level: "1F",
      ruOnly: false,
      stretchGate: undefined,
    });
    expect(graph.node("N3")).toEqual(
      expect.objectContaining({ level: "stretch", stretchGate: ["N1", "N2"] }),
    );
  });

  it("subtypes(id) gives each subtype's level and weight", () => {
    expect(graph.subtypes("N2")).toEqual([
      expect.objectContaining({ id: "fraction", level: "1S", weight: 1 }),
    ]);
  });

  it("prereqs(id) gives each prerequisite with its optional subtype tag", () => {
    expect(graph.prereqs("N2")).toEqual([{ node: "N1", subtype: undefined }]);
    expect(graph.prereqs("N3")).toEqual([{ node: "N2", subtype: "fraction" }]);
  });

  it("topics, sloGoals and changes answer from the file", () => {
    expect(graph.topics()).toEqual([]);
    expect(graph.sloGoals()).toEqual([
      { id: "slo-1", level: "1F", text: "Rekenen op getallen tot 100" },
    ]);
    expect(graph.changes()).toEqual([]);
  });
});

describe("ADR-0050: the parser keeps its cap of 100 aliases", () => {
  it("refuses a file with 101 aliases", () => {
    const aliases = Array.from({ length: 101 }, () => "*base").join(", ");
    const text = `base: &base 1\nlist: [${aliases}]\nnodes: {}\ntopics: []\nsloGoals: []\nchanges: []\n`;
    expect(() => openGraph(text)).toThrow(GraphInvalid);
  });
});

describe("TSK-0501: the validator refuses a node that breaks a field rule, and names it", () => {
  it("refuses an id that doesn't start with its domain's letter", () => {
    const bad = fixture.replace("  N2:\n    domain: N", "  X2:\n    domain: N");
    expect(() => openGraph(bad)).toThrow(/X2.*domain/);
  });

  it("refuses a typicalGroup of 9", () => {
    const bad = fixture.replace("    typicalGroup: 4", "    typicalGroup: 9");
    expect(() => openGraph(bad)).toThrow(/N2.*typicalGroup/);
  });

  it("refuses a subtype weight of 0", () => {
    const bad = fixture.replace(
      "{ id: fraction, level: 1S, weight: 1 }",
      "{ id: fraction, level: 1S, weight: 0 }",
    );
    expect(() => openGraph(bad)).toThrow(/N2.*weight/);
  });

  it("refuses a 1S node with no 1S subtype", () => {
    const bad = fixture.replace(
      "{ id: fraction, level: 1S, weight: 1 }",
      "{ id: fraction, level: 1F, weight: 1 }",
    );
    expect(() => openGraph(bad)).toThrow(/N2.*level/);
  });

  it("refuses a topic that carries a prerequisite field", () => {
    const bad = fixture.replace(
      "topics: []",
      "topics:\n  - { id: E1, name: Licht, prereqs: [N1] }",
    );
    expect(() => openGraph(bad)).toThrow(/prereqs/);
  });

  it("refuses a maths node whose prerequisite is a topic", () => {
    const bad = fixture
      .replace("    prereqs: []", "    prereqs:\n      - { node: E1 }")
      .replace("topics: []", "topics:\n  - { id: E1, name: Licht }");
    expect(() => openGraph(bad)).toThrow(/E1/);
  });
});

describe("REQ-0854: the node list is the file's nodes in file order, and typicalGroup is a query", () => {
  it("lists the nodes in file order with their typical group", () => {
    const graph = openGraph(fixture);
    expect(graph.nodes().map((n) => n.id)).toEqual(["N1", "N2", "N3"]);
    expect(graph.typicalGroup("N2")).toBe(4);
  });
});
