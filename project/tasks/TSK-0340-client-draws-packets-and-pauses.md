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

Not yet.

## Left alone

The view-only screen (TSK-0350), the queue and the offline state (TSK-0380), and the real screens, which ADR-0150 defines.
