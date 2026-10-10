---
id: TSK-0619
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0632]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent lists stored variants by group and hides any one from the player

After this task, the Parent Room's stand-in page lists the stored variants by group with each familiar and a hide control, a hidden variant is never shown and never deleted, and it stops counting towards the 3 visible variants so its group can fill again.

## Acceptance criteria

1. Given stored variants, when the parent opens the page behind the PIN, then they are listed by group with each familiar, the reuse failure count and a hide control; without a parent session the route answers `401` (REQ-0632). Closed by: an integration test and a Playwright test.
2. Given a hidden variant, when a simulated month plays, then it is never shown, and its row stays in `explain_cache` (REQ-0632). Closed by: a simulation test.
3. Given a group with 3 visible variants and one hidden, when the next explanation is asked, then the group asks for a new variant, because hidden ones don't count. Closed by: a unit test.
4. Given the hide, when it is read in the log, then a logged `settings_changed` event with the key `explanationHidden` and the variant's id records it, so a recompute keeps the parent's choice. This key is a choice I made, because the approved records name no event for the hide. Closed by: a projection rebuild test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the parent route and the stand-in list to the Parent Room's page, and the status change on the variant. The Parent Room's own screen is ADR-0180's.

## Depends on

- TSK-0616 (blocking): the list reads that task's cache.

The epic realising ADR-0180 draws the screen; this task puts the control on the stand-in page.

## Evidence

Not yet.

## Left alone

A bulk hide and a filter by familiar, which no requirement asks for.
