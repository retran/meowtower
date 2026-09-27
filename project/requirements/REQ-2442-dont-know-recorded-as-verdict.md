---
id: REQ-2442
artifact: requirement
topic: api
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2400
verification: behavioural
---

# REQ-2442

When the player chooses «Не знаю» (I don't know), the server MUST record the verdict "don't know", distinct from a wrong answer and from an empty one.

An empty answer alone can't tell «Не знаю» from a submit before typing.
