---
id: REQ-7238
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7238

The Director MUST offer a construction riddle only when every node the construction needs is at "understands" or above: A3 for equal groups, A4 for the two meanings of division, F2 for a fraction of a number, D4 for decimals, P2 for a percentage of a number or P3 for a discount, P4 for a ratio, and A11 and the node of each operation it uses for a multi-step expression.

A node is at "understands" or above when its tested state is "understands", "fluent" or "stable", or when it holds an inferred "fluent", because ADR-0060's inference exists so a fluent descendant spares a prerequisite a new test. A construction has no problem type, so REQ-5256's tier node can't stand in for it. Default chosen by the requirements step, because RES-4260 names no node per operation: `+` and `−` need A2 within 100 and A5 above it, `·` needs A3 within the multiplication table and A6 above it, and `:` needs A4 within the table and A9 above it; these apply to whole-number operands, and an expression that holds a decimal, a fraction, a percentage or a ratio also needs that family's node, D4, F2, P2 or P3, or P4.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
Imposed by the owner's addendum 2 of 2026-09-28.
