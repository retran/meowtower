---
id: REQ-7222
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7222

Before it compares a graph with its target, the engine MUST expand each named operation into `+`, `−`, `·` and `:` over exact rationals: a/b of N as N : b · a, p % of N as N : 100 · p, the first part of T in the ratio a : b as T : (a + b) · a and the second as T : (a + b) · b, and the other part from a known part K as K : a · b, where a is the term of the ratio that matches the known part and b the term of the part asked for, wherever each stands in her text.

A story «разделили 20 на 4 части и взяли 3» (divided 20 into 4 parts and took 3) and a story «три четверти от 20» (three quarters of 20) then give the same graph and `match`.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
