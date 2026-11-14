// What the parent can force on the next check in the sandbox (ADR-3280, REQ-8290). An outcome sets
// the outcome the answer's verdict carries, and a fall or a rise moves the answered node's level by
// one. An open gate waits for the gates of ADR-3230, which are not built, so it is refused.
import { z } from "zod";

export const FORCES = ["clean", "partial", "alt", "fall", "rise"] as const;
export type Forced = (typeof FORCES)[number];

export const Force = z.object({ next: z.enum(FORCES) }).strict();
