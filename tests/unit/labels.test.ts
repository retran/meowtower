// TSK-0678: the interface uses the world's labels, and a label that brings back the test, the clock
// or the streak fails the build (ADR-0160, REQ-3310, REQ-3312).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { textGate } from "../../src/shared/voice/gate.js";

const ru = JSON.parse(readFileSync("content/i18n/ru.json", "utf8")) as Record<
  string,
  string
>;
const label = (text: string) =>
  textGate(text, { lang: "ru", kind: "label", source: "fixed" });

describe("REQ-3310: each label of the world is pinned to its key and its exact text", () => {
  it.each([
    ["ui.scheme.title", "Схема узла"],
    ["ui.scheme.thread", "Как легла нить"],
    ["ui.play.answer", "Твоё заклинание"],
    ["ui.play.submit", "Готово"],
    ["ui.play.dontKnow", "Не знаю"],
    ["ui.reward.thread", "Путеводная нить"],
    ["ui.play.badge.clean", "Правильно!"],
    ["ui.play.badge.partial", "Почти правильно"],
    ["ui.play.badge.soft", "Пока не так"],
    ["ui.play.badge.unknown", "Давай посмотрим, как решить"],
    ["ui.rest.title", "Привал"],
    ["ui.play.leave", "Сохранить и уйти"],
    ["ui.play.extend", "Ещё один ряд"],
    ["ui.days.counter", "Дней в Башне"],
  ])("reads %s as %s", (key, text) => {
    expect(ru[key]).toBe(text);
  });

  it("builds the thread button from a number a code fills, never from the text", () => {
    expect(ru["ui.task.thread"]).toBe("Путеводная нить · {n}");
  });
});

describe("REQ-3312: no ui value equals a rejected label or tells a time left", () => {
  it("passes every ui value", () => {
    const failing = Object.entries(ru)
      .filter(([key]) => key.startsWith("ui."))
      .filter(([, value]) => !label(value).ok);
    expect(failing).toEqual([]);
  });

  it.each([
    "Серия",
    " серия ",
    "Осталось 5 минут",
    "Дней подряд",
    "Правильный ответ",
    "Через 3 минуты",
  ])("fails a fixture value %s", (text) => {
    expect(label(text)).toMatchObject({ ok: false, rule: "rejected_label" });
  });

  it("fails a time phrase of the form «in N minutes» inside a longer value", () => {
    expect(label("Привал закончится через 5 минут")).toMatchObject({
      ok: false,
    });
  });
});
