---
id: TSK-1082
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6930, REQ-6932]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Both holds run from the first adventure and put `transfer_hold` in `why`

After this task, both holds apply from the player's first adventure, and every `item_shown` of a subtype under either hold carries `transfer_hold` in its `why`, which no play route response ever sends.

## Acceptance criteria

1. Given an empty log and the first adventure, when the first show of a subtype with templates in both formats is planned, then the format hold already applies at that show, and the first accepted frame of the structure carries its context (REQ-6932). Closed by: an end-to-end test on a fresh fixture database.
2. Given a subtype under the format hold, when `item_shown` is written, then its `why` includes `transfer_hold`; given a subtype under the context hold, then the same; given a subtype under neither, then `why` doesn't include it (REQ-6930). Closed by: a Director test, one fixture for each case.
3. Given a simulated 60-day log with both holds on, when a packet test reads every play route response, then no response carries `why`, `purpose` or `flowSlot`. Closed by: the packet test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `transfer_hold` to the values of `why` and write it on every show of a subtype while either hold is active, so the owner can audit the Director through `why`. Wire both holds from the first adventure: no calendar delay, no warm-up before the holds begin, because a first encounter spent in training can't be recovered.

## Depends on

- TSK-1080 (blocking): the context hold is what this task marks.
- TSK-1081 (blocking): the format hold is what this task marks.

The epic realising ADR-0070 supplies `why` and the packet rules that keep it off the client.

## Evidence

Not yet.

## Left alone

The side-slot rule, which TSK-1083 adds, and the simulation that audits `why` over 60 days, which TSK-1088 runs.
