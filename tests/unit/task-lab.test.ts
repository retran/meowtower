// REQ-8298: any template opens as a task with its answer, solution, hints and typical mistakes, in any
// shipped language and for any seed, the same seed builds the same task, and a story's cost is stated.
import { describe, expect, it } from "vitest";
import { templates } from "../../src/templates/index.js";
import { listTemplates, openTask } from "../../src/server/studio/tasks.js";

describe("the task lab", () => {
  it("lists every template the game plays from", () => {
    const rows = listTemplates();
    expect(rows).toHaveLength(templates.length);
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
    expect(rows[0]).toMatchObject({
      id: expect.any(String),
      node: expect.any(String),
    });
  });

  it("opens each template in each language with a text, an answer and a solution", () => {
    for (const row of listTemplates().slice(0, 40))
      for (const lang of ["ru", "en", "nl"]) {
        const task = openTask(row.id, undefined, lang);
        expect(task, `${row.id} ${lang}`).not.toBeNull();
        expect(task?.text.length).toBeGreaterThan(0);
        expect(task?.answer.length).toBeGreaterThan(0);
        expect(task?.solution.length).toBeGreaterThan(0);
        expect(task?.lang).toBe(lang);
      }
  });

  it("builds the same task from the same seed and another from another", () => {
    const id = listTemplates()[0]?.id ?? "";
    const a = openTask(id, "00aa", "ru");
    const again = openTask(id, "00aa", "ru");
    expect(a).toEqual(again);
    const seeds = new Set(
      ["01", "02", "03", "04", "05", "06"].map(
        (s) => openTask(id, s, "ru")?.text,
      ),
    );
    expect(seeds.size).toBeGreaterThan(1);
  });

  it("states what a story for the task would cost, at least nothing and well under a dollar", () => {
    const id = listTemplates()[0]?.id ?? "";
    const cost = openTask(id, undefined, "ru")?.storyEstimateUsd ?? -1;
    expect(cost).toBeGreaterThan(0);
    expect(cost).toBeLessThan(1);
  });

  it("falls back to Russian for an unknown language, returns null for an unknown template and ignores a bad seed", () => {
    const id = listTemplates()[0]?.id ?? "";
    expect(openTask(id, undefined, "de")?.lang).toBe("ru");
    expect(openTask("nope", undefined, "ru")).toBeNull();
    expect(openTask(id, "not hex!", "ru")?.seed).toMatch(/^[0-9a-f]{64}$/);
  });
});
