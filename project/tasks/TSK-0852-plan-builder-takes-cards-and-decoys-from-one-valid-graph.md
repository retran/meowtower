---
id: TSK-0852
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5614, REQ-5616, REQ-5618, REQ-5620, REQ-5622]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The plan builder takes the needed cards from one valid graph and the decoys from quantities outside every valid graph

After this task, a word problem template declares a quantity id for every node of every valid and structure-trap graph and for the givens its text states, and `src/templates/plan.ts` builds a plan of 3 to 5 cards with exactly one right set, which the distinctness test enforces.

## Acceptance criteria

1. Given 10,000 seeds of every word problem template, when the property test runs, then every plan has 3 to 5 cards, with 1 decoy on T2 and T4 and 1 or 2 on T3 (REQ-5614). Closed by: the property test's report.
2. Given the same seeds, when the needed cards are compared with the valid graphs, then they equal one valid graph's steps with the problem's question as the last card (REQ-5616). Closed by: the property test's report.
3. Given the same seeds, when each decoy's quantity id is compared, then no decoy is a computed node of any valid graph, and no two cards render to the same text (REQ-5618, REQ-5620). Closed by: the property test's report.
4. Given each decoy, when its kind is read, then it is `stated` for a given the text states, `trap` for a quantity only a structure-trap graph computes or `surplus` for the quantity only the surplus datum of a T4 problem computes (REQ-5622). Closed by: a unit test over each template.
5. Given a template without a quantity id, a stated quantity or an eligible decoy for its tier, when the build runs, then it fails with `plan_template_incomplete`, naming the template and quantity; given no candidate among the 1,000 and the fallbacks yields a plan, then the state is `plan_unavailable`. Closed by: a build test with two broken fixtures and a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the declarations to the template contract and the builder to `src/templates/plan.ts`, as ADR-0270 amends ADR-0040. One quantity keeps one id across graphs, so the total in 3 · 5 + 3 · 7 and in 3 · (5 + 7) is one id. Add the two plan rules to the generator's distinctness test. A T3 problem shows 1 or 2 decoys, picked by its seeded stream with equal odds when the template offers two eligible decoys.

The cards' wordings are the next task. Here a card is an id, a kind and a placeholder key.

## Depends on

The epic realising ADR-0040 supplies the template contract, the computation graph and the distinctness test this task extends; the tasks run on fixture templates until the real word problem templates exist.

## Evidence

Not yet.

## Left alone

Card wordings, which TSK-0853 writes, and grading, which TSK-0854 builds.
