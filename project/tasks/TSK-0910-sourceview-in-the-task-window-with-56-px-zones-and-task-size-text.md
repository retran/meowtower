---
id: TSK-0910
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5120, REQ-5974, REQ-5976, REQ-5978]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# SourceView shows the drawn source in the task window with 56 px touch zones and text at the task size

After this task, `src/ui/source/SourceView.tsx` shows the server's SVG inside the task window, every tappable region is at least 56 by 56 CSS px on the tablet at zoom 1, source text takes its size from the `task` type token, and the text-size check measures it.

## Acceptance criteria

1. Given a track task of each source kind at the iPad viewport, when a Playwright test measures the regions at zoom 1, then each is at least 56 by 56 CSS px (REQ-5974). Closed by: the Playwright test.
2. Given the same tasks, when the test reads each SVG text, then its computed size is at least 24 px, and at least 28 px with large text on; given a fixture `font-size` attribute on SVG text in `src/render`, then the lint rule fails and names it (REQ-5976). Closed by: the Playwright test and the lint rule's fixture.
3. Given a fixture source with SVG text at 12 px, when the automated text-size check runs, then it fails and names the element; given page text of the same size it fails as before (REQ-5978). Closed by: the check's test with both fixtures.
4. Given a task window with a drawn source, when its elements are listed, then it holds the task, the source with its tappable regions, the answer field or options, the keypad, «Не знаю», the guiding thread button and «Готово», and nothing else (REQ-5120). Closed by: a Playwright test that lists the window's controls.
5. Given a computer with a keyboard, when the focus moves through the regions, then it follows reading order and Enter selects one; and a tapped region changes its look within 100 ms with no transition (ADR-0300). Closed by: a Playwright test that reads the focus order and the computed style.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `SourceView` in `src/ui/source/`, which has no owner component in the design system, so the parent reviews it at stage acceptance from its entry in the stage review list; add that entry. The component imports `src/shared/` and the design system and nothing from `src/engine/`, `src/server/` or `src/render/source/`. The source sits inside the `data-task-content` subtree that the clock check skips, so a timetable's printed times don't fail it.

Source text gets its size from the `task` type token through a CSS class, never from a `font-size` attribute, because the text-size check can't see SVG attributes. Add the lint rule in `src/render` that rejects the attribute, and extend the check of ADR-0150 so it measures SVG text inside sources at the `task` size or above. The 56 px zone is the approved tablet minimum of RES-3100 and also meets the addendum's 44 by 44 pt, because one CSS pixel is one point on iPad Safari.

## Depends on

- TSK-0907 (blocking): the SVG the component shows.
- TSK-0908 (blocking): the region answer the component sends.

The epic realising ADR-0150 supplies the design system, the task window and the text-size check.

## Evidence

Not yet.

## Left alone

The pinch, the pan and the zoom range, which TSK-0911 builds. The parent's review of the component, which happens once at the stage's acceptance.
