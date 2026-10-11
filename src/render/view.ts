// The client's view of a task (ADR-0040, REQ-1218 to REQ-1230). The identifier
// the client receives is an HMAC of the task's id under the server's secret, so
// it reveals nothing about the node, the template, the seed or the parameters. A
// view holds the text, the picture and the options, and nothing else: no trap,
// no solution path, no short solution and no correct answer. A picture is drawn
// by code from its parameters, which a strict schema admits and nothing more.
import { createHmac } from "node:crypto";
import { z } from "zod";

/** A task as the server holds it. Only `clientView` may pass any of it on. */
export interface ServerTask {
  readonly taskId: string;
  readonly node: string;
  readonly templateId: string;
  readonly seed: string;
  readonly text: string;
  readonly svg: string | null;
  readonly options: readonly string[] | null;
  readonly traps: readonly { readonly id: string; readonly value: string }[];
  readonly correctAnswer: string;
  readonly shortSolution: readonly string[];
}

/** The identifier of a task: an HMAC under the server's secret (REQ-1218). */
export const opaqueId = (secret: Uint8Array, taskId: string): string =>
  createHmac("sha256", secret).update(taskId).digest("hex").slice(0, 32);

/** The only shape a client may receive, and no field beyond it (REQ-1222). */
export const clientViewSchema = z
  .object({
    itemId: z.string().regex(/^[0-9a-f]{32}$/),
    locale: z.literal("ru"),
    text: z.string(),
    svg: z.string().nullable(),
    options: z.array(z.string()).nullable(),
  })
  .strict();

export type ClientView = z.infer<typeof clientViewSchema>;

/** Drops a frame or anchor identifier from anything the renderer draws. */
export function stripIds<T extends Record<string, unknown>>(
  value: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([key]) => key !== "frameId" && key !== "anchorId",
    ),
  ) as Partial<T>;
}

/** The view of a task for the client, before any attempt (REQ-1220). */
export function clientView(task: ServerTask, secret: Uint8Array): ClientView {
  return clientViewSchema.parse({
    itemId: opaqueId(secret, task.taskId),
    locale: "ru",
    text: task.text,
    svg: task.svg,
    options: task.options === null ? null : [...task.options],
  });
}

/** The parameters a picture is drawn from: a count of units, and no more. */
const pictureParams = z
  .object({ count: z.number().int().min(0).max(20) })
  .strict();

export function parsePictureParams(value: unknown): { count: number } {
  return pictureParams.parse(value);
}

/** A picture drawn by code from its parameters alone (REQ-1230). */
export function renderPicture(value: unknown): string {
  const { count } = parsePictureParams(value);
  const cells = Array.from(
    { length: count },
    (_, i) => `<rect x="${i * 20 + 1}" y="1" width="18" height="18"/>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.max(1, count) * 20} 20">${cells}</svg>`;
}
