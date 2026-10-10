---
id: TSK-1032
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6604, REQ-6626, REQ-6628]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every line the report draws names a check to run and proposes no lesson

After this task, each `parent.check.*` string reads «что проверить» and names one check, a build check fails a value with a lesson, a session, an exercise or a date, and the parent judges that no figure is worded as a diagnosis.

## Acceptance criteria

1. Given the `parent.check.*` strings, when each is read, then it names one check the game or the parent can run: a probe phase, a retention check, the sandbox or a question to the teacher (REQ-6626). Closed by: a unit test that each key carries a `check` kind from that list.
2. Given a fixture `parent.check.*` value that contains «урок», one that contains «занятия» and one that contains a date, when the label check runs, then each fails with `check_text_names_lesson` (REQ-6628). Closed by: ADR-0180's label check with the three fixtures; the rule rejects the stems «урок», «заняти» in every form and «упражнени», and any date.
3. Given every figure, label and line of addendum 2's report parts, when the parent reads them, then none is worded as a diagnosis (REQ-6604). Closed by: judgement, the parent reads them at each stage's acceptance, because a diagnosis is a matter of wording and counts can't show it.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the rule to ADR-0180's label check, which already rejects «плохо», «отстаёт» and «невнимательная» in `parent.*`. The strings live in the Russian string file under `parent.check.*` and the language and maths lines of TSK-1031 read them. A line can still name the window its figures come from.

## Depends on

Nothing in this epic.

The epic realising ADR-0180 supplies the label check; where it doesn't exist yet, add the rule as a function in `tools/static-checks.ts` beside the existing checks.

## Evidence

Not yet.

## Left alone

The wording of every line, which the parent judges at the acceptance of the stage that builds it.
