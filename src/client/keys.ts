// Which key types a symbol on the player's current layout. A browser doesn't name the layout, so it is read
// from the keys pressed, from `navigator.keyboard` where it exists, and from the device. The table of keys
// lives in the language file; it was read from the macOS layouts Russian, Russian - PC and ABC.
import type { Room } from "../shared/api.js";

export type Layout = "latin" | "ruMac" | "ruPc" | "touch";
export type Symbol = "comma" | "slash" | "semicolon" | "colon";

/** The symbol an answer's format needs. */
export function symbolOf(format: Room["input"]["format"]): Symbol | null {
  if (format === "decimal" || format === "line") return "comma";
  if (format === "fraction" || format === "mixed") return "slash";
  if (format === "pair") return "semicolon";
  return format === "time" ? "colon" : null;
}

const CYRILLIC = /\p{Script=Cyrillic}/u;

/** The Russian layout of a device: Apple's own unless a key has shown the PC one. */
const russian = (apple: boolean): Layout => (apple ? "ruMac" : "ruPc");

/** The layout a key press shows, or null when this press says nothing about it. */
export function layoutFromKey(
  e: { readonly key: string; readonly code: string },
  apple: boolean,
): Layout | null {
  // Only Russian - PC types a full stop on the physical slash key.
  if (e.code === "Slash" && e.key === ".") return "ruPc";
  // Shift and 6 types a comma only on Apple's Russian layout.
  if (e.code === "Digit6" && e.key === ",") return "ruMac";
  if (e.code === "Digit6" && e.key === "^") return "latin";
  if (CYRILLIC.test(e.key)) return russian(apple);
  return /^[a-zA-Z]$/.test(e.key) ? "latin" : null;
}

/** True for a key of a physical keyboard: the keyboard on an iPad's screen reports no code. */
export const isPhysical = (code: string): boolean =>
  code !== "" && code !== "Unidentified";

/** True on a Mac, an iPad or an iPhone; an iPad's browser calls itself a Macintosh. */
export const isApple = (userAgent: string): boolean =>
  /Macintosh|iPad|iPhone/.test(userAgent);

/** The first guess, before any key is pressed. */
export function firstLayout(
  language: string,
  apple: boolean,
  touch: boolean,
): Layout {
  if (touch) return "touch";
  return language.startsWith("ru") ? russian(apple) : "latin";
}
