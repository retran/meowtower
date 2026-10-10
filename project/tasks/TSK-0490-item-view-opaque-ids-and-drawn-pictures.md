---
id: TSK-0490
artifact: task
status: approved
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

Not yet.

## Left alone

Drawing the packets on the screen, which ADR-0150 owns, and the packet recorder over a played day, which TSK-0310 built.
