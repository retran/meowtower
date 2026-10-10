---
id: TSK-0693
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2824]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The art queue keeps each variant before the next generation and resumes without repeating one

After this task, `tools/art-generate.ts run` works through the catalogue as jobs in the service table `art_jobs`, writes each variant's file, check results and score before it starts the next generation, and picks up from the first missing variant after any stop.

## Acceptance criteria

1. Given a run against a stub gateway that the test kills in the middle of a generation, when the run starts again, then no finished variant is generated twice and every missing variant is made (REQ-2824). Closed by: an integration test that counts the stub's calls for each slot.
2. Given a job whose 4 slots each hold a passing variant, when the run ends, then the job is `ready_to_choose`; given a job that used 16 generations with 3 passing variants, then it is `rejected` with `art_variants_short` and its best-scored passing variant is its draft. Closed by: two integration tests.
3. Given a stub that fails 3 times in a row on one job, when the run goes on, then the job moves to `error` with `art_job_error` after exponential backoff and the run makes the next job; given the next run, then the `error` job is `waiting` again with its slot counts kept and its error count at 0. Closed by: an integration test with a fake clock.
4. Given variants of an asset chosen 30 days ago and variants of an asset not chosen, when the drain runs, then only the first asset's unchosen variants are deleted from `data/art/variants/`. Closed by: an integration test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `art_jobs` table by a numbered migration, as a service table that no projection reads or rebuilds. A row holds the job's state (`waiting`, `generating`, `ready_to_choose`, `chosen`, `rejected` or `error`), its run, each slot's count of generations, and for each variant its file, check results, judge score and verdict, the key colour it used, the chosen variant, whether a person has seen the draft, `sheet_reference`, the tint mask's approval, and each person's action with its time and reason. Later tasks fill the fields they own.

An asset needs 4 passing variants, and each of the 4 slots gets at most 4 generations, the first and 3 regenerations, so an asset costs at most 16. A variant passes when both program checks pass, it has no hard-fail finding and its score is 7 or more; the queue reads those fields from the row and the tasks that make them plug in. Until they exist the stub supplies them. A job's draft is its best-scored passing variant while it has no chosen variant, whatever its state. Unchosen variants drain 30 days after their asset is chosen, a value ADR-0170 chose.

The queue calls a model only through ADR-0100's gateway, and the stub gateway stands in for it until the epic realising ADR-0100 exists.

## Depends on

- TSK-0692 (blocking): the queue lists its jobs from the catalogue's entries and their fields.

## Evidence

Not yet.

## Left alone

The budget, the model check and the 402 refusal, which TSK-0694 adds. The two program checks, the judge and the request each variant carries, which TSK-0695, TSK-0696 and TSK-0697 build. The order in which assets may start, which TSK-0698 and TSK-0699 own.
