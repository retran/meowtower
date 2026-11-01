// REQ-7536, REQ-7524: every task can be answered as it is shown. A chosen answer has its buttons, each button
// sends what the checker takes, and a typed answer names its format.
import { describe, expect, it } from "vitest";
import { present, presentSet } from "../../src/server/task-source.js";
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

describe("REQ-8208, REQ-8210: a task with no live story", () => {
  it("is set in the story by prepared text in the game's language", () => {
    const template = templates[0];
    if (!template) throw new Error("no templates");
    const made = template.make(seedOf(1), "ru");
    for (const lang of ["ru", "en", "nl"] as const) {
      const shape = presentSet({ template, made }, lang, seedOf(1));
      expect(shape.text.endsWith(present({ template, made }).text)).toBe(true);
      expect(shape.text.length).toBeGreaterThan(made.text.length + 10);
    }
  });

  it("keeps the same setting for the same seed and varies it across seeds", () => {
    const template = templates[0];
    if (!template) throw new Error("no templates");
    const made = template.make(seedOf(1), "ru");
    const of = (i: number) =>
      presentSet({ template, made }, "ru", seedOf(i)).text;
    expect(of(1)).toBe(of(1));
    expect(
      new Set(Array.from({ length: 30 }, (_, i) => of(i))).size,
    ).toBeGreaterThan(1);
  });
});
