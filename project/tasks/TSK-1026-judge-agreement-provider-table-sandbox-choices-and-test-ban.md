---
id: TSK-1026
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-1688, REQ-2512, REQ-2648, REQ-6348, REQ-6504]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A judge passes by one stated agreement bar, providers come from one table, and the sandbox choices stand

After this task, the bake-off passes a judge by agreement with the reference plus the gravest-label rule, `content/providers.json` holds each provider's facts, the host job rewrites `owners.json` each minute, the Studievaardigheden ban covers the game's own text, and the sandbox's five choices are in force.

## Acceptance criteria

1. Given a reference model that agrees with itself on 92 % of items over two runs and a judge at 91 % that gives `serious` on every item the reference does, when the bake-off compares them, then the judge matches; given a judge at 95 % that misses one item the reference labels `serious`, then it fails (REQ-1688). Closed by: a bake-off test with recorded labels for both judges, a test-set schema test that finds `scared` items in the `signal` set and a graded serious item in the `safety` set, and a gateway call-log test that finds the reference's two runs as separate requests with no response cache and the settings play uses.
2. Given the stack running, when a minute passes, then the host job has rewritten `data/judges/owners.json`, a judge restarted under another account loses its route within about a minute, and every server process runs as an unprivileged user (REQ-2512). Closed by: a smoke test with a fake clock and a static check of the container user.
3. Given `content/providers.json` with company, country and retention for each provider, when the server starts with a provider on either tier list that has no row, then it refuses with `model_config_invalid`, and the Parent Room page reads the country from the same row (REQ-2648). Closed by: a start-up test and a page test.
4. Given a string file or a Parent Room schema that names a Studievaardigheden test, when the build check runs, then it fails, and given a school document the parent imports, then it shows as the school wrote it (REQ-6504). Closed by: the build check's fixture and an import test.
5. Given the sandbox, when the parent tries anything, then the player's record changes only through the confirmed actions, a confirmed action's handle returns `409 sandbox_resetting` during a reset and `503 log_write_failed` when the log write fails, the builder rebuilds its tables with `local_judge_files` left empty, and a start-up sweep removes both temporary files (REQ-6348). Closed by: sandbox route tests and a start-up test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the agreement function and the gravest-label rule to the bake-off, the table and its start-up check to the gateway, and the sweeps to the sandbox. Agreement is the share, in percent, of the test set's items on which the judge's label equals the reference model's. A judge matches the reference when its agreement is no more than one percentage point below the reference's own agreement over two runs of the same set, and it also gives the gravest label on every item the reference gives it: `serious` on `signal` and a failing answer on `safety`. The reference's own repeat is the closest match any model can show, so the bar asks nothing the reference can't do and needs no number I would have to invent; a judge that misses a serious case the reference catches fails however well it agrees elsewhere, because that miss is the harm the check exists to catch. The server in its container can't read the owner of a process on the Mac, and the job already runs there each minute. REQ-6504 replaces REQ-5994.

SPC-0340's five choices fill gaps ADR-0340 left and conflict with no approved requirement or decision, so they stand as written there.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The bake-off's real run at stage 0, which needs the Mac and the candidate models, and the Parent Room page's Russian wording.
