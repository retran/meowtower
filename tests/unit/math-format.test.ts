// TSK-0480: `formatQ` writes a number with the decimal sign and the group
// separator of the locale's notation profile: for `ru`, a decimal comma and a
// no-break space in every number of 4 digits or more (REQ-1226). Code writes
// `·` for multiplication and `:` for division.
import { describe, expect, it } from "vitest";
import { formatQ, notation } from "../../src/math/format.js";
import { Q } from "../../src/math/q.js";
import { baseSeed, Xoshiro128 } from "../../src/math/rng.js";

const NBSP = " ";

describe("REQ-1226: Russian numbers", () => {
  it("writes a decimal comma and groups 4 digits or more with a no-break space", () => {
    expect(formatQ(Q.of(12500n))).toBe(`12${NBSP}500`);
    expect(formatQ(Q.of(4003n))).toBe(`4${NBSP}003`);
    expect(formatQ(Q.of(2400n))).toBe(`2${NBSP}400`);
    expect(formatQ(Q.of(1n, 2n))).toBe("0,5");
    expect(formatQ(Q.of(7n, 2n))).toBe("3,5");
    expect(formatQ(Q.of(999n))).toBe("999");
    expect(formatQ(Q.of(1234567n, 100n))).toBe(`12${NBSP}345,67`);
    expect(formatQ(Q.of(-5n))).toBe("−5");
    expect(formatQ(Q.of(0n))).toBe("0");
  });

  it("refuses a fraction that has no finite decimal", () => {
    expect(() => formatQ(Q.of(1n, 3n))).toThrow();
  });

  it("takes the signs from the notation profile in the language file", () => {
    const profile = notation();
    expect(profile.decimal).toBe(",");
    expect(profile.group).toBe(NBSP);
    expect(profile.mul).toBe("·");
    expect(profile.div).toBe(":");
  });

  it("finds no point as a decimal sign and no ungrouped number of 4 digits or more in 1,000 numbers", () => {
    const rng = Xoshiro128.fromSeed(baseSeed("s", "N", 1));
    for (let i = 0; i < 1000; i++) {
      const digits = 1 + rng.int(8);
      const whole = BigInt(rng.int(10 ** Math.min(digits, 9)));
      const places = rng.int(3);
      const text = formatQ(
        Q.of(
          whole * 10n ** BigInt(places) + BigInt(rng.int(10 ** places || 1)),
          10n ** BigInt(places),
        ),
      );
      expect(text).not.toMatch(/\d\.\d/);
      const integerPart = text.replace("−", "").split(",")[0] ?? "";
      expect(integerPart).not.toMatch(/\d{4,}/);
      if (integerPart.replaceAll(NBSP, "").length >= 4)
        expect(integerPart).toContain(NBSP);
    }
  });
});
