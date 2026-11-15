// REQ-8280, REQ-8282 (ADR-3420): the child's profile holds no real name or school, which the parent lists for
// the egress guard, and it is no longer than 2,000 characters. The check runs when the profile is saved; the
// gateway cleans the same names from every request again.
import { describe, expect, it } from "vitest";
import { PROFILE_MAX, profileFault } from "../../src/server/profile.js";

describe("REQ-8282: the profile is checked against the parent's list of names", () => {
  it("accepts a profile that holds none of them, and any profile where the list is empty", () => {
    expect(profileFault("Loves cats and the canal.", ["Marta"])).toBeNull();
    expect(profileFault("Loves cats and Marta.", [])).toBeNull();
    expect(profileFault("", ["Marta"])).toBeNull();
  });

  it("names the one it holds, whatever its case", () => {
    expect(profileFault("Her friend is MARTA from class.", ["Marta"])).toEqual({
      code: "name",
      held: "Marta",
    });
    expect(
      profileFault("Goes to the springfield school.", ["Springfield School"]),
    ).toEqual({ code: "name", held: "Springfield School" });
  });

  it("leaves out a name of one character, which would match inside any word", () => {
    expect(profileFault("A cat.", ["A", ""])).toBeNull();
  });

  it("refuses a profile over its length", () => {
    expect(PROFILE_MAX).toBe(2000);
    expect(profileFault("x".repeat(2001), [])).toEqual({
      code: "too_long",
      held: "2001",
    });
    expect(profileFault("x".repeat(2000), [])).toBeNull();
  });
});
