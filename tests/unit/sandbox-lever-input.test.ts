// REQ-8288 (ADR-3280): a state lever names what it sets, and the sandbox refuses a value the game
// could never hold.
import { expect, it } from "vitest";
import { Lever } from "../../src/server/sandbox/levers.js";

it("accepts each state the parent can set", () => {
  for (const lever of [
    { kind: "language", value: "nl" },
    { kind: "gender", value: "m" },
    { kind: "creepiness", value: 2 },
    { kind: "playerLevel", level: 7 },
    { kind: "friendship", familiarId: "f1", points: 12, level: 3 },
    { kind: "item", rewardId: "star", rewardKind: "star", amount: 5 },
    { kind: "nodeLevel", node: "N1", level: 4 },
    { kind: "rank", rank: "B" },
  ])
    expect(Lever.safeParse(lever).success, JSON.stringify(lever)).toBe(true);
});

it("refuses a value the game never holds", () => {
  for (const lever of [
    { kind: "language", value: "fr" },
    { kind: "gender", value: "x" },
    { kind: "creepiness", value: 3 },
    { kind: "playerLevel", level: 0 },
    { kind: "nodeLevel", node: "N1", level: 6 },
    { kind: "nodeLevel", node: "", level: 2 },
    { kind: "rank", rank: "Z" },
    { kind: "friendship", familiarId: "f1", points: -1, level: 1 },
    { kind: "unknown" },
  ])
    expect(Lever.safeParse(lever).success, JSON.stringify(lever)).toBe(false);
});
