// The word-problem build rule (REQ-0780): a template declares one of the seven
// structures of the catalogue, and any other declaration fails the build, named
// by its template.
import { STRUCTURES } from "../src/templates/word-problem.js";
import type { Finding } from "./static-checks.js";

export interface WordFacts {
  readonly template: string;
  readonly structure: string;
}

/** Each word problem whose declared structure is not in the catalogue. */
export function checkWordStructures(facts: readonly WordFacts[]): Finding[] {
  return facts
    .filter((f) => !(STRUCTURES as readonly string[]).includes(f.structure))
    .map((f) => ({
      check: "word_structure",
      file: f.template,
      match: f.structure,
    }));
}
