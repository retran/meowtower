// TSK-0400: a game day runs from 04:00 to 04:00 in the time zone of the device
// she plays on (SPC-0030, REQ-0236). `gameDayOf` is the one function that turns
// a time into a game day index, so every count of adventure days shares it.
import { describe, expect, it } from "vitest";
import { gameDayOf } from "../../src/shared/game-day.js";

const at = (iso: string): number => Date.parse(iso);

describe("REQ-0236: a game day ends at 04:00 in the device's zone", () => {
  it("puts 03:59 on the day before and 04:00 on the next", () => {
    const before = gameDayOf(at("2026-03-02T03:59:59Z"), "UTC");
    const after = gameDayOf(at("2026-03-02T04:00:00Z"), "UTC");
    expect(after).toBe(before + 1);
    expect(gameDayOf(at("2026-03-03T03:59:59Z"), "UTC")).toBe(after);
  });

  it("moves the boundary with the zone", () => {
    // 04:00 in Amsterdam in January is 03:00 UTC.
    const zone = "Europe/Amsterdam";
    const before = gameDayOf(at("2026-01-15T02:59:59Z"), zone);
    expect(gameDayOf(at("2026-01-15T03:00:00Z"), zone)).toBe(before + 1);
    // The same instants fall on one game day in UTC.
    expect(gameDayOf(at("2026-01-15T03:00:00Z"), "UTC")).toBe(
      gameDayOf(at("2026-01-15T02:59:59Z"), "UTC"),
    );
  });

  it("counts a clock change as one game day, not two or none", () => {
    const zone = "Europe/Amsterdam";
    // Summer time starts on 2026-03-29, when 02:00 becomes 03:00.
    const evening = gameDayOf(at("2026-03-28T20:00:00Z"), zone);
    const next = gameDayOf(at("2026-03-29T20:00:00Z"), zone);
    expect(next).toBe(evening + 1);
  });

  it("gives consecutive days consecutive indexes", () => {
    const first = gameDayOf(at("2026-02-27T10:00:00Z"), "UTC");
    expect(gameDayOf(at("2026-02-28T10:00:00Z"), "UTC")).toBe(first + 1);
    expect(gameDayOf(at("2026-03-01T10:00:00Z"), "UTC")).toBe(first + 2);
  });
});
