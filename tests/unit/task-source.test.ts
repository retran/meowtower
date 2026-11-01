// REQ-7536, REQ-7524: every task can be answered as it is shown. A chosen answer has its buttons, each button
// sends what the checker takes, and a typed answer names its format.
import { describe, expect, it } from "vitest";
import { atLevel, bandOf, present } from "../../src/server/task-source.js";
import { templates } from "../../src/templates/index.js";

const seedOf = (i: number): Uint8Array =>
  Uint8Array.from({ length: 32 }, (_, k) => (i * 17 + k * 11) % 256);

describe("how each task is put before the player", () => {
  it("gives every chosen answer buttons that reach the right answer", () => {
    for (const template of templates)
      for (let i = 0; i < 20; i += 1) {
        const made = template.make(seedOf(i));
        const shape = present({ template, made });
        const chosen = ["compare", "choice", "set", "order"];
        if (!chosen.includes(template.answer)) {
          expect(shape.options, template.id).toBeNull();
          continue;
        }
        const values = shape.input.values ?? [];
        expect(shape.options?.length, template.id).toBe(values.length);
        expect(values.length, template.id).toBeGreaterThan(1);
        expect(shape.text, template.id).not.toMatch(/\s1\) /);
        for (const label of shape.options ?? [])
          expect(label.length, template.id).toBeGreaterThan(0);
        for (const part of made.entry.split(","))
          expect(values, template.id).toContain(part.trim());
        expect(made.checker(made.entry).verdict).toBe("correct");
      }
  });

  it("shows the items of an order task, and its answer by them", () => {
    const order = templates.filter((t) => t.answer === "order");
    expect(order.length).toBeGreaterThanOrEqual(17);
    for (const template of order) {
      const shape = present({ template, made: template.make(seedOf(1)) });
      expect(shape.text, template.id).not.toContain(";");
      expect(shape.answer, template.id).not.toMatch(/^\d(,\d)+$/);
    }
  });

  it("names the format of a typed answer that isn't a whole number", () => {
    for (const template of templates) {
      const shape = present({ template, made: template.make(seedOf(1)) });
      if (shape.input.kind === "text")
        expect(shape.input.format, template.id).toBeDefined();
    }
  });
});

describe("REQ-7972, REQ-7974, REQ-7976: tasks follow an ability's level", () => {
  const nodes = [...new Set(templates.map((t) => t.node))];

  it("splits every node's templates into five bands that cover them all", () => {
    for (const node of nodes) {
      const all = templates.filter((t) => t.node === node);
      const seen = [1, 2, 3, 4, 5].flatMap((l) => bandOf(node, l));
      expect(new Set(seen.map((t) => t.id)).size).toBe(all.length);
    }
  });

  it("gives a higher level harder tasks, on a node that spans groups", () => {
    const top = (t: (typeof templates)[number]) => Math.max(...t.groups);
    for (const node of nodes) {
      const low = bandOf(node, 1);
      const high = bandOf(node, 4);
      if (low.length === 0 || high.length === 0) continue;
      const mean = (b: typeof low) =>
        b.reduce((s, t) => s + top(t), 0) / b.length;
      expect(mean(high)).toBeGreaterThanOrEqual(mean(low));
    }
  });

  it("leads the top band with olympiad templates", () => {
    const node = templates.find(
      (t) => t.origin && "olympiad" in t.origin,
    )?.node;
    if (!node) throw new Error("no olympiad template");
    const first = bandOf(node, 5)[0];
    expect(first?.origin && "olympiad" in first.origin).toBe(true);
  });

  it("never leaves a level with no task", () => {
    for (const node of nodes)
      for (const level of [1, 2, 3, 4, 5])
        expect(bandOf(node, level).length).toBeGreaterThan(0);
  });

  it("picks within the node's band and keeps the node", () => {
    const template = templates[0];
    if (!template) throw new Error("no templates");
    const got = atLevel(template, 1, seedOf(3));
    expect(got.node).toBe(template.node);
    expect(bandOf(template.node, 1)).toContain(got);
  });
});
