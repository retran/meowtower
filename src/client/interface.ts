// The tablet and the computer interface (SPC-0010, REQ-2536).
export type Interface = "tablet" | "computer";

/** A touch screen with no fine pointer gets the tablet interface. */
export function detectInterface(): Interface {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const fine = matchMedia("(any-pointer: fine)").matches;
  return coarse && !fine ? "tablet" : "computer";
}

export function applyInterface(chosen: Interface): void {
  document.documentElement.dataset["interface"] = chosen;
}
