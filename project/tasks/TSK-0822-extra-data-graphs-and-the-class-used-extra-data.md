---
id: TSK-0822
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5430, REQ-5432]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A surplus template declares extra-data graphs, and an answer that uses the unused number is classed `used_extra_data`

After this task, every surplus template, T4 included, declares one to three extra-data graphs, the distinctness test rejects a candidate whose extra-data answer equals the correct answer or a trap's answer, and the checker classes a wrong number that equals an extra-data answer as `used_extra_data`.

## Acceptance criteria

1. Given a surplus template, when the build check reads it, then it declares between one and three extra-data graphs, each the valid graph with the unused number joined to or swapped into one step, and a template with none or four fails the build. Closed by: the template build check's fixtures.
2. Given 10,000 seeds of every surplus template, when the property test runs, then no candidate that survives has an extra-data answer equal to the correct answer or to any trap's answer (REQ-5432). Closed by: the property test's report.
3. Given a surplus problem, when the answer equals an extra-data graph's answer, then the verdict is `wrong`, credit 0, class `used_extra_data`, outcome `alt` (REQ-5430). Closed by: a checker fixture.
4. Given a wrong number that matches both a trap and an extra-data graph, or both an extra-data graph and a computational slip, when it is checked, then the class is the first that fits in the order trap, `used_extra_data`, `computational`, `unclassified`. Closed by: two checker fixtures.
5. Given the T1 to T3 surplus templates, when a T1, T2 and T3 template each builds a problem, then it has exactly one given that no valid graph uses and the subtype is `T1.surplus`, `T2.surplus` or `T3.surplus`; ordinary T4 declares its extra-data graphs and keeps no `T4.surplus` subtype. Closed by: a template test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the extra-data graph declaration to the template contract and a rule to the distinctness test, as ADR-0250 amends ADR-0040. Write at least one surplus template for each of T1, T2 and T3 on fixture nodes, and give the existing T4 templates their extra-data graphs. Add the class to the checker's ordered list.

ADR-0250 ships this increment second, after the button and unanswerable problems. This task is independent of the first increment's UI, so it can land first or last without a behaviour change for the player until the Director's draw (TSK-0826) names the surplus subtypes.

## Depends on

- TSK-0820 (blocking): the template extends the subtype names the graph holds.
- TSK-0821 (blocking): the class joins the verdict function that task extends, and the order of classes lives there.

The epic realising ADR-0040 supplies the template contract, the distinctness test and the generator; this task extends them.

## Evidence

Not yet.

## Left alone

The share of surplus problems the Director draws, which TSK-0826 sets, and the surplus templates for real nodes, which need the node table of the epic realising ADR-0050.
