---
id: TSK-0798
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5246, REQ-5248, REQ-5250, REQ-5252]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The composing stream counts verdicts apart, and no estimate, block, probe, state, ladder or input share reads a riddle

After this task, a projection of `compose_confirmed` keeps for each tier, problem type and form the count of each verdict other than `unparsed` and of each error class, and a riddle is never an observation for the "on her own", "with help" or fluency estimates, a block, a probe, a node state, the success share, the holding-steps ladder or the step-input share.

## Acceptance criteria

1. Given a log with riddles, when the projections are replayed with and without them, then no estimate, block, probe, node state, success share, holding-steps count or step-input share changes (REQ-5246, REQ-5248, REQ-5250). Closed by: a projection test.
2. Given riddles of both forms with each verdict, when the stream is read, then each tier, problem type and form holds the count of each verdict other than `unparsed` and of each error class, and `unparsed` is counted in none (REQ-5252). Closed by: a projection test.
3. Given unassisted first attempts on k-step word problems from a Guardian or a room, when the holding-steps ladder is read, then each counts toward step k unless it is a rapid guess, the parent excluded it, it is a riddle or it is a problem with a missing number (REQ-5248). Closed by: a projection test with each exclusion.
4. Given 30 days of compound word problems of T2 to T4, when the step-input share is read, then riddles are in neither part and the share is counted over the rest (REQ-5250). Closed by: a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `compose` projection to the model of ADR-0060 as the stream the epic realising ADR-0210 names, and keep its counts by form, because a card riddle is chosen from given sentences and a text riddle is written, and the two shouldn't blur in one count. Change ADR-0180's holding-steps row to REQ-5248's rule. The stream feeds no estimate until ADR-0060's activation rule admits it.

The band of 40 % to 60 % for step-by-step input over 30 days is REQ-5250's; this task keeps riddles out of both parts of the share, and the epic realising ADR-0070 owns the alternation that fills the band.

## Depends on

- TSK-0791 (blocking): the `compose_confirmed` events the stream reads.

The epic realising ADR-0210 supplies the stream routing of `forms`; this task adds the projection and the exclusions to the model as it stands.

## Evidence

Not yet.

## Left alone

A state for composing and whether the stream ever enters an estimate, which a later record decides under REQ-5026, and the alternation of input forms, which ADR-0070 owns.
