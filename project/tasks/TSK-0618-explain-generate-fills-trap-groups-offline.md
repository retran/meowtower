---
id: TSK-0618
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0630]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `npm run explain:generate` fills trap groups with checked variants outside any session

After this task, the command runs checks 1 to 7 on variants for every group that has a trap, with numbers from the template's own sample seeds, stops at 3 visible variants a group, and the game then shows those variants.

## Acceptance criteria

1. Given no session open and groups with traps, when the command runs against a mocked model, then each group holds 3 visible variants that passed every check, and the run stops there (REQ-0630). Closed by: an integration test.
2. Given a group without a trap, when the command runs, then it skips the group, because the request would need her answer (REQ-0630). Closed by: a unit test.
3. Given the variants the command stored, when a session spends a thread on a task of one of those groups, then the game shows a stored variant with no model call for a new one. Closed by: an integration test over the request log.
4. Given the day's explanation budget and the 20 generations a day, when the command runs, then it spends from the offline key's budget and leaves the play key's daily counts as they were. Closed by: a unit test over the gateway's buckets.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the script under `tools/` that reuses the pipeline of TSK-0615 with the engine's value for each trap as the `{given}` value, because for a trap group the engine computes the value she would have given. Write each stored variant with status `visible`.

## Depends on

- TSK-0616 (blocking): it fills the cache that task builds.

The epic realising ADR-0040 supplies the sample seed of every trap; until it exists the command runs on the fixture templates.

## Evidence

Not yet.

## Left alone

A group without a trap, which has no stored variant before she first meets it, because offline generation can't fill it.
