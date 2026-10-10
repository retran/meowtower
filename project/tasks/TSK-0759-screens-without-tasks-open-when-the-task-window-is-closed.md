---
id: TSK-0759
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5012, REQ-5014]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The seven screens without tasks open whenever the task window is closed, and a new puzzle appears only after the finale

After this task, the client offers the heroine's room, the Diary, the forge, the shop, the familiars, the puzzle branch «Петельки Смотрителя» (the Keeper's Loops) and «Свободное перо» (Free Pen) at any moment the task window is closed, during an adventure included, and the server writes `puzzle_offered` only after that game day's `adventure_completed`.

## Acceptance criteria

1. Given an adventure in progress and the task window closed, when the player reaches each of the seven screens, then each opens, the adventure is held at its current slot, and her way back puts her in the scene or task she left (REQ-5012). Closed by: a Playwright test that visits all seven.
2. Given a task shown and not yet reviewed, when the entries to the seven screens are looked for, then none is in the page, from the state `open` to `twin_review` of ADR-0080, and each is back once she taps to leave the review (REQ-5012). Closed by: a Playwright test.
3. Given a rest stop during an adventure, when she opens a puzzle she already has, then the rest stop ends, ADR-0090's 10-minute wait on «Привал» (Rest stop) starts, and the puzzle stays open (REQ-5012). Closed by: a Playwright test and a state-machine test.
4. Given a game day before its `adventure_completed`, when a `puzzle_offered` event is appended, then the server refuses it, and after `adventure_completed` it accepts one (REQ-5014). Closed by: an integration test on the append path with a fixture event.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the client's screen switch read one fact, whether the task window is open, and show the seven entries when it isn't. Opening one during an adventure holds the adventure at its slot, which the server's resume point already stores.

Opening a screen from a rest stop ends the rest stop, because the campfire scene ends by itself after 5 minutes and would otherwise close under an open puzzle. I chose this in ADR-0210, and the 10-minute wait on «Привал» starts then.

Add a guard to the append path: `puzzle_offered` is accepted only when the log holds `adventure_completed` for the same game day. ADR-0280 owns the event's schema; until its epic exists the guard is tested with a fixture type name registered in the test only, and the real schema joins the guard by its type name.

## Depends on

- TSK-0756 (blocking): the game-day index the guard compares.

The epic realising ADR-0280 supplies the puzzle screens and the event's schema, and the epic realising ADR-0330 supplies «Свободное перо»; this task runs with empty screens that open and close, and leaves their content to those epics.

## Evidence

Not yet.

## Left alone

What each screen holds, and how a puzzle is offered or drafted, which ADR-0280 and ADR-0330 own.
