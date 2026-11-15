// The studio's form for a campaign, an arc or an adventure (ADR-3280, REQ-8306): the fields the level has
// as text, and the whole body as text for any other field. A field the form does not show is kept as it is,
// so the scenario a generator wrote stays in the body when the parent edits its logline.
import { studioNode, studioSave, type StudioNode } from "./api.js";
import { act, button, el } from "./controls.js";
import { faultText, refusalText } from "./studio-form.js";
import { t, uiKey, type UiKey } from "./strings.js";

type UpperLevel = "campaign" | "arc" | "adventure";
type Spec = { path: string[]; area?: boolean; select?: readonly string[] };

const KINDS = ["mythology", "case", "character", "filler"] as const;

const FIELDS: Readonly<Record<UpperLevel, readonly Spec[]>> = {
  campaign: [
    { path: ["logline"], area: true },
    { path: ["theme"], area: true },
  ],
  arc: [
    { path: ["logline"], area: true },
    { path: ["closingQuestion"], area: true },
  ],
  adventure: [
    { path: ["logline"], area: true },
    { path: ["premise"], area: true },
    { path: ["question"], area: true },
    { path: ["kind"], select: KINDS },
    { path: ["conflict", "wants"], area: true },
    { path: ["conflict", "against"], area: true },
    { path: ["conflict", "stakes"], area: true },
  ],
};

type Body = Record<string, unknown>;

const objectOf = (v: unknown): Body | null =>
  typeof v === "object" && v !== null && !Array.isArray(v) ? (v as Body) : null;

const read = (body: Body, path: readonly string[]): string => {
  const v = path.reduce<unknown>((o, k) => objectOf(o)?.[k], body);
  return typeof v === "string" ? v : "";
};

/** Sets a text at a path, or removes it where it is empty, and removes an object that is left empty. */
function write(body: Body, path: readonly string[], value: string): Body {
  const [head, ...rest] = path;
  if (head === undefined) return body;
  const next: Body = { ...body };
  if (rest.length === 0) {
    if (value === "") Reflect.deleteProperty(next, head);
    else next[head] = value;
    return next;
  }
  const inner = write(objectOf(next[head]) ?? {}, rest, value);
  if (Object.keys(inner).length === 0) Reflect.deleteProperty(next, head);
  else next[head] = inner;
  return next;
}

const idOf = (path: readonly string[]): string => `lf-${path.join("-")}`;
const keyOf = (path: readonly string[]): UiKey =>
  uiKey(`ui.studio.lf.${path.join("_")}`);

/** The form of one node above the encounters, loaded from its stored body. */
export async function levelForm(
  node: StudioNode,
  note: HTMLElement,
): Promise<HTMLElement> {
  const form = el("div", { className: "level-form" });
  const loaded = await studioNode(node.id);
  if (!loaded.ok) {
    note.textContent = refusalText(loaded.error);
    return form;
  }
  let stored: Body = { ...(loaded.value.body ?? {}) };
  const specs = FIELDS[node.level as UpperLevel];
  const faultLine = (field: string): HTMLParagraphElement => {
    const p = el("p", { className: "fault" });
    p.dataset["fault"] = field;
    p.setAttribute("role", "alert");
    return p;
  };
  const clearFaults = (): void => {
    for (const p of form.querySelectorAll<HTMLElement>("[data-fault]"))
      p.textContent = "";
  };
  const showFault = (done: {
    fault?: { field: string; code: string; held: string; need: string };
    error: string;
  }): void => {
    const line = done.fault
      ? form.querySelector<HTMLElement>(`[data-fault="${done.fault.field}"]`)
      : null;
    if (done.fault && line) line.textContent = faultText(done.fault);
    else if (done.fault) note.textContent = faultText(done.fault);
    else note.textContent = refusalText(done.error);
  };

  const draw = (): void => {
    const draft: Body = { ...stored };
    let current = draft;
    const fields = specs.flatMap((spec) => {
      const id = idOf(spec.path);
      const label = el("label", { htmlFor: id }, t(keyOf(spec.path)));
      let control: HTMLElement;
      if (spec.select) {
        const pick = el("select", { id });
        pick.append(
          el("option", { value: "" }, t("ui.studio.levelForm.kindNone")),
        );
        for (const k of spec.select)
          pick.append(
            el("option", { value: k }, t(uiKey(`ui.studio.lf.kind.${k}`))),
          );
        pick.value = read(current, spec.path);
        pick.addEventListener("change", () => {
          act(id);
          current = write(current, spec.path, pick.value);
        });
        control = pick;
      } else {
        const box = el("textarea", {
          id,
          rows: 3,
          value: read(current, spec.path),
        });
        box.addEventListener("input", () => {
          act(id);
          current = write(current, spec.path, box.value);
        });
        control = box;
      }
      control.dataset["action"] = id;
      return [
        el("div", { className: "field" }, label, control),
        faultLine(spec.path.join(".")),
      ];
    });
    const save = button("ui.studio.form.save", "level-save", async () => {
      clearFaults();
      const done = await studioSave(node.id, current);
      if (done.ok) {
        stored = current;
        note.textContent = t("ui.studio.form.saved", { n: done.value.version });
        draw();
        return;
      }
      showFault(done);
    });

    const json = el("textarea", {
      id: "lf-json",
      rows: 10,
      value: JSON.stringify(stored, null, 2),
    });
    json.dataset["action"] = "lf-json";
    json.addEventListener("input", () => act("lf-json"));
    const saveJson = button(
      "ui.studio.levelForm.jsonSave",
      "level-json-save",
      async () => {
        clearFaults();
        let parsed: unknown;
        try {
          parsed = JSON.parse(json.value);
        } catch {
          const line = form.querySelector<HTMLElement>('[data-fault="json"]');
          if (line) line.textContent = t("ui.studio.levelForm.badJson");
          return;
        }
        const body = objectOf(parsed);
        if (!body) {
          const line = form.querySelector<HTMLElement>('[data-fault="json"]');
          if (line) line.textContent = t("ui.studio.levelForm.badJson");
          return;
        }
        const done = await studioSave(node.id, body);
        if (done.ok) {
          stored = body;
          note.textContent = t("ui.studio.form.saved", {
            n: done.value.version,
          });
          draw();
          return;
        }
        showFault(done);
      },
    );
    form.replaceChildren(
      el(
        "h2",
        {},
        t("ui.studio.levelForm.title", {
          level: t(uiKey(`ui.studio.level.${node.level}`)),
        }),
      ),
      ...fields,
      save,
      el("h3", {}, t("ui.studio.levelForm.jsonTitle")),
      el("p", {}, t("ui.studio.levelForm.jsonHelp")),
      el("label", { htmlFor: "lf-json" }, t("ui.studio.levelForm.jsonTitle")),
      json,
      faultLine("json"),
      saveJson,
    );
  };
  draw();
  return form;
}
