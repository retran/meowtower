---
id: TSK-0574
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0342, REQ-0344]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The «Привал» button is always on screen and stays inactive for 10 minutes after a rest stop ends

After this task, the «Привал» button shows throughout play, a tap starts a campfire scene with the familiars that ends at her tap or by itself after 5 minutes, and the button stays inactive for 10 minutes of wall-clock time after the scene ends, with no countdown.

## Acceptance criteria

1. Given every player screen during play, when it is walked, then the button is present on each (REQ-0342). Closed by: a Playwright test on the tablet and desktop viewports.
2. Given a tap, when the rest stop runs, then `rest_stop_started` is logged, a tap at any moment ends it, and after 5 minutes it ends by itself, each with `rest_stop_ended` and its reason `tap` or `timeout`. Closed by: an integration test with a fake clock.
3. Given a rest stop that ended 9 minutes 59 seconds ago, when `next` is read, then the packet says the button is inactive; given 10 minutes, then it is active; the button shows no countdown and no number (REQ-0344). Closed by: an integration test with a fake clock and a Playwright test of the inactive button.
4. Given she leaves the game for an hour after a rest stop, when she returns, then the button is active, because the wait counts wall-clock time. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the button to the client's shell, `rest_stop_started` and `rest_stop_ended` in the play routes, and the flag `restStopActive` in each `next` packet, computed from the server's clock and never sent as a time. A rest stop leaves play running, so the day's active time of TSK-0564 counts it and the eye count doesn't. An offered rest stop she declines starts no wait. The campfire scene's content is 2 to 5 minutes of library lines.

## Depends on

Nothing in this epic. The tap's end reasons `puzzle_opened` and `screen_opened` belong to the epics realising ADR-0280 and ADR-0210.

## Evidence

Not yet.

## Left alone

The offer after three «Не знаю», which TSK-0575 builds, and the fatigue signal's offer, which the epic realising ADR-0070 builds.
