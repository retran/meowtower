---
id: TSK-1190
artifact: task
status: done
revised: 2026-10-24
realises: ADR-0470
closes: [REQ-0800, REQ-0808]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The validator refuses a graph whose node has a typical group below a prerequisite's

After this task, `./meowtower graph check` and the server's start-up refuse a graph in which a node's `typicalGroup` is below the `typicalGroup` of a prerequisite it names (ADR-0470). The work was done in EPC-0050's pull request and is recorded here so the decision has a task that realises it.

## Acceptance criteria

1. Given N2 in group 2 with its prerequisite N1 in group 3, when the graph is validated, then it is refused and the message names N2. Closed by: `tests/unit/graph-group-order.test.ts`.
2. Given a node in the same group as its prerequisite, when the graph is validated, then it is accepted. Closed by: `tests/unit/graph-group-order.test.ts`.
3. Given `content/graph.yaml`, when it is validated, then every prerequisite link is in order. Closed by: `tests/unit/graph-group-order.test.ts`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the check after the cycle check in `src/engine/graph.ts` and state it as rule 8 of the validator in SPC-0050.

## Depends on

Nothing.

## Evidence

Closed by the tests in tests/unit/graph-group-order.test.ts, and by the stages of the repository run on the branch that merged it.

## Left alone

Whether a group value is right, which the parent reviews against the school's programme.
