// `./meowtower model check [file]` (ADR-0060, REQ-0986): loads a parameter file and
// exits 0 when it passes the validator, 1 with the template and bound otherwise.
import { readFileSync } from "node:fs";
import { loadParams } from "../src/engine/model/params.js";

const file = process.argv[2] ?? "content/model.v1.json";
try {
  const p = loadParams(readFileSync(file, "utf8"));
  console.log(
    `model check: ${p.version} passes the validator for every answer form and 1 to 6 steps`,
  );
  process.exit(0);
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}
