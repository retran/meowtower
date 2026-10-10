---
id: TSK-0700
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2804]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A character's other pictures follow the sheet a person chose, and a different choice queues them again

After this task, the assets of a character drawn from an unchosen sheet serve only as drafts and stay off the choice screen, and `tools/art-generate.ts requeue <character>` sets them back to `waiting` when the person chose a sheet variant other than the one they were drawn from.

## Acceptance criteria

1. Given a sheet with no chosen variant and best-scored variant V, when the character's other assets generate, then each uses V as its reference, records it in `sheet_reference` as unchosen, serves only as a draft, and isn't offered on the choice screen (REQ-2804). Closed by: an integration test.
2. Given the person chooses V, when the choice screen is read, then each dependent's `sheet_reference` reads chosen and the dependent is offered (REQ-2804). Closed by: an integration test.
3. Given the person chooses a variant W other than V, when `requeue` runs for the character, then every dependent job is `waiting` with each of its 4 slots at 0 generations, its old variants serve as drafts until new ones pass, and no dependent was `chosen` at that moment (REQ-2804). Closed by: an integration test that asserts the three states.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two states of `sheet_reference` to the queue and the choice screen's filter, and add the `requeue` subcommand. A re-run after a different sheet choice spends the dependents' generations again, which ADR-0170 names as the owner's cost, so the command prints the number of jobs it resets and starts no generation itself. The next `run` does that, inside its budget.

## Depends on

- TSK-0698 (blocking): it supplies the sheet-first rule and the `sheet_reference` column.
- TSK-0701 (blocking): the choice screen is where the person chooses a sheet variant and where a dependent is offered or held back.

## Evidence

Not yet.

## Left alone

The choice screen's layout and actions, which TSK-0701 builds, and the check that a different sheet changes the character's look in a way the family wants, which is the person's judgement.
