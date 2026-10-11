// The parallel task of a second attempt (ADR-0040, ADR-0080, REQ-1224). It is
// drawn from the same template and base seed as the original, on its own seed
// stream, with the original's difficulty. Its given numbers and its correct answer
// must both differ from the original's. A template with no such task within
// 1,000 candidates reports twin_unavailable, and the second attempt is skipped.
import { candidateSeed, Xoshiro128 } from "../../math/rng.js";
import {
  distinct,
  CANDIDATE_LIMIT,
  type Built,
  type Template,
} from "./template.js";

export type Twin<P> =
  | {
      readonly status: "ok";
      readonly built: Built<P>;
      readonly effectiveSeed: string;
    }
  | { readonly status: "twin_unavailable" };

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The given numbers of a candidate as a set, so order doesn't count as a change. */
const numberSet = (params: object): string =>
  Object.values(params).map(String).sort().join(",");

/**
 * Draws the parallel task of `original` from the template's own candidate loop,
 * on the `parallel` seed stream. Its difficulty must equal the original's, its
 * set of given numbers and its correct answer must both differ, and its traps
 * must be distinct from its answer (REQ-1224).
 */
export function sampleParallel<P extends object>(
  template: Template<P>,
  base: Uint8Array,
  original: Built<P>,
  difficulty: (params: P) => number,
): Twin<P> {
  const originalNumbers = numberSet(original.params);
  const target = difficulty(original.params);
  for (let k = 0; k < CANDIDATE_LIMIT; k++) {
    const params = template.draw(
      Xoshiro128.fromSeed(candidateSeed(base, `parallel:${k}`)),
    );
    if (!template.valid(params)) continue;
    if (difficulty(params) !== target) continue;
    if (numberSet(params) === originalNumbers) continue;
    const answer = template.solve(params);
    if (answer.eq(original.answer)) continue;
    const traps = template.traps(params);
    if (!distinct(answer, traps)) continue;
    return {
      status: "ok",
      built: {
        params,
        answer,
        traps,
        effectiveSeed: `${hex(base)}/parallel:${k}`,
      },
      effectiveSeed: `${hex(base)}/parallel:${k}`,
    };
  }
  return { status: "twin_unavailable" };
}
