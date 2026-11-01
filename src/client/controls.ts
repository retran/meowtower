// Controls every screen builds from, so each one is keyboard-operable and
// reports its action: the keyboard test reads `data-last-action` to prove a
// key press operated the control it focused.
import { t, type UiKey } from "./strings.js";

export function act(action: string): void {
  document.body.dataset["lastAction"] = action;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

export { el };

/** A fraction as the server writes it (U+2044) or as the player types it. */
const FRACTION = /(\d+)[\u2044/](\d+)/g;

/** A text with each fraction `3⁄4` drawn as a numerator over a bar over a denominator. */
export function math(text: string): (Node | string)[] {
  const parts: (Node | string)[] = [];
  let from = 0;
  for (const m of text.matchAll(FRACTION)) {
    const at = m.index ?? 0;
    if (at > from) parts.push(text.slice(from, at));
    const frac = el("span", { className: "frac" });
    frac.setAttribute("role", "math");
    frac.setAttribute("aria-label", `${m[1] ?? ""}/${m[2] ?? ""}`);
    frac.append(el("span", {}, m[1] ?? ""), el("span", {}, m[2] ?? ""));
    parts.push(frac);
    from = at + m[0].length;
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

/** The button Enter presses on a screen, when focus is on no control of its own. */
const PRIMARY =
  '[data-action="play"], [data-action="play-submit"], [data-action="play-next"]';

/** The keys of the computer: Enter for the main button, and digits or signs for the answer buttons. */
function onKey(e: KeyboardEvent): void {
  if (e.repeat || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
  const target = e.target instanceof HTMLElement ? e.target : document.body;
  if (target.closest("input, textarea")) return;
  const options = [...document.querySelectorAll<HTMLButtonElement>(".option")];
  const chosen =
    options[Number(e.key) - 1] ??
    options.find((b) => b.textContent === e.key && !/\d/.test(e.key));
  if (chosen && !chosen.disabled) {
    e.preventDefault();
    chosen.click();
    return;
  }
  if (e.key === "Backspace") {
    document.querySelector<HTMLElement>('[data-action="play-undo"]')?.click();
    return;
  }
  if (e.key !== "Enter" || target.closest("a, button:not(.option)")) return;
  const primary = document.querySelector<HTMLElement>(PRIMARY);
  if (primary) {
    e.preventDefault();
    primary.click();
  }
}

/** Turns the keys on, once, for the life of the page. */
export const installKeys = (): void => {
  document.addEventListener("keydown", onKey);
};

/** Puts the cursor in a screen's field on a computer; on a tablet that would open the keyboard. */
export function focusField(screen: HTMLElement): void {
  if (document.documentElement.dataset["interface"] !== "computer") return;
  screen
    .querySelector<HTMLElement>('input:not([type="radio"]), textarea')
    ?.focus();
}

/** A form's submit, which Enter in its field fires, as a press of its button. */
export const enterPresses =
  (send: HTMLButtonElement) =>
  (e: Event): void => {
    e.preventDefault();
    send.click();
  };

export function heading(key: UiKey): HTMLHeadingElement {
  return el("h1", { id: "screen-title" }, t(key));
}

export function status(text = ""): HTMLParagraphElement {
  const p = el("p", { className: "status" }, text);
  p.setAttribute("role", "status");
  return p;
}

export function button(
  key: UiKey,
  action: string,
  onActivate: () => void | Promise<void>,
): HTMLButtonElement {
  const b = el("button", { type: "button", className: "control" }, t(key));
  b.dataset["action"] = action;
  b.addEventListener("click", () => {
    act(action);
    void onActivate();
  });
  return b;
}

export function link(
  key: UiKey,
  action: string,
  to: string,
): HTMLAnchorElement {
  const a = el("a", { href: `#${to}`, className: "control" }, t(key));
  a.dataset["action"] = action;
  a.addEventListener("click", () => act(action));
  return a;
}

export function choice(
  name: string,
  value: string,
  key: UiKey,
  checked: boolean,
  onChoose: () => void | Promise<void>,
): HTMLLabelElement {
  const input = el("input", { type: "radio", name, value, checked });
  input.dataset["action"] = `${name}-${value}`;
  input.addEventListener("change", () => {
    act(`${name}-${value}`);
    void onChoose();
  });
  return el("label", { className: "choice" }, input, t(key));
}
