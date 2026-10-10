---
id: TSK-0605
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1550, REQ-1552, REQ-1556, REQ-1558, REQ-1838, REQ-1632]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A pool line enters play only after the parent approves it, a flagged scene teaches later orders, and every dialogue is saved

After this task, a pool line shows only after a `line_approved` event, no line shows twice in a session or again before its category's cycle is done, the parent can flag a scene and later orders carry it as an example of what not to write, every scene, choice and free text is an event the book reads, and the free-text field shows its note.

## Acceptance criteria

1. Given a candidate line, when it is drawn before approval, then it never shows; given `./tower lines approve` or the Parent Room's approval, then a `line_approved` event is logged and the line enters the pool (REQ-1550). Closed by: an integration test over both routes.
2. Given a category of 10 lines and a session of 25 draws, when the draws are read, then no line repeats before all 10 have shown, and none shows twice in the session (REQ-1552). Closed by: a unit test.
3. Given a Master scene flagged as a failure, when the next orders are built, then each carries that scene in the cached «как не надо» block, and 31 flags are all carried and reported once to the owner (REQ-1556, REQ-1558). Closed by: a unit test with 31 flags.
4. Given a played adventure, when the events are read, then every scene, choice and free text is an event, and the dialogue book's read route returns the whole story in order (REQ-1838). Closed by: an integration test.
5. Given the free-text field, when it is shown, then it carries «Эту историю могут читать мама и папа» (REQ-1632). Closed by: a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the approval gate, the shuffled cycle per category, the flag route and the «как не надо» block, with the 100-pending limit that stops `GEN_MODEL` and the 30-day expiry of a candidate, both chosen in ADR-0110. The reaction category of ADR-0320 follows the same cycle. A review queue of 5 Master scenes a week, drawn by the week's seed, is ADR-0330's.

## Depends on

- TSK-0599 (blocking): a line passes the check module at approval.

The epic realising ADR-0180 draws the book, the flag button and the approvals; until then the events exist and the owner approves with `./tower lines approve`.

## Evidence

Not yet.

## Left alone

The book's screen and the parent's reading of it, which ADR-0180's epic owns.
