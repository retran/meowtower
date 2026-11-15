---
id: REQ-7290
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-11-15
elaborates: RES-4321
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7290

The outcome badge MUST show `crit` for a `clean` outcome that closes a clean row, `clean` for any other `clean` outcome, `partial` for a `partial` outcome, `miss` for an `alt` outcome after a wrong answer, and `skipped` for an `alt` outcome after «Не знаю» (I don't know).

The badge says plainly what happened, and keeps an honest «Не знаю» apart from a wrong answer.
