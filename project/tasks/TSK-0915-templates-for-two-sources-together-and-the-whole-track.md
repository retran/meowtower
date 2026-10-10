---
id: TSK-0915
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5990]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Templates for I5 combine two sources, and the first version holds the whole track

After this task, I5 has templates that combine two sources at the four levels, the Director offers them only after two of I1 to I4 are at «понимает», and the game holds the track's five nodes, its component and its screen.

## Acceptance criteria

1. Given I5, when the build lists its templates, then each of the four levels has one that draws two sources of the kinds I1 to I4 build, each with an accepted frame (REQ-5990). Closed by: the build check's output.
2. Given each I5 template and 10,000 seeds, when the property test runs, then it finds no violation of the five source rules, and generation stays within 50 ms at the 95th percentile (REQ-5990). Closed by: the property test's report and the verification run's output.
3. Given a golden fixture log that gives I1 and I2 «понимает» by full blocks, when the Director picks the day's track node, then I5 becomes a candidate only then (REQ-5990). Closed by: a Director test over the fixture log.
4. Given all five nodes with built templates, when a 30-day simulation runs, then every host day shows exactly 2 track tasks on the first host floor, and no node shows «не проверено» after its first full block (REQ-5990). Closed by: the simulation's report and a report test.
5. Given the MVP's acceptance, when the owner reviews the game, then the track holds its five nodes, its component and its report screen (REQ-5990). Closed by: the owner's judgement at the MVP acceptance, because the requirement asks for the first version to hold the track and the MVP contents list doesn't name it.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the I5 templates on top of the source builders of I1 to I4: a combine question may join two parts of one table, and a find question may point into one of two sources. The track is in the MVP, in the stage ADR-0210's stage order gives it. If no node of the `sources` track holds a built template, the Director plans no track task and the screen shows every node as «не проверено», so the increment can be removed by removing the templates.

## Depends on

- TSK-0914 (blocking): the source builders and frames the I5 templates combine.
- TSK-0903 (blocking): the I5 gate and the node choice criterion 3 and 4 read.
- TSK-0912 (not blocking): the report screen the owner's judgement covers; a template can be built before it.

## Evidence

Not yet.

## Left alone

Whether a track task that carries bridge keywords counts toward its node, which ADR-0210's rule for bridge tasks governs.
