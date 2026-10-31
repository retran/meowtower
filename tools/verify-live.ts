// `npm run verify:live` (ADR-0100, ADR-3200): one frame through the real models for a sample of templates in
// each language, on the offline key and its own budget. Each reply lands in tests/recordings/.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { baseSeed } from "../src/math/rng.js";
import { openDatabase } from "../src/server/database.js";
import { Answers, scoreOf } from "../src/server/frames/check.js";
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
  pauses: false,
});
console.log(`budget: $${budget.toString()}`);
const sample = templates.filter((_, i) => i % 300 === 0);
const jobs = (["ru", "en", "nl"] as const).flatMap((lang) =>
  sample.map((template) => ({ lang, template })),
);
/** Six tasks at once: the author takes most of the time, and each waits for its own reply. */
const AT_ONCE = 6;
await Promise.all(
  Array.from({ length: AT_ONCE }, async () => {
    for (let job = jobs.shift(); job; job = jobs.shift()) {
      const { lang, template } = job;
      const base = baseSeed("verify-live", template.id, 0);
      await queue.prepare({ template, base, bucket: "verify", lang });
      const frame = queue.take({ template, base, lang });
      console.log(`${lang} ${template.id}: ${frame?.text ?? "no frame"}`);
    }
  }),
);
// Every variant the judge read, by task, best first, with its answers.
interface Judged {
  readonly request: string;
  readonly response: string;
}
const statusOf = db.prepare("SELECT status FROM frames WHERE text = ? LIMIT 1");
const tasks = new Map<string, { score: number; line: string }[]>();
for (const row of db
  .prepare(
    "SELECT request, response FROM llm_log WHERE role = 'FRAME_JUDGE_MODEL' AND outcome = 'ok'",
  )
  .all() as Judged[]) {
  const { messages } = JSON.parse(row.request) as {
    messages: { content: string }[];
  };
  const [story = "", original = ""] = (messages.at(-1)?.content ?? "").split(
    "\n\n",
  );
  const text = story.slice(story.indexOf("\n") + 1);
  const answers = Answers.parse(JSON.parse(row.response));
  const score = scoreOf(answers) ?? -9;
  const { status } = (statusOf.get(text) ?? { status: "?" }) as {
    status: string;
  };
  const marks = Object.entries(answers)
    .map(([k, v]) => `${k} ${typeof v === "number" ? v.toFixed(2) : v}`)
    .join("  ");
  tasks.set(original, [
    ...(tasks.get(original) ?? []),
    { score, line: `${score.toFixed(2)} ${status}\n  ${marks}\n  ${text}` },
  ]);
}
for (const [original, variants] of tasks) {
  console.log(`\n=== ${original}`);
  for (const v of [...variants].sort((a, b) => b.score - a.score))
    console.log(v.line);
}
console.table(
  db
    .prepare(
      `SELECT lang, status, COALESCE(step, '') AS step, COUNT(*) AS count
       FROM frames GROUP BY lang, status, step`,
    )
    .all(),
);
console.table(
  db
    .prepare(
      `SELECT role, outcome, COUNT(*) AS calls, SUM(cost_usd) AS usd,
         AVG(latency_ms) AS ms, MAX(CASE WHEN outcome != 'ok' THEN response END) AS fault
       FROM llm_log GROUP BY role, outcome`,
    )
    .all(),
);
