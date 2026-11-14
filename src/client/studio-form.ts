// The studio's form for an encounter (ADR-3360, REQ-8306): the body is edited field by field, one save
// stores one new version, and the code's check names the field it refused beside that field (REQ-8600).
import {
  studioNode,
  studioRestore,
  studioSave,
  studioVersions,
  type StudioFault,
  type StudioNode,
} from "./api.js";
import { act, button, el } from "./controls.js";
import { t, uiKey, type UiKey } from "./strings.js";

const TEXT_FIELDS = ["place", "situation", "goal", "pressure"] as const;
type Person = { name: string; aim: string };
type Exit = { when: string; next: string };

const text = (v: unknown): string => (typeof v === "string" ? v : "");

/** A refusal of the store in words that say what to do, where the reason is one the page knows. */
export function refusalText(reason: string): string {
  const edited = /^a (playing|played) node is not edited$/.exec(reason);
  if (edited)
    return t("ui.studio.refusal.notEdited", {
      status: t(uiKey(`ui.studio.status.${edited[1] ?? "playing"}`)),
    });
  if (reason === "that is the current version")
    return t("ui.studio.refusal.alreadyCurrent");
  if (reason === "the title is 1 to 120 characters")
    return t("ui.studio.refusal.title");
  return t("ui.studio.refused", { reason });
}

const labelOf = (field: string): string => {
  const row = /^(people|exits)\.(\d+)\.(\w+)$/.exec(field);
  if (row) {
    const [, list, n, part] = row;
    const partKey =
      list === "people"
        ? part === "aim"
          ? "personAim"
          : "personName"
        : part === "when"
          ? "exitWhen"
          : "exitNext";
    return t("ui.studio.fault.row", {
      label: t(uiKey(`ui.studio.field.${list ?? ""}`)),
      n: String(Number(n) + 1),
      part: t(uiKey(`ui.studio.field.${partKey}`)),
    });
  }
  return t(uiKey(`ui.studio.field.${field}`));
};

/** A fault in the parent's language: the field, what it holds and what it needs. */
export function faultText(fault: StudioFault): string {
  const range = /^(\d+) to (\d+)$/.exec(fault.need);
  const key = uiKey(`ui.studio.fault.${fault.code}`);
  return t(
    key as UiKey,
    {
      label: labelOf(fault.field),
      held: fault.held,
      need: fault.need,
      min: range?.[1] ?? "",
      max: range?.[2] ?? "",
    } as never,
  );
}

/** The form of one encounter, loaded from its stored body; siblings are the encounters it can lead to. */
export async function encounterForm(
  node: StudioNode,
  siblings: readonly StudioNode[],
  note: HTMLElement,
): Promise<HTMLElement> {
  const form = el("div", { className: "encounter-form" });
  const loaded = await studioNode(node.id);
  if (!loaded.ok) {
    note.textContent = refusalText(loaded.error);
    return form;
  }
  /** What is stored, so a field the form does not show (the writer's) is kept. */
  let stored: Record<string, unknown> = { ...(loaded.value.body ?? {}) };
  const values: Record<string, string> = {};
  for (const f of TEXT_FIELDS) values[f] = text(stored[f]);
  let checks =
    typeof stored["checks"] === "number" ? String(stored["checks"]) : "";
  let people: Person[] = Array.isArray(stored["people"])
    ? (stored["people"] as Record<string, unknown>[]).map((p) => ({
        name: text(p["name"]),
        aim: text(p["aim"]),
      }))
    : [];
  let exits: Exit[] = Array.isArray(stored["exits"])
    ? (stored["exits"] as Record<string, unknown>[]).map((x) => ({
        when: text(x["when"]),
        next: text(x["next"]),
      }))
    : [];

  const faultLine = (field: string): HTMLParagraphElement => {
    const p = el("p", { className: "fault" });
    p.dataset["fault"] = field;
    p.setAttribute("role", "alert");
    return p;
  };
  const labelled = (
    id: string,
    key: UiKey,
    control: HTMLElement,
  ): HTMLElement =>
    el(
      "div",
      { className: "field" },
      el("label", { htmlFor: id }, t(key)),
      control,
    );
  const input = (
    id: string,
    value: string,
    onInput: (v: string) => void,
    multi = false,
  ): HTMLInputElement | HTMLTextAreaElement => {
    const c = multi
      ? el("textarea", { id, rows: 3, value })
      : el("input", { id, type: "text", value });
    c.dataset["action"] = id;
    c.addEventListener("input", () => {
      act(id);
      onInput(c.value);
    });
    return c;
  };

  const peopleBox = el("div", { className: "rows" });
  const exitsBox = el("div", { className: "rows" });
  const drawPeople = (): void => {
    peopleBox.replaceChildren(
      ...people.map((p, i) => {
        const row = el(
          "div",
          { className: "row" },
          labelled(
            `enc-person-name-${String(i)}`,
            "ui.studio.field.personName",
            input(`enc-person-name-${String(i)}`, p.name, (v) => (p.name = v)),
          ),
          faultLine(`people.${String(i)}.name`),
          labelled(
            `enc-person-aim-${String(i)}`,
            "ui.studio.field.personAim",
            input(`enc-person-aim-${String(i)}`, p.aim, (v) => (p.aim = v)),
          ),
          faultLine(`people.${String(i)}.aim`),
          button(
            "ui.studio.form.remove",
            `enc-person-remove-${String(i)}`,
            () => {
              people = people.filter((_, k) => k !== i);
              drawPeople();
            },
          ),
        );
        return row;
      }),
    );
  };
  const drawExits = (): void => {
    exitsBox.replaceChildren(
      ...exits.map((x, i) => {
        const pick = el("select", { id: `enc-exit-next-${String(i)}` });
        pick.dataset["action"] = `enc-exit-next-${String(i)}`;
        pick.append(el("option", { value: "" }, t("ui.studio.form.exitPick")));
        for (const s of siblings)
          if (s.id !== node.id)
            pick.append(el("option", { value: s.id }, s.title));
        pick.value = x.next;
        pick.addEventListener("change", () => {
          act(`enc-exit-next-${String(i)}`);
          x.next = pick.value;
        });
        return el(
          "div",
          { className: "row" },
          labelled(
            `enc-exit-when-${String(i)}`,
            "ui.studio.field.exitWhen",
            input(`enc-exit-when-${String(i)}`, x.when, (v) => (x.when = v)),
          ),
          faultLine(`exits.${String(i)}.when`),
          labelled(
            `enc-exit-next-${String(i)}`,
            "ui.studio.field.exitNext",
            pick,
          ),
          faultLine(`exits.${String(i)}.next`),
          button(
            "ui.studio.form.remove",
            `enc-exit-remove-${String(i)}`,
            () => {
              exits = exits.filter((_, k) => k !== i);
              drawExits();
            },
          ),
        );
      }),
    );
  };
  drawPeople();
  drawExits();

  const clearFaults = (): void => {
    for (const p of form.querySelectorAll<HTMLElement>("[data-fault]"))
      p.textContent = "";
  };
  const body = (): Record<string, unknown> => {
    const next: Record<string, unknown> = { ...stored };
    for (const f of TEXT_FIELDS) {
      const v = (values[f] ?? "").trim();
      if (v === "") Reflect.deleteProperty(next, f);
      else next[f] = v;
    }
    if (checks.trim() === "") delete next["checks"];
    else next["checks"] = Number(checks);
    if (people.length === 0) delete next["people"];
    else next["people"] = people.map((p) => ({ name: p.name, aim: p.aim }));
    if (exits.length === 0) delete next["exits"];
    else next["exits"] = exits.map((x) => ({ when: x.when, next: x.next }));
    return next;
  };
  const save = button("ui.studio.form.save", "studio-save", async () => {
    clearFaults();
    const sent = body();
    const done = await studioSave(node.id, sent);
    if (done.ok) {
      stored = sent;
      note.textContent = t("ui.studio.form.saved", { n: done.value.version });
      return;
    }
    const line = done.fault
      ? form.querySelector<HTMLElement>(`[data-fault="${done.fault.field}"]`)
      : null;
    if (done.fault && line) line.textContent = faultText(done.fault);
    else if (done.fault) note.textContent = faultText(done.fault);
    else note.textContent = refusalText(done.error);
  });

  form.append(
    el("h2", {}, t("ui.studio.form.title")),
    ...TEXT_FIELDS.flatMap((f) => [
      labelled(
        `enc-${f}`,
        uiKey(`ui.studio.field.${f}`),
        input(
          `enc-${f}`,
          values[f] ?? "",
          (v) => (values[f] = v),
          f !== "place",
        ),
      ),
      faultLine(f),
    ]),
    labelled(
      "enc-checks",
      "ui.studio.field.checks",
      input("enc-checks", checks, (v) => (checks = v)),
    ),
    faultLine("checks"),
    el("h3", {}, t("ui.studio.field.people")),
    peopleBox,
    button("ui.studio.form.addPerson", "enc-person-add", () => {
      people = [...people, { name: "", aim: "" }];
      drawPeople();
    }),
    el("h3", {}, t("ui.studio.field.exits")),
    exitsBox,
    button("ui.studio.form.addExit", "enc-exit-add", () => {
      exits = [...exits, { when: "", next: "" }];
      drawExits();
    }),
    faultLine("body"),
    save,
  );
  return form;
}

/**
 * The versions of a node, newest last, with a button that restores an earlier one as a new version
 * (REQ-8602). `onRestored` runs after a restore, so a form showing the node reloads its body.
 */
export function versionsPanel(
  node: StudioNode,
  note: HTMLElement,
  onRestored: () => void,
): HTMLElement {
  const box = el("div", { className: "versions-panel" });
  const list = el("ol", { className: "versions" });
  let current = node.version;
  const load = async (): Promise<void> => {
    const got = await studioVersions(node.id);
    if (!got.ok) {
      note.textContent = refusalText(got.error);
      return;
    }
    list.replaceChildren(
      ...got.value.map((v) => {
        const when = new Date(v.createdAt).toLocaleString(
          document.documentElement.lang || "ru",
        );
        const row = el(
          "li",
          {},
          t("ui.studio.versions.item", {
            n: v.version,
            author: t(uiKey(`ui.studio.versions.author.${v.author}`)),
            time: when,
          }),
        );
        if (v.version === current)
          row.append(" ", t("ui.studio.versions.currentMark"));
        else
          row.append(
            " ",
            button(
              "ui.studio.versions.restore",
              `version-restore-${String(v.version)}`,
              async () => {
                const done = await studioRestore(node.id, v.version);
                if (!done.ok) {
                  note.textContent = refusalText(done.error);
                  return;
                }
                current = done.value.version;
                note.textContent = t("ui.studio.versions.restored", {
                  n: done.value.version,
                });
                await load();
                onRestored();
              },
            ),
          );
        return row;
      }),
    );
  };
  box.append(button("ui.studio.versions.show", "studio-versions", load), list);
  return box;
}
