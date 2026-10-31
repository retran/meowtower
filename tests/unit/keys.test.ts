// REQ-7528: the key of a symbol follows the layout, which only the keys pressed can show.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  firstLayout,
  isApple,
  isPhysical,
  layoutFromKey,
  symbolOf,
} from "../../src/client/keys.js";

describe("the layout behind the key hints", () => {
  it("reads the layout from a key", () => {
    expect(layoutFromKey({ key: "ф", code: "KeyA" }, true)).toBe("ruMac");
    expect(layoutFromKey({ key: "ф", code: "KeyA" }, false)).toBe("ruPc");
    expect(layoutFromKey({ key: "a", code: "KeyA" }, true)).toBe("latin");
    expect(layoutFromKey({ key: ".", code: "Slash" }, true)).toBe("ruPc");
    expect(layoutFromKey({ key: ",", code: "Digit6" }, true)).toBe("ruMac");
    expect(layoutFromKey({ key: "7", code: "Digit7" }, true)).toBeNull();
  });

  it("starts from the device", () => {
    expect(firstLayout("ru-RU", true, true)).toBe("touch");
    expect(firstLayout("ru-RU", true, false)).toBe("ruMac");
    expect(firstLayout("en-GB", true, false)).toBe("latin");
  });

  it("knows an iPad, which calls itself a Macintosh, and its screen keyboard", () => {
    expect(isApple("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe(
      true,
    );
    expect(isPhysical("Unidentified")).toBe(false);
    expect(isPhysical("")).toBe(false);
    expect(isPhysical("KeyA")).toBe(true);
  });

  it("names the symbol of each format", () => {
    expect(symbolOf("decimal")).toBe("comma");
    expect(symbolOf("fraction")).toBe("slash");
    expect(symbolOf("pair")).toBe("semicolon");
    expect(symbolOf("time")).toBe("colon");
  });

  it("names a key by its English marking, on every layout", () => {
    const strings = JSON.parse(
      readFileSync("content/i18n/ru.json", "utf8"),
    ) as Record<string, string>;
    const hints = Object.entries(strings).filter(([k]) =>
      k.startsWith("ui.play.key."),
    );
    expect(hints.length).toBe(16);
    for (const [key, text] of hints)
      expect(text, key).not.toMatch(/(?:буквой|от) \p{Script=Cyrillic}\b/u);
  });
});
