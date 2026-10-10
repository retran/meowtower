---
id: TSK-0908
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5948, REQ-5950, REQ-5952, REQ-5954]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A track task takes a tap on one region, a choice of labels or a duration in minutes

After this task, the answer module has a `region` kind with credit 1 for the correct region and 0 for any other, a `source` template may ask for a choice of at least 4 labels, and a duration is typed as a whole number beside its unit.

## Acceptance criteria

1. Given every template, when the static check reads its answer kind, then each takes free input except the classes the contract lists for choice and the `source` class, which may also take a `choice` of at least 4 options or a `region`; a fixture source template with 3 options, or with a choice whose answer is a number, fails (REQ-5948). Closed by: the static check's test with both fixtures.
2. Given a source with 12 regions, when the client sends a tap, then it sends one index in reading order, the server maps it to its region and its trap, and a point of a line chart is never a region (REQ-5950). Closed by: a route test and a client test.
3. Given the correct region and its neighbour, when each is answered, then the first earns credit 1 and the second 0, with no partial credit (REQ-5952). Closed by: a checker test.
4. Given a region tapped and then another, when «Готово» is pressed, then the second is the submitted answer and the first tap submitted nothing (ADR-0300). Closed by: a Playwright test.
5. Given a task that asks for a duration in minutes and the answer `45` typed beside the label «мин», when it is checked, then it is correct, and no answer is marked wrong for a missing or misspelt unit (REQ-5954). Closed by: a checker test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `region` to `src/shared/answer.ts` and to `attempt_submitted` as a raw answer in a new payload version. A tap selects a region, a tap on another region moves the selection, and «Готово» submits, as a choice does, so a slipped finger doesn't cost the answer. A template asks for `choice` only where the answer is a label of the source, such as a stop, a fish kind or a direction, in a compare or combine question, because the keypad types numbers and times and has no way to type a label. A duration is an `integer` in minutes with the unit label fixed beside the field, which ADR-0150 draws.

## Depends on

Nothing. The epic realising ADR-0040 supplies the checker and its answer-kind table; this task adds a row. The epic realising ADR-0080 supplies `attempt_submitted`.

## Evidence

Not yet.

## Left alone

The traps a wrong region maps to, which TSK-0909 adds, and the component that sends the tap, which TSK-0910 builds.
