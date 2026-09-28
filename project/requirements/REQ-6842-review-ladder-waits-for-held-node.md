---
id: REQ-6842
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
supersedes: [REQ-0990]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6842

After the 1st, 2nd, 3rd, 4th and 5th unassisted success in a row on a node, the node's next review MUST fall 1, 3, 7, 14 and 30 days later, and 30 days after each further success, except that a retention check stands in for any review falling while the node is held, and the ladder resumes from the retention check's result.

A retention check is the review after a gap that the ladder asks for, so the hold moves its timing; a node that reaches «устойчиво» at its 4th success gets its check from day 28 in place of a review on day 14.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
