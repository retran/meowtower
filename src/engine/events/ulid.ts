import { randomBytes } from "node:crypto";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** A ULID: 48 bits of milliseconds, then 80 random bits, in Crockford base32. */
export function ulid(ms: number): string {
  let time = "";
  for (let i = 0, t = ms; i < 10; i++, t = Math.floor(t / 32))
    time = CROCKFORD[t % 32] + time;
  let random = "";
  for (const byte of randomBytes(16)) random += CROCKFORD[byte % 32];
  return time + random;
}
