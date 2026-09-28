---
id: REQ-6420
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
supersedes: [REQ-5218]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6420

The Director MUST offer a riddle only on a floor that holds word problems, and a riddle in text form only when the parse budget can still reserve two worst-case parses, the gateway's live calls are on, the composing flag is on and the parent hasn't switched off the free-text field.

A card riddle needs no parse and no free-text field, so it can play when any of the four conditions fails. The four still guard the text form, so no text riddle ends `unparsed` for a reason that isn't hers.

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
