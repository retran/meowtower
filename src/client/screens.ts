// The shell's screens. ADR-0150 adds the game's and the Parent Room's; each
// registers here, so the keyboard test walks it too.
import {
  studioTask,
  studioTemplates,
  type OpenedTask,
  type TemplateRow,
  studioChecklist,
  studioCreate,
  studioEncounters,
  studioForce,
  studioLever,
  studioPlayStart,
  studioLog,
  studioLogs,
  studioNodes,
  studioReached,
  studioStatus,
  type StudioNode,
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
import { layoutGraph, DEFAULT_SIZE } from "./graph-layout.js";
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
        link("ui.nav.studio", "open-studio", "/studio"),
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

/** The level a node of `level` holds inside it, or null for an encounter. */
/**
 * The play surface of the sandbox (ADR-3280, REQ-8286): one button for each encounter of the adventure,
 * a draft included, and a frame with the game itself, opened on the sandbox, at that encounter.
 */
function playPanel(node: StudioNode, note: HTMLElement): HTMLElement {
  const box = el("div", { className: "sandbox-play" });
  const stage = el("div", { className: "screen-stage" });
  const open = button("ui.studio.play", "studio-play", async () => {
    const listed = await studioEncounters(node.id);
    if (!listed.ok) {
      note.textContent = t("ui.studio.refused", { reason: listed.error });
      return;
    }
    if (listed.value.length === 0) {
      note.textContent = t("ui.studio.playNone");
      return;
    }
    const choices = listed.value.map((e) => {
      const b = button("ui.studio.playFrom", "studio-play-from", async () => {
        const started = await studioPlayStart(node.id, e.id);
        if (!started.ok) {
          note.textContent = t("ui.studio.refused", { reason: started.error });
          return;
        }
        let frame = stage.querySelector("iframe");
        if (!frame) {
          frame = el("iframe", {
            className: "screen-frame",
            title: t("ui.studio.playFrame"),
          });
          frame.dataset["action"] = "studio-play-frame";
          frame.style.width = "100%";
          frame.style.height = "480px";
          stage.append(frame);
        }
        frame.setAttribute(
          "src",
          `/?sandbox=1&lang=${document.documentElement.lang || "ru"}#/play`,
        );
      });
      b.textContent = t("ui.studio.playFrom", { title: e.title });
      return b;
    });
    box.replaceChildren(open, ...choices, stage);
  });
  box.append(open, stage);
  return box;
}

/** What each state lever asks for: a field is a number or a text, and the server checks the value. */
const LEVERS: Readonly<
  Record<string, readonly { name: string; number?: boolean }[]>
> = {
  language: [{ name: "value" }],
  gender: [{ name: "value" }],
  creepiness: [{ name: "value", number: true }],
  friendship: [
    { name: "familiarId" },
    { name: "points", number: true },
    { name: "level", number: true },
  ],
  item: [
    { name: "rewardId" },
    { name: "rewardKind" },
    { name: "amount", number: true },
  ],
  nodeLevel: [{ name: "node" }, { name: "level", number: true }],
  rank: [{ name: "rank" }],
};

/**
 * The state levers of the sandbox (ADR-3280, REQ-8288): pick a state, fill what it asks for and set
 * it. The sandbox takes it and her game never does.
 */
function leverPanel(note: HTMLElement): HTMLElement {
  const kind = el("select", { id: "lever-kind" });
  kind.dataset["action"] = "lever-kind";
  for (const k of Object.keys(LEVERS))
    kind.append(
      el("option", { value: k }, t(`ui.studio.lever.kind.${k}` as UiKey)),
    );
  const fields = el("span", { className: "lever-fields" });
  const inputs = new Map<string, HTMLInputElement>();
  const draw = (): void => {
    inputs.clear();
    fields.replaceChildren();
    for (const f of LEVERS[kind.value] ?? []) {
      const input = el("input", {
        id: `lever-${f.name}`,
        type: f.number ? "number" : "text",
      });
      input.dataset["action"] = `lever-${f.name}`;
      input.addEventListener("input", () => act(`lever-${f.name}`));
      inputs.set(f.name, input);
      fields.append(
        el(
          "label",
          { htmlFor: `lever-${f.name}` },
          t(`ui.studio.lever.field.${f.name}` as UiKey),
        ),
        input,
      );
    }
  };
  kind.addEventListener("change", () => {
    act("lever-kind");
    draw();
  });
  // Enter confirms a choice from the keyboard, as it does on a button.
  kind.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    act("lever-kind");
    draw();
  });
  draw();
  const set = button("ui.studio.lever.set", "lever-set", async () => {
    const lever: Record<string, unknown> = { kind: kind.value };
    for (const f of LEVERS[kind.value] ?? []) {
      const raw = inputs.get(f.name)?.value ?? "";
      lever[f.name] = f.number ? Number(raw) : raw;
    }
    const done = await studioLever(lever);
    note.textContent = done.ok
      ? t("ui.studio.lever.done")
      : t("ui.studio.refused", { reason: done.error });
  });
  return el(
    "section",
    { className: "levers" },
    el("h2", {}, t("ui.studio.lever.title")),
    el("label", { htmlFor: "lever-kind" }, t("ui.studio.lever.kind")),
    kind,
    fields,
    set,
  );
}

/** What the parent can force on the next check; each is a key, so the screen shows no stray text. */
const FORCES = ["clean", "partial", "alt", "fall", "rise"] as const;

/**
 * The force of the sandbox (ADR-3280, REQ-8290): choose what the next check gives, an outcome, a fall
 * or a rise, and force it once. An open gate waits for the gates of the world, which are not built.
 */
function forcePanel(note: HTMLElement): HTMLElement {
  const next = el("select", { id: "force-next" });
  next.dataset["action"] = "force-next";
  for (const f of FORCES)
    next.append(el("option", { value: f }, t(`ui.studio.force.${f}` as UiKey)));
  next.addEventListener("change", () => act("force-next"));
  // Enter confirms a choice from the keyboard, as it does on a button.
  next.addEventListener("keydown", (e) => {
    if (e.key === "Enter") act("force-next");
  });
  const set = button("ui.studio.force.set", "force-set", async () => {
    const done = await studioForce(next.value);
    note.textContent = done.ok
      ? t("ui.studio.lever.done")
      : t("ui.studio.refused", { reason: done.error });
  });
  return el(
    "section",
    { className: "force" },
    el("h2", {}, t("ui.studio.force.title")),
    el("label", { htmlFor: "force-next" }, t("ui.studio.force.next")),
    next,
    set,
  );
}

const INNER: Readonly<Record<StudioNode["level"], StudioNode["level"] | null>> =
  {
    campaign: "arc",
    arc: "adventure",
    adventure: "encounter",
    encounter: null,
  };

/**
 * The studio (ADR-3280, REQ-8258): the graph of one level, a breadcrumb up to the campaigns, a
 * panel for the selected node, and the logs of the adventures that were played. Opening a node
 * opens the graph inside it.
 */
const studioScreen: Screen = {
  path: "/studio",
  render() {
    const note = status();
    const crumbs = el("nav", { className: "crumbs" });
    const graph = el("div", { className: "graph" });
    graph.setAttribute("aria-label", t("ui.studio.graph"));
    const panel = el("div", { className: "panel" });
    const logs = el("div", { className: "logs" });
    const nav = el("nav", { className: "actions" });
    const section = el(
      "section",
      {},
      heading("ui.studio.title"),
      crumbs,
      graph,
      panel,
      note,
      leverPanel(note),
      forcePanel(note),
      logs,
      nav,
    );
    section.dataset["busy"] = "1";
    /** The nodes opened so far, from the first campaign to the one whose graph shows. */
    const trail: StudioNode[] = [];
    let selected: StudioNode | null = null;
    /** What a test has reached in the sandbox, drawn on the encounters of an adventure (REQ-8296). */
    let reached = { encounters: new Set<string>(), exits: new Set<string>() };

    const drawCrumbs = (): void => {
      crumbs.replaceChildren(
        el(
          "button",
          { type: "button", className: "control" },
          t("ui.studio.root"),
        ),
      );
      (crumbs.firstChild as HTMLElement).dataset["action"] = "crumb-root";
      crumbs.firstChild?.addEventListener("click", () => {
        act("crumb-root");
        trail.length = 0;
        void show();
      });
      trail.forEach((n, i) => {
        const b = el(
          "button",
          { type: "button", className: "control" },
          n.title,
        );
        b.dataset["action"] = `crumb-${String(i)}`;
        b.addEventListener("click", () => {
          act(`crumb-${String(i)}`);
          trail.length = i + 1;
          void show();
        });
        crumbs.append(" › ", b);
      });
    };

    const drawPanel = (level: StudioNode["level"]): void => {
      panel.replaceChildren();
      const title = el("input", {
        id: "studio-title",
        type: "text",
        maxLength: 120,
      });
      title.dataset["action"] = "studio-title";
      title.addEventListener("input", () => act("studio-title"));
      const add = button("ui.studio.add", "studio-add", async () => {
        const made = await studioCreate({
          level,
          parentId: trail.at(-1)?.id ?? null,
          title: title.value,
        });
        if (made.ok) {
          note.textContent = t("ui.studio.added");
          void show();
        } else
          note.textContent = t("ui.studio.refused", { reason: made.error });
      });
      add.textContent = t("ui.studio.add", {
        level: t(`ui.studio.level.${level}` as UiKey),
      });
      panel.append(
        el("label", { htmlFor: "studio-title" }, t("ui.studio.addTitle")),
        title,
        add,
      );
      if (!selected) return;
      const node = selected;
      panel.append(
        status(t("ui.studio.selected", { title: node.title })),
        status(
          `${t(`ui.studio.status.${node.status}` as UiKey)} · ${t("ui.studio.version", { n: String(node.version) })}`,
        ),
      );
      if (INNER[node.level])
        panel.append(
          button("ui.studio.open", "studio-open", () => {
            trail.push(node);
            void show();
          }),
        );
      if (node.level === "adventure") panel.append(playPanel(node, note));
      if (node.level !== "encounter" && node.status === "draft")
        panel.append(
          button("ui.studio.approve", "studio-approve", async () => {
            const done = await studioStatus(node.id, "approved");
            if (done.ok) void show();
            else
              note.textContent = t("ui.studio.refused", { reason: done.error });
          }),
        );
      if (node.level !== "encounter" && node.status === "approved")
        panel.append(
          button("ui.studio.toDraft", "studio-draft", async () => {
            const done = await studioStatus(node.id, "draft");
            if (done.ok) void show();
            else
              note.textContent = t("ui.studio.refused", { reason: done.error });
          }),
        );
    };

    const drawGraph = (nodes: StudioNode[]): void => {
      graph.replaceChildren();
      if (nodes.length === 0) {
        graph.append(status(t("ui.studio.empty")));
        return;
      }
      const placed = layoutGraph(
        nodes.map((n) => ({ id: n.id, links: n.links })),
      );
      graph.style.position = "relative";
      graph.style.width = `${String(placed.width)}px`;
      graph.style.height = `${String(placed.height)}px`;
      graph.style.overflow = "auto";
      const at = new Map(placed.nodes.map((p) => [p.id, p]));
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", String(placed.width));
      svg.setAttribute("height", String(placed.height));
      svg.setAttribute("aria-hidden", "true");
      svg.style.position = "absolute";
      for (const e of placed.edges) {
        const a = at.get(e.from);
        const b = at.get(e.to);
        if (!a || !b) continue;
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );
        line.setAttribute("x1", String(a.x + DEFAULT_SIZE.nodeWidth));
        line.setAttribute("y1", String(a.y + DEFAULT_SIZE.nodeHeight / 2));
        line.setAttribute("x2", String(b.x));
        line.setAttribute("y2", String(b.y + DEFAULT_SIZE.nodeHeight / 2));
        line.setAttribute("stroke", "currentColor");
        if (reached.exits.has(`${e.from}>${e.to}`)) {
          line.setAttribute("stroke-width", "4");
          line.dataset["reached"] = "1";
        }
        svg.append(line);
      }
      graph.append(svg);
      for (const n of nodes) {
        const p = at.get(n.id);
        if (!p) continue;
        const b = el(
          "button",
          { type: "button", className: "control node" },
          el("strong", {}, n.title),
          el("small", {}, t(`ui.studio.status.${n.status}` as UiKey)),
          ...(reached.encounters.has(n.id)
            ? [el("small", {}, t("ui.studio.reached"))]
            : []),
        );
        if (reached.encounters.has(n.id)) b.dataset["reached"] = "1";
        b.dataset["action"] = `node-${n.id}`;
        b.dataset["node"] = n.id;
        b.style.position = "absolute";
        b.style.left = `${String(p.x)}px`;
        b.style.top = `${String(p.y)}px`;
        b.style.width = `${String(DEFAULT_SIZE.nodeWidth)}px`;
        b.style.height = `${String(DEFAULT_SIZE.nodeHeight)}px`;
        b.setAttribute(
          "aria-pressed",
          selected?.id === n.id ? "true" : "false",
        );
        b.addEventListener("click", () => {
          act(`node-${n.id}`);
          selected = n;
          drawGraph(nodes);
          drawPanel(
            n.level === "encounter"
              ? "encounter"
              : (INNER[n.level] as StudioNode["level"]),
          );
        });
        b.addEventListener("dblclick", () => {
          if (INNER[n.level]) {
            trail.push(n);
            void show();
          }
        });
        graph.append(b);
      }
    };

    const show = async (): Promise<void> => {
      selected = null;
      drawCrumbs();
      const here = trail.at(-1) ?? null;
      const level: StudioNode["level"] = here
        ? (INNER[here.level] ?? "encounter")
        : "campaign";
      const nodes = await asParent(section, note, () =>
        studioNodes(here?.id ?? null),
      );
      if (!nodes) {
        loginNeeded(note, nav);
        delete section.dataset["busy"];
        return;
      }
      reached = { encounters: new Set(), exits: new Set() };
      if (level === "encounter") {
        // The sandbox may not exist, and then nothing is marked.
        const got = await studioReached();
        if (got.ok)
          reached = {
            encounters: new Set(got.value.encounters),
            exits: new Set(got.value.exits.map((x) => `${x.from}>${x.to}`)),
          };
      }
      drawGraph(nodes);
      drawPanel(level);
      delete section.dataset["busy"];
    };

    const showLogs = async (): Promise<void> => {
      const list = await asParent(section, note, studioLogs);
      logs.replaceChildren(el("h2", {}, t("ui.studio.logs")));
      if (!list || list.length === 0) {
        logs.append(status(t("ui.studio.noLogs")));
        return;
      }
      const items = el("ul", {});
      for (const a of list) {
        const detail = el("ol", { className: "log" });
        const open = button(
          "ui.studio.logOpen",
          `log-${a.adventureId}`,
          async () => {
            const events = await asParent(section, note, () =>
              studioLog(a.adventureId),
            );
            detail.replaceChildren(
              ...(events ?? []).map((e) =>
                el("li", {}, `${String(e.seq)} ${e.type}`),
              ),
            );
          },
        );
        items.append(
          el(
            "li",
            {},
            status(t("ui.studio.logEvents", { n: String(a.events) })),
            open,
            detail,
          ),
        );
      }
      logs.append(items);
    };

    nav.append(
      link("ui.studio.navTasks", "open-task-lab", "/studio/tasks"),
      link("ui.studio.navScreens", "open-screen-lab", "/studio/screens"),
      link("ui.studio.navChecklist", "open-checklist", "/studio/checklist"),
      link("ui.nav.parent", "open-parent", "/parent"),
      link("ui.nav.back", "back", "/"),
    );
    void show().then(showLogs);
    return section;
  },
};

const LANGS = ["ru", "en", "nl"] as const;

/**
 * The task lab (ADR-3280, REQ-8298): any template opened as a task, in any language and for any
 * seed, with its answer, solution, hints, typical mistakes and what a story for it would cost.
 */
const taskLabScreen: Screen = {
  path: "/studio/tasks",
  render() {
    const note = status();
    const nav = el("nav", { className: "actions" });
    const filter = el("input", { id: "task-filter", type: "text" });
    filter.dataset["action"] = "task-filter";
    filter.addEventListener("input", () => act("task-filter"));
    const count = status();
    const list = el("ul", { className: "templates" });
    const detail = el("div", { className: "task-detail" });
    const section = el(
      "section",
      {},
      heading("ui.tasks.title"),
      el("label", { htmlFor: "task-filter" }, t("ui.tasks.filter")),
      filter,
      count,
      list,
      detail,
      note,
      nav,
    );
    section.dataset["busy"] = "1";
    let all: TemplateRow[] = [];
    let chosen: TemplateRow | null = null;
    let lang: string = "ru";
    let seed = "";

    const openChosen = async (): Promise<void> => {
      if (!chosen) return;
      const task = await asParent(section, note, () =>
        studioTask(chosen?.id ?? "", seed, lang),
      );
      detail.replaceChildren();
      if (!task) return;
      seed = task.seed;
      showTask(task);
    };

    const showTask = (task: OpenedTask): void => {
      const seedBox = el("input", {
        id: "task-seed",
        type: "text",
        value: task.seed,
      });
      seedBox.dataset["action"] = "task-seed";
      seedBox.addEventListener("input", () => {
        act("task-seed");
        seed = (seedBox as HTMLInputElement).value.trim().toLowerCase();
      });
      const apply = button("ui.tasks.nextSeed", "task-next-seed", async () => {
        const next = BigInt(`0x${task.seed || "0"}`) + 1n;
        seed = next.toString(16);
        await openChosen();
      });
      const langs = el(
        "div",
        { className: "langs" },
        el("span", {}, t("ui.tasks.lang")),
        ...LANGS.map((code) => {
          const b = el(
            "button",
            { type: "button", className: "control" },
            code,
          );
          b.dataset["action"] = `task-lang-${code}`;
          b.setAttribute("aria-pressed", String(code === lang));
          b.addEventListener("click", () => {
            act(`task-lang-${code}`);
            lang = code;
            void openChosen();
          });
          return b;
        }),
      );
      const picture = el("div", { className: "picture" });
      if (task.svg) picture.innerHTML = task.svg;
      detail.replaceChildren(
        el("h2", {}, task.template.id),
        status(
          t("ui.tasks.meta", {
            node: task.template.node,
            subtype: task.template.subtype,
            from: String(task.template.groups[0]),
            to: String(task.template.groups[1]),
          }),
        ),
        langs,
        el("label", { htmlFor: "task-seed" }, t("ui.tasks.seed")),
        seedBox,
        apply,
        el("p", { className: "task-text" }, task.text),
        picture,
        ...(task.options ? [el("p", {}, task.options.join(" · "))] : []),
        el(
          "p",
          { className: "task-answer" },
          t("ui.tasks.answer", { answer: task.answer }),
        ),
        el("h3", {}, t("ui.tasks.solution")),
        el("ol", {}, ...task.solution.map((line) => el("li", {}, line))),
        el("h3", {}, t("ui.tasks.hints")),
        el("ol", {}, ...task.hints.map((line) => el("li", {}, line))),
        el("h3", {}, t("ui.tasks.traps")),
        el(
          "ul",
          {},
          ...task.traps.map((trap) =>
            el("li", {}, `${trap.entry}: ${trap.explanation}`),
          ),
        ),
        el("h3", {}, t("ui.tasks.blank")),
        el("p", { className: "task-blank" }, task.blank),
        status(t("ui.tasks.cost", { usd: task.storyEstimateUsd.toFixed(4) })),
      );
    };

    const drawList = (): void => {
      const needle = (filter as HTMLInputElement).value.trim().toLowerCase();
      const shown = all
        .filter(
          (r) =>
            needle === "" ||
            `${r.id} ${r.node} ${r.subtype}`.toLowerCase().includes(needle),
        )
        .slice(0, 60);
      count.textContent = t("ui.tasks.count", { n: String(shown.length) });
      list.replaceChildren(
        ...(shown.length === 0
          ? [el("li", {}, t("ui.tasks.none"))]
          : shown.map((r) => {
              const b = el(
                "button",
                { type: "button", className: "control" },
                r.id,
              );
              b.dataset["action"] = `task-${r.id}`;
              b.addEventListener("click", () => {
                act(`task-${r.id}`);
                chosen = r;
                seed = "";
                void openChosen();
              });
              return el("li", {}, b);
            })),
      );
    };
    filter.addEventListener("input", drawList);

    nav.append(
      link("ui.studio.title", "open-studio", "/studio"),
      link("ui.nav.back", "back", "/"),
    );
    void (async () => {
      const rows = await asParent(section, note, studioTemplates);
      if (!rows) loginNeeded(note, nav);
      else {
        all = rows;
        drawList();
      }
      delete section.dataset["busy"];
    })();
    return section;
  },
};

const CHILD_SCREENS = [
  ["home", "/"],
  ["sheet", "/sheet"],
  ["pair", "/pair"],
  ["settings", "/settings"],
] as const;

/**
 * The screen lab (ADR-3280, REQ-8300): a child's screen in a frame, in any shipped language. The
 * frame is the game's own page with the language asked for in its address, so what shows is what
 * the child sees. The play screen opens in the sandbox, which comes with the turn loop.
 */
const screenLabScreen: Screen = {
  path: "/studio/screens",
  render() {
    const stage = el("div", { className: "screen-stage" });
    // The frame is made on the first choice, so a page that only shows the buttons holds no frame.
    const show = (code: string, route: string): void => {
      let frame = stage.querySelector("iframe");
      if (!frame) {
        frame = el("iframe", {
          className: "screen-frame",
          title: t("ui.screens.frame"),
        });
        frame.dataset["action"] = "screen-frame";
        frame.tabIndex = -1;
        frame.style.width = "100%";
        frame.style.height = "480px";
        stage.append(frame);
      }
      frame.setAttribute("src", `/?lang=${code}#${route}`);
    };
    const buttons = el("div", { className: "screens" });
    for (const [name, route] of CHILD_SCREENS)
      for (const code of LANGS) {
        const b = button("ui.screens.open", `screen-${name}-${code}`, () => {
          show(code, route);
        });
        b.textContent = t("ui.screens.open", {
          screen: t(`ui.screens.screen.${name}` as UiKey),
          lang: code,
        });
        buttons.append(b);
      }
    return el(
      "section",
      {},
      heading("ui.screens.title"),
      status(t("ui.screens.intro")),
      buttons,
      stage,
      el(
        "nav",
        { className: "actions" },
        link("ui.studio.title", "open-studio", "/studio"),
        link("ui.nav.back", "back", "/"),
      ),
    );
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

/**
 * The checklist page (ADR-3280, REQ-8304): each game feature and the tests that cover it. The list
 * shows when the parent asks for it, so the page itself holds no data text until then.
 */
const checklistScreen: Screen = {
  path: "/studio/checklist",
  render() {
    const note = status();
    const list = el("ul", { className: "checklist" });
    const show = button("ui.checklist.show", "checklist-show", async () => {
      const got = await studioChecklist();
      if (!got.ok) {
        note.textContent = t("ui.studio.refused", { reason: got.error });
        return;
      }
      list.replaceChildren(
        ...got.value.map((f) =>
          el(
            "li",
            {},
            `${f.id}: ${f.tests.length ? f.tests.join(", ") : (f.untested ?? "")}`,
          ),
        ),
      );
    });
    return el(
      "section",
      {},
      heading("ui.checklist.title"),
      status(t("ui.checklist.intro")),
      show,
      note,
      list,
      el(
        "nav",
        { className: "actions" },
        link("ui.nav.studio", "open-studio", "/studio"),
        link("ui.nav.back", "back", "/"),
      ),
    );
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
  studioScreen,
  taskLabScreen,
  screenLabScreen,
  checklistScreen,
  playScreen,
];
