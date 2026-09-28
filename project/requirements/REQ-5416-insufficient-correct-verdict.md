---
id: REQ-5416
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5416

When the player answers «Нельзя узнать» (can't be known) on an unanswerable problem and chooses the withheld given, the server MUST record the verdict `insufficient_correct` with credit 1 and the outcome `clean`.

An unanswerable problem is a T1 to T4 word problem of a subtype `T1.insufficient` to `T4.insufficient`, which can't be answered because a needed given is missing.

The owner's addendum counts `insufficient_correct` as a correct answer, and full credit maps to `clean` like any correct verdict.

Written from RES-4040 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
