// The seeded source (ADR-0040, REQ-1202). A task is built from a base seed,
// SHA-256 over the session, the node and the slot; candidate `k` is drawn from
// `hash(baseSeed, k)`, and the first 128 bits of a seed are the state of
// xoshiro128**. Nothing here reads a clock or `Math.random`, so the same
// template, version and seed rebuild the same task.
import { createHash } from "node:crypto";

/** The state used in place of all zeros, which xoshiro128** can't leave. */
export const ZERO_STATE_REPLACEMENT: readonly [number, number, number, number] =
  [0x9e3779b9, 0x243f6a88, 0xb7e15162, 0xdeadbeef];

const sha256 = (...parts: Uint8Array[]): Uint8Array =>
  createHash("sha256")
    .update(Buffer.concat(parts.map((p) => Buffer.from(p))))
    .digest();

const text = (value: string): Uint8Array => Buffer.from(value, "utf8");
const NUL = Uint8Array.of(0);

/** The base seed of a task: SHA-256 over the session, the node and the slot. */
export function baseSeed(
  sessionId: string,
  nodeId: string,
  slot: number,
): Uint8Array {
  return sha256(text(sessionId), NUL, text(nodeId), NUL, text(String(slot)));
}

/**
 * The 128-bit seed of candidate `k`, or of a named stream such as
 * `"parallel"`: the first 128 bits of SHA-256 over the base seed, a zero byte
 * and the label.
 */
export function candidateSeed(
  base: Uint8Array,
  label: number | string,
): Uint8Array {
  return sha256(base, NUL, text(String(label))).subarray(0, 16);
}

const rotl = (x: number, k: number): number =>
  ((x << k) | (x >>> (32 - k))) >>> 0;

export class Xoshiro128 {
  private constructor(private readonly s: [number, number, number, number]) {}

  /** The state of the first 128 bits of `seed`, read as four big-endian words. */
  static fromSeed(seed: Uint8Array): Xoshiro128 {
    const view = new DataView(seed.buffer, seed.byteOffset, seed.byteLength);
    const words = [0, 1, 2, 3].map((i) =>
      i * 4 + 4 <= seed.byteLength ? view.getUint32(i * 4) : 0,
    ) as [number, number, number, number];
    return Xoshiro128.fromState(words);
  }

  static fromState(
    state: readonly [number, number, number, number],
  ): Xoshiro128 {
    const copy: [number, number, number, number] = [
      state[0] >>> 0,
      state[1] >>> 0,
      state[2] >>> 0,
      state[3] >>> 0,
    ];
    if (copy.every((word) => word === 0))
      return new Xoshiro128([...ZERO_STATE_REPLACEMENT]);
    return new Xoshiro128(copy);
  }

  /** The next unsigned 32-bit number. */
  next(): number {
    const s = this.s;
    const result = Math.imul(rotl(Math.imul(s[1], 5) >>> 0, 7), 9) >>> 0;
    const t = (s[1] << 9) >>> 0;
    s[2] = (s[2] ^ s[0]) >>> 0;
    s[3] = (s[3] ^ s[1]) >>> 0;
    s[1] = (s[1] ^ s[2]) >>> 0;
    s[0] = (s[0] ^ s[3]) >>> 0;
    s[2] = (s[2] ^ t) >>> 0;
    s[3] = rotl(s[3], 11);
    return result;
  }

  /** An integer from 0 up to but not including `bound`, without modulo bias. */
  int(bound: number): number {
    if (!Number.isInteger(bound) || bound <= 0 || bound > 2 ** 32)
      throw new RangeError("bad_bound");
    const limit = 2 ** 32 - (2 ** 32 % bound);
    for (;;) {
      const v = this.next();
      if (v < limit) return v % bound;
    }
  }
}
