---
id: TSK-0711
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-2374, REQ-0834, REQ-0838]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The graph map rings every frontier node, and word problems are counted by type and steps with modelling errors apart

After this task, the graph map draws every node with its state label, hatches an inferred state and rings each frontier node, and under the word-problem domain it shows a matrix of problem type by number of steps that counts modelling errors apart from calculation errors.

## Acceptance criteria

1. Given a fixture graph, when the map is drawn, then it holds one entry for every node, a hatched fill on each inferred state and a ring on each frontier node and on no other (REQ-2374). Closed by: a Playwright test that counts entries, hatches and rings.
2. Given unassisted first attempts on T1 to T4 problems, when the matrix is built, then they are counted by the classical problem type each template declares and by the number of steps; given an unanswerable problem, then it stays out, and given a surplus problem, then it stays in (REQ-0834). Closed by: a unit test.
3. Given an attempt with a wrong model choice, when the matrix is built, then it counts as a modelling error; given a wrong answer after a right model, then it counts as a calculation error; given a right model followed by «Не знаю», then it counts in neither (REQ-0838). Closed by: a unit test with the three cases.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the graph map's report part and the matrix. Every figure reads only the base graph layer. The classical problem types come from RES-0800 through the template's declaration, which the epic realising ADR-0040 supplies with the number of steps. The node's state label comes from RES-0900, and the frontier is the set ADR-0060 computes.

The map draws every node of the graph and the screen has no switch that hides one, so a Playwright test counts them against the graph.

## Depends on

- TSK-0708 (blocking): the part joins the report model and its cache.

## Evidence

Not yet.

## Left alone

The four separate counts and the planning-error count beside the matrix, which later decisions add, and the state names themselves, which ADR-0060 owns.
