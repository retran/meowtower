---
id: TSK-0810
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5336]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The `inverseCheck` flag passes the build only on a bare expression of one operation between two printed numbers

After this task, a template offers the inverse check only when its catalogue row has `inverseCheck: true`, and the build fails the flag on a word problem, on an expression with a longer chain, on a division with a remainder, on a multiplication that can draw a zero operand and on a basic fact.

## Acceptance criteria

1. Given `inverseCheck: true` on a T template, one-step ones included, when the build runs, then it fails and names the template (REQ-5336). Closed by: a build check with a fixture row.
2. Given the flag on a task such as 3 · 5 + 7, whose final operation has an operand the task doesn't print, when the build runs, then it fails (REQ-5336). Closed by: the build check with a fixture.
3. Given the flag on a division with a remainder, on a multiplication whose generator can draw a zero operand and on a template with `kind: "basic_fact"`, when the build runs, then each fails (REQ-5336). Closed by: the build check with three fixtures.
4. Given a bare `a + b`, `a - b`, `a · b` or `a : b` with an integer or decimal answer, when the build runs, then the flag passes (REQ-5336). Closed by: the build check with four fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `inverseCheck` to the catalogue's rows and the build checks that allow it only on a bare expression of one operation, +, -, · or :, between two numbers printed in the task, with an integer or decimal answer. The excluded cases and the reason for each, which I take from ADR-0240: a word problem, because the check's prompt names the operation, which is the modelling step the task measures, so it would be a hint; a longer expression, because the check must reproduce a value the task doesn't print, so a match would judge her step; a division with a remainder; a multiplication that can draw a zero operand, because its inverse would divide by 0; a basic fact, because a fact measures recall within its fluency threshold and a check on every 7 · 8 would double the task; and fractions for the MVP, because the check field would need the fraction keypad. A Dutch probe letter never offers it, as ADR-0430 amends.

## Depends on

Nothing.

The epic realising ADR-0220 supplies `kind: "basic_fact"`; until it exists the build reads the declaration from the fixture module.

## Evidence

Not yet.

## Left alone

Offering the check at all, which TSK-0811 holds, and the check on fractions, longer expressions and word problems, which ADR-0240 doesn't settle.
