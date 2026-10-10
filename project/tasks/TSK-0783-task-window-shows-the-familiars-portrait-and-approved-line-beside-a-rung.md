---
id: TSK-0783
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5120, REQ-5122]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The task window shows the familiar's portrait and one approved line beside each rung, and the same line after a resume

After this task, each rung shown before the answer appears with the portrait of the familiar accompanying her and one approved framing line for that familiar's kind and rung, the server stores the picked `framingId` with the rung so a resume shows the same line, and a rung with no approved line shows with the portrait alone.

## Acceptance criteria

1. Given an approved line for a familiar kind and rung, when the rung is shown on the tablet viewport, then the portrait and the line sit beside it, and the line is one of the approved variants (REQ-5122). Closed by: a Playwright test.
2. Given the parent approves another line for the same kind and rung after the rung was shown, when the task is resumed, then the same line shows, because the picked `framingId` is stored in `resume_snapshot` (REQ-5122). Closed by: the Playwright test.
3. Given no approved line for the kind and rung, or a stored line that has since been removed, when the rung shows, then the portrait shows with no line and no other line takes its place (REQ-5122). Closed by: the Playwright test.
4. Given the task window at any state, when its contents are read, then they are only the task, the answer field or options, the keypad, «Не знаю» (I don't know), the thread button and «Готово» (Done), plus the texts and controls REQ-5120 lists for a task's own form, and the strategy line after the answer takes no framing (REQ-5120). Closed by: a DOM test of the task window's controls against the list in REQ-5120.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend `TaskWindow` of ADR-0150 with an optional portrait and framing line beside a shown rung and nothing else from the scene. The server picks the variant among the approved lines by a hash of `itemId` and rung when it first shows the rung, and stores the `framingId` with the rung in `resume_snapshot`. A basic fact's strategy rung takes the rung 1 lines. When the stored line has been removed, the resumed rung shows with the portrait and no line, because a removed line must not show and a new pick would look like another familiar's voice.

Replace the window's list of controls with REQ-5120's list, which folds in every form's controls once; the controls of other forms join it as their epics add them. Count the lines missing for a kind and rung as `framing_missing` on the framing screen.

## Depends on

- TSK-0776 (blocking): the resume snapshot that stores the picked line.
- TSK-0782 (blocking): the approved lines the window shows.

The epic realising ADR-0150 supplies `TaskWindow` and the design system's portrait; until it exists, a stand-in portrait draws the familiar.

## Evidence

Not yet.

## Left alone

The look of the portrait and line, which ADR-0150 and the design system own, and the controls of forms whose epics aren't built.
