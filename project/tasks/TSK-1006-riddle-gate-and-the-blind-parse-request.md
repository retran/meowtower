---
id: TSK-1006
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-5200, REQ-5256, REQ-5284, REQ-5290, REQ-6420]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A text riddle plays only when four conditions hold, a card riddle plays otherwise, and a parse request carries the fixed prompt and the masked text alone

After this task, the Director offers a riddle only on a floor with word problems and in text form only when the parse budget holds two worst-case parses, live calls are on, the composing flag is on and the free-text field is on; a card riddle plays when any fails, and the composing flag turns off with a changed parse model without stopping the server.

## Acceptance criteria

1. Given a floor with word problems and each of the four conditions failing in turn, when a riddle is offered, then it is a card riddle, and with all four holding it is a text riddle (REQ-6420). Closed by: a Director test over five cases.
2. Given a tier node below «Понимает», when a riddle is considered, then none is offered, and at or above it one is (REQ-5256). Closed by: a unit test over the node's states.
3. Given a parse request, when its body is read from the log of model calls, then it holds exactly the fixed parse prompt and the masked text, and the token list and schema version stay on the server (REQ-5200, REQ-5284). Closed by: acceptance test 3's body check over its fixture riddles.
4. Given `COMPOSE_FREE` on and no passing test 3 for the configured parse model, when the server starts, then text riddles are off, card riddles play, `./meowtower status` shows `compose_flag_off`, and the server starts (REQ-5290). Closed by: a start-up test.
5. Given a masker that returns `mask_incomplete`, when a riddle runs, then nothing is sent and it turns into a card riddle for the same target, and every riddle ends with one `compose_confirmed` whose `answer` may be `none` (ADR-0360 entries 46 and 51, no requirement of their own). Closed by: a riddle test over the failure and a log test of the closing event.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 46 to 51. The free-text field's list of opening points, REQ-5268, belongs to TSK-1009's proof and isn't changed here.

## Depends on

Nothing in this epic. The epic realising ADR-0230 supplies the riddles, the masker, the parse request and the flag; until it exists, the tests run on a fixture riddle with a stub parser, and the real parser's behaviour is left to that epic.

## Evidence

Not yet.

## Left alone

The masker and the parser themselves, and the riddle's Russian text, which ADR-0230 and ADR-0160 own.
