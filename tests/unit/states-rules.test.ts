// TSK-0524 and TSK-0525: each node's state follows from a named rule over its checks, the
// newest complete check sets the tested state, and `stable` reads the whole history
// (SPC-0060, REQ-0934 to REQ-0946).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { fluencyThresholdSeconds } from "../../src/engine/model/beta.js";
import { observationsOf } from "../../src/engine/model/observations.js";
import { marksOf } from "../../src/engine/states/checks.js";
import { nodeStateOf, type StateName } from "../../src/engine/states/rules.js";
import { RULES_VERSION } from "../../src/engine/states/version.js";
import { logOf, type Try } from "./states-log.js";

const SUBS = [
  { id: "a", weight: 0.5 },
  { id: "b", weight: 0.5 },
];
const FAST = fluencyThresholdSeconds("N1") * 1000;
const SLOW = FAST + 5000;

/** A full block of five tries from day `from`, scored by `verdicts`, timed by `ms`. */
const block = (
  prefix: string,
  from: number,
  verdicts: NonNullable<Try["verdict"]>[],
  ms = FAST,
): Try[] =>
  verdicts.map((verdict, k) => ({
    id: `${prefix}${k}`,
    subtype: k % 2 === 0 ? "a" : "b",
    day: from + k,
    verdict,
    ms,
  }));
const probe = (
  id: string,
  subtype: string,
  day: number,
  verdict: NonNullable<Try["verdict"]> = "correct",
  ms = FAST,
): Try => ({
  id,
  subtype,
  day,
  purpose: "probe",
  verdict,
  ms,
});
const stateOf = (tries: readonly Try[], stretch = false) => {
  const log = logOf(tries);
  return nodeStateOf(
    { id: "N1", stretch },
    observationsOf(log).own,
    SUBS,
    marksOf(log).get("N1") ?? -1,
  );
};

describe("REQ-0936, REQ-0938: a full block's score sets the state from 2.5 down and from 3 up", () => {
  it("reads 2 and 2.5 as not mastered by block-low", () => {
    const two = stateOf(
      block("t", 0, ["correct", "correct", "wrong", "wrong", "wrong"]),
    );
    const twoHalf = stateOf(
      block("u", 0, ["correct", "correct", "partial", "wrong", "wrong"]),
    );
    expect([two.state, two.rule]).toEqual(["not mastered", "block-low"]);
    expect([twoHalf.state, twoHalf.rule]).toEqual([
      "not mastered",
      "block-low",
    ]);
  });

  it("reads 3 and 3.5 as understands by block-mid", () => {
    const three = stateOf(
      block("t", 0, ["correct", "correct", "correct", "wrong", "wrong"]),
    );
    const threeHalf = stateOf(
      block("u", 0, ["correct", "correct", "correct", "partial", "wrong"]),
    );
    expect([three.state, three.rule]).toEqual(["understands", "block-mid"]);
    expect([threeHalf.state, threeHalf.rule]).toEqual([
      "understands",
      "block-mid",
    ]);
  });
});

describe("REQ-0940, REQ-0942: a score of 4 or more is fluent unless its right answers are slow", () => {
  const four: NonNullable<Try["verdict"]>[] = [
    "correct",
    "correct",
    "correct",
    "correct",
    "wrong",
  ];

  it("reads a median above the threshold as understands, needs speed by block-slow", () => {
    const s = stateOf(block("t", 0, four, SLOW));
    expect([s.state, s.rule]).toEqual([
      "understands, needs speed",
      "block-slow",
    ]);
  });

  it("reads a median at the threshold as fluent by block-fast", () => {
    const s = stateOf(block("t", 0, four, FAST));
    expect([s.state, s.rule]).toEqual(["fluent", "block-fast"]);
  });
});

describe("REQ-0942: a probe that is right and quick is fluent (probe), and one wrong answer is being clarified", () => {
  it("reads two right fast probes on different subtypes as probe-fast", () => {
    const s = stateOf([probe("p1", "a", 0), probe("p2", "b", 1)]);
    expect([s.state, s.rule]).toEqual(["fluent (probe)", "probe-fast"]);
  });

  it("reads a choice-only probe of three right answers as probe-fast", () => {
    const choice = [0, 1, 2].map((k): Try => ({
      id: `c${k}`,
      subtype: "a",
      day: k,
      purpose: "probe",
      form: "choice",
      options: 4,
      ms: FAST,
    }));
    const s = stateOf(choice);
    expect([s.state, s.rule]).toEqual(["fluent (probe)", "probe-fast"]);
  });

  it("reads a probe with one wrong answer as being clarified by open", () => {
    const s = stateOf([probe("p1", "a", 0), probe("p2", "b", 1, "wrong")]);
    expect([s.state, s.rule]).toEqual(["being clarified", "open"]);
  });
});

describe("REQ-0934: a node with no unassisted first attempt is not checked", () => {
  it("is not checked by none on an ordinary node", () => {
    const s = stateOf([]);
    expect([s.state, s.rule]).toEqual(["not checked", "none"]);
  });

  it("is stretch: not checked on a stretch node", () => {
    expect(stateOf([], true).state).toBe("stretch: not checked");
  });
});

describe("REQ-0934: each state keeps its rule and the items the rule read", () => {
  it("holds the item identifiers of the newest check", () => {
    const s = stateOf(
      block("t", 0, ["correct", "correct", "correct", "wrong", "wrong"]),
    );
    expect(s.items).toEqual(["t0", "t1", "t2", "t3", "t4"]);
  });

  it("does not depend on any probability: the rules read only the attempts", () => {
    const tries = block("t", 0, [
      "correct",
      "correct",
      "correct",
      "partial",
      "wrong",
    ]);
    const first = stateOf(tries);
    const again = stateOf(tries);
    expect(again).toEqual(first);
  });
});

describe("REQ-0934: the newest complete check by seq sets the tested state", () => {
  it("lets a later probe that is fluent replace an earlier not-mastered block", () => {
    const early = block("t", 0, ["wrong", "wrong", "wrong", "wrong", "wrong"]);
    const late = [probe("p1", "a", 6), probe("p2", "b", 7)];
    const s = stateOf([...early, ...late]);
    expect([s.state, s.rule]).toEqual(["fluent (probe)", "probe-fast"]);
  });

  it("lets a later block that is not mastered replace an earlier fluent probe", () => {
    const early = [probe("p1", "a", 0), probe("p2", "b", 1)];
    const late = block("t", 6, ["wrong", "wrong", "wrong", "wrong", "wrong"]);
    const s = stateOf([...early, ...late]);
    expect([s.state, s.rule]).toEqual(["not mastered", "block-low"]);
  });
});

describe("REQ-0944: stable needs two fluent checks at least 14 days apart, one of them a full block", () => {
  const fluentBlock = (prefix: string, from: number): Try[] =>
    block(prefix, from, [
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);

  it("is stable for two fluent blocks 14 days apart", () => {
    const s = stateOf([...fluentBlock("a", 0), ...fluentBlock("b", 14)]);
    expect([s.state, s.rule]).toEqual(["stable", "stable"]);
  });

  it("is only fluent for two fluent blocks 13 days apart", () => {
    const s = stateOf([...fluentBlock("a", 0), ...fluentBlock("b", 13)]);
    expect([s.state, s.rule]).toEqual(["fluent", "block-fast"]);
  });

  it("is stable for a fluent probe and a later fluent block 14 days apart", () => {
    const s = stateOf([
      probe("p1", "a", 0),
      probe("p2", "b", 0),
      ...block("b", 10, [
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
      ]),
    ]);
    expect(s.state).toBe("stable");
  });

  it("is only fluent (probe), not stable, for two fluent probes 14 days apart", () => {
    const s = stateOf([
      probe("p1", "a", 0),
      probe("p2", "b", 0.5),
      probe("p3", "a", 14),
      probe("p4", "b", 14.5),
    ]);
    expect(s.state).toBe("fluent (probe)");
  });

  it("is not stable when a later check reads understands", () => {
    const s = stateOf([
      ...fluentBlock("a", 0),
      ...fluentBlock("b", 14),
      ...block("c", 20, ["correct", "correct", "correct", "wrong", "wrong"]),
    ]);
    expect(s.state).toBe("understands");
  });

  it("gives the same state at any later clock, because the rule reads the events only", () => {
    const tries = [...fluentBlock("a", 0), ...fluentBlock("b", 14)];
    expect(stateOf(tries)).toEqual(stateOf(tries));
  });
});

describe("REQ-0946: the not-mastered label is a key in the Russian file and no code holds the string", () => {
  const ru = JSON.parse(readFileSync("content/i18n/ru.json", "utf8")) as Record<
    string,
    string
  >;

  it("gives state.not_mastered the string of the record", () => {
    expect(ru["state.not_mastered"]).toBe("Пока не освоено");
  });

  it("holds the string in no file under src", () => {
    const hits: string[] = [];
    const walk = (dir: string): void => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (
          /\.(ts|tsx)$/.test(name) &&
          readFileSync(path, "utf8").includes("Пока не освоено")
        )
          hits.push(path);
      }
    };
    walk("src");
    expect(hits).toEqual([]);
  });
});

describe("ADR-0060 golden: fixed logs keep their states until RULES_VERSION changes", () => {
  const GOLDEN_RULES_VERSION = "1";
  const GOLDEN: Record<string, StateName> = {
    "block 2.5": "not mastered",
    "block 3": "understands",
    "block 4 fast": "fluent",
    "block 4 slow": "understands, needs speed",
    "two fluent blocks 14 days apart": "stable",
  };
  const fixtures: Record<string, Try[]> = {
    "block 2.5": block("g", 0, [
      "correct",
      "correct",
      "partial",
      "wrong",
      "wrong",
    ]),
    "block 3": block("g", 0, [
      "correct",
      "correct",
      "correct",
      "wrong",
      "wrong",
    ]),
    "block 4 fast": block("g", 0, [
      "correct",
      "correct",
      "correct",
      "correct",
      "wrong",
    ]),
    "block 4 slow": block(
      "g",
      0,
      ["correct", "correct", "correct", "correct", "wrong"],
      SLOW,
    ),
    "two fluent blocks 14 days apart": [
      ...block("g", 0, ["correct", "correct", "correct", "correct", "correct"]),
      ...block("h", 14, [
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
      ]),
    ],
  };

  it("matches every golden state, naming the fixture that changed", () => {
    expect(RULES_VERSION).toBe(GOLDEN_RULES_VERSION);
    for (const [name, tries] of Object.entries(fixtures)) {
      const got = stateOf(tries).state;
      if (got !== GOLDEN[name])
        throw new Error(
          `golden fixture "${name}" changed: ${got} instead of ${GOLDEN[name]}; bump RULES_VERSION and update GOLDEN`,
        );
    }
  });
});
