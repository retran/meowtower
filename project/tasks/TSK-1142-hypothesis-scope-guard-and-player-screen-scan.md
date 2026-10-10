---
id: TSK-1142
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7354, REQ-7358, REQ-7374]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The scope guard keeps the post-MVP part out, and the player's screens show no hypothesis

After this task, a tree that adds `content/hypothesis-measures.json`, a `hypothesis_days` table or a version 2 hypothesis schema fails the scope guard, the Parent Room offers no link to a school goal, and the end-to-end scan of the player's screens fails on a hypothesis text or label.

## Acceptance criteria

1. Given a fixture tree that adds `content/hypothesis-measures.json`, when the scope guard runs, then it fails and names the file; given the same for a `hypothesis_days` table and for a version 2 schema of either hypothesis event, then each fails the same way (REQ-7358). Closed by: three fixture tests of the scope guard.
2. Given the first-version build, when the form's route schema and the stored events are read, then no numeric condition, no link to a dimension or a presentation and no computed label exists (REQ-7358). Closed by: a schema test over both events and the three routes.
3. Given a canary hypothesis text and a hypothesis in each state the first version has, when the end-to-end scan walks every player screen, then it finds neither the canary nor any `parent.hypotheses.*` string (REQ-7354). Closed by: the end-to-end scan's report.
4. Given the form, when the parent links a hypothesis, then no control offers a school goal while ADR-0310's two screens don't exist (REQ-7374). Closed by: a Playwright test that lists the form's controls.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add three traces to `verify/scope-guard.json` as ADR-0450's Consequences name them, `content/hypothesis-measures.json`, a `hypothesis_days` table and a version 2 schema of either event, and give each trace the backlog item whose first task removes it, so the guard loses a trace only in the change that starts building its part. Extend the end-to-end scan's canary list with a hypothesis text and every `parent.hypotheses.*` label. Keep the school-goal link out of the form's controls behind one check that reads whether ADR-0310's screens exist.

## Depends on

- TSK-1141 (blocking): the scan needs the tab and its strings to exist.

The epic realising ADR-0190 supplies the scope guard and the end-to-end scan; where it hasn't landed, the three traces and the canary go in the fixtures this task adds, and that epic moves them into its files.

## Evidence

Not yet.

## Left alone

Removing a trace, which the first task of the post-MVP work does, and the scan's other canaries, which ADR-0190 owns.
