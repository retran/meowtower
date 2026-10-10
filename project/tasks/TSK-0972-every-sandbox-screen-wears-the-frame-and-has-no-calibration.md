---
id: TSK-0972
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6346, REQ-6358]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every sandbox screen shows the striped frame and its label, and the sandbox has no calibration

After this task, the client draws the frame and the label «Песочница — не влияет на игру» on each sandbox screen from `data-mode="sandbox"`, and no route or control under the sandbox runs the adult's calibration.

## Acceptance criteria

1. Given each sandbox screen on the iPad and the computer viewports, when it renders, then the root has `data-mode="sandbox"` and the frame and the label are visible (REQ-6346). Closed by: a Playwright test over every sandbox screen on both viewports.
2. Given the Russian string file, when the label is read, then it holds «Песочница — не влияет на игру» and no component holds the text in code (REQ-6346). Closed by: the string check of group 1 and a component test.
3. Given the routes under `/api/parent/sandbox/`, when they are listed, then none runs a calibration, and no sandbox screen has a control that opens one (REQ-6358). Closed by: a route-table test and a Playwright search of the sandbox's controls.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Set the root attribute `data-mode="sandbox"` in the client shell for every sandbox screen, as the design system's striped frame component of ADR-0150 reads it, and add the label to the Russian string file of ADR-0160. The old attribute `data-mode="test"` and its label leave the code. Keep the adult calibration of ADR-0180 a Parent Room mode with no entry from the sandbox. Choice made here under M2: the label sits in the frame's one slot, so no screen needs its own copy.

## Depends on

- TSK-0971 (not blocking): the screens under test are the sandbox's own; the Playwright test can run on one stand-in sandbox screen until the routes exist, and the full sweep waits for them.

The epic realising ADR-0150 supplies the frame component and the epic realising ADR-0160 the string files.

## Evidence

Not yet.

## Left alone

The design of the sandbox's screens beyond the frame and the label, which the specification step and ADR-0150 own.
