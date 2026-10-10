---
id: TSK-0704
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-3406]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A heroine picture's tint mask is made offline, approved by a person and sent only once approved

After this task, `tools/art-generate.ts mask <id>` makes a candidate tint mask from the chosen picture's cardigan and bow colours, the parent approves it in the Parent Room, and the server sends a mask only once it is approved.

## Acceptance criteria

1. Given a fixture heroine picture with known cardigan and bow pixels, when `mask <id>` runs, then `data/art/masks/<id>.mask.webp` covers those pixels and no other (REQ-3406). Closed by: a unit test that compares the mask with the known pixel set.
2. Given a candidate mask, when the parent approves it on the tint-mask panel, then it is copied to `public/art/<id>.mask.webp` and `art_jobs` records who approved it and when; given no approval, then the server doesn't send the mask (REQ-3406). Closed by: an integration test and a Playwright test.
3. Given a candidate mask over a picture, when the parent compares them, then the parent judges that the mask covers only the cardigan and the bows (REQ-3406). Closed by: the parent's judgement at the panel, because a program can match colours and can't tell a bow from a ribbon on the apron.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `mask` subcommand, the panel that shows the candidate over the picture, the approval route behind the parent session and the server's rule that a mask leaves only once approved. A picture with no approved mask is sent untinted, and the server logs `tint_mask_missing` for the parent. The panel's tab belongs to the epic realising ADR-0180.

## Depends on

- TSK-0701 (blocking): the mask is made from a chosen picture and approved through the same panel code.
- TSK-0702 (blocking): the server's resolution is where an unapproved mask is held back.

## Evidence

Not yet.

Criterion 3 rests on the parent's judgement, because the requirement says only the cardigan and the bows tint and the boundary of a bow is a likeness question.

## Left alone

The runtime colour filter that uses the mask, which TSK-0705 builds, and the six colours the player picks from, which ADR-0150's screen 02 owns.
