// TSK-0680 and TSK-0681: one forbidden list, one gate (ADR-0160, REQ-3314, REQ-3320, REQ-3324,
// REQ-3328, REQ-3302).
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkListReader } from "../../tools/static-checks.js";
import {
  knotViolations,
  normalise,
  textGate,
} from "../../src/shared/voice/gate.js";

const story = { lang: "ru", kind: "story", source: "master" } as const;
const list = JSON.parse(readFileSync("content/shaming.ru.json", "utf8")) as {
  forms: { lemma: string; diminutives: string[]; forms: string[] }[];
  fixtures: { match: string[]; pass: string[] };
};

describe("REQ-3314: the fixtures of ADR-0160 match or pass by token", () => {
  it.each(["ОЦЕНКА", "Урок", "ошибкой", "задачку", "зaдача".replace("a", "a")])(
    "blocks %s",
    (text) => {
      const result = textGate(text, story);
      expect(result.ok).toBe(false);
    },
  );

  it("blocks the mixed-script word with a Latin a and names the matched form", () => {
    const mixed = "зaдача"; // the second letter is the Latin "a"
    expect(/\p{Script=Latin}/u.test(mixed)).toBe(true);
    expect(textGate(mixed, story)).toEqual({
      ok: false,
      rule: "forbidden_form",
      match: "задача",
    });
  });

  it.each(["примерно", "примерить", "мимоза", "верно"])("passes %s", (text) => {
    expect(textGate(text, story)).toEqual({ ok: true });
  });

  it("does not turn ordinary Latin text into a match", () => {
    expect(textGate("x + cat = 5", story)).toEqual({ ok: true });
  });
});

describe("REQ-3314: every lemma has its base form and the diminutives it lists", () => {
  it("lists the base form and each diminutive among the forms", () => {
    for (const e of list.forms) {
      expect(e.forms, e.lemma).toContain(e.lemma);
      for (const d of e.diminutives) expect(e.forms, d).toContain(d);
    }
  });

  it("holds the fixtures the list names", () => {
    for (const text of list.fixtures.match)
      expect(textGate(text, story).ok, text).toBe(false);
    for (const text of list.fixtures.pass)
      expect(textGate(text, story).ok, text).toBe(true);
  });
});

describe("REQ-3328: normalising removes what hides a word", () => {
  it("removes soft hyphens, zero-width characters and stress marks and reads ё as е", () => {
    expect(normalise("за­да​чу́")).toBe("задачу");
    expect(normalise("Ёлка")).toBe("елка");
  });

  it("blocks a word hidden by a stress mark and by a zero-width character", () => {
    expect(textGate("задачу́", story).ok).toBe(false);
    expect(textGate("зад​ачу", story).ok).toBe(false);
  });
});

describe("REQ-3324: the shortage phrases match as a run of tokens in each form", () => {
  it.each([
    "Нити закончились",
    "У тебя нитей не осталось",
    "Теперь нет нитей",
    "нет нити",
  ])("blocks %s", (text) => {
    expect(textGate(text, story)).toMatchObject({
      ok: false,
      rule: "shortage_phrase",
    });
  });
});

describe("REQ-3314: the phrases match as runs of tokens", () => {
  it.each([
    "Не получилось",
    "ты не поняла",
    "Это же просто",
    "Ты умная",
    "ты самая умная",
  ])("blocks %s", (text) => {
    expect(textGate(text, story)).toMatchObject({
      ok: false,
      rule: "forbidden_phrase",
    });
  });
});

describe("REQ-3302: the system, label and emoji rules", () => {
  it("fails a system line with an exclamation mark or a digit", () => {
    const system = { lang: "ru", kind: "system", source: "fixed" } as const;
    expect(textGate("Тропа открыта!", system)).toMatchObject({
      rule: "system_punctuation",
    });
    expect(textGate("Открыто 3 тропы", system)).toMatchObject({
      rule: "system_digit",
    });
    expect(textGate("Тропа открыта", system)).toEqual({ ok: true });
  });

  it("fails a label equal to a rejected label, folded for case", () => {
    const label = { lang: "ru", kind: "label", source: "fixed" } as const;
    expect(textGate(" Серия ", label)).toMatchObject({
      ok: false,
      rule: "rejected_label",
    });
    expect(textGate("Готово", label)).toEqual({ ok: true });
  });

  it("fails an emoji in any kind", () => {
    expect(textGate("Вперёд 🎉", story)).toMatchObject({ rule: "emoji" });
  });
});

describe("REQ-3328: the player's own words and the Parent Room are exempt", () => {
  it("passes a forbidden word from the player or under parent.*", () => {
    expect(
      textGate("ошибка", { lang: "ru", kind: "story", source: "player" }),
    ).toEqual({ ok: true });
    expect(
      textGate("ошибка", {
        lang: "ru",
        kind: "label",
        source: "fixed",
        key: "parent.report.title",
      }),
    ).toEqual({ ok: true });
  });
});

describe("REQ-3320: a form of «узелок» fails in the knot's keys and not in others", () => {
  it("reports the key and the match for a knot key only", () => {
    const hits = knotViolations({
      "ui.scheme.title": "Схема узелка",
      "ui.reward.note": "Узелок в сундуке",
      "ui.outcome.clean": "Узел распутан",
    });
    expect(hits).toEqual([{ key: "ui.scheme.title", match: "узелка" }]);
  });
});

describe("REQ-3328: only src/shared/voice opens the list", () => {
  it("reports a file elsewhere that names the list and passes the voice folder", () => {
    const root = mkdtempSync(join(tmpdir(), "meowtower-voice-"));
    mkdirSync(join(root, "src", "shared", "voice"), { recursive: true });
    mkdirSync(join(root, "src", "server"), { recursive: true });
    writeFileSync(
      join(root, "src", "shared", "voice", "gate.ts"),
      'const f = "content/shaming.ru.json";\n',
    );
    writeFileSync(
      join(root, "src", "server", "read.ts"),
      'const f = "content/shaming.ru.json";\n',
    );
    expect(checkListReader(root)).toEqual([
      {
        check: "list_outside_voice",
        file: join("src", "server", "read.ts"),
        match: "shaming.ru.json",
      },
    ]);
    rmSync(root, { recursive: true, force: true });
    expect(checkListReader(process.cwd())).toEqual([]);
  });
});
