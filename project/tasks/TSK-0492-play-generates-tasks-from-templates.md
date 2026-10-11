---
id: TSK-0492
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-1200, REQ-0734, REQ-0736, REQ-0740]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The play routes generate each task from a template and a seed, and an unparsed entry stays unanswered

After this task, `GET /api/session/:id/next` builds each task with `generate` from the stand-in templates and logs the effective seed, the base seed and `k` in `item_shown`, and an entry the checker can't parse is returned to the player as `unparsed`, counts as no answer and neither resets nor pauses the clock.

## Acceptance criteria

1. Given a played day through the routes, when the log is read, then every `item_shown` carries a template id, a template version, a base seed, `k` and the effective seed, and rebuilding each task from them gives the same view (REQ-1200). Closed by: an integration test over 60 tasks.
2. Given an entry `3,,5` or one with a letter, when it is sent as an answer, then the reply is `unparsed`, no attempt is logged, and the task's time keeps running from its first display without a reset or a pause (REQ-0734, REQ-0736, REQ-0740). Closed by: an integration test that reads the event times.
3. Given the stand-in tasks of TSK-0300, when they are replaced, then every existing route test and Playwright test passes with the generated tasks. Closed by: the test verb's report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Replace the stand-in task table in `src/server/standin.ts` with generated tasks from the fixture templates, add the seed fields to `item_shown`'s next version with its upcast as ADR-0020's rule requires, and return `unparsed` from the answer route. The stand-in scene, chest and ending stay as they are.

## Depends on

- TSK-0481 (blocking): the routes call the generator.
- TSK-0482 (blocking): the checker parses the entry.
- TSK-0483 (blocking): the structured kinds are part of the module the route calls.
- TSK-0490 (blocking): the route sends only the strict view.
- TSK-0491 (blocking): the second attempt uses the parallel task.

## Evidence

Every criterion is checkable by a program; none rests on judgement.

Stand-in tasks come from fixture templates with their current numbers (the owner's choice of the simplest option until the LLM text route exists). The route generates each shown task and each twin through `generate` at a base seed, and stores the template id, the base seed, the effective seed and the candidate in `item_shown` version 2, with an upcast from version 1.

1. REQ-1200, `tests/unit/standin-generated.test.ts`: 60 generated stand-in tasks rebuild from their effective seeds with the same parameters and answers. This checks the rebuild on generated tasks, not on a played day's log.
2. REQ-0734, REQ-0736 and REQ-0740, `tests/integration/unparsed-answer.test.ts`: `3,,5` gets `422 unparsed_input`; the log holds only the `item_shown` for that task, with no verdict, no attempt and no pause; the correct answer then logs exactly one attempt. `standinVerdict` returns `unparsed` for `3,,5`, letters and an empty entry.
3. The test verb passes with the generated tasks: `tests/integration/packet-recorder.test.ts` now corrects its empty entries and counts the refusals, and every route and Playwright test passes.

Deviations from the task text: the second attempt uses the stand-in's twin template rather than `sampleParallel`, because the twin is a fixed second parameter set, not a draw. The packet recorder's expected counts changed to match the refused entries.

Stages at tree `9ab87fd0e087`, from `meow-checks evidence`:

- format: passed, record 3055c5740cd2
- lint: passed, record 1a4fc21b194d
- check: passed, record 1ad80e4193fe
- test: passed, record 7813c754a2de
- build: passed, record ea731ff9e03e

## Left alone

Which node, subtype and purpose a slot gets, which ADR-0070 owns; until its epic exists the routes keep the stand-in order.
