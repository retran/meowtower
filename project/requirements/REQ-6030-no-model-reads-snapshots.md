---
id: REQ-6030
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6030

A language model MUST NOT read a snapshot file or any value parsed from one.

The approved rule on what leaves the Mac lets neither leave, and a model's reading can't be reproduced by version the way a parser's can. A check over the code verifies it, because a test catches only the paths it runs, as for REQ-6002.

Written from RES-4100 on the owner's instruction of 2026-09-28.
