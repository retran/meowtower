---
id: TSK-1110
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7110, REQ-7114, REQ-7116, REQ-7124, REQ-7126]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The offline run refuses to start on shared models, holds no player data and runs under roles of its own

After this task, `npm run probe:generate` exists in `tools/probe/` as the only producer of probe text, it runs on the offline key under two new roles, it refuses to start in three cases, and no code path in the server calls a model for probe text.

## Acceptance criteria

1. Given two of the writing, blind-solve and language-check roles resolving to the same model id, an empty `nl` section in the forbidden list, or no `content/probe/style-guide.md`, when the run starts, then it stops as `probe_run_refused`, names the reason and makes no model call (REQ-7124). Closed by: the run's output and a gateway recording in each of the three cases.
2. Given `src/engine/probe/` or a server probe route that imports the model gateway, when verify runs, then a group 1 check fails and names the file; given a play-time request for probe text, then none exists (REQ-7114). Closed by: the check's fixture test.
3. Given the gateway, when a probe job is sent, then it runs under `PROBE_TEXT_MODEL` or `PROBE_LANGUAGE_MODEL`, both content tier, offline key, request class `ContentRequest`, and the gateway refuses `PLANNER_MODEL` on the offline key (REQ-7116). Closed by: a gateway test, one fixture for each role.
4. Given a recording of every request of a run, when it is searched, then it holds no field from the event log, such as an answer, a tap or an opened word, and `tools/probe/` importing the log or the database fails a group 1 check (REQ-7126). Closed by: the recording test's report and the import check's fixture test.
5. Given a prompt, a style guide, a template, a data file or a logged value that holds "Cito", when ADR-0290's word check runs, then it fails; the check covers `content/probe/`, `tools/probe/` and the probe's event schemas, and `item_shown`'s `probe` and `forms` values, whole words and case-insensitively (REQ-7110). Closed by: the check's fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `tools/probe/` with the `probe:generate` script and a `ContentRequest` that holds the template's structural specification from ADR-0130 step 1, the style guide, the Mainland's canon names and the target length, and has no field for an answer, a tap or an opened word. Add the two roles to ADR-0100's gateway with these defaults: `PROBE_TEXT_MODEL` the model `GEN_MODEL` uses, `CHECK_MODEL` as it stands, and `PROBE_LANGUAGE_MODEL` the model `LIVE_CHECK_MODEL` uses, so the three differ. The style guide, the Dutch numeral list and the Dutch forbidden forms are written by a person; this task reads them and writes none. A run costs about $10 and its budget is $20 on the offline key, which the owner raises before a run.

## Depends on

- TSK-1108 (not blocking): its scope guard keeps the tree clean until the owner's amendment, so this task lands after the amendment and not after that task.

The epic realising ADR-0100 supplies the gateway and the epic realising ADR-0160 the forbidden list; the task runs on a stand-in gateway and a fixture list.

## Evidence

Not yet.

## Left alone

The checks each candidate passes, which TSK-1111 builds, and the style guide's text, the Dutch numeral list and the Dutch forbidden forms, which a person writes.
