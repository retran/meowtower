// TSK-0489: a story frame is measured against the readability limits of the
// table: sentences at most k + 1 for k steps, at most 14 words each, the question
// as its own last sentence, a mean of at most 10 words, at most 10 % of words
// outside the frequency list and at most 2 risk terms (REQ-0701, REQ-0790 to
// REQ-0798). The age band is read from the parent's file, or reports age_unset
// (REQ-3712).
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { frameMetrics, frameViolations } from "../../src/shared/readability.js";
import { ageBand } from "../../src/shared/age-band.js";

/** A frequency list where every word of the fixtures is familiar. */
const familiar = new Set([
  "у",
  "на",
  "в",
  "и",
  "дал",
  "дала",
  "стало",
  "сколько",
]);
const words = (n: number): string =>
  Array.from({ length: n }, () => "дала").join(" ");
const frame = (text: string, extra = {}) =>
  frameViolations(text, 2, { frequency: familiar, riskTerms: [], ...extra });

describe("REQ-0790: a frame of k steps has at most k + 1 sentences", () => {
  it("passes k + 1 sentences and fails k + 2 for k = 2", () => {
    expect(frame(`${words(3)}. ${words(3)}. ${words(3)}?`)).not.toContain(
      "sentences_over_k_plus_1",
    );
    expect(
      frame(`${words(3)}. ${words(3)}. ${words(3)}. ${words(3)}?`),
    ).toContain("sentences_over_k_plus_1");
  });
});

describe("REQ-0792: every sentence has at most 14 words", () => {
  it("passes 14 words and fails 15", () => {
    expect(frame(`${words(14)}?`)).not.toContain("sentence_over_14_words");
    expect(frame(`${words(15)}?`)).toContain("sentence_over_14_words");
  });
});

describe("REQ-0794: the question is a sentence of its own at the end", () => {
  it("passes a question that ends the frame", () => {
    expect(frame(`${words(3)}. ${words(3)}?`)).not.toContain(
      "question_not_last",
    );
  });

  it("fails a question inside an earlier sentence", () => {
    expect(frame(`${words(3)}? ${words(3)}.`)).toContain("question_not_last");
  });
});

describe("REQ-0796: the mean sentence length is at most 10 words", () => {
  it("passes a mean of 10 and fails a mean above 10", () => {
    expect(frame(`${words(10)}. ${words(10)}?`)).not.toContain("mean_over_10");
    expect(frame(`${words(10)}. ${words(12)}?`)).toContain("mean_over_10");
  });
});

describe("REQ-0798: at most 10 % of words lie outside the frequency list", () => {
  const twentyWords = (outside: number): string => {
    const familiarWords = Array.from({ length: 20 - outside }, () => "дала");
    const unfamiliar = Array.from({ length: outside }, (_, i) => `слово${i}`);
    return `${[...familiarWords, ...unfamiliar].join(" ")}?`;
  };

  it("passes 10 % outside and fails more", () => {
    expect(frame(twentyWords(2))).not.toContain("outside_over_10_percent");
    expect(frame(twentyWords(3))).toContain("outside_over_10_percent");
  });
});

describe("REQ-0701: at most 2 risk terms", () => {
  it("passes 2 risk terms and fails 3", () => {
    const text = `${words(3)} ворон сад ${words(2)}?`;
    expect(frame(text, { riskTerms: ["ворон", "сад"] })).not.toContain(
      "risk_over_2",
    );
    expect(frame(text, { riskTerms: ["ворон", "сад", "дала"] })).toContain(
      "risk_over_2",
    );
  });
});

describe("frameMetrics reports the measures the limits are read against", () => {
  it("counts sentences, words and the mean", () => {
    const m = frameMetrics(`${words(3)}. ${words(5)}?`, {
      frequency: familiar,
      riskTerms: [],
    });
    expect(m.sentences).toBe(2);
    expect(m.words).toBe(8);
    expect(m.meanWords).toBe(4);
  });
});

describe("REQ-3712: the age band is read from the parent's file, or reports age_unset", () => {
  const dir = mkdtempSync(join(tmpdir(), "meowtower-age-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("reports age_unset when there is no personal file", () => {
    expect(ageBand(dir)).toBe("age_unset");
  });

  it("reads the band the parent's file holds", () => {
    mkdirSync(join(dir, "personal"));
    writeFileSync(join(dir, "personal", "player.md"), "age_band: 2\n");
    expect(ageBand(dir)).toBe("2");
  });
});

describe("REQ-3712: no age band is written in any tracked file", () => {
  it("finds no age_band assignment outside the reader and its tests", () => {
    const root = process.cwd();
    const tracked = execFileSync("git", ["ls-files"], {
      cwd: root,
      encoding: "utf8",
    })
      .split("\n")
      .filter(
        (f) =>
          f !== "" &&
          !f.startsWith("tests/") &&
          !f.endsWith("src/shared/age-band.ts") &&
          existsSync(join(root, f)),
      );
    const found = tracked.filter((f) =>
      /age_band:\s*\d/.test(readFileSync(join(root, f), "utf8")),
    );
    expect(found).toEqual([]);
  });
});
