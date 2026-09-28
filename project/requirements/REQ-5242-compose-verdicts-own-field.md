---
id: REQ-5242
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5242

The verdicts and error classes of a composed riddle MUST be recorded only in the `compose_parsed` and `compose_confirmed` events, in a verdict field that no other attempt uses.

The addendum's `unparsed`, a riddle the parser failed on, is a written attempt with base experience; the checker's `unparsed` is an entry such as «3,,5» that is never submitted. One field for both would let a projection count one as the other.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
