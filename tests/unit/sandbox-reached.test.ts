// REQ-8296 (ADR-3280): what a test has reached is read from the sandbox's log: each scene shown is an
// encounter reached, and each choice made is an exit taken.
import { expect, it } from "vitest";
import { reachedOf } from "../../src/server/sandbox/play.js";

it("reads the encounters shown and the exits chosen, each once and in order", () => {
  const reached = reachedOf([
    { type: "scene_prepared", payload: { sceneId: "e1" } },
    { type: "choice_made", payload: { sceneId: "e1", choiceId: "e2" } },
    { type: "scene_prepared", payload: { sceneId: "e2" } },
    { type: "scene_prepared", payload: { sceneId: "e1" } },
    { type: "choice_made", payload: { sceneId: "e1", choiceId: "e2" } },
    { type: "item_shown", payload: { itemId: "x" } },
  ]);
  expect(reached.encounters).toEqual(["e1", "e2"]);
  expect(reached.exits).toEqual([{ from: "e1", to: "e2" }]);
});

it("reads nothing from an empty log or from events of other kinds", () => {
  expect(reachedOf([])).toEqual({ encounters: [], exits: [] });
  expect(
    reachedOf([
      { type: "free_text", payload: { sceneId: "e1", cleaned: "x" } },
    ]),
  ).toEqual({ encounters: [], exits: [] });
});
