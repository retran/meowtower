---
id: REQ-8608
artifact: requirement
topic: studio
class: functional
status: approved
revised: 2026-11-14
elaborates: RES-4320
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8608

Until a generator's spend has been measured across runs, its estimate MUST show the number of model calls and the spend so far, and no dollar figure for the run.

The one-run figures in the record trace to no log, and a figure shown as an estimate reads as a promise.
