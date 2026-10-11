// TSK-0509: a template or a catalogue row that names a missing node or subtype fails
// the build, and a subtype with no template is listed as not_generatable (REQ-1244).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import { checkCatalogue, notGeneratable } from "../../src/engine/catalogue.js";

const small = openGraph(
  readFileSync(
    new URL("../fixtures/graph-small.yaml", import.meta.url),
    "utf8",
  ),
);
const real = openGraph(readFileSync(GRAPH_FILE, "utf8"));

describe("REQ-1244: a template that names a missing subtype fails the build", () => {
  it("names the template and the missing id", () => {
    expect(() =>
      checkCatalogue(
        small,
        [{ id: "fixture.bad", node: "N2", subtype: "nope" }],
        [],
      ),
    ).toThrow(/fixture\.bad.*nope/);
  });

  it("passes a template naming an existing subtype", () => {
    expect(() =>
      checkCatalogue(
        small,
        [{ id: "fixture.ok", node: "N2", subtype: "fraction" }],
        [],
      ),
    ).not.toThrow();
  });
});

describe("REQ-1244: a catalogue row that names a missing node fails the build", () => {
  it("names the row", () => {
    expect(() =>
      checkCatalogue(small, [], [{ node: "Z9", subtypes: ["x"] }]),
    ).toThrow(/catalogue row Z9/);
  });
});

describe("REQ-1244: a subtype with no template is not_generatable", () => {
  it("lists every subtype of the small graph when no template exists", () => {
    expect(notGeneratable(small, [])).toEqual([
      "N1.whole",
      "N2.fraction",
      "N3.blocks",
    ]);
  });

  it("lists only the subtype that has no template", () => {
    expect(
      notGeneratable(small, [{ id: "t", node: "N1", subtype: "whole" }]),
    ).toEqual(["N2.fraction", "N3.blocks"]);
  });

  it("lists every subtype of the real file when no template exists yet", () => {
    const total = real
      .nodes()
      .reduce((acc, n) => acc + real.subtypes(n.id).length, 0);
    expect(notGeneratable(real, [])).toHaveLength(total);
  });
});
