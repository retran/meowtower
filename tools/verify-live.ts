// `npm run verify:live` (ADR-0100, ADR-3200): one frame through the real models for a sample of templates in
// each language, on the offline key and its own budget. Each reply lands in tests/recordings/.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { baseSeed } from "../src/math/rng.js";
import { openDatabase } from "../src/server/database.js";
import { createFrameQueue } from "../src/server/frames/queue.js";
import { readConfig } from "../src/server/gateway/config.js";
import { createGateway } from "../src/server/gateway/gateway.js";
import { recording } from "../src/server/gateway/recording.js";
import { liveRoutes } from "../src/server/gateway/routes.js";
import { templates } from "../src/templates/index.js";

const config = readConfig(process.env);
if (!config) throw new Error("model_config_invalid: a role is unset");
const budget = Number(process.env["VERIFY_LIVE_BUDGET_USD"] ?? 2);
const db = openDatabase(
  join(mkdtempSync(join(tmpdir(), "meowtower-live-")), "live.sqlite"),
);
const queue = createFrameQueue({
  db,
  gateway: createGateway({
    db,
    config,
    routes: recording(liveRoutes(config)),
    limits: { adventure: budget, month: budget },
  }),
  zone: "UTC",
});
const sample = templates.filter((_, i) => i % 300 === 0);
for (const lang of ["ru", "en", "nl"] as const)
  for (const template of sample) {
    const base = baseSeed("verify-live", template.id, 0);
    await queue.prepare({ template, base, bucket: "verify", lang });
    const frame = queue.take({ template, base, lang });
    console.log(`${lang} ${template.id}: ${frame?.text ?? "no frame"}`);
  }
