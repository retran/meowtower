---
id: TSK-0846
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5534, REQ-5536, REQ-5590]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `./meowtower yarn-weeks` prints star yarn per source for each week, and two high weeks in a row raise one notice

After this task, `./meowtower yarn-weeks` prints, for each week of 7 game days from Monday, the star yarn granted per source with `short_loop` as its own row, the floors that logged `no_grouping_candidate` and the attempts that reached `grouping_link_cap`, and the server raises `yarn_weeks_high` once when a week closes as the second in a row above 60.

## Acceptance criteria

1. Given a fixture log of 4 weeks with grants from several sources, when the command runs, then it prints one row per source for each week, `short_loop` among them, and the two counts beneath (REQ-5534). Closed by: the command's output over the fixture.
2. Given weekly yarn of 61, 62, 63, 50 and 61, 62, when the notice test replays them, then `yarn_weeks_high` is raised exactly twice, after the second and the sixth week, and shows in `./meowtower status`, per ADR-0370 (REQ-5536). Closed by: the notice test's report.
3. Given `content/economy.json`, when the diff check compares the forge recipe amounts with REQ-2172's, then they are equal, and the check fails when they change without a record opened under REQ-5536 (REQ-5590). Closed by: the diff check's output.
4. Given every week of stage 0.3, when the owner reads the table, then each week has a figure per source (REQ-5534). Closed by: judgement of the owner at the stage 0.3 review, because REQ-5534 names that review and the figures exist only after the weeks have been played.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the command to `./meowtower` reading `reward_granted`, and the notice to the server, once per run of high weeks, again only after a week at or below 60 has closed. The notice asks the owner to open a record that resizes the recipes; opening it is the owner's act and no code does it.

## Depends on

- TSK-0844 (blocking): `short_loop` is a source only once it is granted.

The epic realising ADR-0140 supplies `reward_granted` and `content/economy.json`; the epic realising ADR-0190's verify command supplies the diff check's harness.

## Evidence

Not yet.

## Left alone

Resizing the forge recipes, which the record that REQ-5536 opens decides, and the counts' causes, which TSK-0847 and TSK-0839 write.
