import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE } from "../../src/engine/graph.js";
import { templates } from "../../src/templates/index.js";
import { strayIn } from "../../src/templates/spec.js";

const compiled = templates;
const SEEDS = 200;
const seedOf = (i: number): Uint8Array =>
  Uint8Array.from({ length: 32 }, (_, k) => (i * 31 + k * 7) % 256);

describe("domain N and A templates", () => {
  it("holds at least ten templates for each subtype of every node that has one", () => {
    const graph = parse(readFileSync(GRAPH_FILE, "utf8")) as {
      nodes: Record<string, { subtypes: { id: string }[] }>;
    };
    const done = new Set(compiled.map((c) => c.node));
    expect(done.size).toBeGreaterThan(0);
    for (const node of done) {
      for (const sub of graph.nodes[node]?.subtypes ?? []) {
        const count = compiled.filter(
          (c) => c.node === node && c.subtype === sub.id,
        ).length;
        expect(count, `${node}.${sub.id}`).toBeGreaterThanOrEqual(10);
      }
    }
  });

  it("gives every template its own id and form", () => {
    expect(new Set(compiled.map((c) => c.id)).size).toBe(compiled.length);
    expect(new Set(compiled.map((c) => c.form)).size).toBe(compiled.length);
  });

  it("draws a picture for the tasks that show data or a figure", () => {
    const drawn = compiled.filter((c) => c.make(seedOf(1)).svg !== null);
    expect(drawn.length).toBeGreaterThan(100);
  });

  it("draws a picture for every task of geometry and of area, volume and circle", () => {
    const geometry = /^(G\d|M(4|5|6|7|11)\.)/;
    const bare = compiled
      .filter((c) => geometry.test(c.id))
      .filter((c) => c.make(seedOf(1)).svg === null)
      .map((c) => c.id);
    expect(bare).toEqual([]);
  });

  it("REQ-7542: knows the typical mistakes of every task, two where the form allows", () => {
    const counts = compiled.map((c) => {
      const ids = new Set<string>();
      for (let i = 0; i < 40; i += 1)
        for (const t of c.make(seedOf(i)).traps) ids.add(t.id);
      return { id: c.id, n: ids.size };
    });
    expect(counts.filter((c) => c.n === 0)).toEqual([]);
    expect(counts.filter((c) => c.n === 1).length).toBeLessThan(40);
  });

  it("labels a picture in the language asked for", () => {
    const rose = compiled.find((c) => c.id === "G7.plan.01");
    expect(rose).toBeDefined();
    const svgOf = (lang: "ru" | "en" | "nl"): string =>
      rose?.make(seedOf(1), lang).svg ?? "";
    expect(svgOf("ru")).toContain(">С<");
    expect(svgOf("en")).toContain(">E<");
    expect(svgOf("nl")).toContain(">O<");
    expect(svgOf("nl")).toContain(">Z<");
  });

  it("keeps the groups inside 1 to 8", () => {
    for (const c of compiled) {
      expect(c.groups[0]).toBeGreaterThanOrEqual(1);
      expect(c.groups[1]).toBeLessThanOrEqual(8);
      expect(c.groups[0]).toBeLessThanOrEqual(c.groups[1]);
    }
  });

  for (const c of compiled) {
    describe(c.id, () => {
      it("agrees with its second route and accepts its own answer", () => {
        for (let i = 0; i < SEEDS; i += 1) {
          const made = c.make(seedOf(i));
          expect(made.referenceAgrees).toBe(true);
          expect(made.checker(made.entry).verdict).toBe("correct");
        }
      });

      it("draws a picture that is a plain, deterministic SVG", () => {
        for (let i = 0; i < SEEDS; i += 1) {
          const made = c.make(seedOf(i));
          if (made.svg === null) continue;
          expect(made.svg.startsWith("<svg ")).toBe(true);
          expect(made.svg.endsWith("</svg>")).toBe(true);
          expect(made.svg).not.toMatch(
            /<script|href|on\w+=|NaN|Infinity|undefined/,
          );
          expect(made.svg.length).toBeLessThan(20000);
          expect(c.make(seedOf(i)).svg).toBe(made.svg);
        }
      });

      it("rejects every trap answer and gives each a different one", () => {
        for (let i = 0; i < SEEDS; i += 1) {
          const made = c.make(seedOf(i));
          for (const t of made.traps) {
            expect(made.checker(t.entry).verdict).not.toBe("correct");
            expect(t.explanation.length).toBeGreaterThan(0);
          }
          expect(new Set(made.traps.map((t) => t.entry)).size).toBe(
            made.traps.length,
          );
        }
      });

      it("states no number its task does not hold", () => {
        for (let i = 0; i < SEEDS; i += 1) {
          expect(strayIn(c.make(seedOf(i)))).toEqual([]);
        }
      });

      it("rebuilds the same task from the same seed and varies with the seed", () => {
        const a = c.make(seedOf(1));
        const b = c.make(seedOf(1));
        expect(b.text).toBe(a.text);
        expect(b.entry).toBe(a.entry);
        const keys = new Set(
          Array.from({ length: 30 }, (_, i) => c.make(seedOf(i)).paramsKey),
        );
        expect(keys.size).toBeGreaterThan(3);
      });
    });
  }
});

describe("REQ-7548: every task reads in the parent's language", () => {
  it("renders English and Dutch with nothing left in Russian or unfilled", () => {
    const left: string[] = [];
    for (const c of compiled)
      for (const lang of ["en", "nl"] as const) {
        const made = c.make(seedOf(1), lang);
        for (const text of [made.text, ...made.solution, ...made.hints])
          if (/[\u0400-\u04FF{}]/.test(text))
            left.push(`${c.id} ${lang}: ${text}`);
      }
    expect(left).toEqual([]);
  });

  it("takes an English decimal with a point and a Dutch one with a comma", () => {
    const c = compiled.find((t) => t.id === "D1.place-value.10");
    if (!c) throw new Error("no such template");
    const entry = c.make(seedOf(1), "en").entry.replace(",", ".");
    expect(c.make(seedOf(1), "en").checker(entry).verdict).toBe("correct");
    expect(
      c.make(seedOf(1), "nl").checker(entry.replace(".", ",")).verdict,
    ).toBe("correct");
  });
});
