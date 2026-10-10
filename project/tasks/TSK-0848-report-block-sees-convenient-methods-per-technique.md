---
id: TSK-0848
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5508, REQ-5520, REQ-5580, REQ-5582, REQ-5584, REQ-5586]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Summary screen shows «Видит удобные приёмы» per technique and names what the figure counts

After this task, the Summary screen holds a block with one row per technique, the share of `optimal` among unassisted first attempts over 30 days with the attempt count beside it, a count alone below 5 attempts, assisted groupings among the «с помощью» figures and a sentence that says what the figure counts.

## Acceptance criteria

1. Given a fixture log, when the report is built, then the block has no distributive-law row, each row shows the share and the count, a row with fewer than 5 attempts shows the count alone, and a skipped link counts as `none` (REQ-5520, REQ-5580). Closed by: the report test.
2. Given assisted attempts in the log, when the report is built, then they appear only as a count and an `optimal` share among the «с помощью» figures (REQ-5582). Closed by: the report test.
3. Given the Russian strings of the block, when the string check on `parent.*` values runs, then it passes, and no string or colour names a `none` grouping as an error or sets it against a norm (REQ-5508, REQ-5586). Closed by: the string check's output and a test that scans the block's strings.
4. Given the sentence `parent.grouping.invited`, when the parent reads it at stage 0.3 acceptance, then the parent judges whether it says the figure counts what she marks when the task invites her to link numbers (REQ-5584, REQ-5586). Closed by: judgement of the parent, because the requirements name the parent's reading and a test can't tell whether a sentence conveys that.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the block to the Summary screen of ADR-0180, reading `grouping_stream` (TSK-0843), with the labels and `parent.grouping.invited` in the Russian file. I chose 30 days as ADR-0260 does, because ADR-0180 reads assisted attempts over 30 days and the with-help figures beside it then count the same period. The block sets no norm and no colour against `none`.

## Depends on

- TSK-0843 (blocking): the block reads the stream's rows.

The epics realising ADR-0180 and ADR-0160 supply the Summary screen, the string file and the `parent.*` string check.

## Evidence

Not yet.

## Left alone

The final Russian wording beyond the keys named here, which ADR-0160 owns with the parent judging, and the model's use of the stream, which comes after the MVP.
