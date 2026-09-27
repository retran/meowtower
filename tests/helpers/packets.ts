// The field names no packet may carry (REQ-2428): the task's design stays on
// the server. Shared by the API recorder and the end-to-end fixture.
export const FORBIDDEN = [
  "node",
  "templateId",
  "seed",
  "params",
  "purpose",
  "scored",
  "frameId",
  "flowSlot",
  "why",
];

export function forbiddenFields(value: unknown, path = ""): string[] {
  if (Array.isArray(value))
    return value.flatMap((v, i) => forbiddenFields(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => [
      ...(FORBIDDEN.includes(k) ? [`${path}.${k}`] : []),
      ...forbiddenFields(v, `${path}.${k}`),
    ]);
  }
  return [];
}
