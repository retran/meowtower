---
id: REQ-6154
artifact: requirement
topic: master
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6154

A prepared reaction line MUST NOT show again in an adventure while the bank still holds a line not yet shown in that adventure.

A line that repeats tells the player the reply was canned. When every line has shown, a line may repeat, so the 2-second budget of REQ-6150 still holds; the bank's size is the design step's choice. The record asks for a bank large enough that lines don't repeat often and names no window; I chose one adventure.

Written from RES-4110 on the owner's instruction of 2026-09-28.

## Open review findings

- Rejected in part: "name the cap on sends per adventure and the minimum bank size, and get the owner's approval for the one-adventure window". The fallback is now in the rule (a line repeats only once every line has shown); a cap and a bank size are design choices RES-4110 doesn't make, and the owner approves the window by approving this requirement.
