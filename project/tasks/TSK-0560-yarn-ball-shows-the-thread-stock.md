---
id: TSK-0560
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0546]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The game screen shows the guiding-thread stock as a ball of yarn with the current number

After this task, every packet carries the stock and the game screen draws it as a ball of yarn with its number, and the number matches the ledger after a grant, a spend, a leave and a resume.

## Acceptance criteria

1. Given a stock of 7, when the game screen is drawn, then it shows a ball of yarn with the number 7 (REQ-0546). Closed by: a Playwright test on the tablet viewport.
2. Given a grant, a spend and a pocket draw, when each packet arrives, then the number on the ball equals the ledger's stock after the event. Closed by: a Playwright test over the three events.
3. Given a leave and a resume on the same game day, when the screen is drawn, then the number is the ledger's stock and not a value the client kept. Closed by: a Playwright test.
4. Given the client's code, when it is searched, then it holds no rule that adds to or subtracts from the stock: it displays the number each packet carries. Closed by: a static check in the lint verb.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the ball and its number to the game screen in `src/client/screens.ts`, reading the stock from the packet's field that the routes already carry. The thread button's own count is drawn with the task window and appears once guiding threads have opened, a rule ADR-0330 sets.

## Depends on

- TSK-0555 (blocking): the ledger whose stock the packets carry.

## Evidence

Not yet.

## Left alone

The yarn ball's art, which the epic realising ADR-0170 builds, and the opening of guiding threads, which ADR-0330's epic decides.
