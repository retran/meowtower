---
id: EPC-0410
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0410
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every accepted frame names its context, two holds keep first encounters unspent until a node is fluent, and `first_exposures` marks each first encounter from the log

Realises exactly ADR-0410: the closed list of contexts and its append-only check, the template schema's `contexts` and its refusals, the `context` on each accepted frame and the frame request that names it, the frame picker under the context hold, the format hold, the side-slot rule, the projection `first_exposures` with its eligibility rules and its model-version fields, the fence that keeps the projection out of the model, the 60-day simulation, and the report's transfer section after the MVP.

Until the epics realising ADR-0060, ADR-0130, ADR-0020 and ADR-0400 exist, the tasks run on fixtures: a stand-in reader of a node's tested state, fixture frames, a fixture log and a fixture rule for depth of help. Each task names what it leaves to those epics. Everything here is in the MVP except the report's transfer section, TSK-1089.

## Acceptance criteria

1. The 60-day simulation finds at most one `firstExposure` per subtype, per subtype-and-format pair and per subtype-and-context pair, exactly one for each pair shown and not used up by a higher kind at the same show, no subtype with both formats showing its context format before its node is fluent by a tested result or 14 game days have passed, no subtype with at least 2 contexts with an accepted frame showing its last unshown context before its node is fluent by a tested result, and the half-bare rule holding on every node. Evidence: the simulation's report, from TSK-1088.
2. A schema test refuses a template with `formats`, a context template without `contexts`, one with an unknown id and a frame without `context`, and `template_one_context` warns on a template with one context while the build passes. Evidence: the schema tests' reports, from TSK-1077 and TSK-1078.
3. A verify test deletes a tag from `content/contexts.yaml` in a commit and `contexts_append_only` fails, and a start-up test with a `frame_accepted` naming a missing tag refuses to start with `context_unknown`. Evidence: the check's output and the start-up test's report, from TSK-1076.
4. A picker test on a structure with 5 frames in 2 contexts, one held, never shows the held context, repeats the frame shown longest ago among the others with `frameRepeat: true`, and shows the held context once the node's tested state reaches fluent. Evidence: the picker test's report, from TSK-1080.
5. A side-slot test fills a warm-up, a twin, a retention check, a bridge task and a live top-up on a subtype with one shown and one unshown context, and every frame carries the shown context; the first warm-up of an empty log takes a new one that the projection marks used with the reason `side_slot`. Evidence: the side-slot test's report, from TSK-1083 and TSK-1085.
6. A projection test on a fixture log gives each of the eleven reasons once, the highest kind on a show new on three counts, `transferred` only for «сама», and no observation for a second attempt. Evidence: the projection tests' reports, from TSK-1084 and TSK-1085.
7. A recompute test activates a second model version and finds the `expected` of earlier shows unchanged, and a rebuild with `content/model.v1.json` removed gives `version_missing` on those rows. Evidence: the recompute test's report, from TSK-1086.
8. The `why` of every `item_shown` of a held subtype in the simulation includes `transfer_hold`, and no play route response holds `why`. Evidence: the simulation's report and the packet test's report, from TSK-1082 and TSK-1088.
9. After the MVP, a report test on a fixture log finds near and far apart, by the graph and by domain, no node figure, «мало данных» with its count below 10, the mean `expected` beside each share, both definitions and the note on school. Evidence: the report test's report, from TSK-1089.
10. Every requirement ADR-0410 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the count of `template_one_context` warnings on the fixture templates, which TSK-1077 reports and which shows early whether the list is too coarse for the hold to run, and the share of shows marked `frameRepeat` in the simulation of TSK-1088 against the 1 in 4 that ADR-0410 reverses the context hold on.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-1076 The closed list of contexts only gains entries, and the server refuses a tag it doesn't hold
      closes: REQ-6902, REQ-6904
      depends: none
- [ ] T-002 [P] TSK-1077 The template schema takes `contexts`, refuses `formats` and any third format, and warns on one context
      closes: REQ-6910, REQ-6912, REQ-6918, REQ-6920, REQ-6922
      depends: TSK-1076 - the schema checks each id against the list.
- [ ] T-003 [P] TSK-1078 Every accepted frame records its context, and a frame without one is never served
      closes: REQ-6900, REQ-6914, REQ-6916
      depends: TSK-1076 - the event takes an id from the list.
- [ ] T-004 [P] TSK-1079 A frame request names the least used context, and the review screen lets the parent change it or park the frame
      closes: REQ-6906, REQ-6908
      depends: TSK-1078 - acceptance writes the context the screen shows.
- [ ] T-005 TSK-1080 The frame picker keeps one unshown context back until the node is fluent and repeats the oldest frame instead
      closes: REQ-6926, REQ-6928, REQ-6982
      depends: TSK-1078 - the picker reads each frame's context from its acceptance.
- [ ] T-006 [P] TSK-1081 A subtype with both formats takes only bare templates until its node is fluent or 14 game days pass
      closes: REQ-6924
      depends: TSK-1080 - it reads the used sets that task folds from the log.
- [ ] T-007 TSK-1082 Both holds run from the first adventure and put `transfer_hold` in `why`
      closes: REQ-6930, REQ-6932
      depends: TSK-1080 - the context hold is what it marks.; TSK-1081 - the format hold is what it marks.
- [ ] T-008 [P] TSK-1083 A side slot takes the subtype, format and context she has already met
      closes: REQ-6954, REQ-6956
      depends: TSK-1080 - step 3 of the picker is the side-slot rule.
- [ ] T-009 [P] TSK-1084 `first_exposures` marks each first show of a subtype, format and context once, at its highest kind, with its category
      closes: REQ-6934, REQ-6938, REQ-6940, REQ-6944, REQ-6958, REQ-6960, REQ-6962
      depends: TSK-1078 - the context of a show comes from its frame's acceptance.; TSK-1080 - the projection extends the used sets that task folds.
- [ ] T-010 TSK-1085 A first encounter is eligible only when it measures transfer, and its reason names the first failing condition
      closes: REQ-6946, REQ-6948, REQ-6950, REQ-6952
      depends: TSK-1084 - it fills the `eligible` and `reason` fields of its rows.
- [ ] T-011 [P] TSK-1086 A rebuild keeps the `expected` each show had under the model version active then
      closes: REQ-6942
      depends: TSK-1084 - it keeps the model-derived fields of its rows.
- [ ] T-012 [P] TSK-1087 The transfer view feeds no estimate, state, probe or block, and a first encounter still counts in «сама»
      closes: REQ-6964, REQ-6966
      depends: TSK-1084 - the fence and the property test need the projection.
- [ ] T-013 TSK-1088 A 60-day simulation shows each first encounter once and both holds keeping their encounters back
      closes: REQ-6980
      depends: TSK-1082 - it runs both holds.; TSK-1083 - it fills side slots under the rule.; TSK-1085 - it counts only eligible encounters.
- [ ] T-014 [P] TSK-1089 After the MVP, the report shows near and far transfer apart, pooled, with the expected chance beside each share
      closes: REQ-6968, REQ-6970, REQ-6972, REQ-6974, REQ-6976, REQ-6978
      depends: TSK-1085 - it reads only eligible rows.; TSK-1086 (not blocking) - its mean `expected` reads the same rows with or without the version rule; the report shows the right figure once both land.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-1076.
- After TSK-1076: TSK-1077 and TSK-1078.
- After TSK-1078: TSK-1079, TSK-1080 and TSK-1084.
- After TSK-1080: TSK-1081 and TSK-1083.
- After TSK-1080 and TSK-1081: TSK-1082.
- After TSK-1084: TSK-1085, TSK-1086 and TSK-1087.
- After TSK-1082, TSK-1083 and TSK-1085: TSK-1088.
- After TSK-1085: TSK-1089.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1076 | REQ-6902, REQ-6904 |
| TSK-1077 | REQ-6910, REQ-6912, REQ-6918, REQ-6920, REQ-6922 |
| TSK-1078 | REQ-6900, REQ-6914, REQ-6916 |
| TSK-1079 | REQ-6906, REQ-6908 |
| TSK-1080 | REQ-6926, REQ-6928, REQ-6982 |
| TSK-1081 | REQ-6924 |
| TSK-1082 | REQ-6930, REQ-6932 |
| TSK-1083 | REQ-6954, REQ-6956 |
| TSK-1084 | REQ-6934, REQ-6938, REQ-6940, REQ-6944, REQ-6958, REQ-6960, REQ-6962 |
| TSK-1085 | REQ-6946, REQ-6948, REQ-6950, REQ-6952 |
| TSK-1086 | REQ-6942 |
| TSK-1087 | REQ-6964, REQ-6966 |
| TSK-1088 | REQ-6980 |
| TSK-1089 | REQ-6968, REQ-6970, REQ-6972, REQ-6974, REQ-6976, REQ-6978 |

The smallest set of tasks that would test the decision is TSK-1078, TSK-1080, TSK-1081, TSK-1085 and TSK-1088. Together they show whether a frame names its context, whether the two holds keep a first encounter back until the node is fluent, and whether the encounter that results is eligible, which are the three things the decision's premortem names.

## Not covered

No requirement ADR-0410 addresses is deferred. The decision leaves these things to other records, and no task here builds them:

- The report's intervals, floors across measures, interpretation wording and addendum 2's MVP scope, which ADR-0380 owns; TSK-1089 reads them.
- The profile's transfer bar, which ADR-0390 owns.
- The retention check's slot and the weekly breakdown's categories, which ADR-0400 owns; TSK-1083 and TSK-1084 read them through a stand-in until its epic exists.
- Frames in English and Dutch, and a mapping from old subtype ids to new ones after a graph change.
- The owner's one reading of the first list: TSK-1076 drafts `content/contexts.yaml`, and the owner's reading of it is a judgement the stage acceptance holds, not a task.
