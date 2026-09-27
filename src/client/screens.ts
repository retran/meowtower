// The shell's screens. ADR-0150 adds the game's and the Parent Room's; each
// registers here, so the keyboard test walks it too.
import {
  newPairingCode,
  pair,
  parentDevices,
  parentLogin,
  revoke,
  storeInterface,
  type Tried,
} from "./api.js";
import { button, choice, el, heading, link, status } from "./controls.js";
import { applyInterface, type Interface } from "./interface.js";
import { clock, t } from "./strings.js";

export interface Shell {
  paired: boolean;
  /** The parent revoked this device; it needs pairing from the Parent Room. */
  revoked: boolean;
  current: Interface;
  setPaired(paired: boolean): void;
  setRevoked(revoked: boolean): void;
  setInterface(chosen: Interface): void;
}

export interface Screen {
  path: string;
  render(shell: Shell): HTMLElement;
}

const home: Screen = {
  path: "/",
  render(shell) {
    const note = status(
      t(
        shell.revoked
          ? "ui.home.revoked"
          : shell.paired
            ? "ui.home.ready"
            : "ui.home.unpaired",
      ),
    );
    const nav = el("nav", { className: "actions" });
    nav.append(
      button("ui.home.play", "play", () => {
        note.textContent = t("ui.home.playSoon");
      }),
      link("ui.nav.settings", "open-settings", "/settings"),
    );
    if (shell.paired)
      nav.append(link("ui.nav.parent", "open-parent", "/parent"));
    else nav.append(link("ui.nav.pair", "open-pair", "/pair"));
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
        const result = await pair(code.value.trim(), shell.current);
        if (result.ok) shell.setPaired(true);
        note.textContent = refusal(
          result,
          "ui.pair.done",
          {
            pairing_locked: "ui.pair.locked",
          },
          "ui.pair.failed",
        );
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

/** The line for an attempt's result; a lockout names when attempts resume. */
function refusal(
  result: Tried,
  done: string,
  locked: Record<string, string>,
  failed: string,
): string {
  if (result.ok) return t(done);
  const key = locked[result.error];
  if (key && result.retryAt) return t(key, { time: clock(result.retryAt) });
  return t(failed);
}

const parentLoginScreen: Screen = {
  path: "/parent",
  render() {
    const note = status();
    const pin = el("input", {
      id: "parent-pin",
      type: "password",
      inputMode: "numeric",
      autocomplete: "current-password",
      maxLength: 8,
    });
    pin.dataset["action"] = "parent-pin";
    pin.addEventListener("input", () => {
      document.body.dataset["lastAction"] = "parent-pin";
    });
    const form = el(
      "form",
      {},
      el("label", { htmlFor: "parent-pin" }, t("ui.parent.pin")),
      pin,
      button("ui.parent.enter", "parent-login", async () => {
        const result = await parentLogin(pin.value.trim());
        if (result.ok) {
          location.hash = "#/parent/devices";
          return;
        }
        note.textContent =
          result.error === "pin_not_set"
            ? t("ui.parent.noPin")
            : refusal(
                result,
                "ui.parent.enter",
                {
                  pin_locked: "ui.parent.locked",
                },
                "ui.parent.wrong",
              );
      }),
    );
    form.addEventListener("submit", (e) => e.preventDefault());
    return el(
      "section",
      {},
      heading("ui.parent.title"),
      form,
      note,
      el("nav", { className: "actions" }, link("ui.nav.back", "back", "/")),
    );
  },
};

const parentDevicesScreen: Screen = {
  path: "/parent/devices",
  render(shell) {
    const note = status();
    const list = el("ul", { className: "devices" });
    const code = el("p", { className: "code" });
    const nav = el("nav", { className: "actions" });
    const section = el(
      "section",
      {},
      heading("ui.devices.title"),
      list,
      code,
      note,
      nav,
    );
    // The page fills once the list arrives; the keyboard test waits for it.
    section.dataset["busy"] = "1";
    const fill = async (): Promise<void> => {
      const devices = await parentDevices();
      list.replaceChildren();
      nav.replaceChildren();
      if (!devices) {
        note.textContent = t("ui.devices.loginNeeded");
        nav.append(
          link("ui.nav.parent", "open-parent", "/parent"),
          link("ui.nav.back", "back", "/"),
        );
        delete section.dataset["busy"];
        return;
      }
      devices.forEach((d, i) => {
        const label = t(
          d.kind === "tablet" ? "ui.devices.tablet" : "ui.devices.computer",
          {
            date: new Date(d.createdAt).toLocaleDateString(
              document.documentElement.lang || "ru",
            ),
          },
        );
        const row = el("li", {}, el("span", {}, label));
        if (d.current)
          row.append(el("span", { className: "tag" }, t("ui.devices.current")));
        if (d.revoked) {
          row.append(el("span", { className: "tag" }, t("ui.devices.revoked")));
        } else {
          // Revoking asks twice, because the device loses its access at once.
          let armed = false;
          const b = button("ui.devices.revoke", `revoke-${i}`, async () => {
            if (!armed) {
              armed = true;
              b.textContent = t("ui.devices.revokeSure");
              return;
            }
            const done = await revoke(d.id);
            if (done && d.current) {
              shell.setRevoked(true);
              location.hash = "#/";
              return;
            }
            note.textContent = t(
              done ? "ui.devices.revokedNow" : "ui.devices.failed",
            );
            void fill();
          });
          row.append(b);
        }
        list.append(row);
      });
      nav.append(
        button("ui.devices.newCode", "new-code", async () => {
          const issued = await newPairingCode();
          code.textContent = issued
            ? t("ui.devices.code", {
                code: issued.code,
                time: clock(issued.expiresAt),
              })
            : t("ui.devices.failed");
        }),
        link("ui.nav.back", "back", "/"),
      );
      delete section.dataset["busy"];
    };
    void fill();
    return section;
  },
};

export const SCREENS: readonly Screen[] = [
  home,
  settings,
  pairing,
  parentLoginScreen,
  parentDevicesScreen,
];
