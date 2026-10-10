---
id: TSK-1134
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7264, REQ-7270]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A family plays in text only after its own pass on the configured model and prompt, and the whole-number constructions after the 200 texts alone

After this task, a construction riddle plays in text form only when every family of its target has a recorded pass for the configured parse model and prompt, and a change of either returns every family to cards until a new run passes.

## Acceptance criteria

1. Given a record for the configured model and prompt hash that shows the 200 texts passing and the fraction subset agreeing on 48 of 50, when a fraction riddle is offered, then it can play in text form; given the subset at 47, then it plays as cards (REQ-7264). Closed by: a play-route test, two fixture records.
2. Given a start-up with a changed prompt hash or a changed `PARSE_MODEL`, when a riddle is offered for each family, then every family plays as cards until a new run passes on the new pair (REQ-7264). Closed by: a start-up test.
3. Given equal groups, the two meanings of division and a multi-step expression whose operands are all whole numbers, when the composing flag is on and the 200 texts passed, then each plays in text form with no subset of its own; given a multi-step expression that holds a decimal, a fraction, a percentage or a ratio, then it waits for that family's pass (REQ-7270). Closed by: a play-route test, four fixtures.
4. Given a family with no passing record on the configured pair, when the owner runs `./meowtower status`, then one line lists each family whose text form is off beside ADR-0230's `compose_flag_off` line, on every run while any family is off, and no notice is pushed. Closed by: the status command's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Read `verify/parser-eval.json` at the Director's offer and at the play route: a family's text form needs both the whole set's pass and its subset's pass on the configured model and prompt, as ADR-0230's flag needs the pass for the configured model. A failing record is what tells the Director that a family is off on the configured pair, so dropping the configured pair would lose the only record that counts, as ADR-0460 settles. A family that goes off plays as cards through TSK-1137. Add `compose_family_off` and `compose_family_test_failed` to the failure states.

## Depends on

- TSK-1136 (blocking): it reads that task's records.
- TSK-1137 (blocking): the family plays as cards until it passes.

The epic realising ADR-0230 supplies the composing flag and its start-up check.

## Evidence

Not yet.

## Left alone

The reversal on 5 of the last 30 labelled riddles of a family judged other than labelled, which the owner applies from the riddle list after the parent labels them, and the live run itself, which the owner starts.
