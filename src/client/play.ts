// The stand-in play screen (TSK-0340, SPC-0030): it draws each packet the
// server sends, checks an answer only against its InputSpec (REQ-2402), shows
// every task and outcome the same way whether the server scores it or not
// (REQ-2430), and pauses the adventure on background (REQ-2406) and on idle
// (REQ-2408, REQ-2410). ADR-0150's epic replaces the screen.
import type { AnswerIn, AnswerOut, Room } from "../shared/api.js";
import { answer, nextPacket, pause, startSession } from "./api.js";
import { act, button, el, heading, link, status } from "./controls.js";
import type { Screen } from "./screens.js";
import { t } from "./strings.js";

/** No input for this long outside the task window pauses the adventure (REQ-2408). */
export const IDLE_OUTSIDE_TASK_MS = 90 * 1000;
/** With a task open the limit is longer, because long thought is normal (REQ-2410). */
export const IDLE_IN_TASK_MS = 5 * 60 * 1000;

/** What each InputSpec kind lets into the field; everything else is refused. */
const ACCEPTS: Record<Room["input"]["kind"], RegExp> = { integer: /^\d*$/ };

/** The badge's word for an outcome; the server decides the outcome. */
function badgeKey(reply: AnswerOut, dontKnow: boolean): string {
  if (reply.outcome === "clean") return "ui.play.badge.clean";
  if (reply.outcome === "partial") return "ui.play.badge.partial";
  return dontKnow ? "ui.play.badge.unknown" : "ui.play.badge.soft";
}

type Reason = "leave" | "background" | "idle";

export const playScreen: Screen = {
  path: "/play",
  render(shell) {
    const section = el("section", { className: "play" });
    section.dataset["busy"] = "1";
    let sessionId: string | null = null;
    let taskOpen = false;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const detach = (): void => {
      clearTimeout(idle);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const type of ["keydown", "pointerdown", "input"])
        document.removeEventListener(type, onActivity, true);
    };
    // The shell swaps screens by replacing them, so a handler that finds its
    // screen gone detaches itself.
    const gone = (): boolean => {
      if (section.isConnected) return false;
      detach();
      return true;
    };
    const restartIdle = (): void => {
      clearTimeout(idle);
      if (!sessionId) return;
      idle = setTimeout(
        () => void stop("idle"),
        taskOpen ? IDLE_IN_TASK_MS : IDLE_OUTSIDE_TASK_MS,
      );
    };
    function onActivity(): void {
      if (!gone()) restartIdle();
    }
    function onVisibility(): void {
      if (!gone() && document.visibilityState === "hidden")
        void stop("background");
    }
    document.addEventListener("visibilitychange", onVisibility);
    for (const type of ["keydown", "pointerdown", "input"])
      document.addEventListener(type, onActivity, true);

    const draw = (...children: Node[]): void => {
      section.replaceChildren(heading("ui.play.title"), ...children);
      delete section.dataset["busy"];
    };

    async function stop(reason: Reason): Promise<void> {
      if (!sessionId) return;
      const id = sessionId;
      sessionId = null;
      clearTimeout(idle);
      await pause(id, reason);
      if (reason === "leave") {
        location.hash = "#/";
        return;
      }
      if (!gone())
        draw(
          status(t("ui.play.paused")),
          el(
            "nav",
            { className: "actions" },
            button("ui.play.continue", "play-continue", begin),
            link("ui.nav.back", "back", "/"),
          ),
        );
    }

    const refused = (key: string): void =>
      draw(
        status(t(key)),
        el("nav", { className: "actions" }, link("ui.nav.back", "back", "/")),
      );

    async function begin(): Promise<void> {
      section.dataset["busy"] = "1";
      sessionId = await startSession();
      if (!sessionId) return refused("ui.play.refused");
      await advance();
    }

    async function advance(): Promise<void> {
      if (!sessionId) return;
      section.dataset["busy"] = "1";
      const packet = await nextPacket(sessionId);
      if (gone()) return;
      if (!packet) return refused("ui.play.failed");
      if (packet.kind === "room") drawRoom(packet);
      else {
        taskOpen = false;
        draw(
          status(t("ui.play.end")),
          el("nav", { className: "actions" }, link("ui.nav.back", "back", "/")),
        );
      }
      restartIdle();
    }

    function drawRoom(room: Room): void {
      taskOpen = true;
      const shownAt = performance.now();
      const input: AnswerIn["input"] = {
        firstKeyMs: 0,
        submittedMs: 0,
        edits: 0,
        erasures: 0,
        keyPresses: 0,
        focusLosses: { count: 0, totalMs: 0 },
        method: shell.current === "tablet" ? "keypad" : "keyboard",
      };
      const since = (): number => Math.round(performance.now() - shownAt);
      const field = el("input", {
        id: "play-answer",
        type: "text",
        inputMode: "numeric",
        autocomplete: "off",
      });
      field.dataset["action"] = "play-answer";
      const accepts = ACCEPTS[room.input.kind];
      // The one check the client makes: the input's format (REQ-2402).
      field.addEventListener("beforeinput", (e) => {
        const next =
          e.inputType.startsWith("delete") || e.data === null
            ? ""
            : field.value + e.data;
        if (!accepts.test(next)) e.preventDefault();
      });
      field.addEventListener("input", () => {
        if (!accepts.test(field.value))
          field.value = field.value.replace(/\D/g, "");
        act("play-answer");
      });
      field.addEventListener("keydown", (e) => {
        input.keyPresses++;
        if (!input.firstKeyMs) input.firstKeyMs = since();
        if (e.key === "Backspace" || e.key === "Delete") input.erasures++;
        else if (e.key.length === 1) input.edits++;
        if (e.key === "Enter") {
          e.preventDefault();
          void submit(false);
        }
      });
      let blurredAt = 0;
      field.addEventListener("blur", () => {
        blurredAt = performance.now();
      });
      field.addEventListener("focus", () => {
        if (!blurredAt) return;
        input.focusLosses.count++;
        input.focusLosses.totalMs += Math.round(performance.now() - blurredAt);
      });
      const note = status();
      let sending = false;
      async function submit(dontKnow: boolean): Promise<void> {
        if (sending || !sessionId) return;
        const raw = dontKnow ? "" : field.value.trim();
        if (!dontKnow && !raw) return;
        sending = true;
        input.submittedMs = since();
        const reply = await answer(sessionId, {
          itemId: room.itemId,
          raw,
          dontKnow,
          input,
        });
        sending = false;
        if (gone()) return;
        if (!reply) {
          note.textContent = t("ui.play.failed");
          return;
        }
        drawOutcome(reply, dontKnow);
      }
      draw(
        el("p", { className: "task" }, room.view.text),
        el("label", { htmlFor: "play-answer" }, t("ui.play.answer")),
        field,
        note,
        el(
          "nav",
          { className: "actions" },
          button("ui.play.submit", "play-submit", () => submit(false)),
          button("ui.play.dontKnow", "play-dont-know", () => submit(true)),
          button("ui.play.leave", "play-leave", () => stop("leave")),
        ),
      );
      field.focus();
    }

    function drawOutcome(reply: AnswerOut, dontKnow: boolean): void {
      taskOpen = false;
      const badge = el(
        "p",
        { className: "badge" },
        t(badgeKey(reply, dontKnow)),
      );
      const solution = el(
        "ol",
        { className: "solution" },
        ...reply.shortSolution.map((line) => el("li", {}, line)),
      );
      draw(
        badge,
        el("p", { className: "battle" }, reply.battleLine),
        el("p", {}, t("ui.play.solution")),
        solution,
        el(
          "nav",
          { className: "actions" },
          button("ui.play.next", "play-next", advance),
          button("ui.play.leave", "play-leave", () => stop("leave")),
        ),
      );
      restartIdle();
    }

    void begin();
    return section;
  },
};
