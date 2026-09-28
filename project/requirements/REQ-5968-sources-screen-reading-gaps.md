---
id: REQ-5968
artifact: requirement
topic: report
class: functional
status: superseded
revised: 2026-09-28
elaborates: RES-4090
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5968

The screen «Работа с источниками» (working with sources) MUST show «находит, но не считает» (finds but doesn't calculate) when at least 3 wrong first attempts on track tasks in the last 30 days matched no reading trap, and «считает, но ошибается в чтении» (calculates but misreads) when at least 3 in the same window matched a reading trap.

The research names both gaps and leaves them undefined. I chose these defaults: a wrong answer that matched no reading trap counts as a calculating mistake on data found correctly, and 3 in 30 days keeps a single slip from reaching the parent. The second gap also explains why a track node and an overlapping graph node such as S1 or M2 can disagree.

Written from RES-4090 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
