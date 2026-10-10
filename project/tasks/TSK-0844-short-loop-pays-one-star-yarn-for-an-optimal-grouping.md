---
id: TSK-0844
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5526, REQ-5532]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The short loop pays 1 star yarn for an `optimal` grouping on a `clean` unassisted first attempt and reads no time

After this task, the rewards rule grants 1 star yarn through `reward_granted` with source `short_loop` on exactly the `clean` unassisted first attempts scored `optimal`, and the rule reads the verdict, `assisted` and the score and no time field.

## Acceptance criteria

1. Given a replayed log, when the rewards run, then `reward_granted` with source `short_loop` appears on exactly the `clean` unassisted `optimal` first attempts and on no other attempt, a second attempt included (REQ-5526). Closed by: a replay test.
2. Given the same log with every time field replaced by a random value, when the rewards run again, then the grants are identical, and the `rapidGuess` mark changes nothing (REQ-5532). Closed by: a replay test and a static check that the rule's module reads no time field.
3. Given a `clean` unassisted first attempt scored `valid` or `none`, when the rewards run, then no yarn is granted and the outcome is as it was. Closed by: two replay fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the row "Short loop" to ADR-0140's rewards table in `content/economy.json` and its rule, as ADR-0260 amends ADR-0140. The grant plays after the task window closes, in ADR-0080's `closed` state, so the rule only writes the event. The forge recipe amounts stay as REQ-2172 sets them (REQ-5590 belongs to TSK-0846).

I accept, as ADR-0260 does, that a guess with optimal links and a right answer earns the yarn, because linking takes taps a rapid guess doesn't make.

## Depends on

- TSK-0839 (blocking): the rule reads the score from the last `grouping_submitted`.
- TSK-0843 (not blocking): the `assisted` flag is the attempt's own, which this rule can read without the projection.

The epic realising ADR-0140 supplies the rewards table and `reward_granted`.

## Evidence

Not yet.

## Left alone

The animation and the System line, which TSK-0845 builds, and the weekly yarn table, which TSK-0846 builds.
