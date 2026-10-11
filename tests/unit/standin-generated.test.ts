// TSK-0492: the stand-in tasks are generated from fixture templates, each task
// rebuilds from its effective seed alone with the same view, and an entry the
// engine can't parse is unparsed, not an answer (REQ-1200, REQ-0734, REQ-0736,
// REQ-0740).
import { describe, expect, it } from "vitest";
import { generate, rebuild } from "../../src/engine/tasks/template.js";
import { baseSeed } from "../../src/math/rng.js";
import {
  STANDIN_TASKS,
  standinTemplate,
  standinVerdict,
} from "../../src/server/standin.js";

describe("REQ-1200: each stand-in task rebuilds from its effective seed", () => {
  it("rebuilds the same parameters and answer for 60 generated tasks", () => {
    for (let index = 0; index < 60; index++) {
      const task = STANDIN_TASKS[index % STANDIN_TASKS.length];
      if (task === undefined) throw new Error("no task");
      const template = standinTemplate(task, false);
      const base = baseSeed("session-rebuild", `standin.task.${task.n}`, index);
      const drawn = generate(template, base);
      expect(drawn.status).toBe("ok");
      if (drawn.status === "generation_error") continue;
      const again = rebuild(template, drawn.effectiveSeed);
      expect(again.params).toEqual(drawn.built.params);
      expect(again.answer.toString()).toBe(drawn.built.answer.toString());
    }
  });

  it("gives each stand-in task the answer its text asks for", () => {
    const answers = STANDIN_TASKS.map((task) => {
      const drawn = generate(
        standinTemplate(task, false),
        baseSeed("s", "x", 0),
      );
      return drawn.status === "generation_error"
        ? ""
        : drawn.built.answer.toString();
    });
    expect(answers).toEqual(["7", "3", "12"]);
  });
});

describe("REQ-0734, REQ-0736, REQ-0740: an entry the engine can't parse is not an answer", () => {
  it("returns unparsed for 3,,5 and for text with a letter", () => {
    expect(standinVerdict("3,,5", false, "7")).toBe("unparsed");
    expect(standinVerdict("7a", false, "7")).toBe("unparsed");
    expect(standinVerdict("", false, "7")).toBe("unparsed");
  });

  it("returns correct for the answer, wrong for another number, dont_know when asked", () => {
    expect(standinVerdict("7", false, "7")).toBe("correct");
    expect(standinVerdict("12 500", false, "7")).toBe("wrong");
    expect(standinVerdict("8", false, "7")).toBe("wrong");
    expect(standinVerdict("8", true, "7")).toBe("dont_know");
  });
});
