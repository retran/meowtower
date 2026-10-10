---
id: TSK-0808
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5318, REQ-5320, REQ-5322]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The `estimate` stream is a number-sense estimate for each node and subtype with a guess rate of 0.25, and it feeds nothing else

After this task, the knowledge model keeps a BKT estimate for each node and subtype fed only by the `estimate` field of `attempt_submitted`, with `pGuess` 0.25 and `pSlip` 0.10, and during the MVP it feeds no other estimate: not "on her own", not fluency and not node N4.

## Acceptance criteria

1. Given attempts with and without an `estimate` field, when the stream is read, then each attempt with the field is one observation for its node and subtype and the others are none (REQ-5318). Closed by: a model test over a fixed log.
2. Given the stream's parameters, when they are read, then `pGuess` is 0.25 and `pSlip` is 0.10, the floor of ADR-0060's `max(0.10, 1 - 0.95^steps)` for a one-step answer (REQ-5320). Closed by: a unit test on the parameter file.
3. Given a log with estimates, when the "on her own" estimate, the fluency estimate and node N4's estimate are computed with and without the stream's observations, then each is identical (REQ-5322). Closed by: a model test.
4. Given the recompute over the whole log, when the stream is rebuilt, then it equals the live one (REQ-5318). Closed by: a recompute test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `estimate` stream to ADR-0060's model as the fourth part, named by the epic realising ADR-0210 and registered there. It is a BKT estimate with ADR-0060's forgetting and priors, so it needs a new projection and no new code path; I took ADR-0240's choice of the existing parameters. It reads the `estimate` field and never `forms`, because an item with an estimate keeps `forms` empty so that its exact answer still counts in "on her own".

The stream exists for the export and for a refit after the MVP, and enters an estimate only through ADR-0060's activation rule, so a feed into N4 waits until a refit shows that estimates on other nodes' tasks improve prediction.

## Depends on

- TSK-0813 (blocking): the `estimate` field the stream reads.

The epic realising ADR-0060 supplies the model and the recompute; this task adds a projection to it.

## Evidence

Not yet.

## Left alone

The Director's use of the stream, which nothing does in the MVP, and the refit tool, which ADR-0060 defers until after the MVP.
