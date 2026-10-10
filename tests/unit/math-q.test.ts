// TSK-0480: `Q` computes every sum, difference, product and quotient exactly,
// decimals included (REQ-1204).
import { describe, expect, it } from "vitest";
import { Q } from "../../src/math/q.js";

describe("REQ-1204: Q is exact", () => {
  it("adds the decimals 0,1 and 0,2 to exactly 3/10", () => {
    const sum = Q.fromDecimal("0,1").add(Q.fromDecimal("0,2"));
    expect(sum.toString()).toBe("3/10");
    expect(sum.eq(Q.of(3n, 10n))).toBe(true);
    // The float answer is the wrong one, which is why the type exists.
    expect(0.1 + 0.2).not.toBe(0.3);
  });

  it("divides 79 by 10 to exactly 79/10 and multiplies back with no loss", () => {
    const quotient = Q.of(79n).div(Q.of(10n));
    expect(quotient.toString()).toBe("79/10");
    expect(quotient.mul(Q.of(10n)).toString()).toBe("79");
  });

  it("adds 0,1 a thousand times to exactly 100", () => {
    let total = Q.of(0n);
    for (let i = 0; i < 1000; i++) total = total.add(Q.fromDecimal("0,1"));
    expect(total.toString()).toBe("100");
  });

  it("keeps the fraction in lowest terms with a positive denominator", () => {
    expect(Q.of(2n, 4n).toString()).toBe("1/2");
    expect(Q.of(1n, -2n).toString()).toBe("-1/2");
    expect(Q.of(-6n, -8n).toString()).toBe("3/4");
    expect(Q.of(0n, 7n).toString()).toBe("0");
  });

  it("subtracts, negates and multiplies exactly", () => {
    expect(Q.of(1n, 3n).sub(Q.of(1n, 2n)).toString()).toBe("-1/6");
    expect(Q.of(2n, 3n).neg().toString()).toBe("-2/3");
    expect(Q.of(3n, 4n).mul(Q.of(8n, 9n)).toString()).toBe("2/3");
  });

  it("compares by value, so 2/4 equals 1/2", () => {
    expect(Q.of(2n, 4n).eq(Q.of(1n, 2n))).toBe(true);
    expect(Q.of(1n, 3n).lt(Q.of(1n, 2n))).toBe(true);
    expect(Q.of(1n, 2n).cmp(Q.of(1n, 3n))).toBe(1);
    expect(Q.of(1n, 2n).cmp(Q.of(1n, 2n))).toBe(0);
  });

  it("reads a decimal written with a comma or a point, with a sign", () => {
    expect(Q.fromDecimal("2,5").toString()).toBe("5/2");
    expect(Q.fromDecimal("2.50").toString()).toBe("5/2");
    expect(Q.fromDecimal("-0,75").toString()).toBe("-3/4");
    expect(Q.fromDecimal("007").toString()).toBe("7");
  });

  it("refuses text that is not a decimal and a division by zero", () => {
    expect(() => Q.fromDecimal("3,,5")).toThrow();
    expect(() => Q.fromDecimal("abc")).toThrow();
    expect(() => Q.of(1n).div(Q.of(0n))).toThrow();
    expect(() => Q.of(1n, 0n)).toThrow();
  });

  it("reports whether it is an integer and its floor", () => {
    expect(Q.of(6n, 3n).isInteger()).toBe(true);
    expect(Q.of(7n, 2n).isInteger()).toBe(false);
    expect(Q.of(7n, 2n).floor().toString()).toBe("3");
    expect(Q.of(-7n, 2n).floor().toString()).toBe("-4");
  });
});
