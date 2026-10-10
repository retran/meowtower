---
id: TSK-0779
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5114, REQ-5116, REQ-5162]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A fluent mental-arithmetic fact offers no ladder before the answer, and its strategy shows after the answer at no charge

After this task, the server fixes `hintMaxLevel` when it shows a task, stores it with the item, sets it to 0 for a basic fact placed as mental arithmetic whose fluency threshold on the showing device is 10 seconds or less, and puts the strategy line in the short solution at no thread.

## Acceptance criteria

1. Given a fluent mental-arithmetic basic fact, when it is shown, then `hintMaxLevel` is 0, the thread button is visible and inactive before the answer, and a forced hint request gets `400 hint_level_beyond_ladder` with nothing shown or charged (REQ-5114). Closed by: a state-machine test and an integration test.
2. Given the same fact answered right or wrong, when the short solution shows, then it carries the strategy line, whether the window shows it at once after a miss or offers it after a right answer, and no thread is spent (REQ-5116, REQ-5162). Closed by: an integration test over both outcomes and a ledger test.
3. Given a task shown on one device and resumed on another with a different fluency threshold, when it is resumed, then `hintMaxLevel` is the value stored at show time (REQ-5114). Closed by: a cross-device resume test.
4. Given a basic fact that isn't mental arithmetic, or whose threshold is above 10 seconds, when it is shown, then `hintMaxLevel` equals the length of `hints(p)` (REQ-5114). Closed by: the integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Compute `hintMaxLevel` when the server shows the task and store it in the `items` row, then read it from there on every later request. I chose the showing device's threshold in the active threshold version, because it is the threshold the attempt is measured against, and fixing the length at show time keeps a cross-device resume from changing it.

With `hintMaxLevel` 0 the thread button stays visible and inactive before the answer, as ADR-0080 already draws an attempt with nothing left to buy. Add the error `400 hint_level_beyond_ladder` to the route table of SPC-0030. Add the strategy line to the short solution of a fluent fact; the line is a template string with engine numbers, which is why it costs nothing, like the free short solution it comes with.

## Depends on

- TSK-0778 (blocking): the strategy rung whose text the short solution carries.
- TSK-0773 (blocking): the ladder's price and charge key, which this task leaves unchanged for a task with a ladder.

## Evidence

Not yet.

## Left alone

Which templates are mental arithmetic and each fact's threshold, which ADR-0060 and ADR-0290 own.
