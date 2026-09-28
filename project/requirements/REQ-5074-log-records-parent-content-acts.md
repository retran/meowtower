---
id: REQ-5074
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4000
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5074

The event log MUST record the parent's approval of a puzzle, the parent's approval of a hint rung's framing, each time a template or a puzzle is turned off, and the parent's mark «тренировали факты» (we trained facts).

The parent's acts change what the player sees, and only the log can later show why a puzzle, a framing or a template appeared or went away. The addendum's list of event types gives none of these facts a type, so each is written once a decision owns its type and schema, as REQ-5062 requires; the design step names that decision.

Written from RES-4000 on the owner's instruction of 2026-09-28.
