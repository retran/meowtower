---
id: TSK-0859
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5652]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After the answer, the knot's scheme shows her cards beside the engine's cards with no tick or cross

After this task, the `review` state of a problem that opened with a plan shows the knot's scheme in two columns, her cards in her order and the engine's cards in the graph's order, with a laid decoy drawn in the muted card style and no tick, cross or verdict word.

## Acceptance criteria

1. Given a plan problem answered after a plan with a decoy and a missing step, when the `review` state shows, then two columns show her cards in her order and the engine's cards in the graph's order. Closed by: a Playwright test.
2. Given the two columns, when their markup and text are read, then neither carries a tick, a cross or a verdict word, and the laid decoy is drawn in the muted style (REQ-0110). Closed by: a Playwright test that scans the columns.
3. Given a problem that opened with no plan, when `review` shows, then the scheme has one column as before. Closed by: a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the second column to the knot's scheme in ADR-0080's `review`, reading the laid sequence from `plan_submitted` and the engine's order from the same graph that `solution(p)` reads, so the scheme and the short solution show the same plan.

## Depends on

- TSK-0856 (blocking): the columns read `plan_submitted`.

The epic realising ADR-0150 supplies the scheme and the muted card style.

## Evidence

Not yet.

## Left alone

The report's plan cross, which TSK-0860 builds.
