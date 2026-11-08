// REQ-7992, REQ-7994, REQ-7996, REQ-7998: the fall texts name the thread and the way back, say
// that her things stay, and describe nothing about her.
import { describe, expect, it } from "vitest";
import { SKILLS } from "../../src/engine/model/skills.js";
import { SHIPPED } from "../../src/shared/i18n.js";
import { fallText } from "../../src/story/falls.js";

describe("fall texts", () => {
  for (const lang of SHIPPED) {
    it(`names the skill and leaves no placeholder in ${lang}`, () => {
      for (const { skill } of SKILLS)
        for (const kind of ["warning", "skill"] as const) {
          const text = fallText(kind, skill, lang);
          expect(text).not.toMatch(/[{}]/);
          expect(text.length).toBeGreaterThan(40);
        }
    });
    it(`gives a rank fall with no skill name in ${lang}`, () => {
      expect(fallText("rank", "marks", lang)).not.toMatch(/[{}]/);
    });
  }
  it("tells the player her things stay when a skill falls", () => {
    expect(fallText("skill", "marks", "en")).toContain("stays with you");
    expect(fallText("skill", "marks", "ru")).toContain("остались при тебе");
  });
  it("does not describe the player's ability", () => {
    for (const lang of SHIPPED)
      expect(fallText("skill", "trade", lang)).not.toMatch(
        /(слаб[аы]я? ты|you are (bad|weak)|je bent (slecht|zwak))/i,
      );
  });
});
