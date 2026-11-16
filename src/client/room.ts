// The Parent Room's frame (ADR-3470): a left-hand menu of the parent's jobs, a header row with the
// screen's title, and the screen in Tabler's widgets. The room is the parent's admin and not the
// game, so it wears Tabler's look and the game's own sheet is switched off while it shows.
import { parentSettings, saveParentSettings } from "./api.js";
import { act, el } from "./controls.js";
import { ICONS, type IconName } from "./room-icons.js";
import { t, type UiKey } from "./strings.js";

interface RoomItem {
  readonly path: string;
  readonly key: UiKey;
  readonly icon: IconName;
  /** The action the menu's link reports; the links the screens ended with used the same names. */
  readonly action: string;
  readonly group?: UiKey;
}

/** The menu, in the order a visit follows (REQ-7674). */
const MENU: readonly RoomItem[] = [
  {
    path: "/parent/home",
    key: "ui.room.overview",
    icon: "layout-dashboard",
    action: "open-overview",
  },
  {
    path: "/studio",
    key: "ui.room.story",
    icon: "binary-tree",
    action: "open-studio",
    group: "ui.room.group.game",
  },
  {
    path: "/studio/checklist",
    key: "ui.room.testing",
    icon: "checklist",
    action: "open-checklist",
  },
  {
    path: "/studio/tasks",
    key: "ui.room.tasks",
    icon: "math-function",
    action: "open-task-lab",
    group: "ui.room.group.lab",
  },
  {
    path: "/studio/prompts",
    key: "ui.room.prompts",
    icon: "message-chatbot",
    action: "open-prompt-lab",
  },
  {
    path: "/studio/screens",
    key: "ui.room.screens",
    icon: "device-desktop",
    action: "open-screen-lab",
  },
  {
    path: "/parent/logs",
    key: "ui.room.logs",
    icon: "history",
    action: "open-logs",
  },
  {
    path: "/parent/devices",
    key: "ui.room.devices",
    icon: "device-tablet",
    action: "open-parent-devices",
    group: "ui.room.group.family",
  },
  {
    path: "/parent/settings",
    key: "ui.room.settings",
    icon: "settings",
    action: "open-parent-settings",
  },
  {
    path: "/account",
    key: "ui.room.account",
    icon: "user-circle",
    action: "open-account",
  },
];

/** Whether a route is one of the room's screens behind the PIN, which show inside the frame. */
export const inRoom = (path: string): boolean =>
  MENU.some((item) => item.path === path);

function icon(name: IconName): HTMLSpanElement {
  const span = el("span", { className: "nav-link-icon" });
  span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  return span;
}

function menuLink(
  item: { path: string; key: UiKey; icon: IconName; action: string },
  current: boolean,
): HTMLLIElement {
  const a = el(
    "a",
    { className: `nav-link${current ? " active" : ""}`, href: `#${item.path}` },
    icon(item.icon),
    el("span", { className: "nav-link-title" }, t(item.key)),
  );
  a.dataset["action"] = item.action;
  a.addEventListener("click", () => act(item.action));
  if (current) a.setAttribute("aria-current", "page");
  return el("li", { className: `nav-item${current ? " active" : ""}` }, a);
}

function menu(path: string): HTMLElement {
  const list = el("ul", { className: "navbar-nav pt-md-2" });
  for (const item of MENU) {
    if (item.group)
      list.append(
        el(
          "li",
          { className: "nav-item room-group" },
          el("span", {}, t(item.group)),
        ),
      );
    list.append(menuLink(item, item.path === path));
  }
  const exit = el(
    "ul",
    { className: "navbar-nav room-exit" },
    el("li", { className: "nav-item" }, themeToggle()),
    menuLink(
      { path: "/", key: "ui.room.exit", icon: "logout", action: "back" },
      false,
    ),
  );
  const nav = el("nav", { className: "navbar-collapse room-menu" }, list, exit);
  nav.setAttribute("aria-label", t("ui.room.menu"));
  return el(
    "aside",
    { className: "navbar navbar-vertical navbar-expand-md" },
    el(
      "div",
      { className: "container-fluid" },
      el("div", { className: "navbar-brand room-brand" }, t("ui.room.title")),
      nav,
    ),
  );
}

/** Actions whose button is the screen's main one. */
const PRIMARY = new Set([
  "parent-login",
  "new-code",
  "profile-save",
  "account-login",
  "budget-save",
  "studio-add",
  "studio-approve",
  "studio-play",
  "studio-play-here",
  "turn-take",
  "lever-set",
  "force-set",
  "finish-today",
]);

/** Actions that take something away, drawn in the danger colour. */
const DANGER = /^(revoke-\d+|reset-stats|studio-archive|account-logout)$/;

/**
 * Dresses the plain controls the screens build in Tabler's classes, so a screen's code serves the
 * room as it is. It runs on the screen and on everything the screen adds later.
 */
function dress(root: ParentNode): void {
  for (const b of root.querySelectorAll<HTMLElement>(
    "button.control:not(.btn), a.control:not(.btn)",
  )) {
    const action = b.dataset["action"] ?? "";
    b.classList.add(
      "btn",
      PRIMARY.has(action)
        ? "btn-primary"
        : DANGER.test(action)
          ? "btn-outline-danger"
          : "btn-outline-secondary",
    );
  }
  for (const i of root.querySelectorAll<HTMLElement>(
    'input:not([type="radio"]):not([type="checkbox"]):not(.form-control), textarea:not(.form-control)',
  ))
    i.classList.add("form-control");
  for (const s of root.querySelectorAll<HTMLElement>(
    "select:not(.form-select)",
  ))
    s.classList.add("form-select");
  for (const l of root.querySelectorAll<HTMLElement>(
    "label:not(.choice):not(.form-label):not(.form-selectgroup-item)",
  ))
    l.classList.add("form-label");
  for (const l of root.querySelectorAll<HTMLElement>("legend:not(.form-label)"))
    l.classList.add("form-label");
  // A fieldset of radio choices becomes a segmented control (REQ-7688).
  for (const f of root.querySelectorAll<HTMLFieldSetElement>("fieldset")) {
    const choices = [
      ...f.querySelectorAll<HTMLLabelElement>(":scope > label.choice"),
    ];
    if (choices.length === 0) continue;
    // Radio choices join into one segmented row; boxes that each switch on stay apart as pills.
    const pills = choices.some((c) =>
      c.querySelector('input[type="checkbox"]'),
    );
    const group = el("div", {
      className: pills ? "form-selectgroup room-pills" : "form-selectgroup",
    });
    for (const c of choices) {
      c.classList.replace("choice", "form-selectgroup-item");
      c.querySelector("input")?.classList.add("form-selectgroup-input");
      const text = [...c.childNodes].filter(
        (n) => n.nodeType === Node.TEXT_NODE,
      );
      const label = el("span", { className: "form-selectgroup-label" });
      label.append(...text);
      c.append(label);
      group.append(c);
    }
    // A legend stays outside a fieldset's layout, so its text moves into a row with the choices.
    const legend = f.querySelector(":scope > legend");
    const name = legend?.textContent ?? "";
    if (legend) {
      f.setAttribute("aria-label", name);
      legend.remove();
    }
    f.classList.add("room-field");
    f.append(
      el(
        "div",
        { className: "room-field-row" },
        el("div", { className: "room-field-name" }, name),
        group,
      ),
    );
  }
  for (const s of root.querySelectorAll<HTMLElement>(".tag:not(.badge)"))
    s.classList.add("badge", "bg-secondary-lt");
  for (const s of root.querySelectorAll<HTMLElement>(
    ".status:not(.room-status)",
  ))
    s.classList.add("room-status", "text-secondary");
}

/** A card with an optional title, the room's block for a group of things. */
export function card(
  title: string | null,
  ...children: (Node | string)[]
): HTMLDivElement {
  const body = el("div", { className: "card-body" }, ...children);
  return title
    ? el(
        "div",
        { className: "card" },
        el(
          "div",
          { className: "card-header" },
          el("h3", { className: "card-title" }, title),
        ),
        body,
      )
    : el("div", { className: "card" }, body);
}

let watcher: MutationObserver | null = null;

/**
 * The screen inside the frame: the screen's first heading moves into the header row, the screen's
 * own action row moves beside it, and content that isn't laid out in cards yet sits in one.
 */
export function roomFrame(path: string, screen: HTMLElement): HTMLElement {
  const title = screen.querySelector<HTMLElement>(":scope > h1");
  title?.classList.add("page-title");
  const actions = el("div", { className: "btn-list" });
  const head = el(
    "div",
    { className: "page-header d-print-none" },
    el(
      "div",
      { className: "container-xl" },
      el(
        "div",
        { className: "row g-2 align-items-center" },
        el("div", { className: "col" }, ...(title ? [title] : [])),
        el("div", { className: "col-auto ms-auto" }, actions),
      ),
    ),
  );
  for (const a of screen.querySelectorAll<HTMLElement>(
    ":scope > .room-actions",
  ))
    actions.append(a);
  screen.classList.add("room-screen");
  if (
    !screen.querySelector(":scope > .card, :scope > .row, :scope > .room-bare")
  ) {
    const inner = el("div", { className: "card-body room-screen" });
    inner.append(...screen.childNodes);
    screen.replaceChildren(el("div", { className: "card" }, inner));
  }
  const page = el(
    "div",
    { className: "page room" },
    menu(path),
    el(
      "div",
      { className: "page-wrapper" },
      head,
      el(
        "div",
        { className: "page-body" },
        el("div", { className: "container-xl" }, screen),
      ),
    ),
  );
  // A screen's busy mark stays on the screen, where the tests and the keyboard look for it.
  dress(page);
  watcher?.disconnect();
  watcher = new MutationObserver((records) => {
    for (const r of records)
      // The parent of the changed node, so a fieldset that just got its choices is dressed whole.
      if (r.addedNodes.length > 0 && r.target instanceof HTMLElement)
        dress(r.target.parentElement ?? r.target);
  });
  watcher.observe(page, { childList: true, subtree: true });
  return page;
}

type Theme = "auto" | "light" | "dark";

/** The parent's choice once the server has answered; `auto` follows the device (REQ-7692). */
let chosen: Theme = "auto";
let known = false;
const deviceDark = matchMedia("(prefers-color-scheme: dark)");
const resolved = (): "light" | "dark" =>
  chosen === "auto" ? (deviceDark.matches ? "dark" : "light") : chosen;
let toggle: HTMLButtonElement | null = null;

/** Tabler's theme attribute on the root while the room shows, and none in the game. */
function paint(): void {
  const on = document.body.classList.contains("room-body");
  if (on) document.documentElement.dataset["bsTheme"] = resolved();
  else delete document.documentElement.dataset["bsTheme"];
  if (toggle) drawToggle(toggle);
}
deviceDark.addEventListener("change", paint);

/** Sets the room's theme for this page; the caller saves it on the server. */
export function setRoomTheme(theme: Theme): void {
  chosen = theme;
  known = true;
  paint();
}

/** The menu's switch to the other theme: a moon in the light one, a sun in the dark one. */
function drawToggle(b: HTMLButtonElement): void {
  const dark = resolved() === "dark";
  b.replaceChildren(
    icon(dark ? "sun" : "moon"),
    el(
      "span",
      { className: "nav-link-title" },
      t(dark ? "ui.room.toLight" : "ui.room.toDark"),
    ),
  );
}

function themeToggle(): HTMLButtonElement {
  const b = el("button", { type: "button", className: "nav-link room-theme" });
  b.dataset["action"] = "room-theme";
  b.addEventListener("click", () => {
    act("room-theme");
    const next = resolved() === "dark" ? "light" : "dark";
    setRoomTheme(next);
    void saveParentSettings({ roomTheme: next });
  });
  drawToggle(b);
  toggle = b;
  return b;
}

let tabler: HTMLLinkElement | null = null;

/**
 * Switches the page between the game's look and the room's: Tabler's sheet on and the game's off
 * in the room, and the other way round in the game.
 */
export function useRoomLook(on: boolean, game: HTMLStyleElement): void {
  if (on && !tabler) {
    tabler = el("link", { rel: "stylesheet", href: "/vendor/tabler.min.css" });
    document.head.append(tabler);
  }
  if (tabler) tabler.disabled = !on;
  game.disabled = on;
  room.disabled = !on;
  document.body.classList.toggle("room-body", on);
  if (!on) {
    watcher?.disconnect();
    watcher = null;
    toggle = null;
  }
  paint();
  // The parent's choice comes once a parent session can read it; until then the device's holds.
  if (on && !known)
    void parentSettings().then((got) => {
      if (got.ok && !known) setRoomTheme(got.value.roomTheme);
    });
}

/** What the room adds to Tabler: the menu's groups, the narrow bar and the studio's editor. */
const room = el("style", {});
room.textContent = `
.room-body { background: var(--tblr-bg-surface-secondary); }
.room-body main { max-width: none; margin: 0; padding: 0; font-size: 15px; }
.room .navbar-vertical { width: 15rem; }
.room-brand { font-weight: 700; font-size: 1.05rem; padding: 0.75rem 0; }
.room-group { padding: 1rem 0.75rem 0.25rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--tblr-secondary); }
.room-menu { flex-direction: column; align-items: stretch; }
.room-exit { margin-top: auto; padding-bottom: 1rem; }
.room .room-theme { background: none; border: 0; width: 100%; text-align: left; }
.room .nav-link.active { background: var(--tblr-primary-lt); color: var(--tblr-primary); font-weight: 600; border-radius: var(--tblr-border-radius); }
.room-screen { display: flex; flex-direction: column; gap: 1rem; }
.room-screen > h1:first-child { display: none; }
.room-field { border: 0; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.25rem; }
.room-status:empty { display: none; }
/* Tabler draws its own .status as a pill; the screens' status line is plain text. */
.room .status { display: block; height: auto; padding: 0; margin: 0; border-radius: 0; background: none; font-size: inherit; font-weight: inherit; line-height: inherit; color: var(--tblr-secondary); text-transform: none; letter-spacing: normal; }
.room .card-body { display: flex; flex-direction: column; gap: 0.75rem; }
.room .card-body > .btn, .room .card-body > .room-actions, .room form > .btn { align-self: flex-start; }
.room .card-body h2, .room .card-body h3 { font-size: 1rem; font-weight: 600; margin: 0.5rem 0 0; }
.room .card-body h2:first-child, .room .card-body h3:first-child { margin-top: 0; }
.room .card-body section { display: flex; flex-direction: column; gap: 0.5rem; padding: 0; border: 0; background: none; }
/* A setting is a row: its name on the left and its control on the right (REQ-7688). */
.room .room-field { margin: 0; padding: 0.75rem 0; border: 0; border-bottom: 1px solid var(--tblr-border-color); min-width: 0; }
.room .room-field-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem 1.5rem; text-align: left; }
.room .room-field:last-child { border-bottom: 0; }
.room .room-field-name { font-weight: 500; }
/* A segmented control: the choices joined in one row, the chosen one filled. */
.room .form-selectgroup { display: inline-flex; flex-wrap: nowrap; margin: 0; max-width: 100%; overflow-x: auto; }
.room .form-selectgroup-item { margin: 0; position: relative; }
/* The input lies over its label, so a press on the label is a press on the input itself. */
.room .form-selectgroup-input { z-index: 2; inset: 0; width: 100%; height: 100%; margin: 0; cursor: pointer; }
.room .room-pills { flex-wrap: wrap; gap: 0.5rem; overflow: visible; }
.room .room-pills .form-selectgroup-label { border-radius: var(--tblr-border-radius) !important; margin-left: 0 !important; }
.room .form-selectgroup-label { border-radius: 0; margin-left: -1px; white-space: nowrap; }
.room .form-selectgroup-item:first-child .form-selectgroup-label { border-radius: var(--tblr-border-radius) 0 0 var(--tblr-border-radius); margin-left: 0; }
.room .form-selectgroup-item:last-child .form-selectgroup-label { border-radius: 0 var(--tblr-border-radius) var(--tblr-border-radius) 0; }
.room .form-selectgroup-input:checked + .form-selectgroup-label { background: var(--tblr-primary); color: var(--tblr-primary-fg, #fff); border-color: var(--tblr-primary); position: relative; z-index: 1; }
.room form { display: flex; flex-direction: column; gap: 0.5rem; max-width: 32rem; }
.room .devices { list-style: none; padding: 0; margin: 0; }
.room .devices li { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid var(--tblr-border-color); }
.room .devices li > span:first-child { flex: 1; }
.room .table-scroll { max-height: 70vh; overflow: auto; }
.room .table-scroll thead th { position: sticky; top: 0; background: var(--tblr-bg-surface); z-index: 1; }
.room pre { white-space: pre-wrap; overflow-wrap: anywhere; max-width: 80ch; font-size: 0.8rem; }
.room .kpi .h1 { margin: 0; }
.room .kpi .card-body { gap: 0; }
.room .editor { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 1rem; align-items: start; }
.room .canvas { overflow: auto; min-height: 420px; background-image: radial-gradient(var(--tblr-border-color) 1px, transparent 1px); background-size: 16px 16px; }
.room .graph .node { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2px; text-align: left; white-space: normal; background: var(--tblr-bg-surface); }
.room .graph .node[aria-pressed="true"] { color: var(--tblr-body-color); background: var(--tblr-primary-lt); border-color: var(--tblr-primary); box-shadow: 0 0 0 2px var(--tblr-primary-lt); }
.room .graph .node small { color: var(--tblr-secondary); }
.room .inspector-panel .card-body { display: flex; flex-direction: column; gap: 0.75rem; }
.room .studio-toolbar { flex-direction: row; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; }
.room .studio-add { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.room .studio-add .form-label { margin: 0; }
.room .studio-add .form-control { width: 16rem; }
.room .crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; }
@media (max-width: 1099.98px) { .room .editor { grid-template-columns: minmax(0, 1fr); } }
/* On the tablet every control keeps the game's touch size (REQ-8624). */
[data-interface="tablet"] .room .btn, [data-interface="tablet"] .room .form-control, [data-interface="tablet"] .room .form-select, [data-interface="tablet"] .room .form-selectgroup-label { min-height: 56px; display: inline-flex; align-items: center; }
[data-interface="tablet"] .room textarea.form-control { display: block; }
/* Under 768 px the menu is a bar of sections above the screen that scrolls sideways (REQ-7688). */
@media (max-width: 767.98px) {
  .room .navbar-vertical { width: auto; }
  .room .navbar-vertical .navbar-collapse { display: flex !important; flex-direction: row; overflow-x: auto; }
  .room .navbar-vertical .navbar-nav { flex-direction: row; flex-wrap: nowrap; }
  .room .room-group { display: none; }
  .room .room-exit { margin: 0; padding: 0; }
  .room .nav-link { white-space: nowrap; }
}
`;
document.head.append(room);
room.disabled = true;

/** The PIN entry, alone in the middle of the page and without the menu (REQ-7676). */
export function roomDoor(screen: HTMLElement): HTMLElement {
  screen.classList.add("card-body", "room-screen");
  const door = el(
    "div",
    { className: "page page-center room" },
    el(
      "div",
      { className: "container container-tight py-4" },
      el(
        "div",
        { className: "text-center mb-4 room-brand" },
        t("ui.room.title"),
      ),
      el("div", { className: "card card-md" }, screen),
    ),
  );
  dress(door);
  return door;
}
