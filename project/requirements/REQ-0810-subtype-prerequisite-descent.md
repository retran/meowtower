---
id: REQ-0810
artifact: requirement
topic: skill-graph
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-0800
verification: behavioural
---

# REQ-0810

When a subtype that has a prerequisite of its own fails, the descent MUST go to that prerequisite only and never to the node's other prerequisites.

For example, a failed M1.decimal (2,5 km = ? m) sends the descent to D3 and leaves N3 alone.
