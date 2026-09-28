---
id: REQ-5414
artifact: requirement
topic: api
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5414

Before the player answers, the server MUST NOT send anything that lets a client tell an unanswerable problem from a solvable one of the same tier and answer form.

An unanswerable problem is a T1 to T4 word problem of a subtype `T1.insufficient` to `T4.insufficient`, which can't be answered because a needed given is missing. This covers the task packet and every server reply, the 4 options for what is missing included, which the server sends or withholds the same way for both kinds. The check draws 1,000 seeds and compares the fields each kind sends.

Written from RES-4040 on the owner's instruction of 2026-09-28.
