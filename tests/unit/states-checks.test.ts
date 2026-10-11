// TSK-0523: the full block and the probe are read from a node's graded attempts, never
// spanning a lesson mark and never holding a control fact (SPC-0060, REQ-0932, REQ-0950
// to REQ-0954).
import { describe, expect, it } from "vitest";
import { observationsOf } from "../../src/engine/model/observations.js";
import {
  checksOf,
  fullBlocksOf,
  marksOf,
  probesOf,
} from "../../src/engine/states/checks.js";
import { nodeStateOf } from "../../src/engine/states/rules.js";
import { logOf, mark, type Try } from "./states-log.js";

const SUBS = [
  { id: "a", weight: 0.5 },
  { id: "b", weight: 0.5 },
];
/** Five graded tries on one node, alternating subtypes a and b, one per day from `from`. */
const five = (prefix: string, from: number): Try[] =>
  [0, 1, 2, 3, 4].map((k) => ({
    id: `${prefix}${k}`,
    subtype: k % 2 === 0 ? "a" : "b",
    day: from + k,
  }));
const blocksOf = (tries: readonly Try[], subs = SUBS) =>
  fullBlocksOf(observationsOf(logOf(tries)).own, subs);

describe("REQ-0950: a full block is five graded first attempts in seven days covering each heavy subtype", () => {
  it("forms from five tries covering both subtypes", () => {
    expect(blocksOf(five("x", 0))).toHaveLength(1);
  });

  it("does not form when a subtype of weight 0.3 is uncovered", () => {
    const tries = five("x", 0).map((t) => ({ ...t, subtype: "a" }));
    expect(
      blocksOf(tries, [
        { id: "a", weight: 0.7 },
        { id: "b", weight: 0.3 },
      ]),
    ).toHaveLength(0);
  });

  it("does not form when one observation is 8 days older than the rest", () => {
    const tries = [
      ...five("x", 0).slice(0, 4),
      { id: "old", subtype: "b", day: 8 },
    ];
    expect(blocksOf(tries)).toHaveLength(0);
  });
});

describe("REQ-0952: a block never spans a lesson mark", () => {
  it("forms only after five tries follow the mark", () => {
    const log = logOf([...five("p", 0).slice(0, 2), ...five("q", 2)]);
    const withMark = [
      ...log.slice(0, 6),
      mark("parent_tag_added", "N1", 1.5),
      ...log.slice(6),
    ];
    const marks = marksOf(withMark);
    const state = nodeStateOf(
      { id: "N1", stretch: false },
      observationsOf(withMark).own,
      SUBS,
      marks.get("N1") ?? -1,
    );
    expect(state.checks).toHaveLength(1);
    expect(
      state.checks[0]?.check.items.every(
        (o) => o.seq > (marks.get("N1") ?? -1),
      ),
    ).toBe(true);
  });

  it("reads a removed mark as never set", () => {
    const tries = five("x", 0);
    const log = logOf(tries);
    const added = [
      ...log.slice(0, 4),
      mark("parent_tag_added", "N1", 1.5),
      ...log.slice(4),
    ];
    const removed = [...added, mark("parent_tag_removed", "N1", 2)];
    expect(marksOf(removed).get("N1")).toBeUndefined();
    const state = nodeStateOf(
      { id: "N1", stretch: false },
      observationsOf(removed).own,
      SUBS,
      marksOf(removed).get("N1") ?? -1,
    );
    expect(state.checks).toHaveLength(1);
  });
});

describe("REQ-0932: a control fact is in no block and no probe", () => {
  it("leaves a control fact out of the block of the last five", () => {
    const tries = five("x", 0).map((t, k) =>
      k === 4 ? { ...t, purpose: "control" } : t,
    );
    expect(blocksOf(tries)).toHaveLength(0);
  });
});

describe("REQ-0954: a probe is two probe tasks on different subtypes, or three choice tasks of four options", () => {
  const probe = (
    id: string,
    subtype: string,
    day: number,
    options = 0,
    form: "free" | "choice" = "free",
  ): Try => ({
    id,
    subtype,
    day,
    purpose: "probe",
    form,
    options,
  });

  it("forms from two probe tasks on different subtypes", () => {
    const own = observationsOf(
      logOf([probe("p1", "a", 0), probe("p2", "b", 1)]),
    ).own;
    expect(probesOf(own, false)).toHaveLength(1);
  });

  it("does not form from two probe tasks on the same subtype", () => {
    const own = observationsOf(
      logOf([probe("p1", "a", 0), probe("p2", "a", 1)]),
    ).own;
    expect(probesOf(own, false)).toHaveLength(0);
  });

  it("forms from three choice tasks of four options on a choice-only node", () => {
    const own = observationsOf(
      logOf([0, 1, 2].map((k) => probe(`c${k}`, "a", k, 4, "choice"))),
    ).own;
    expect(probesOf(own, true)).toHaveLength(1);
  });

  it("does not form from three choice tasks of three options", () => {
    const own = observationsOf(
      logOf([0, 1, 2].map((k) => probe(`c${k}`, "a", k, 3, "choice"))),
    ).own;
    expect(probesOf(own, true)).toHaveLength(0);
  });

  it("lists blocks and probes together in log order", () => {
    const own = observationsOf(
      logOf([...five("x", 0), probe("p1", "a", 6), probe("p2", "b", 7)]),
    ).own;
    expect(checksOf(own, SUBS, false).map((c) => c.kind)).toEqual([
      "block",
      "probe",
    ]);
  });
});
