---
id: TSK-0872
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5742, REQ-5744, REQ-5746, REQ-5748, REQ-5750]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `npm run puzzles:prepare` passes each puzzle through five steps on the offline key and stops at its own budget

After this task, the command takes each data file whose Russian text is missing or whose data changed through the reference check, `PUZZLE_MODEL`'s drafts, the code checks, the safety question and the blind solve, calls models only in offline roles on the offline key, and stops at $20 a run.

## Acceptance criteria

1. Given a puzzle whose reference solution fails its check, when the run starts, then it stops there with `puzzle_reference_failed` before any model call, and no puzzle enters the review queue before its reference passes (REQ-5742). Closed by: a replayed run with a recording gateway.
2. Given a replayed run, when the recorded requests are read, then every call went on the offline key under `PUZZLE_MODEL`, `CHECK_MODEL`, `JUDGE_MODEL` or `SAFETY_MODEL` and none under a play role (REQ-5748). Closed by: the replay test's report.
3. Given a blind-solve request, when its body is read, then it holds the filled statement and the answer format's notation and no answer and no candidate answers (REQ-5744). Closed by: the replay test's assertion over every blind-solve request.
4. Given a variant whose parsed free-form answer the puzzle's check accepts on the first of at most 2 solves, when the run ends, then it enters the review queue, and a variant the check doesn't accept ends as `puzzle_blind_solve_failed` (REQ-5746). Closed by: two recorded fixtures.
5. Given a run that reaches $20, when the next call would exceed it, then the run stops, keeps what passed and reports `budget_puzzle_run_spent`; the queue takes new candidates only while it holds fewer than 60 (REQ-5750). Closed by: a replay with a priced fixture gateway.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the command, the role `PUZZLE_MODEL` (default model the planner's) and the puzzle draft and blind-solve entries to ADR-0100's `ContentRequest` and budget table, as ADR-0280 amends ADR-0100. A text the parent edited skips the draft step, runs the checks and the blind solve on the parent's words and returns to the queue marked `as_edited`. The blind solve needs a parser for each answer format's notation; for jugs, one pour per line as «из A в B».

I accept one accepted solve as ADR-0280 does, a preference nobody has measured, and the parent's review and the fourth reversal condition catch an ambiguous statement.

## Depends on

- TSK-0868 (blocking): the run reads the data and text schemas and the code checks.
- TSK-0869 (blocking): the run needs the checks for the four answer formats.
- TSK-0870 (blocking): the run needs the move-sequence check.

The epic realising ADR-0100 supplies the gateway, the offline key and the budget table; the epic realising ADR-0130 supplies the safety question's pattern. The run uses a recording gateway fixture until those epics land.

## Evidence

Not yet.

## Left alone

The review screen, which TSK-0873 builds, and the key's $20 limit itself, which the owner sets before each run.
