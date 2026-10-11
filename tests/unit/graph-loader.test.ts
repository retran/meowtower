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
      "    domain: getal\n    level: 1F",
      "    domain: getal\n    colour: red\n    level: 1F",
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
      domain: "getal",
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
