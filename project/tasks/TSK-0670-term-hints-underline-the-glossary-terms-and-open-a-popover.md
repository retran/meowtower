---
id: TSK-0670
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-0840, REQ-0842]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A maths term with a glossary entry is marked, and a tap opens its explanation, picture and approved Dutch word

After this task, the task window draws every term span that has a glossary entry with a dotted underline as a button, and a tap opens a popover inside the task window and logs `glossary_opened`.

## Acceptance criteria

1. Given a task whose view lists term spans, two with a glossary entry and one without, when the window renders, then the two with an entry have a dotted underline and are buttons, and the one without has neither (REQ-0840). Closed by: a Playwright test that reads the spans.
2. Given a marked term, when the player taps it, then a popover inside the task window shows the term's Russian explanation and its picture from `lexicon.ru.json`, and no Dutch word unless the entry is approved (REQ-0842). Closed by: a Playwright test with an approved and an unapproved entry.
3. Given an approved entry, when the popover opens, then it shows the Dutch word beside the Russian explanation, and given the parent revokes the approval, then the next opening shows none (REQ-0842). Closed by: a Playwright test over the approval flag.
4. Given the popover opens, when the log is read, then it holds one `glossary_opened` event with the term and the `itemId`, and `document.getAnimations()` inside the task window is empty (REQ-0842). Closed by: an integration test of the event and a Playwright test of the animations.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw the spans from the task view's term list and open the popover as a layer of the task window, so the window's no-motion rule holds. Read the entry's text, picture and approval flag from the lexicon as the view carries them. Send `glossary_opened` through the event queue like any other write. The popover has no timer and closes on a tap outside it.

## Depends on

- TSK-0660 (blocking): the ported `TaskWindow` and its popover layer.

The epic realising ADR-0040 builds the spans from each template's `riskyTerms`, and the epic realising ADR-0180 holds the parent's approval of the Dutch word. Until they land, tests pass a fixture view and a flag on the entry.

## Evidence

Not yet.

## Left alone

The glossary's content, which the parent approves word by word, and which terms are risky, which ADR-0040's templates declare.
