// What the studio is given beyond the database: the models it can call, each present only while its role is
// configured (ADR-3270, ADR-3360, ADR-3280). Bundled so a new one is a field and not another argument.
import type { Db } from "../db/index.js";
import type { Gateway } from "../gateway/gateway.js";
import type { MasterFactory, SandboxFrames } from "../sandbox/play.js";
import type { AdventureWriter } from "./generate.js";

/** Makes the gateway of the prompt lab, which spends from the sandbox's own limit (REQ-8302). */
export type LabGateway = (sandbox: Db) => Gateway;

export interface StudioExtras {
  readonly master?: MasterFactory;
  readonly sandboxFrames?: SandboxFrames;
  readonly generator?: AdventureWriter;
  readonly lab?: LabGateway;
}
