---
id: TSK-0984
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0350
closes: [REQ-3914]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `tools/bakeoff.ts --local` measures each candidate's latency at the gateway and agreement with the reference

After this task, `tools/bakeoff.ts --local` runs each candidate through the gateway's local route on the family Mac, check by check, with the check's prompt cached and 6 requests in flight, and writes one `bakeoff` row whose latency flag is true only when the 95th percentile at the gateway is at most 1500 ms.

## Acceptance criteria

1. Given a stub judge whose answers take 1400 ms at the 95th percentile and one whose answers take 1600 ms, when the bake-off runs a check on each, then the first row has `latency_passed` true and the second false, the latency is measured from the request leaving the gateway to the parsed answer, and the row holds the seven inputs: check, judge, file hash, runtime build, prompt hash, test-set version and in-flight count (REQ-3914). Closed by: a bake-off test with two stub judges.
2. Given a check, when the bake-off sends its test set, then 6 requests are in flight at once, 3 of the check under test and 3 of the other for `safety` and `creepiness`, and for any other check 1 of it, 3 `safety` and 2 `creepiness`, after one warm-up request for each slot (REQ-3914). Closed by: a concurrency test that counts requests in flight at the stub.
3. Given an adventure that is open, when the bake-off starts, then it refuses and runs nothing; given a candidate whose tokenizer splits a label into more than one token, then the bake-off refuses it for every check (REQ-3914). Closed by: a test for each refusal.
4. Given a local run, when it ends, then it spent nothing from the $25 bake-off bucket and used no key (REQ-3914). Closed by: the run's `llm_log` rows, read in the test.
5. Given the family Mac at stage 0, when the owner runs `tools/bakeoff.ts --local`, then each check that a candidate passed has a row with a p95 at or under 1500 ms at 6 in flight (REQ-3914). Closed by: the command's output on the family Mac, run while no adventure is open.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `--local` mode to the bake-off tool and the `bakeoff` table's local columns: judge, model file hash, runtime build, prompt hash, test-set version, in-flight count, p95 latency, thresholds, and the two pass flags. The agreement flag follows the measure of the epic realising ADR-0100: at most one percentage point below the reference model's self-agreement over two runs and the gravest label on every item the reference gives it. This task writes the flag by that function and doesn't define the measure.

The bake-off refuses to start while an adventure is open, because play and a bake-off would share the GPU and each would slow the other. The in-flight count of 6 is three drafted Master replies checked at once, each by `safety` and `creepiness` in parallel; ADR-0360 entry 92 keeps it at 6 and moves it to 9 only if play shows her own text's checks overlapping.

## Depends on

- TSK-0982 (blocking): the bake-off goes through the gateway's local route, and its answer reading and error rule.
- TSK-0981 (blocking): the candidate list names each candidate's file and the checks it may take.

The epic realising ADR-0100 supplies `tools/bakeoff.ts`, the labelled Russian test sets and the agreement measure; until it exists the task runs on fixture test sets of 20 items, and the real sets and the reference model's two runs stay with that epic.

## Evidence

Not yet.

## Left alone

Which check moves to which judge, which TSK-0985 decides from the rows, and the premortem's case of a loaded Mac, which the notice of TSK-0985 watches in play.
