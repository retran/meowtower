---
id: REQ-8602
artifact: requirement
topic: studio
class: functional
status: approved
revised: 2026-11-14
elaborates: RES-4320
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8602

The parent MUST be able to restore any earlier version of a node as a new version.

A restore keeps every version, including the one it replaces, so one action reverses any change and nothing is lost by trying.
