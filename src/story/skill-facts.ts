// What the scenario writer is told about the skills (REQ-8408, REQ-8416): the player's abilities as
// facts in the setting's words, and the Director's plan of practice. No node, level, percentage or
// estimate is named, so the story request keeps the rule that it holds no number of the model.
import { readFileSync } from "node:fs";
import type { PracticeItem } from "../engine/director/skill-plan.js";
import type { SkillScore } from "../engine/model/skills.js";
import type { Lang } from "../shared/i18n.js";

export interface SkillFacts {
  can: string[];
  learning: string[];
}

const stringsOf = (lang: Lang): Record<string, string> =>
  JSON.parse(
    readFileSync(
      new URL(`../../content/i18n/${lang}.json`, import.meta.url),
      "utf8",
    ),
  ) as Record<string, string>;

const wordsOf = (lang: Lang) => {
  const strings = stringsOf(lang);
  const text = (key: string): string => strings[key] ?? key;
  return {
    name: (skill: string): string => text(`ui.skills.${skill}.name`),
    step: (skill: string, level: number): string =>
      text(`ui.skills.${skill}.step.${String(level)}`),
  };
};

/** What she can do, from the step of each skill she has shown, and what she is still learning. */
export function skillFacts(
  scores: readonly SkillScore[],
  lang: Lang,
): SkillFacts {
  const words = wordsOf(lang);
  const can: string[] = [];
  const learning: string[] = [];
  for (const s of scores) {
    if (s.shown)
      can.push(`${words.name(s.skill)}: ${words.step(s.skill, s.level)}`);
    if (!s.shown || s.level <= 2) learning.push(words.name(s.skill));
  }
  return { can, learning };
}

interface Texts {
  can: string;
  learning: string;
  practise: string;
  line: string;
  purposes: Record<string, string>;
}

/** The prompt wording for the skills, from the language's scenario prompt file. */
export function skillTexts(lang: Lang): Texts {
  const file = JSON.parse(
    readFileSync(
      new URL(`../../content/story/scenario.${lang}.json`, import.meta.url),
      "utf8",
    ),
  ) as { skills: Texts };
  return file.skills;
}

/** The plan of practice as the writer reads it: each skill's code and name, why, and the checks asked. */
export function practiseText(
  plan: readonly PracticeItem[],
  lang: Lang,
): string {
  const { practise, line, purposes } = skillTexts(lang);
  const words = wordsOf(lang);
  const list = plan
    .map((p) =>
      line
        .replace("{code}", p.skill)
        .replace("{name}", words.name(p.skill))
        .replace("{purpose}", purposes[p.purpose] ?? p.purpose)
        .replace("{checks}", String(p.checks)),
    )
    .join("\n");
  return practise.replace("{list}", list);
}

/** Every step she has opened in each skill she has shown, as things she can do, with no number (REQ-8406). */
export function openedSteps(
  scores: readonly SkillScore[],
  lang: Lang,
): string[] {
  const words = wordsOf(lang);
  return scores.flatMap((s) =>
    s.shown
      ? [
          `${words.name(s.skill)}: ${Array.from({ length: s.level }, (_, i) =>
            words.step(s.skill, i + 1),
          ).join(" ")}`,
        ]
      : [],
  );
}
