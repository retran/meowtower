// `Q`, an exact rational on `bigint` (ADR-0040, REQ-1204): every sum,
// difference, product and quotient of a task is computed here, so no answer,
// trap or check ever meets a float. A value is kept in lowest terms with a
// positive denominator, so equal values have equal parts.

const gcd = (a: bigint, b: bigint): bigint => {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
};

export class Q {
  private constructor(
    /** The numerator, carrying the sign. */
    readonly n: bigint,
    /** The denominator, always positive. */
    readonly d: bigint,
  ) {}

  /** `n / d` in lowest terms; a zero denominator is refused. */
  static of(n: bigint, d: bigint = 1n): Q {
    if (d === 0n) throw new RangeError("zero_denominator");
    const sign = d < 0n ? -1n : 1n;
    const g = gcd(n, d) || 1n;
    return new Q((sign * n) / g, (sign * d) / g);
  }

  /**
   * A decimal as the fraction it is: `0,1` is `1/10`. The sign, digits and one
   * `,` or `.` are read, and nothing else, so `3,,5` is refused.
   */
  static fromDecimal(text: string): Q {
    const m = /^([+-]?)(\d+)(?:[.,](\d+))?$/.exec(text.trim());
    if (!m) throw new SyntaxError("not_a_decimal");
    const [, sign = "", whole = "", fraction = ""] = m;
    const n = BigInt(whole + fraction);
    return Q.of(sign === "-" ? -n : n, 10n ** BigInt(fraction.length));
  }

  add(o: Q): Q {
    return Q.of(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  sub(o: Q): Q {
    return Q.of(this.n * o.d - o.n * this.d, this.d * o.d);
  }

  mul(o: Q): Q {
    return Q.of(this.n * o.n, this.d * o.d);
  }

  div(o: Q): Q {
    if (o.n === 0n) throw new RangeError("division_by_zero");
    return Q.of(this.n * o.d, this.d * o.n);
  }

  neg(): Q {
    return new Q(-this.n, this.d);
  }

  /** -1, 0 or 1, compared by value. */
  cmp(o: Q): -1 | 0 | 1 {
    const left = this.n * o.d;
    const right = o.n * this.d;
    return left < right ? -1 : left > right ? 1 : 0;
  }

  eq(o: Q): boolean {
    return this.n === o.n && this.d === o.d;
  }

  lt(o: Q): boolean {
    return this.cmp(o) < 0;
  }

  isInteger(): boolean {
    return this.d === 1n;
  }

  /** The greatest integer not above the value. */
  floor(): Q {
    const q = this.n / this.d;
    return Q.of(this.n < 0n && this.n % this.d !== 0n ? q - 1n : q);
  }

  toString(): string {
    return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`;
  }
}
