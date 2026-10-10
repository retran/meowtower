---
id: TSK-0940
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6142, REQ-6144]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every tap changes the tapped control's look within 100 ms, and inside the task window the change is instant

After this task, every control kind shows a pressed look from a CSS `:active` state within 100 ms of a tap, Safari on iOS applies it because the client registers a passive `touchstart` listener, and `.tw-btn` inside the task window has no transition.

## Acceptance criteria

1. Given a Playwright test at the iPad viewport that taps each control kind, when it reads the control's computed style 100 ms after the tap, then the style differs from the one before it (REQ-6142). Closed by: the Playwright test over every control kind.
2. Given the client, when its listeners are read, then it registers exactly one passive `touchstart` listener on the document, and the pressed look is a CSS `:active` state, not a class a script sets (REQ-6142). Closed by: a client test that lists the listeners and a style test.
3. Given the task window, when the test taps each action button, then `getAnimations()` returns no result for it, and `.tw-btn` computes `transition: none` (REQ-6144). Closed by: the Playwright test.
4. Given `divergences.json`, when the drift check reads it, then it lists the departure from the owner's `bundle.css` 90 ms press transition with RES-4110 as its finding, and reports the difference once (ADR-0320). Closed by: the drift check's output.
5. Given the stage 0 spike's iPad, when the pressed look is measured on the device and it comes later than 100 ms, then ADR-0320's fifth reversal condition applies and the look moves from `:active` to a class set in a `pointerdown` handler (REQ-6142). Closed by: the adult's measurement on the real iPad at the spike, because the device's timing isn't reachable from a browser test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the passive `touchstart` listener to the client, `transition: none` for `.tw-btn` inside the task window to `src/ui/ds/corrections.css`, and the entry in `divergences.json`; ADR-0150's part 1 now allows a port to depart from `bundle.js` where RES-4110 says so. The pressed look is an instant change of state inside the task window, because nothing may animate there and a press transition counts as an animation.

## Depends on

Nothing. The epic realising ADR-0150 supplies the design-system port, its corrections file and the drift check.

## Evidence

Not yet.

## Left alone

The owner's design files, which keep the 90 ms press on `.tw-btn`; the drift check reports the difference once and the owner can carry the change into `design/` by hand.
