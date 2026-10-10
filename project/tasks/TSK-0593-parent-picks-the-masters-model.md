---
id: TSK-0593
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-1694, REQ-1696, REQ-2630]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent switches the Master's model among approved models, and the pick applies at the next adventure

After this task, the Parent Room lets the parent pick only from `MASTER_MODEL_CHOICES`, the pick applies at the next adventure, and a pick that fails the check at that adventure's start falls back to `MASTER_MODEL` with a `master_pick_rejected` event the Parent Room shows.

## Acceptance criteria

1. Given a model outside `MASTER_MODEL_CHOICES`, when the parent sends it as a pick, then the route refuses it, and the Parent Room lists only the approved models (REQ-1694). Closed by: an integration test and a Playwright test of the list.
2. Given a pick made during an adventure, when that adventure goes on, then it keeps its model, and the next adventure uses the pick (REQ-1696). Closed by: an integration test over two adventures.
3. Given a pick with no zero-retention endpoint at a player-tier provider, when the next adventure starts, then it runs on `MASTER_MODEL`, `master_pick_rejected` is appended, and the Parent Room shows it (REQ-2630). Closed by: an integration test with a mocked catalogue and a Playwright test of the notice.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the pick to the parent settings as a `settings_changed` key, validate it against the list at write time, and re-validate at the adventure's start against the catalogue and the zero-retention list the check of TSK-0584 reads. `MASTER_MODEL_CHOICES` is the list of approved Master models from the owner-approved decision record that names the bake-off's choices; until that record exists it holds `MASTER_MODEL` alone.

## Depends on

- TSK-0592 (blocking): the pick chooses the first model of that task's list.
- TSK-0584 (blocking): the re-validation uses that task's catalogue and zero-retention reads.

- TSK-0594 (not blocking): the list comes from the decision record its bake-off supports; until then the list holds `MASTER_MODEL` alone.

The epic realising ADR-0180 draws the pick in the Parent Room's own page.

## Evidence

Not yet.

## Left alone

The bake-off scoring screen, which ADR-0180's epic draws.
