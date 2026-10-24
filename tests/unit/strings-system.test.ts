// TSK-0679: the parent reads the whole System section in one sitting (ADR-0160, REQ-3300).
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { systemSection } from "../../tools/strings-system.js";

describe("REQ-3300: the System section prints as one reading", () => {
  it("lists each system key with its lines, in order, and nothing else", () => {
    expect(
      systemSection({
        "ui.home.play": "Играть",
        "system.a": ["Первая строка.", { pause: "Подожди." }],
        "system.b": "Вторая.",
      }),
    ).toEqual([
      "system.a",
      "  Первая строка.",
      "  Подожди.",
      "system.b",
      "  Вторая.",
    ]);
  });

  it("prints the committed section through the npm command", () => {
    const out = execFileSync("npm", ["run", "--silent", "strings:system"], {
      encoding: "utf8",
    });
    expect(out.trim().split("\n")[0]).toBe("system.fallback.line");
  }, 60_000);
});
