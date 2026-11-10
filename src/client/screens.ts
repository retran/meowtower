// The shell's screens. ADR-0150 adds the game's and the Parent Room's; each
// registers here, so the keyboard test walks it too.
import {
  accountCode,
  accountLogin,
  accountLogout,
  accountMe,
  accountSpend,
  addProfile,
  profilePairCode,
  setBudget,
  type AccountReply,
  newPairingCode,
  pair,
  parentDevices,
  parentLogin,
  parentFalls,
  parentSettings,
  resetStats,
  skills,
  revoke,
  saveParentSettings,
  storeInterface,
  type ParentReply,
  type Tried,
} from "./api.js";
import { flushOnce, refusedAnswers, stuckEntries } from "./answer-queue.js";
import {
  act,
  button,
  choice,
  el,
  enterPresses,
  heading,
  link,
  status,
} from "./controls.js";
import { applyInterface, type Interface } from "./interface.js";
import { playScreen } from "./play.js";
import { clock, t, uiKey, type UiKey } from "./strings.js";

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
    if (shell.paired)
      nav.append(
        button("ui.home.play", "play", () => {
          location.hash = "#/play";
        }),
      );
    if (shell.paired) nav.append(link("ui.nav.sheet", "open-sheet", "/sheet"));
    nav.append(link("ui.nav.settings", "open-settings", "/settings"));
    nav.append(link("ui.nav.account", "open-account", "/account"));
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
    // Answers the device couldn't send for 24 hours, and ones the server
    // refused for good, are listed with their time and a retry (SPC-0030).
    const stuck = el("div", { className: "queue" });
    const showStuck = async (): Promise<void> => {
      const rows: Node[] = [];
      const time = (at: number): HTMLTimeElement => {
        const node = el("time", {}, clock(new Date(at)));
        node.dateTime = new Date(at).toISOString();
        return node;
      };
      for (const entry of await stuckEntries()) {
        const row = el("p", {});
        row.dataset["queueStuck"] = entry.idemKey;
        const [before = "", after = ""] = t("ui.settings.queueStuck", {
          time: "\u0000",
        }).split("\u0000");
        row.append(before, time(entry.queuedAt), after);
        rows.push(row);
      }
      for (const refused of refusedAnswers()) {
        const row = el("p", {});
        row.dataset["queueStuck"] = `refused-${refused.at}`;
        const [before = "", after = ""] = t("ui.settings.queueRefused", {
          time: "\u0000",
          error: refused.error,
        }).split("\u0000");
        row.append(before, time(refused.at), after);
        rows.push(row);
      }
      if (rows.length)
        rows.push(
          button("ui.settings.queueRetry", "queue-retry", async () => {
            await flushOnce();
            await showStuck();
          }),
        );
      stuck.replaceChildren(...rows);
    };
    void showStuck();
    return el(
      "section",
      {},
      heading("ui.settings.title"),
      group,
      note,
      stuck,
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
    const send = button("ui.pair.submit", "pair-submit", async () => {
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
    });
    const form = el(
      "form",
      {},
      el("label", { htmlFor: "pair-code" }, t("ui.pair.code")),
      code,
      send,
    );
    form.addEventListener("submit", enterPresses(send));
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
  done: UiKey,
  locked: Record<string, UiKey>,
  failed: UiKey,
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
  const enter = button("ui.parent.enter", "parent-login", async () => {
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
  });
  const form = el(
    "form",
    {},
    el("label", { htmlFor: "parent-pin" }, t("ui.parent.pin")),
    pin,
    enter,
  );
  form.addEventListener("submit", enterPresses(enter));
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
      // Devices in use come first; a revoked one is only history.
      const inOrder = [...devices].sort(
        (x, y) => Number(x.revoked) - Number(y.revoked),
      );
      inOrder.forEach((d, i) => {
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

const LANGUAGES = ["ru", "en", "nl"] as const;

// Stand-in until the Parent Room's own page exists: the three-day limit alone
// (REQ-0234). A choice saves at once, as the device settings do.
const parentSettingsScreen: Screen = {
  path: "/parent/settings",
  render() {
    const note = status();
    const limits = el("fieldset", {});
    const languages = el("fieldset", {});
    const creepiness = el("fieldset", {});
    const gender = el("fieldset", {});
    const hideFalls = el("fieldset", {});
    const falls = el("ul", { className: "falls" });
    const resetBox = el("fieldset", {});
    const nav = el("nav", { className: "actions" });
    const section = el(
      "section",
      {},
      heading("ui.parentSettings.title"),
      languages,
      creepiness,
      gender,
      hideFalls,
      limits,
      heading("ui.parentFalls.title"),
      falls,
      resetBox,
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
      languages.append(
        el("legend", {}, t("ui.parentSettings.language")),
        ...LANGUAGES.map((code) =>
          choice(
            "language",
            code,
            uiKey(`ui.parentSettings.language.${code}`),
            code === current.language,
            async () => {
              note.textContent = "";
              const saved = await asParent(section, note, () =>
                saveParentSettings({ language: code }),
              );
              // The strings of the page come from the server in the new language.
              if (saved) location.reload();
              else note.textContent = t("ui.devices.failed");
            },
          ),
        ),
      );
      creepiness.append(
        el("legend", {}, t("ui.parentSettings.creepiness")),
        ...([0, 1, 2] as const).map((level) =>
          choice(
            "creepiness",
            String(level),
            uiKey(`ui.parentSettings.creepiness.${String(level)}`),
            level === current.creepiness,
            async () => {
              note.textContent = "";
              const saved = await asParent(section, note, () =>
                saveParentSettings({ creepiness: level }),
              );
              note.textContent = t(
                saved ? "ui.settings.saved" : "ui.devices.failed",
              );
            },
          ),
        ),
      );
      gender.append(
        el("legend", {}, t("ui.parentSettings.gender")),
        ...(["f", "m"] as const).map((value) =>
          choice(
            "gender",
            value,
            uiKey(`ui.parentSettings.gender.${value}`),
            value === current.gender,
            async () => {
              note.textContent = "";
              const saved = await asParent(section, note, () =>
                saveParentSettings({ gender: value }),
              );
              note.textContent = t(
                saved ? "ui.settings.saved" : "ui.devices.failed",
              );
            },
          ),
        ),
      );
      hideFalls.append(
        el("legend", {}, t("ui.parentSettings.hideRankFalls")),
        ...(["no", "yes"] as const).map((value) =>
          choice(
            "hide-rank-falls",
            value,
            uiKey(`ui.parentSettings.hideRankFalls.${value}`),
            (value === "yes") === current.hideRankFalls,
            async () => {
              note.textContent = "";
              const saved = await asParent(section, note, () =>
                saveParentSettings({ hideRankFalls: value === "yes" }),
              );
              note.textContent = t(
                saved ? "ui.settings.saved" : "ui.devices.failed",
              );
            },
          ),
        ),
      );
      const listed = await asParent(section, note, parentFalls);
      if (listed && listed.length === 0)
        falls.append(el("li", {}, t("ui.parentFalls.none")));
      for (const f of listed ?? [])
        falls.append(
          el(
            "li",
            {},
            f.kind === "rank"
              ? t("ui.parentFalls.rank", {
                  from: f.from,
                  to: f.to,
                  day: f.day,
                })
              : t("ui.parentFalls.skill", {
                  skill: t(uiKey(`ui.skills.${f.skill}.name`)),
                  node: f.node,
                  from: f.from,
                  to: f.to,
                  when: f.at.slice(0, 10),
                }),
          ),
        );
      limits.append(
        el("legend", {}, t("ui.parentSettings.threeDay")),
        ...THREE_DAY_LIMITS.map((limit) => {
          const value = limit === null ? "off" : String(limit);
          return choice(
            "three-day",
            value,
            uiKey(`ui.parentSettings.limit.${value}`),
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
      // The first press asks again; the second one resets (REQ-8386).
      const reset = button(
        "ui.parentSettings.reset",
        "reset-stats",
        async () => {
          if (reset.dataset["asked"] !== "1") {
            reset.dataset["asked"] = "1";
            note.textContent = t("ui.parentSettings.resetAsk");
            return;
          }
          reset.dataset["asked"] = "0";
          const done = await asParent(section, note, resetStats);
          note.textContent = t(
            done ? "ui.parentSettings.resetDone" : "ui.devices.failed",
          );
        },
      );
      resetBox.append(
        el("legend", {}, t("ui.parentSettings.resetTitle")),
        reset,
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

/** The text for a refused account request, with the time it may be tried again where there is one. */
function accountError(
  result: Extract<AccountReply<unknown>, { ok: false }>,
): string {
  const key = `ui.account.error.${result.error}`;
  const known = [
    "email_invalid",
    "code_invalid",
    "code_expired",
    "code_locked",
    "code_too_soon",
    "unavailable",
  ].includes(result.error);
  return t(
    (known ? key : "ui.account.error.failed") as UiKey,
    result.retryAt === undefined
      ? {}
      : { time: clock(new Date(result.retryAt)) },
  );
}

/**
 * The parent's account (ADR-3320, REQ-8500, REQ-8502): sign in with the code sent to an email, then
 * the children of the account, a pairing code for each child's device, and what the account spent.
 */
const accountScreen: Screen = {
  path: "/account",
  render() {
    const note = status();
    const body = el("div", {});
    const section = el(
      "section",
      {},
      heading("ui.account.title"),
      body,
      note,
      el("nav", { className: "actions" }, link("ui.nav.back", "back", "/")),
    );
    section.dataset["busy"] = "1";

    const field = (id: string, label: UiKey, action: string, type = "text") => {
      const input = el("input", { id, type, autocomplete: "off" });
      input.dataset["action"] = action;
      input.addEventListener("input", () => act(action));
      return { input, label: el("label", { htmlFor: id }, t(label)) };
    };

    const showSignIn = (): void => {
      const email = field(
        "account-email",
        "ui.account.email",
        "account-email",
        "email",
      );
      const code = field("account-code", "ui.account.code", "account-code");
      (code.input as HTMLInputElement).inputMode = "numeric";
      (code.input as HTMLInputElement).maxLength = 6;
      const send = button("ui.account.sendCode", "account-send", async () => {
        const sent = await accountCode((email.input as HTMLInputElement).value);
        note.textContent = sent.ok
          ? t("ui.account.codeSent")
          : accountError(sent);
      });
      const enter = button("ui.account.signIn", "account-login", async () => {
        const done = await accountLogin(
          (email.input as HTMLInputElement).value,
          (code.input as HTMLInputElement).value.trim(),
        );
        if (done.ok) void showAccount();
        else note.textContent = accountError(done);
      });
      const form = el(
        "form",
        {},
        email.label,
        email.input,
        send,
        code.label,
        code.input,
        enter,
      );
      form.addEventListener("submit", enterPresses(enter));
      body.replaceChildren(form);
    };

    const showAccount = async (): Promise<void> => {
      const me = await accountMe();
      if (!me.ok) {
        if (me.error === "account_session_missing") showSignIn();
        else note.textContent = accountError(me);
        delete section.dataset["busy"];
        return;
      }
      const list = el("ul", { className: "profiles" });
      for (const p of me.value.profiles) {
        const shown = status();
        const pair = button(
          "ui.account.pairCode",
          `pair-code-${p.id}`,
          async () => {
            const issued = await profilePairCode(p.id);
            shown.textContent = issued.ok
              ? t("ui.account.pairCodeShown", { code: issued.value })
              : accountError(issued);
          },
        );
        list.append(el("li", {}, el("strong", {}, p.label), pair, shown));
      }
      const label = field(
        "profile-label",
        "ui.account.addLabel",
        "profile-label",
      );
      const add = button("ui.account.add", "profile-add", async () => {
        const made = await addProfile((label.input as HTMLInputElement).value);
        if (made.ok) {
          note.textContent = t("ui.account.added");
          void showAccount();
        } else note.textContent = accountError(made);
      });
      const budget = field(
        "account-budget",
        "ui.account.budget",
        "account-budget",
        "number",
      );
      (budget.input as HTMLInputElement).min = "1";
      (budget.input as HTMLInputElement).max = "200";
      const spendLine = status();
      const spend = await accountSpend();
      if (spend.ok) {
        spendLine.textContent = t("ui.account.spend", {
          usd: spend.value.usd.toFixed(2),
          limit: String(spend.value.limitUsd),
        });
        (budget.input as HTMLInputElement).value = String(spend.value.limitUsd);
      }
      const save = button("ui.account.budgetSave", "budget-save", async () => {
        const amount = Number((budget.input as HTMLInputElement).value);
        if (!(amount >= 1 && amount <= 200)) {
          note.textContent = t("ui.account.budgetInvalid");
          return;
        }
        const saved = await setBudget(amount);
        note.textContent = saved.ok
          ? t("ui.account.budgetSaved")
          : accountError(saved);
        if (saved.ok) void showAccount();
      });
      const out = button("ui.account.signOut", "account-logout", async () => {
        await accountLogout();
        note.textContent = "";
        showSignIn();
      });
      body.replaceChildren(
        status(t("ui.account.signedIn", { email: me.value.email })),
        el("h2", {}, t("ui.account.profiles")),
        me.value.profiles.length === 0
          ? status(t("ui.account.noProfiles"))
          : list,
        label.label,
        label.input,
        add,
        spendLine,
        budget.label,
        budget.input,
        save,
        out,
      );
      delete section.dataset["busy"];
    };

    void showAccount();
    return section;
  },
};

const sheet: Screen = {
  path: "/sheet",
  render() {
    const section = el("section", {}, heading("ui.sheet.title"));
    const list = el("ul", { className: "skills" });
    section.append(list);
    section.append(link("ui.nav.back", "back", "/"));
    section.dataset["busy"] = "1";
    void skills().then((got) => {
      delete section.dataset["busy"];
      if (!got) {
        list.append(el("li", {}, t("ui.devices.failed")));
        return;
      }
      for (const s of got) {
        const item = el("li", { className: "skill" });
        item.dataset["skill"] = s.skill;
        item.append(el("h2", {}, t(uiKey(`ui.skills.${s.skill}.name`))));
        if (!s.shown) {
          item.append(el("p", {}, t("ui.sheet.notShown")));
        } else {
          item.append(
            el(
              "p",
              { className: "level" },
              `${t("ui.sheet.level")} ${String(s.level)}`,
            ),
          );
          const bar = el("progress", {});
          bar.setAttribute("max", "100");
          bar.setAttribute("value", String(s.percent));
          item.append(bar, el("span", {}, ` ${String(s.percent)} %`));
          const steps = el("ul", { className: "steps" });
          for (let n = 1; n <= s.level; n += 1)
            steps.append(
              el("li", {}, t(uiKey(`ui.skills.${s.skill}.step.${String(n)}`))),
            );
          item.append(steps);
        }
        list.append(item);
      }
    });
    return section;
  },
};

export const SCREENS: readonly Screen[] = [
  home,
  settings,
  sheet,
  pairing,
  parentLoginScreen,
  parentDevicesScreen,
  parentSettingsScreen,
  accountScreen,
  playScreen,
];
