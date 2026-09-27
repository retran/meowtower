// The shell's screens. ADR-0150 adds the game's and the Parent Room's; each
// registers here, so the keyboard test walks it too.
import { pair, storeInterface } from "./api.js";
import { button, choice, el, heading, link, status } from "./controls.js";
import { applyInterface, type Interface } from "./interface.js";
import { t } from "./strings.js";

export interface Shell {
  paired: boolean;
  current: Interface;
  setPaired(paired: boolean): void;
  setInterface(chosen: Interface): void;
}

export interface Screen {
  path: string;
  render(shell: Shell): HTMLElement;
}

const home: Screen = {
  path: "/",
  render(shell) {
    const note = status(t(shell.paired ? "ui.home.ready" : "ui.home.unpaired"));
    const nav = el("nav", { className: "actions" });
    nav.append(
      button("ui.home.play", "play", () => {
        note.textContent = t("ui.home.playSoon");
      }),
      link("ui.nav.settings", "open-settings", "/settings"),
    );
    if (!shell.paired) nav.append(link("ui.nav.pair", "open-pair", "/pair"));
    return el("section", {}, heading("ui.app.name"), note, nav);
  },
};

const settings: Screen = {
  path: "/settings",
  render(shell) {
    const note = status();
    const pick = (kind: Interface) => async () => {
      shell.setInterface(kind);
      applyInterface(kind);
      const stored = shell.paired ? await storeInterface(kind) : true;
      note.textContent = t(stored ? "ui.settings.saved" : "ui.settings.failed");
    };
    const group = el(
      "fieldset",
      {},
      el("legend", {}, t("ui.settings.interface")),
      choice(
        "interface",
        "tablet",
        "ui.settings.tablet",
        shell.current === "tablet",
        pick("tablet"),
      ),
      choice(
        "interface",
        "computer",
        "ui.settings.computer",
        shell.current === "computer",
        pick("computer"),
      ),
    );
    return el(
      "section",
      {},
      heading("ui.settings.title"),
      group,
      note,
      el("nav", { className: "actions" }, link("ui.nav.back", "back", "/")),
    );
  },
};

const pairing: Screen = {
  path: "/pair",
  render(shell) {
    const note = status();
    const code = el("input", {
      id: "pair-code",
      inputMode: "numeric",
      autocomplete: "one-time-code",
      maxLength: 6,
      pattern: "\\d{6}",
    });
    code.dataset["action"] = "pair-code";
    code.addEventListener("input", () => {
      document.body.dataset["lastAction"] = "pair-code";
    });
    const form = el(
      "form",
      {},
      el("label", { htmlFor: "pair-code" }, t("ui.pair.code")),
      code,
      button("ui.pair.submit", "pair-submit", async () => {
        const ok = await pair(code.value.trim(), shell.current);
        if (ok) shell.setPaired(true);
        note.textContent = t(ok ? "ui.pair.done" : "ui.pair.failed");
      }),
    );
    form.addEventListener("submit", (e) => e.preventDefault());
    return el(
      "section",
      {},
      heading("ui.pair.title"),
      form,
      note,
      el("nav", { className: "actions" }, link("ui.nav.back", "back", "/")),
    );
  },
};

export const SCREENS: readonly Screen[] = [home, settings, pairing];
