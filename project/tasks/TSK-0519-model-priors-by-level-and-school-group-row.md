---
id: TSK-0519
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0982, REQ-0984, REQ-3712]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Starting estimates follow the subtype's level and the school group the parent set, and change only through a new model version

After this task, a pair's prior comes from the row for the school group in the latest `settings_changed` event, highest at 1F, lower at 1S and lowest at stretch, and a change of the setting is a new model version with a full recompute, so no date, clock or tracked file selects a row.

## Acceptance criteria

1. Given a school-group setting of 7, when the priors of a 1F, a 1S and a stretch subtype are read, then they are 0,55, 0,25 and 0,05; given a setting of 8, then they are 0,70, 0,40 and 0,10 (REQ-0982). Closed by: a unit test for each row.
2. Given a node with 1F and 1S subtypes, when no observation has arrived, then its 1F subtypes start higher than its 1S subtypes (REQ-0982). Closed by: a unit test.
3. Given a log with a school-group setting that the parent then changes, when the model version is read before and after, then the two differ, a full recompute is due under the new one, and the earlier version's rows stay (REQ-0984). Closed by: an integration test over two `settings_changed` events.
4. Given a clock moved past a date, when the prior is read, then it is the same; given a log with no school-group setting, then the row of group 7 applies (REQ-3712). Closed by: a unit test that fixes the clock at two values.
5. Given the tracked files, when `src/`, `content/` and `tests/` are searched, then no file names the player's school group as a value to use, and the model reads it only from the log (REQ-3712). Closed by: a static check in the lint verb.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Read the prior row from the latest `settings_changed` event for the school-group key, and make the model version the file version plus the row in use. The model file holds the rows for groups 7 and 8; a change of the setting passes no held-out gate and writes no `model_activated`, as SPC-0060 states.

The decision leaves open which row applies when the log holds no setting. I chose the group 7 row, because lower priors report nothing as known before evidence arrives, and a first answer then moves the estimate most.

## Depends on

- TSK-0517 (blocking): the parameter file and the update that reads `pInit`.

## Evidence

Not yet.

## Left alone

The Parent Room's control that writes the setting, which the epic realising ADR-0180 builds, and rows for other groups, which a later model version adds.
