---
id: REQ-8220
artifact: requirement
topic: story
class: functional
status: approved
revised: 2026-11-01
elaborates: RES-4314
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8220

A Master reply is plain text with tool calls, it MUST pass the forbidden-word list before it shows, with no model call to check it, and every other text check MUST only report after the reply.

The owner decided on 2026-11-01 to loosen text checks for now, because the rest seem excessive at this stage. Style and continuity faults reach the parent's audit, and they block nothing.
