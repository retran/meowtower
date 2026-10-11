---
id: TSK-0490
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-1218, REQ-1220, REQ-1222, REQ-1230]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The client gets only the view: no solution, no design, no meaning in the id, and pictures drawn from parameters

After this task, `ItemViewOut` and `InputSpec` are strict schemas, the task identifier is random, no client-bound packet carries a trap, a valid path, the correct answer or the short solution before the first attempt, and every mathematical picture is an SVG that `src/render` draws from the task's parameters with no id or class that names a node or a template.

## Acceptance criteria

1. Given 1,000 client-bound payloads across templates, when they are serialised, then none carries a node code, template id, seed, trap id, correct answer or solution before the first attempt (REQ-1220, REQ-1222). Closed by: the payload test, which builds on `tests/helpers/packets.ts`.
2. Given two tasks built from the same template and seed, when their identifiers are compared, then they differ and neither is derivable from the node, subtype, template, seed or parameters (REQ-1218). Closed by: a unit test.
3. Given a task with a picture, when the SVG is rendered, then it is computed from the parameters alone, it holds no `id` or `class` naming a node or a template, and a field outside the schema fails serialisation (REQ-1230). Closed by: a unit test and a strict-schema fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/render/` with the drawers for the pictures the stand-in and the first templates need, and the strict schemas next to the play routes' packets. The renderer strips `frameId` and `anchorId` from anything it draws.

## Depends on

- TSK-0481 (blocking): the view is built from the template contract.

## Evidence

Every criterion is checkable by a program; none rests on judgement.

Tests in `tests/unit/client-view.test.ts`, seven tests:

1. REQ-1220 and REQ-1222: 1,000 client views carry no field that `forbiddenFields` in `tests/helpers/packets.ts` names, no trap id, no `correctAnswer`, no seed, no template id and no short solution. The 1,000 views come from one fixture template across 1,000 sessions, not from several templates, because the real templates arrive with later epics.
2. REQ-1218: two tasks from one template and seed get different identifiers, each a 32-character hex string with no node or template name in it. The identifier is a keyed hash (hash-based message authentication code, HMAC) under the server's secret.
3. REQ-1230: a picture is drawn from its parameters and is the same SVG each time, with no `id` or `class` and no node name. A parameter outside the schema (`node`) is refused, and `stripIds` drops `frameId` and `anchorId`.

Stages at tree `a70514277639`, from `meow-checks evidence`:

- format: passed, record 52bc1dd420b8
- lint: passed, record 686310735501
- check: passed, record b0c626b5654e
- test: passed, record eca374408fdb
- build: passed, record 9d5542cae695

The test stage failed once on `scene-resume.spec.ts:308`, a timing test that passed on the re-run. The record cites the passing run.

## Left alone

Drawing the packets on the screen, which ADR-0150 owns, and the packet recorder over a played day, which TSK-0310 built.
