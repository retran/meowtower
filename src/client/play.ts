// The stand-in play screen (TSK-0340, SPC-0030): it draws each packet the
// server sends, checks an answer only against its InputSpec (REQ-2402), shows
// every task and outcome the same way whether the server scores it or not
// (REQ-2430), and pauses the adventure on background (REQ-2406) and on idle
// (REQ-2408, REQ-2410). ADR-0150's epic replaces the screen.
import type {
  AnswerIn,
  AnswerOut,
  Chest,
  Grant,
  Room,
  Scene,
  StopOffer,
} from "../shared/api.js";
import {
  answer,
  deliverRewards,
  extend,
  heartbeat,
  MOVED,
  nextPacket,
  pause,
  pickChest,
  resumeAdventure,
  sceneInput,
  startSession,
} from "./api.js";
import { act, button, el, heading, link, status } from "./controls.js";
import type { Screen } from "./screens.js";
import { t } from "./strings.js";

/** No input for this long outside the task window pauses the adventure (REQ-2408). */
export const IDLE_OUTSIDE_TASK_MS = 90 * 1000;
/** With a task open the limit is longer, because long thought is normal (REQ-2410). */
export const IDLE_IN_TASK_MS = 5 * 60 * 1000;

/** The holder tells the server it is alive this often; 45 seconds without one ends the lease. */
export const HEARTBEAT_MS = 15 * 1000;

/** A typed draft goes to the server at most this often (SPC-0030). */
export const DRAFT_EVERY_MS = 10 * 1000;

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
    let beat: ReturnType<typeof setInterval> | undefined;
    let events: EventSource | undefined;

    const detach = (): void => {
      clearTimeout(idle);
      clearInterval(beat);
      events?.close();
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

    /** Another device holds the adventure: nothing here can play or answer any more (REQ-0222). */
    function viewOnly(): void {
      sessionId = null;
      taskOpen = false;
      clearTimeout(idle);
      clearInterval(beat);
      events?.close();
      if (gone()) return;
      draw(
        status(t("ui.play.leaseMoved")),
        el(
          "nav",
          { className: "actions" },
          button("ui.play.continueHere", "play-continue-here", begin),
          link("ui.nav.back", "back", "/"),
        ),
      );
    }

    /** Keeps the lease with a heartbeat and hears when it moves. */
    function hold(id: string): void {
      clearInterval(beat);
      events?.close();
      beat = setInterval(() => {
        void heartbeat(id).then((state) => {
          if (state === MOVED && sessionId === id) viewOnly();
        });
      }, HEARTBEAT_MS);
      events = new EventSource(`/api/session/${encodeURIComponent(id)}/events`);
      events.addEventListener("lease_moved", () => {
        if (sessionId === id) viewOnly();
      });
    }

    async function stop(reason: Reason): Promise<void> {
      if (!sessionId) return;
      const id = sessionId;
      sessionId = null;
      clearTimeout(idle);
      clearInterval(beat);
      events?.close();
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
      // An open adventure resumes, which also brings the grants no device has
      // shown yet (REQ-0204); with none open a session starts one.
      const resumed = await resumeAdventure();
      sessionId = resumed?.sessionId ?? (await startSession());
      if (!sessionId) return refused("ui.play.refused");
      hold(sessionId);
      if (resumed?.rewards.length) return showGrants(resumed.rewards);
      await advance();
    }

    async function advance(): Promise<void> {
      if (!sessionId) return;
      section.dataset["busy"] = "1";
      const packet = await nextPacket(sessionId);
      if (gone()) return;
      if (packet === MOVED) return viewOnly();
      if (!packet) return refused("ui.play.failed");
      if (packet.kind === "room") drawRoom(packet);
      else if (packet.kind === "scene") drawScene(packet);
      else if (packet.kind === "chest") drawChest(packet);
      else if (packet.kind === "stop_offer") drawStop(packet);
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
        if (reply === MOVED) return viewOnly();
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

    /** Shows the grants, tells the server they were shown, then goes on. */
    function showGrants(grants: Grant[]): void {
      taskOpen = false;
      if (sessionId)
        void deliverRewards(
          sessionId,
          grants.map((g) => g.rewardId),
        );
      draw(
        el("p", {}, t("ui.reward.title")),
        el(
          "ul",
          { className: "grants" },
          ...grants.map((g) =>
            el("li", {}, `${t(`ui.reward.${g.kind}`)} × ${g.amount}`),
          ),
        ),
        el(
          "nav",
          { className: "actions" },
          button("ui.play.next", "play-next", advance),
          button("ui.play.leave", "play-leave", () => stop("leave")),
        ),
      );
      restartIdle();
    }

    function drawScene(scene: Scene): void {
      taskOpen = false;
      const note = status();
      const field = el("textarea", {
        id: "scene-draft",
        rows: 3,
        maxLength: 500,
        value: scene.draft ?? "",
      });
      field.dataset["action"] = "scene-draft";
      // The draft goes out at once when none went in the last 10 seconds and
      // otherwise once the 10 seconds are up, so the last text isn't lost.
      let sentAt = -Infinity;
      let sentText = field.value;
      let waiting: ReturnType<typeof setTimeout> | undefined;
      const sendDraft = (): void => {
        waiting = undefined;
        if (!sessionId || field.value === sentText) return;
        sentAt = Date.now();
        sentText = field.value;
        void sceneInput(sessionId, {
          kind: "draft",
          sceneId: scene.sceneId,
          text: field.value,
        }).then((reply) => {
          if (reply === MOVED && !gone()) viewOnly();
        });
      };
      field.addEventListener("input", () => {
        act("scene-draft");
        if (waiting !== undefined) return;
        const due = sentAt + DRAFT_EVERY_MS - Date.now();
        if (due <= 0) sendDraft();
        else waiting = setTimeout(sendDraft, due);
      });
      async function done(
        input:
          | { kind: "choice"; sceneId: string; choiceId: string }
          | { kind: "text"; sceneId: string; text: string },
      ): Promise<void> {
        if (!sessionId) return;
        clearTimeout(waiting);
        const reply = await sceneInput(sessionId, input);
        if (gone()) return;
        if (reply === MOVED) return viewOnly();
        if (!reply) {
          note.textContent = t("ui.play.failed");
          return;
        }
        if (reply.grants.length) showGrants(reply.grants);
        else await advance();
      }
      const lines = el(
        "div",
        { className: "scene" },
        ...scene.lines.map((line) => {
          const p = el("p", { className: "scene-line" });
          p.append(
            el("strong", {}, `${t(`ui.speaker.${line.speaker}`)}: `),
            line.text,
          );
          return p;
        }),
      );
      const choices = scene.branches.map((branch) => {
        const b = el("button", { type: "button", className: "control" });
        b.textContent = branch.text;
        b.dataset["action"] = `scene-choice-${branch.choiceId}`;
        b.dataset["choiceId"] = branch.choiceId;
        b.addEventListener("click", () => {
          act(`scene-choice-${branch.choiceId}`);
          void done({
            kind: "choice",
            sceneId: scene.sceneId,
            choiceId: branch.choiceId,
          });
        });
        return b;
      });
      draw(
        lines,
        el("nav", { className: "actions" }, ...choices),
        el("label", { htmlFor: "scene-draft" }, t("ui.scene.draft")),
        field,
        note,
        el(
          "nav",
          { className: "actions" },
          button("ui.scene.send", "scene-send", () => {
            const text = field.value.trim();
            if (text)
              return done({ kind: "text", sceneId: scene.sceneId, text });
          }),
          button("ui.play.leave", "play-leave", () => stop("leave")),
        ),
      );
      restartIdle();
    }

    /** The day's play is over for now; the extra row only where the server allows it. */
    function drawStop(offer: StopOffer): void {
      taskOpen = false;
      const note = status();
      const actions: Node[] = [];
      if (offer.canExtend)
        actions.push(
          button("ui.stop.extend", "stop-extend", async () => {
            if (!sessionId) return;
            const reply = await extend(sessionId);
            if (gone()) return;
            if (reply === MOVED) return viewOnly();
            if (reply === "ok") return advance();
            // The day was finished meanwhile: the offer stays, without the row.
            if (reply === "day_finished")
              return drawStop({ kind: "stop_offer", canExtend: false });
            note.textContent = t("ui.play.failed");
          }),
        );
      actions.push(button("ui.play.leave", "stop-leave", () => stop("leave")));
      draw(
        el("div", { className: "stop" }, el("p", {}, t("ui.stop.title"))),
        note,
        el("nav", { className: "actions" }, ...actions),
      );
      restartIdle();
    }

    function drawChest(chest: Chest): void {
      taskOpen = false;
      const note = status();
      const options = chest.options.map((option) => {
        const b = el("button", { type: "button", className: "control" });
        b.textContent = t(`ui.reward.${option.kind}`);
        b.dataset["action"] = "chest-pick";
        b.dataset["rewardId"] = option.rewardId;
        b.addEventListener("click", () => {
          act("chest-pick");
          void (async () => {
            if (!sessionId) return;
            const reply = await pickChest(
              sessionId,
              chest.chestId,
              option.rewardId,
            );
            if (gone()) return;
            if (reply === MOVED) return viewOnly();
            if (!reply) {
              note.textContent = t("ui.play.failed");
              return;
            }
            showGrants(reply.grants);
          })();
        });
        return b;
      });
      draw(
        el("p", {}, t("ui.chest.title")),
        el("nav", { className: "actions" }, ...options),
        note,
        el(
          "nav",
          { className: "actions" },
          button("ui.play.leave", "play-leave", () => stop("leave")),
        ),
      );
      restartIdle();
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
