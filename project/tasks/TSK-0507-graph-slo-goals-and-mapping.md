---
id: TSK-0507
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0812]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every SLO goal at 1F and 1S maps to a subtype of the graph

After this task, `sloGoals` holds the goals of the SLO «Concretisering referentieniveaus rekenen 1F/1S», each subtype names the goals it serves, and the validator fails a goal no subtype names and a reference to a goal that doesn't exist.

## Acceptance criteria

1. Given the file, when the validator runs rule 5, then every `sloGoals` entry has an id, a level and a short text, every entry is named by at least one subtype, and every `slo` reference names an existing goal (REQ-0812). Closed by: the validator's report on the real file.
2. Given a copy with an extra goal no subtype names, and another with a subtype that names `slo-999`, when each is validated, then each fails naming the goal or the subtype (REQ-0812). Closed by: two unit tests.
3. Given the SLO document and the finished list, when the reviewing agent compares them, then its report names every goal in the document and at least one subtype for each, and flags a goal the list lacks. Closed by: judgement of the reviewing agent, because whether a subtype covers the meaning of a goal is a reading of the SLO text that no program does.
4. Given a later change to `sloGoals` or to any subtype's `slo` field, when the change is reviewed, then the agent's report is produced again. Closed by: judgement, the same reason, run as a step of the review and not by a program.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draft the goal list from the SLO document RES-0800 cites, as the building agent does for the first version, and fill each subtype's `slo` ids. Add rule 5 of the validator. Run the reviewing agent over the list and the mapping, and keep its report beside the pull request, naming every goal with its subtypes.

## Depends on

- TSK-0505 (blocking): the full set of subtypes the goals map to.

## Evidence

Not yet.

## Left alone

Any Dutch overlay's goals, which RES-2550 defers until after the MVP, and the report's coverage by level, which ADR-0180 draws.
