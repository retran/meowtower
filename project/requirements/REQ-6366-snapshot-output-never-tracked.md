---
id: REQ-6366
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6366

The command-line sandbox MUST print its output and write it to no file.

Output from a run on a snapshot of the player's state holds her own text and the names she gave, and the repository is public, so the command leaves every copy in a file to whoever redirects it, where the repository scan checks it.

Written from RES-4130 on the owner's instruction of 2026-09-28.
