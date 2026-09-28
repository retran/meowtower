---
id: REQ-6428
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4090
verification: behavioural
supersedes: [REQ-5968]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6428

The screen «Работа с источниками» (working with sources) MUST show «находит, но не считает» (finds but doesn't calculate) when at least 3 wrong first attempts in the last 30 days on track tasks that ask for a calculation matched no reading trap, and «считает, но ошибается в чтении» (calculates but misreads) when at least 3 wrong first attempts on track tasks in the same window matched a reading trap.

A task that asks only to find a region or read one value involves no calculation, so counting its wrong answers would tell the parent she can't calculate when the task never asked her to.

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
