// REQ-8182, REQ-8256: the Master calls nine tools, each with a strict input, and a check answers
// with an outcome alone.
import { describe, expect, it } from "vitest";
import {
  checkOutcome,
  CheckReply,
  MASTER_TOOL_NAMES,
  parseToolCall,
} from "../../src/story/master-tools.js";

describe("the Master's tools", () => {
  it("names the nine tools of the decision", () => {
    expect([...MASTER_TOOL_NAMES].sort()).toEqual(
      [
        "adapt_scenario",
        "at_encounter",
        "change_world",
        "end_scene",
        "query_world",
        "record_event",
        "record_fact",
        "report_signal",
        "request_check",
      ].sort(),
    );
  });

  it("accepts a check request that says what she tried and why it is hard", () => {
    const got = parseToolCall("request_check", {
      tried: "she reads the lock's marks",
      hard: "the marks are worn",
    });
    expect(got.ok).toBe(true);
  });

  it("refuses a check that names a node, a level or an outcome", () => {
    for (const extra of [{ node: "N3" }, { level: 4 }, { outcome: "success" }])
      expect(
        parseToolCall("request_check", { tried: "a", hard: "b", ...extra }),
      ).toMatchObject({ ok: false, fault: "tool_input_invalid" });
  });

  it("refuses a tool that is not in the list", () => {
    expect(parseToolCall("set_verdict", {})).toMatchObject({
      ok: false,
      fault: "tool_unknown",
    });
  });

  it("refuses a signal outside the four", () => {
    expect(parseToolCall("report_signal", { signal: "loud" }).ok).toBe(false);
    expect(parseToolCall("report_signal", { signal: "scared" }).ok).toBe(true);
  });

  it("ends a scene with no input and refuses one with input", () => {
    expect(parseToolCall("end_scene", {}).ok).toBe(true);
    expect(parseToolCall("end_scene", { why: "x" }).ok).toBe(false);
  });

  it("gives a check reply only the outcome", () => {
    expect(CheckReply.safeParse({ outcome: "twist" }).success).toBe(true);
    expect(CheckReply.safeParse({ outcome: "twist", level: 3 }).success).toBe(
      false,
    );
    expect(CheckReply.safeParse({ outcome: "fail" }).success).toBe(false);
  });

  it("maps a clean answer to success, a partial one to a cost and a failed one to a twist", () => {
    expect(checkOutcome("clean")).toBe("success");
    expect(checkOutcome("partial")).toBe("cost");
    expect(checkOutcome("alt")).toBe("twist");
  });
});
