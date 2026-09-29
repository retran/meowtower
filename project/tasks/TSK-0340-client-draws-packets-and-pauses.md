---
id: TSK-0340
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-2402, REQ-2406, REQ-2408, REQ-2410, REQ-2430]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The client draws packets, checks only the input format, and pauses on background and idle

After this task, the client in both interfaces plays the stand-in adventure: it draws each packet, checks an answer only against its `InputSpec`, shows every outcome the same way, and sends the pause when the app goes to the background or the player is idle.

## Acceptance criteria

1. Given a `room` packet whose `InputSpec` asks for digits, when the player types a letter, then the client refuses the input; when she types a wrong number, the client sends it with `raw` and shows no verdict of its own (REQ-2402). Closed by: a Playwright test that records the request and the screen.
2. Given play in progress, when `visibilitychange` reports the page hidden, then the client sends the pause with `background` through `fetch` with `keepalive` (REQ-2406). Closed by: a Playwright test that hides the page and reads the log.
3. Given no input, when 90 seconds pass outside the task window, then the client sends the pause with `idle` (REQ-2408); when 5 minutes pass with a task open, it sends the same, and not at 90 seconds (REQ-2410). Closed by: a Playwright test with a fake clock.
4. Given the stand-in adventure, which marks some tasks scored and some not on the server only, when the parent plays them side by side in both interfaces, then the parent can't tell them apart (REQ-2430). Closed by: the parent's signed-off judgement, beside a Playwright check that the rendered markup of a scored and an unscored task differs only in the task's text.

## What to do

Add the stand-in play screen to the client shell of TSK-0100: it draws `room`, `scene`, `chest`, `break`, `stop_offer` and `end` packets, the answer input built from `InputSpec`, «Не знаю», and «Сохранить и уйти». The client imports only `src/shared/`, keeps every string in the `ru` language file, and maps `outcome`, `critical` and its own `dontKnow` to the badge; it never compares an answer. Add the background and idle triggers as SPC-0030 states them.

These screens stand in for ADR-0150's; its epic replaces them. ADR-0190's definition of done applies.

## Depends on

TSK-0310, because it draws the final packet shapes. TSK-0330, because the triggers call its pause route. TSK-0100, because the play screen lives in the client shell.

## Evidence

Collected on 2026-09-29 on the Mac. Every criterion holds; criterion 4's judgement is the parent's, given on 2026-09-29.

- Verbs: `meow-verbs run format lint check test build` exited 0 at tree `1563d2d70306`: 40 test files and 358 Vitest tests passed, 23 Playwright tests passed in the `ipad` and `computer` projects, and the build made both images. `meow-verbs evidence --keep` kept the records: format `9fe8044303e5`, lint `30280092ac6c`, check `e590fe192abb`, test `6407b25a6362`, build `f9398e0c8b83`, under `project/evidence/`. The keyboard test now walks 7 routes and 16 controls, `/play` included.
- Seen failing: the tests were written after the screen, so each was shown to catch its requirement by breaking one mechanism, running the test on the `computer` project and restoring the code:
  - with the format check accepting any text, REQ-2402 failed on `Expected: "" Received: "a"`;
  - with `keepalive: false`, and again with the `visibilitychange` handler doing nothing, REQ-2406 failed;
  - with 90 seconds inside a task, and again with 5 minutes outside one, the idle test failed;
  - with a class given only to the warm-up task's text, REQ-2430 failed on the two tasks' markup.
- Criterion 1, REQ-2402: `tests/e2e/play.spec.ts` pairs a device and opens `/play`. The digits-only field refuses a typed `a` and takes `99`. The answer request carries `raw: "99"` and `dontKnow: false`. While the test holds the server's reply, the screen shows no badge and none of the badge words. Once the reply is released, the badge shows the word for the server's `outcome`.
- Criterion 2, REQ-2406: with `document.visibilityState` reporting `hidden`, the client sends one `POST /api/session/:id/pause` with `reason: "background"` through `fetch` with `keepalive: true`, and the session's log holds `adventure_paused` `{reason: "background"}`.
- Criterion 3, REQ-2408 and REQ-2410: on Playwright's fake clock, with a task open, nothing is sent at 91 seconds or at 4:59. At 5:01 the client sends the pause with `idle`, and the log holds `adventure_paused` `{reason: "idle"}`. After «Продолжить» starts a new session and an answer closes the task, nothing is sent at 89 seconds, and the pause with `idle` goes at 91.
- Criterion 4, REQ-2430, Playwright half: the stand-in marks task 2 as the unscored warm-up in `item_shown`'s `purpose`, which only the log holds (`standinPurpose` in `src/server/standin.ts`). The test plays until it has met a scored and a warm-up task, reading each one's purpose from the log by `itemId`, and answers both with `0`. The room's markup and the outcome's markup are identical once the text content of the task's text, the battle line and the solution's lines is blanked. Blanking sets only their text content, so their tags, classes and attributes are still compared.
- Criterion 4, the parent's half: on 2026-09-29 the parent played `/play` on the iPad and on the computer, as asked, without looking up which task was the warm-up, and reported «works» and then «can't tell them apart», which stands as the sign-off. The owner added the same day that a side-by-side check like this one may run as a Playwright test, which the markup comparison above already is. The log's `item_shown` names each task's purpose afterwards.
- Also: `playwright.config.ts` now keeps the e2e snapshots in `/tmp/meowtower-e2e-data/snapshots`. The storage notice counts the snapshots folder's parent, which had been `/tmp` itself. Its synchronous walk blocked the server after the first session end any e2e test caused, and these are the first tests that end one.

Choices this task made, where the task or SPC-0030 left a gap:

- The screen draws `room` and `end`, the two packets `src/shared/api.ts` defines today. `scene`, `chest`, `break` and `stop_offer` have no schema yet, so the client can't draw them until TSK-0370, TSK-0410 and the epic realising ADR-0090 add them.
- The badge maps `clean` to «Чисто!», `partial` to «Почти!», `alt` to «Другая тропа», and `alt` after «Не знаю» to «Принято», SPC-0150's word for it. `AnswerOut` carries no `critical` yet, so the `crit` view waits for it.
- The task window is open from the moment a room is drawn until the answer's reply arrives, because the player is still inside the task until she sees its outcome. An answer sent with no reply yet therefore keeps the 5-minute limit; TSK-0380's queue, which can hold an answer offline, inherits this rule. Any key press, pointer press or input restarts the idle limit, because each shows the player is at the screen, which is what REQ-2408 and REQ-2410 measure.
- `clientSeq` starts from the clock at page load and counts up, so a reload never repeats a value the server has seen.

### Open review findings

An agent reviewed this record after the work. These findings stay open or were rejected, each with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- What to do asks for `scene`, `chest`, `break` and `stop_offer` to be drawn and for `critical` to reach the badge, and Depends on says TSK-0310 drew the final packet shapes. The Choices above record that neither exists yet: the four packets belong in Left alone, with TSK-0370, TSK-0410 and the epic realising ADR-0090, which add them. Not changed: What to do, Depends on and Left alone are frozen. The missing packets don't hold the task open, because no criterion names them.
- Criterion 4 says the markup "differs only in the task's text", and the check also blanks the battle line and the solution, which come from the task too. The evidence now says only their text content is blanked. Not changed: the criterion is frozen.
- Rejected: that the storage notice's synchronous walk of `data/` is a defect to record. In production `data/` holds tens to a few hundred files, and the walk takes milliseconds after a session ends. The block came from the e2e setup, which pointed the data root at `/tmp`. The test verb caught it, and this change fixed it, so under I15 it needs no defect record.

## Left alone

The view-only screen (TSK-0350), the queue and the offline state (TSK-0380), and the real screens, which ADR-0150 defines.
