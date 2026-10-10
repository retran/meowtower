---
id: TSK-0666
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3202, REQ-3230, REQ-3224]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A screen reader announces a System window and a new story line without interrupting, and every counter names its resource

After this task, the root holds one polite live region from the first paint, a new System window writes its text there, the story log announces new lines through its own `role="log"` region, and each resource counter has an accessible name.

## Acceptance criteria

1. Given the first paint of any story screen, when the document is read, then exactly one element has `aria-live="polite"` and it is present before any System window exists (REQ-3202). Closed by: a Playwright test that reads the DOM at first paint.
2. Given a new System window, when it appears, then its text is written to the live region once, and the window inside the story log has no `role="status"`, so it is announced once and nothing interrupts the reader (REQ-3202, REQ-3230). Closed by: a Playwright test that records the live region's changes and reads the window's attributes.
3. Given a new line in the story log, when it is added, then the log's `role="log"` region announces it and no assertive region exists on the page (REQ-3230). Closed by: a Playwright test that lists every `aria-live` and `role` attribute.
4. Given each resource counter, when the accessibility tree is read, then each has an accessible name from the language file that names its resource, such as buttons, shards, yarn or threads, and a counter with no name fails the test (REQ-3224). Closed by: a Playwright test over the accessibility tree.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the live region to the root of the client shell and let `SystemWindow` write to it through one function, so the text isn't announced from two places. Drop the `role="status"` the owner's bundle gives a System window when it sits in the log, and list it in `divergences.json`. The story log keeps its latest 200 messages in the DOM and fetches older ones on scroll, a ceiling ADR-0150 chose so a long day never slows the iPad.

## Depends on

- TSK-0660 (blocking): `SystemWindow`, the story log and the counters are ported components.

## Evidence

Not yet.

## Left alone

What a counter shows and when, which the epic realising ADR-0140 owns through its grants, and the voice of the System lines, which the epic realising ADR-0160 owns.
