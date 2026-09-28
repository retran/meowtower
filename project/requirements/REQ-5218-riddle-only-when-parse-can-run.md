---
id: REQ-5218
artifact: requirement
topic: selection
class: functional
status: superseded
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5218

The Director MUST offer a riddle only on a floor that holds word problems, and only when the parse budget can still reserve two worst-case parses, the gateway's live calls are on, the composing flag is on and the parent hasn't switched off the free-text field.

A spent budget or a failed start-up check then means no riddle, and never a riddle that ends `unparsed` for a reason that isn't hers. A riddle's target comes from the floor's word problems, and she writes it in the free-text field (REQ-5268), so without either there is nothing to compose or nowhere to write it.

Written from RES-4020 on the owner's instruction of 2026-09-28.
