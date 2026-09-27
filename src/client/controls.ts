// Controls every screen builds from, so each one is keyboard-operable and
// reports its action: the keyboard test reads `data-last-action` to prove a
// key press operated the control it focused.
import { t } from "./strings.js";

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

export function heading(key: string): HTMLHeadingElement {
  return el("h1", { id: "screen-title" }, t(key));
}

export function status(text = ""): HTMLParagraphElement {
  const p = el("p", { className: "status" }, text);
  p.setAttribute("role", "status");
  return p;
}

export function button(
  key: string,
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
  key: string,
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
  key: string,
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
