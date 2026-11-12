// REQ-8286 (ADR-3280): an encounter of any status shows as the scene the child's screen reads: the
// narrator's lines from its place, situation and goal, and one option for each exit.
import { expect, it } from "vitest";
import { sceneOf } from "../../src/server/sandbox/play.js";

it("turns an encounter's place, situation and goal into lines and its exits into options", () => {
  const scene = sceneOf("enc-1", "The gate", {
    place: "The old gate",
    situation: "The lock is stuck.",
    goal: "Open the gate.",
    exits: [
      { when: "She opens it", next: "enc-2" },
      { when: "She goes round", next: "enc-3" },
    ],
  });
  expect(scene.sceneId).toBe("enc-1");
  expect(scene.lines.map((l) => l.text)).toEqual([
    "The old gate",
    "The lock is stuck.",
    "Open the gate.",
  ]);
  expect(scene.lines.every((l) => l.speaker === "narrator")).toBe(true);
  expect(scene.branches).toEqual([
    { choiceId: "enc-2", text: "She opens it" },
    { choiceId: "enc-3", text: "She goes round" },
  ]);
});

it("shows a draft with an empty body by its title and offers no option", () => {
  for (const body of [null, {}, "text", { exits: "none" }]) {
    const scene = sceneOf("enc-9", "A bare node", body);
    expect(scene.lines).toEqual([{ speaker: "narrator", text: "A bare node" }]);
    expect(scene.branches).toEqual([]);
  }
});

it("skips an exit that names no next encounter or says nothing", () => {
  const scene = sceneOf("e", "t", {
    situation: "s",
    exits: [{ when: "", next: "a" }, { when: "x" }, { when: "ok", next: "b" }],
  });
  expect(scene.branches).toEqual([{ choiceId: "b", text: "ok" }]);
});
