// The starting estimates of the knowledge model and the model version (ADR-0060,
// TSK-0519, REQ-0982 to REQ-0984). The prior row follows the school-group setting the
// parent set; a log with no setting uses the group 7 row, so a first answer moves the
// estimate most. A new setting is a new model version, and the earlier rows stay.
import type { ModelParamsT } from "./params.js";

/** The row used when the log holds no school-group setting (ADR-0060). */
export const DEFAULT_GROUP = 7;

export interface SettingEvent {
  readonly type: string;
  readonly payload: unknown;
}

/** The school group the latest `settings_changed` event for `schoolGroup` sets, or null. */
export function schoolGroupOf(log: readonly SettingEvent[]): number | null {
  let group: number | null = null;
  for (const event of log) {
    if (event.type !== "settings_changed") continue;
    const p = event.payload as { key?: unknown; value?: unknown } | undefined;
    if (p?.key === "schoolGroup" && typeof p.value === "number")
      group = p.value;
  }
  return group;
}

/** The prior row in use: the setting's group, or the group 7 row when there is none. */
export const rowOf = (log: readonly SettingEvent[]): number =>
  schoolGroupOf(log) ?? DEFAULT_GROUP;

/** pInit of a subtype's level in the row of its group (ADR-0060). */
export function priorOf(
  p: ModelParamsT,
  group: number,
  level: "1F" | "1S" | "stretch",
): number {
  const row = p.pInit[String(group)];
  if (row === undefined) throw new RangeError(`no_prior_row:${group}`);
  return row[level];
}

/** The model version: the file's version plus the row in use (REQ-0984). */
export const modelVersionOf = (fileVersion: string, group: number): string =>
  `${fileVersion}:g${group}`;
