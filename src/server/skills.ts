// The skills the sheet shows (REQ-8400): each skill's whole level and percentage from the
// `skill_scores` projection, in the order of the nine, and "not yet shown" where it has no row.
import { SKILLS } from "../engine/model/skills.js";
import type { SkillsOut } from "../shared/api.js";
import type { Db } from "./database.js";

interface Row {
  skill: string;
  shown: number;
  level: number | null;
  percent: number | null;
}

export async function skillsRead(db: Db): Promise<SkillsOut["skills"]> {
  const rows = new Map(
    (
      (await db
        .prepare("SELECT skill, shown, level, percent FROM skill_scores")
        .all()) as Row[]
    ).map((r) => [r.skill, r]),
  );
  return SKILLS.map(({ skill }) => {
    const row = rows.get(skill);
    return row?.shown && row.level !== null && row.percent !== null
      ? { skill, shown: true as const, level: row.level, percent: row.percent }
      : { skill, shown: false as const };
  });
}
