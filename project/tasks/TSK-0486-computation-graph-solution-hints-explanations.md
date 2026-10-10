---
id: TSK-0486
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-1214, REQ-1234]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One computation graph gives the solution, the hints and the explanation of every trap

After this task, a template's `graph(p)` feeds `solution(p)`, `hints(p)` and `explain(p, trapId)`, each of them fills numbers only from the graph's values and the task's givens, and a build check calls `explain` for every trap id a template lists.

## Acceptance criteria

1. Given a template and a seed, when the solution, the three hints and an explanation are built, then every number in them is a graph value or a given, and a fixture that writes a number from neither fails the check (the rule behind ADR-0040's first realisation criterion). Closed by: a unit test and the check's fixture.
2. Given a template that lists a trap id with no `explain` entry, when the build check runs, then it fails and names the template and the trap (REQ-1214). Closed by: the check's fixture test.
3. Given a template that lists a trap, when a task is generated, then the trap's `apply()` computes its wrong answer in `Q` (REQ-1234). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/tasks/graph.ts` and the check in `tools/static-checks.ts`. The Russian strings of hints and explanations sit in the language file and are read through the typed function ADR-0160 defines; until its epic exists the keys follow the stand-in tasks' `standin.` keys.

## Depends on

- TSK-0481 (blocking): it carries the template contract the graph extends.

## Evidence

Not yet.

## Left alone

Detailed explanations a model writes from the graph, which ADR-0120 owns, and when a hint or the solution is released, which ADR-0080 owns.
