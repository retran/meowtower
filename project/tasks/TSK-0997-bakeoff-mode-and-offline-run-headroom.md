---
id: TSK-0997
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-1654, REQ-2710, REQ-6412]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A bake-off runs play roles through the play route on the offline key and stops at its budget, and an offline run starts with no more limit left than its budget

After this task, the gateway has a `bakeoff` mode that only `tools/bakeoff.ts` can set, the mode runs the play roles through the route play uses and stops at the bake-off budget, and `verify --live` reads its budget as what remains of the offline key's limit.

## Acceptance criteria

1. Given the gateway in `bakeoff` mode, when a play role is called, then the request goes through the route and endpoint play would use, on the offline key (REQ-1654). Closed by: a gateway test that compares the recorded route in `bakeoff` and `play` mode.
2. Given a bake-off budget of $25 and a stubbed price, when calls settle until the budget is spent, then the next call is refused with the budget state and no call is sent (REQ-2710). Closed by: a gateway test over a fake ledger.
3. Given any caller other than `tools/bakeoff.ts`, when it sets the mode to `bakeoff`, then the gateway refuses (REQ-1654). Closed by: a unit test and a static check that finds the mode's setter imported nowhere else.
4. Given the offline key's limit and its usage this month, when `verify --live` or `tools/bakeoff.ts` starts, then it reads the run's budget as the limit minus the usage and refuses when that exceeds the run's budget; the owner's setting of the limit before each run is judgement (REQ-6412). Closed by: a unit test over three limit and usage pairs for the refusal, and the owner's judgement from the key's settings and usage for the setting itself, because the key is held at the model service and the project can't read it back.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `bakeoff` mode to the gateway's modes, set only by `tools/bakeoff.ts`, as ADR-0360 entry 32 states. Change the budget reading of `verify --live` and the bake-off tool to the remaining limit, as entry 31 states, and add one line to the owner's run checklist: set the limit so that what remains equals the run's budget, and set it back to the sandbox's $20 a month afterwards.

## Depends on

Nothing in this epic. The epic realising ADR-0100 supplies the gateway and its ledger; until it exists, the tests run on a fake gateway with the same mode switch and ledger interface, and the real gateway's wiring is left to that epic.

## Evidence

Not yet.

## Left alone

The sandbox's $20 bucket and the offline key's limit around sandbox runs, which ADR-0210 and ADR-0340 own.
