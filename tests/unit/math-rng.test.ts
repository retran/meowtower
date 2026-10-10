// TSK-0480: the seed is SHA-256 over the session, the node and the slot, its
// first 128 bits seed xoshiro128**, and a state of all zeros is replaced by a
// fixed constant, so a template, its version and a seed rebuild the same task
// (REQ-1202). The golden values come from a separate script that follows the
// reference C implementation.
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  baseSeed,
  candidateSeed,
  Xoshiro128,
  ZERO_STATE_REPLACEMENT,
} from "../../src/math/rng.js";

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

describe("REQ-1202: the base seed is a hash of the session, node and slot", () => {
  it("gives the same 256 bits twice and a different one for another slot", () => {
    const a = baseSeed("sess-1", "N1", 3);
    expect(hex(a)).toBe(
      "323feac3d86a1a707b52ac2e1def0c1cd9ef915072cd46d1e2debd1cec1d5824",
    );
    expect(hex(baseSeed("sess-1", "N1", 3))).toBe(hex(a));
    expect(hex(baseSeed("sess-1", "N1", 4))).not.toBe(hex(a));
    expect(hex(baseSeed("sess-1", "N2", 3))).not.toBe(hex(a));
  });

  it("does not let one field run into the next", () => {
    expect(hex(baseSeed("ab", "c", 1))).not.toBe(hex(baseSeed("a", "bc", 1)));
  });

  it("derives candidate k and a named stream from the base seed", () => {
    const base = baseSeed("sess-1", "N1", 3);
    expect(hex(candidateSeed(base, 7))).toBe(
      "8e786fdb769f144e782ac1fa01b6ace0",
    );
    expect(hex(candidateSeed(base, 7))).toBe(hex(candidateSeed(base, 7)));
    expect(hex(candidateSeed(base, 8))).not.toBe(hex(candidateSeed(base, 7)));
    expect(hex(candidateSeed(base, "parallel"))).not.toBe(
      hex(candidateSeed(base, 0)),
    );
  });
});

describe("REQ-1202: xoshiro128** draws the same numbers from the same seed", () => {
  it("matches the golden values, and the hash of the first 1,000 draws", () => {
    const rng = Xoshiro128.fromSeed(baseSeed("sess-1", "N1", 3));
    const draws: number[] = [];
    for (let i = 0; i < 1000; i++) draws.push(rng.next());
    expect(draws.slice(0, 6)).toEqual([
      1397938437, 631492666, 2325388701, 102466540, 1687883515, 3928354910,
    ]);
    expect(createHash("sha256").update(draws.join(",")).digest("hex")).toBe(
      "482df4856802a73292ad9fe4936115424de120af6c9487df3ffffa45767606e4",
    );
  });

  it("replaces a state of all zeros by the fixed constant", () => {
    const zero = Xoshiro128.fromSeed(new Uint8Array(16));
    const fixed = Xoshiro128.fromState(ZERO_STATE_REPLACEMENT);
    expect(zero.next()).toBe(fixed.next());
    expect(zero.next()).not.toBe(0);
    expect(ZERO_STATE_REPLACEMENT.some((word) => word !== 0)).toBe(true);
  });

  it("draws an integer below a bound without bias outside the range", () => {
    const rng = Xoshiro128.fromSeed(baseSeed("sess-1", "N1", 3));
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const v = rng.int(10);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(10);
      seen.add(v);
    }
    expect(seen.size).toBe(10);
  });
});
