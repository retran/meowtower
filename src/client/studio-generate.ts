// The studio's generator for an adventure (ADR-3360, REQ-8608, REQ-8318, REQ-8610): the page shows the
// calls a run makes and the month's spend before it starts, then the step it is at, and names the cause
// where it stops. The result waits as a version, so the page ends by showing the versions.
import {
  studioGenerate,
  studioGenerateEstimate,
  studioJob,
  type StudioJob,
  type StudioNode,
} from "./api.js";
import { act, button, el } from "./controls.js";
import { refusalText } from "./studio-form.js";
import { t, uiKey } from "./strings.js";

/** How often a running job is read again. */
const POLL_MS = 1000;

const stepText = (job: StudioJob): string => {
  const [name = "", n = "0"] = job.message.split(":");
  const known = ["plan", "review", "replan", "draft", "critic"].includes(name);
  return t(uiKey(`ui.studio.generate.step.${known ? name : "start"}`), {
    n,
    progress: job.progress,
  } as never);
};

/** The generator of one adventure: its estimate, a prompt, a start button and the job's progress. */
export function generatePanel(
  node: StudioNode,
  note: HTMLElement,
  onDone: () => void,
): HTMLElement {
  const box = el("div", { className: "generate" });
  const estimate = el("p", { className: "status" });
  estimate.dataset["estimate"] = "1";
  const prompt = el("textarea", { id: "gen-prompt", rows: 3 });
  prompt.dataset["action"] = "gen-prompt";
  prompt.addEventListener("input", () => act("gen-prompt"));
  const progress = el("p", { className: "status" });
  progress.dataset["job"] = "1";
  progress.setAttribute("role", "status");
  const cause = el("p", { className: "fault" });
  cause.setAttribute("role", "alert");

  void studioGenerateEstimate(node.id).then((got) => {
    if (!got.ok) {
      estimate.textContent = "";
      return;
    }
    const v = got.value;
    estimate.dataset["basis"] = v.basis;
    estimate.textContent = t(
      v.basis === "measured"
        ? "ui.studio.generate.estimateMeasured"
        : "ui.studio.generate.estimateDefault",
      {
        min: v.calls.min,
        max: v.calls.max,
        low: v.estimateUsd.min.toFixed(2),
        high: v.estimateUsd.max.toFixed(2),
        calls: v.measuredCalls,
        spent: v.spentUsd.toFixed(2),
      },
    );
  });

  const follow = async (
    id: string,
    start: HTMLButtonElement,
  ): Promise<void> => {
    const got = await studioJob(id);
    if (!got.ok) {
      progress.dataset["state"] = "failed";
      cause.textContent = refusalText(got.error);
      start.disabled = false;
      return;
    }
    const job = got.value;
    progress.dataset["state"] = job.state;
    if (job.state === "done") {
      progress.textContent = t("ui.studio.generate.done");
      start.disabled = false;
      onDone();
      return;
    }
    if (job.state === "failed") {
      progress.textContent = "";
      const code = [
        "budget_exhausted",
        "provider_failed",
        "check_failed",
        "version_waits",
      ].includes(job.message)
        ? job.message
        : "failed";
      cause.dataset["cause"] = code;
      cause.textContent = t(uiKey(`ui.studio.generate.cause.${code}`));
      start.disabled = false;
      return;
    }
    progress.textContent =
      job.state === "queued"
        ? t("ui.studio.generate.step.start", { n: "0", progress: 0 } as never)
        : stepText(job);
    setTimeout(() => {
      void follow(id, start);
    }, POLL_MS);
  };

  const start = button("ui.studio.generate.start", "gen-start", async () => {
    cause.textContent = "";
    delete cause.dataset["cause"];
    if (prompt.value.trim() === "") {
      cause.textContent = t("ui.studio.generate.promptEmpty");
      return;
    }
    start.disabled = true;
    const began = await studioGenerate(node.id, prompt.value.trim());
    if (!began.ok) {
      cause.textContent = refusalText(began.error);
      start.disabled = false;
      return;
    }
    progress.dataset["state"] = began.value.state;
    note.textContent = "";
    await follow(began.value.id, start);
  });
  box.append(
    estimate,
    el("label", { htmlFor: "gen-prompt" }, t("ui.studio.generate.prompt")),
    prompt,
    start,
    progress,
    cause,
  );
  return box;
}
