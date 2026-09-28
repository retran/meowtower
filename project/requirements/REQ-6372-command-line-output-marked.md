---
id: REQ-6372
artifact: requirement
topic: privacy
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6372

Every output of the command-line sandbox MUST carry a mark that shows it came from a sandbox run.

The repository scan of REQ-6368 keys on the mark to find sandbox output that reached a tracked file. Default chosen by the requirements step: RES-4130 asks the scan to check for such output and names no way to recognise it, so the command marks it.

Written from RES-4130 on the owner's instruction of 2026-09-28.
