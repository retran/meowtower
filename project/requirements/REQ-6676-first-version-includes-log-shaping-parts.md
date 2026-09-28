---
id: REQ-6676
artifact: requirement
topic: scope
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: judgement
verifier: person
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6676

The first version MUST include addendum 2's parts that shape the log: the event types `hypothesis_recorded` and `hypothesis_updated` with a Parent Room form that records a hypothesis and what would confirm and refute it as text; a context tag on every accepted frame, the Director's hold on first encounters and the projection of first exposures; `itemId` on `solution_shown` and `hint_shown`; and an optional category list on the Cito result form.

Each holds a fact a later report can't rebuild: a hypothesis written after the MVP can't be judged on the MVP's data, a first encounter spent in training can't be recovered, a short solution or a rung with no task can't be placed on a node, and the teacher's printout is the only copy of the category results. REQ-5076 stays as approved, and this list adds to it. The owner judges it at the stage 0.3 acceptance.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.

## Open review findings

The agent review of 2026-09-28 suggested one requirement per part, so stage 0.3 could accept each part apart. I kept one list, as REQ-5076 does for addendum 1's parts, because the owner accepts the first version's contents as one list; each part also has its own requirement in RES-4220, RES-4230, RES-4240 and RES-4270's blocks.
