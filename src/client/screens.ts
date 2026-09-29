// The shell's screens. ADR-0150 adds the game's and the Parent Room's; each
// registers here, so the keyboard test walks it too.
import {
  newPairingCode,
  pair,
  parentDevices,
  parentLogin,
  parentSettings,
  revoke,
  saveParentSettings,
  storeInterface,
  type ParentReply,
  type Tried,
} from "./api.js";
import { act, button, choice, el, heading, link, status } from "./controls.js";
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

/** The PIN form; `opened` runs once a PIN entry opens a parent session. */
function pinForm(note: HTMLElement, opened: () => void): HTMLFormElement {
  const pin = el("input", {
    id: "parent-pin",
    type: "password",
    inputMode: "numeric",
    autocomplete: "current-password",
    maxLength: 8,
  });
  pin.dataset["action"] = "parent-pin";
  pin.addEventListener("input", () => act("parent-pin"));
  const form = el(
    "form",
    {},
    el("label", { htmlFor: "parent-pin" }, t("ui.parent.pin")),
    pin,
    button("ui.parent.enter", "parent-login", async () => {
      const result = await parentLogin(pin.value.trim());
      if (result.ok) {
        opened();
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
  return form;
}

/**
 * Runs a Parent Room request. When the parent session has expired, the PIN
 * form opens in place above the page's note, so the page and the choice made
 * on it stay, and a PIN entry runs the request again (REQ-2440). Resolves to
 * null when the request is refused for another reason.
 */
async function asParent<T>(
  section: HTMLElement,
  note: HTMLElement,
  request: () => Promise<ParentReply<T>>,
): Promise<T | null> {
  const reply = await request();
  if (reply.ok) return reply.value;
  if (reply.error !== "parent_session_expired") return null;
  await new Promise<void>((opened) => {
    const form = pinForm(note, () => {
      form.remove();
      note.textContent = "";
      opened();
    });
    note.textContent = t("ui.parent.expired");
    note.before(form);
    delete section.dataset["busy"];
  });
  return asParent(section, note, request);
}

/** The links a Parent Room page shows when no parent session is open. */
function loginNeeded(note: HTMLElement, nav: HTMLElement): void {
  note.textContent = t("ui.devices.loginNeeded");
  nav.append(
    link("ui.nav.parent", "open-parent", "/parent"),
    link("ui.nav.back", "back", "/"),
  );
}

const parentLoginScreen: Screen = {
  path: "/parent",
  render() {
    const note = status();
    const form = pinForm(note, () => {
      location.hash = "#/parent/devices";
    });
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
      const devices = await asParent(section, note, parentDevices);
      list.replaceChildren();
      nav.replaceChildren();
      if (!devices) {
        loginNeeded(note, nav);
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
        link(
          "ui.parentSettings.title",
          "open-parent-settings",
          "/parent/settings",
        ),
        link("ui.nav.back", "back", "/"),
      );
      delete section.dataset["busy"];
    };
    void fill();
    return section;
  },
};

/** The three-day limits, in adventure days, as the server accepts them; null is off. */
const THREE_DAY_LIMITS = [null, 1, 2, 3, 4, 5, 6, 7];

// Stand-in until the Parent Room's own page exists: the three-day limit alone
// (REQ-0234). A choice saves at once, as the device settings do.
const parentSettingsScreen: Screen = {
  path: "/parent/settings",
  render() {
    const note = status();
    const limits = el("fieldset", {});
    const nav = el("nav", { className: "actions" });
    const section = el(
      "section",
      {},
      heading("ui.parentSettings.title"),
      limits,
      note,
      nav,
    );
    section.dataset["busy"] = "1";
    const fill = async (): Promise<void> => {
      const current = await asParent(section, note, parentSettings);
      if (!current) {
        loginNeeded(note, nav);
        delete section.dataset["busy"];
        return;
      }
      limits.append(
        el("legend", {}, t("ui.parentSettings.threeDay")),
        ...THREE_DAY_LIMITS.map((limit) => {
          const value = limit === null ? "off" : String(limit);
          return choice(
            "three-day",
            value,
            `ui.parentSettings.limit.${value}`,
            limit === current.threeDayLimit,
            async () => {
              note.textContent = "";
              const saved = await asParent(section, note, () =>
                saveParentSettings({ threeDayLimit: limit }),
              );
              note.textContent = t(
                saved ? "ui.parentSettings.saved" : "ui.devices.failed",
              );
            },
          );
        }),
      );
      nav.append(
        link("ui.devices.title", "open-parent-devices", "/parent/devices"),
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
  parentSettingsScreen,
];
