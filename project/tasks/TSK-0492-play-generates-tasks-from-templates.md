---
id: TSK-0492
artifact: task
status: draft
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

Not yet.

## Left alone

Which node, subtype and purpose a slot gets, which ADR-0070 owns; until its epic exists the routes keep the stand-in order.
