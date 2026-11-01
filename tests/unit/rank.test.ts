// REQ-7982, REQ-7984, REQ-7986, REQ-7988, REQ-7990, REQ-8054: the rank is computed from the node
// levels by rule rank.v1. A rank counts every Dutch group up to its own, rises at 80 % of its
// nodes on level 4 and falls only after 14 played days below 65 %.
import { describe, expect, it } from "vitest";
import {
  RANK_RULE,
  rankOver,
  type RankDay,
} from "../../src/engine/model/rank.js";

// Ten nodes in each group 1 to 8, so a share is easy to set.
const groups = Array.from({ length: 80 }, (_, i) => ({
  node: `n${String(i)}`,
  group: Math.floor(i / 10) + 1,
}));
const at = (levelOf: (group: number) => number): Record<string, number> =>
  Object.fromEntries(groups.map((g) => [g.node, levelOf(g.group)]));
const day = (n: number, levels: Record<string, number>): RankDay => ({
  day: n,
  levels,
});
const upTo = (top: number, level: number) => (group: number) =>
  group <= top ? level : 1;

describe("the rank", () => {
  it("starts at E and names its rule", () => {
    const got = rankOver(groups, [
      day(
        1,
        at(() => 1),
      ),
    ]);
    expect(got.rank).toBe("E");
    expect(got.rule).toBe(RANK_RULE);
  });

  it("rises to D when 80 % of groups 1 to 4 stand on level 4", () => {
    const got = rankOver(groups, [day(1, at(upTo(4, 4)))]);
    expect(got.rank).toBe("D");
    expect(got.changes[0]).toMatchObject({ from: "E", to: "D", fell: false });
  });

  it("does not rise at 79 %", () => {
    const levels = at(upTo(4, 4));
    // 40 nodes in groups 1 to 4: 9 of them lowered makes 31 of 40, below 80 %.
    for (const g of groups.filter((x) => x.group <= 4).slice(0, 9))
      levels[g.node] = 3;
    expect(rankOver(groups, [day(1, levels)]).rank).toBe("E");
  });

  it("counts every group up to its own, so one weak low group holds a high rank back", () => {
    const levels = at((g) => (g >= 4 ? 5 : 1));
    expect(rankOver(groups, [day(1, levels)]).rank).toBe("E");
  });

  it("reaches A with groups 1 to 8 on level 4, and S only with all on level 5", () => {
    expect(
      rankOver(groups, [
        day(
          1,
          at(() => 4),
        ),
      ]).rank,
    ).toBe("A");
    expect(
      rankOver(groups, [
        day(
          1,
          at(() => 5),
        ),
      ]).rank,
    ).toBe("S");
  });

  it("counts the word-problem nodes among the others", () => {
    const more = [
      ...groups,
      { node: "T1", group: 3 },
      { node: "T2", group: 3 },
    ];
    const levels = { ...at(upTo(3, 4)), T1: 1, T2: 1 };
    expect(rankOver(more, [day(1, levels)]).rank).toBe("E");
    expect(rankOver(more, [day(1, { ...levels, T1: 4, T2: 4 })]).rank).toBe(
      "E",
    );
  });

  it("holds its rank through a bad week and falls after 14 played days below 65 %", () => {
    const high = at(upTo(4, 4));
    const low = at(() => 1);
    const week = Array.from({ length: 13 }, (_, i) => day(2 + i, low));
    expect(rankOver(groups, [day(1, high), ...week]).rank).toBe("D");
    const two = [...week, day(15, low)];
    const got = rankOver(groups, [day(1, high), ...two]);
    expect(got.rank).toBe("E");
    expect(got.changes.at(-1)).toMatchObject({
      from: "D",
      to: "E",
      fell: true,
    });
  });

  it("starts the count again when the share recovers", () => {
    const high = at(upTo(4, 4));
    const low = at(() => 1);
    const days = [
      day(1, high),
      ...Array.from({ length: 10 }, (_, i) => day(2 + i, low)),
      day(12, high),
      ...Array.from({ length: 10 }, (_, i) => day(13 + i, low)),
    ];
    expect(rankOver(groups, days).rank).toBe("D");
  });

  it("warns before a fall, once the share has been below the line for a week", () => {
    const high = at(upTo(4, 4));
    const low = at(() => 1);
    const days = [
      day(1, high),
      ...Array.from({ length: 8 }, (_, i) => day(2 + i, low)),
    ];
    expect(rankOver(groups, days).warning).toBe(true);
    expect(rankOver(groups, [day(1, high)]).warning).toBe(false);
  });

  it("a steady player sees no fall in a year", () => {
    const steady = at(upTo(4, 4));
    const days = Array.from({ length: 365 }, (_, i) => day(i + 1, steady));
    expect(rankOver(groups, days).changes.filter((c) => c.fell)).toEqual([]);
  });
});
