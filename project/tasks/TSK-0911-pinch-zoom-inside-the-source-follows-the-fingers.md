---
id: TSK-0911
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5980, REQ-5982, REQ-5984]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A pinch inside the source zooms it with no animation and moves nothing else in the task window

After this task, two fingers on a source zoom it from 1 to 3 as they move, one finger pans it while it is zoomed, and no other element of the task window changes place.

## Acceptance criteria

1. Given a source at zoom 1, when a Playwright test pinches outward with two pointers inside it, then the zoom rises and stops at 3, and a pinch inward returns it to 1 and no lower (REQ-5980). Closed by: the Playwright test.
2. Given the same pinch, when the test reads `getAnimations()` on the source and the page during it, then the result is empty, and the transform is written on each pointer move with no transition (REQ-5982). Closed by: the Playwright test.
3. Given the task window's elements outside the source, when a scripted pinch runs, then each is at the same place and size before and after it (REQ-5984). Closed by: the Playwright test that compares bounding boxes.
4. Given a zoomed source, when one finger moves 30 CSS px, then the source pans; given one finger that moves 8 px and lifts, then it is a tap on the region under it; given a trackpad pinch that arrives as a wheel event with `ctrlKey`, then it zooms the same way; given the task changes, then the zoom returns to 1 (ADR-0300). Closed by: a Playwright test for each case.
5. Given a device with no two-pointer input, when a source shows, then it stays at zoom 1, where its text is at the `task` size, and nothing else changes (ADR-0300). Closed by: a Playwright test with touch emulation off.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the gestures to `SourceView`. The container has a fixed size and sets `touch-action: none`, reads two pointers and writes a CSS transform on the inner SVG on every pointer move, so the zoom follows the fingers and a transition never exists. I chose a zoom range of 1 to 3, as ADR-0300 did, because at 3 a 56 px cell is 168 px and a larger zoom shows less than one row. I chose a move of less than 10 CSS px as a tap, as ADR-0460 did, so a finger that trembles still selects.

The zoom lives inside the component, because page zoom on the iPad is untested against the task window's fixed layout, and the real-iPad checklist of TSK-0913 tests it.

## Depends on

- TSK-0910 (blocking): the component and its regions.

## Evidence

Not yet.

## Left alone

A zoom event in the log and any report of how often the player zooms, which the decision leaves out. Page zoom, which the checklist judges on a real iPad.
