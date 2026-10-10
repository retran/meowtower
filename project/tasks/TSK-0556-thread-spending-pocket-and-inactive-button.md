---
id: TSK-0556
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0514, REQ-0516, REQ-0528, REQ-0544, REQ-0550, REQ-0552]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An explanation costs 1 thread, the short solution nothing, and an empty stock gets one pocket thread in each room

After this task, the detailed explanation costs exactly 1 thread on any task, once per attempt, the short solution is free, a press with a stock of 0 draws 1 thread from the backpack pocket once in each room, and the thread button then stays visible and inactive with no words about running out.

## Acceptance criteria

1. Given a stock of 3, when the player buys the explanation on a first attempt and again on the second attempt, then each costs exactly 1 thread and a second purchase on the same attempt costs nothing and is refused (REQ-0528). Closed by: an integration test.
2. Given a short solution after any outcome, when it shows, then the stock is unchanged (REQ-0544). Closed by: an integration test.
3. Given a stock of 0 and a pocket that hasn't given a thread in this room, when the player presses the thread button for a ladder opening or an explanation, then the server logs `pocket_thread_given` with 1 thread and spends it on the action pressed (REQ-0514). Closed by: an integration test.
4. Given the same room and a second press with a stock of 0, when it arrives, then the server answers `409 no_threads`, charges and reveals nothing, and the button turns inactive (REQ-0550). Closed by: an integration test.
5. Given tasks outside any room, the warm-up, mental arithmetic and the Guardian, when the pocket is asked, then they share one pocket for the floor. Closed by: an integration test over a floor.
6. Given a stock of 0 and the pocket used, when the window is read, then the thread button is visible and inactive at `disabled-alpha` with no change of text, and no string the game shows speaks of running out of threads (REQ-0550, REQ-0552). Closed by: a Playwright test on the tablet viewport and a search of the language file against ADR-0160's forbidden-word list.
7. Given CAN-0030, when it is read, then it states that the pocket gives at most one guiding thread in each room and only when the player reaches for a thread with none left (REQ-0516). Closed by: judgement of a reader of the canon, because whether the wording says that is a reading; the file already holds the rule and any change to the rule must change it in the same commit.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the explanation's charge and the pocket to the explain and hint routes through TSK-0555's ledger, with the charge key SPC-0030 states so a repeat never charges twice. Tasks outside any room share one pocket per floor, which I take from ADR-0080's choice: REQ-0514 names only rooms and these tasks need the same net.

The price of a ladder opening and its later rungs is ADR-0220's REQ-5100 and REQ-5102; this task builds the explanation's price and the pocket they all use. When the explanation model fails or passes 10 seconds the template explanation arrives and the thread is spent once, which ADR-0120's epic builds.

## Depends on

- TSK-0555 (blocking): the ledger and the `pocket_thread_given` event.
- TSK-0548 (blocking): the flow whose attempt the explanation is sold in.

## Evidence

Not yet.

## Left alone

The explanation's text and model, which ADR-0120's epic builds, the button's look, which ADR-0150's epic builds, and the first-contact rule that keeps the button undrawn until guiding threads open, which ADR-0330's epic adds.
