---
id: TSK-0633
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3646]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `npm run frames:generate` runs the pipeline offline and writes the passing variants to a candidates file

After this task, `npm run frames:generate` asks `GEN_MODEL` for variants of the structures that fall short of the stage's target, runs steps 1 to 5 on each, writes the ones that pass to a candidates file in `data/`, and every request and response sits in `llm_log`.

## Acceptance criteria

1. Given a structure with 2 accepted frames at stage 0.2 with its target of 5, when the command runs against a stub gateway, then it asks for candidates up to 1.5 times the shortfall with at least 5, never more, and a second run adds nothing for that structure and reports `frame_candidates_full` once. Closed by: an integration test with a stub gateway that counts requests.
2. Given a run, when it ends, then every request and response of steps 1, 4 and 5 is a row of `llm_log` through the gateway module on the offline key, and no call bypasses the module (REQ-3646). Closed by: an integration test that counts `llm_log` rows against the stub's calls, and a static check that `src/frames/` imports the gateway module and no model client.
3. Given variants that fail steps 2 to 5, when the run ends, then each failing variant is dropped and the run's summary lists the number rejected for each step, and the candidates file holds only variants that passed all five. Closed by: an integration test with one failing variant for each step.
4. Given a candidate older than 60 days, when the command runs, then it leaves the candidates file and the log records `frame_candidate_expired`. Closed by: an integration test with a stubbed clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `frames:generate` script to `package.json` and write `src/frames/generate.ts`. Keep the candidates file at `data/frames-candidates.json`, outside the repository, because an unreviewed frame isn't the project's content and rejected text would reach a public history. The file name is my choice. Each candidate keeps its text, hash, structure, floor, `candidateSince` and the results of its checks. Run outside any session. The stage's target comes from the stage setting the verify command of ADR-0190 reads.

## Depends on

- TSK-0629 (blocking): the request and the reply parser.
- TSK-0630 (blocking): step 3.
- TSK-0631 (blocking): step 4.
- TSK-0632 (blocking): step 5.

The epic realising ADR-0100 supplies the gateway, the offline key and `llm_log`; until it lands, tests pass a stub with the same recording interface.

## Evidence

Not yet.

## Left alone

The Parent Room's review of the candidates, which TSK-0634 builds, and the live queue, which TSK-0637 builds on the same pipeline functions.
