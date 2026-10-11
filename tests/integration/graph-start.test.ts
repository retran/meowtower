// TSK-0500: the server stores each graph version it starts on, serves the last
// valid version when the file breaks, stops when nothing valid is stored, and
// at 1,000 stored versions raises a warning once and deletes none (REQ-0804,
// REQ-0808).
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { openCanonical, openGraph } from "../../src/engine/graph.js";
import { VERSIONS } from "../../src/engine/projections/versions.js";
import { openDatabase } from "../../src/server/database.js";
import {
  GRAPH_VERSIONS_MANY,
  startGraph,
} from "../../src/server/graph-start.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-graph-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const fixture = resolve("tests/fixtures/graph-small.yaml");
const broken = join(dir, "broken.yaml");
let counter = 0;
const freshDb = () => openDatabase(join(dir, `live-${counter++}.sqlite`));

afterEach(() => vi.restoreAllMocks());

describe("REQ-0804: a second start on the same file stores no second row", () => {
  it("stores the canonical content and reads it back equal to the parsed file", () => {
    const db = freshDb();
    const first = startGraph(db, fixture);
    expect(first.source).toBe("file");
    expect(first.version).toBe(
      openGraph(readFileSync(fixture, "utf8")).graphVersion(),
    );
    expect(VERSIONS.graph).toBe(first.version);
    const back = openCanonical(
      (
        db.prepare("SELECT canonical FROM graph_versions").get() as {
          canonical: string;
        }
      ).canonical,
    );
    expect(back.node("N3")).toEqual(first.graph.node("N3"));
    expect(back.prereqs("N3")).toEqual(first.graph.prereqs("N3"));
    startGraph(db, fixture);
    expect(
      (
        db.prepare("SELECT COUNT(*) AS n FROM graph_versions").get() as {
          n: number;
        }
      ).n,
    ).toBe(1);
    db.close();
  });
});

describe("REQ-0808: a broken file after a good start serves the last valid version", () => {
  it("serves the stored version and raises graph_invalid once", () => {
    const db = freshDb();
    const good = startGraph(db, fixture);
    writeFileSync(broken, "nodes: { N1: { domain: getal, level: 9Z } }\n");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const again = startGraph(db, broken);
    expect(again.source).toBe("stored");
    expect(again.version).toBe(good.version);
    expect(again.graph.node("N2")).toEqual(good.graph.node("N2"));
    const raised = error.mock.calls.filter(([line]) =>
      String(line).startsWith("graph_invalid"),
    );
    expect(raised).toHaveLength(1);
    db.close();
  });

  it("stops with graph_unloadable when no valid version is stored", () => {
    const db = freshDb();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => startGraph(db, broken)).toThrow(/^graph_unloadable/);
    expect(
      error.mock.calls.some(([line]) =>
        String(line).startsWith("graph_unloadable"),
      ),
    ).toBe(true);
    db.close();
  });
});

describe("REQ-0804: at 1,000 stored versions the warning is raised once and none is deleted", () => {
  it("raises graph_versions_many once and keeps every version", () => {
    const db = freshDb();
    const insert = db.prepare(
      "INSERT INTO graph_versions (version, canonical, stored_at) VALUES (?, ?, ?)",
    );
    for (let i = 0; i < GRAPH_VERSIONS_MANY; i++)
      insert.run(
        `g-old${String(i).padStart(8, "0")}`,
        "{}",
        new Date(i * 1000).toISOString(),
      );
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    startGraph(db, fixture, () => new Date(10_000_000_000));
    startGraph(db, fixture, () => new Date(10_000_000_000));
    const many = error.mock.calls.filter(([line]) =>
      String(line).startsWith("graph_versions_many"),
    );
    expect(many).toHaveLength(1);
    expect(
      (
        db.prepare("SELECT COUNT(*) AS n FROM graph_versions").get() as {
          n: number;
        }
      ).n,
    ).toBe(GRAPH_VERSIONS_MANY + 1);
    db.close();
  });
});

describe("REQ-0806: after a restart, only the change line added since the last version is new", () => {
  it("marks the new line new and the earlier one not new, with no source file changed", () => {
    const db = freshDb();
    const first = join(dir, "first.yaml");
    const second = join(dir, "second.yaml");
    const text = readFileSync(fixture, "utf8");
    const oneLine = text.replace(
      "changes: []",
      'changes:\n  - { node: N2, field: level, reason: "first" }',
    );
    const twoLines = oneLine
      .replace(
        'reason: "first" }',
        'reason: "first" }\n  - { node: N3, field: prereqs, reason: "second" }',
      )
      .replace(
        "{ id: whole, level: 1F, weight: 1 }",
        "{ id: whole, level: 1F, weight: 2 }",
      );
    writeFileSync(first, oneLine);
    writeFileSync(second, twoLines);
    startGraph(db, first);
    const again = startGraph(db, second);
    const marks = again.graph.changes(again.previous);
    expect(marks.map((m) => [m.node, m.new])).toEqual([
      ["N2", false],
      ["N3", true],
    ]);
    db.close();
  });
});

describe("TSK-0509: the parent is told once per graph version which subtypes have no template", () => {
  it("raises not_generatable on a new version and not again on a second start", () => {
    const db = freshDb();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    startGraph(db, fixture);
    startGraph(db, fixture);
    const raised = error.mock.calls.filter(([line]) =>
      String(line).startsWith("not_generatable"),
    );
    expect(raised).toHaveLength(1);
    db.close();
  });
});
