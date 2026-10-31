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

/** The fraction slash the server writes between a numerator and a denominator (U+2044). */
const FRACTION = /(\d+)\u2044(\d+)/g;

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
