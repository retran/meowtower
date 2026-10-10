---
id: TSK-0551
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0410, REQ-0412, REQ-0536]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The short solution and every hint rung show only numbers the engine computed

After this task, the short solution lists the task's solution steps and the correct answer, and it and every hint rung take their numbers from the template's one solution graph, so no number the player reads is one a person or a model wrote.

## Acceptance criteria

1. Given a template and a seed, when the short solution is built, then it shows the task's solution steps and the correct answer (REQ-0410). Closed by: a template test over 1,000 seeds for each template.
2. Given the same template and seeds, when each number in the short solution is read, then it is a value the graph computed or a given (REQ-0412). Closed by: the same template test.
3. Given every rung `hints(p)` returns, when each number in it is read, then it is a value the graph computed or a given (REQ-0536). Closed by: the same template test over every rung.
4. Given a template whose rung text holds a number that is neither, such as one written in the template, when the test runs, then it fails naming the template and the rung. Closed by: a mutation test with one edited template.
5. Given the play routes, when a rung or a short solution is served, then no language model is called to build it. Closed by: an integration test with the model gateway stubbed to fail on any call.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Use `solution(p)` and `hints(p)` from the epic realising ADR-0040, which build both from the computation graph, and add the per-template test of ADR-0080's third criterion for numbers. The test reads each number in the text and checks it against the graph's values and givens; numbers' formatting comes from `formatQ`.

How long a ladder is, what rung 1 holds, the grouping of steps above three and the rule that no rung states the answer are REQ-5106 to REQ-5118 and REQ-6408 and REQ-6410, closed by the epics realising ADR-0220 and ADR-0360; this test reads whatever rungs those rules produce.

## Depends on

- TSK-0548 (not blocking): the flow decides when each text is served; the template test doesn't need it.
- The epic realising ADR-0040 supplies `solution(p)`, `hints(p)` and the graph, and its fixture templates until real ones exist.

## Evidence

Not yet.

## Left alone

The rung count, the framing lines beside a rung and the price of a rung, which ADR-0220's epic builds, and the explanations of traps, which the epic realising ADR-0120 builds.
