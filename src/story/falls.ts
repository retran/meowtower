// What the player is told when a skill is about to fall and when it has (REQ-7992, REQ-7994,
// REQ-7996, REQ-7998). The text speaks of threads and the way back, never of what she is, and
// says that her things stay.
import type { SkillName } from "../engine/model/skills.js";
import { type Lang, translator } from "../shared/i18n.js";

export type FallKind = "warning" | "skill" | "rank";

/** The story line for a warning, a fallen skill or a fallen rank, in the parent's language. */
export function fallText(kind: FallKind, skill: SkillName, lang: Lang): string {
  const { t } = translator(lang);
  if (kind === "rank") return t("ui.fall.rank");
  const name = t(`ui.skills.${skill}.name`);
  return kind === "warning"
    ? t("ui.fall.warning", { skill: name })
    : t("ui.fall.skill", { skill: name });
}
