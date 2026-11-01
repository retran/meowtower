// REQ-7520, REQ-7530: what a task's string computes, exactly, and the noun that follows a number.
import { describe, expect, it } from "vitest";
import {
  agree,
  evaluate,
  readsFraction,
  readValue,
  writeValue,
} from "../../src/templates/expr.js";

const value = (source: string, vars: Record<string, string> = {}): string =>
  writeValue(evaluate(source, vars, "test"), readsFraction(source, vars));
const forms = ["кубик", "кубика", "кубиков"] as const;

describe("expressions in strings", () => {
  it("computes exactly, with the task's numbers", () => {
    expect(value("a*b+2", { a: "12 500", b: "2" })).toMatch(/^25\s002$/);
    expect(value("(a+b)/2", { a: "2,5", b: "1,5" })).toBe("2");
    expect(value("a/3", { a: "1" })).toBe("1⁄3");
    expect(value("a-b", { a: "2", b: "5" })).toBe("−3");
    expect(value("a+1", { a: "1⁄2" })).toBe("3⁄2");
  });

  it("has the functions a solution needs", () => {
    expect(value("floor(17/5)")).toBe("3");
    expect(value("mod(17,5)")).toBe("2");
    expect(value("gcd(16,56)")).toBe("8");
    expect(value("min(4,2,9)+max(4,2,9)")).toBe("11");
    expect(value("nth(2,9,1,5)")).toBe("5");
    expect(value("pow(2,5)")).toBe("32");
  });

  it("refuses what it can't read", () => {
    expect(() => value("a+1", { a: "x" })).toThrow(/bad_expression/);
    expect(() => value("z")).toThrow(/bad_expression/);
    expect(readValue("x")).toBeNull();
  });
});

describe("a noun after a number", () => {
  it("takes the form the number requires", () => {
    expect(agree("1", forms)).toBe("кубик");
    expect(agree("21", forms)).toBe("кубик");
    expect(agree("3", forms)).toBe("кубика");
    expect(agree("11", forms)).toBe("кубиков");
    expect(agree("112", forms)).toBe("кубиков");
    expect(agree("31", ["процент", "процента", "процентов"])).toBe("процент");
    expect(agree("2,5", forms)).toBe("кубика");
  });
});
