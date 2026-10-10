---
id: TSK-0609
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-0105, REQ-0107]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent prepares the day's adventure ahead, previews it, and the approved one plays with no live model call

After this task, `./meowtower adventure plan --preview` plans the route and the task slots, has the Master draft and check the scene orders in advance, shows the whole prepared adventure for the parent's approval, and an approved adventure is served from the unplayed pool on the next game day with no model call during play.

## Acceptance criteria

1. Given the command, when it runs, then the Director plans the route and 30 to 40 task slots, the Master drafts and checks the scenes, and the preview lists the route, the story scenes, the task statements and the answers (REQ-0105). Closed by: an integration test over the command's output.
2. Given a preview, when the parent approves it, then `adventure_approved` is logged, and when the parent swaps one task, then the preview shows the swapped task before approval (REQ-0105). Closed by: an integration test.
3. Given an approved adventure and a gateway stub that records its requests, when the player plays it the next game day, then the server serves its pre-planned route, rooms, tasks and checked scenes and the stub records no request (REQ-0107). Closed by: an integration test over a played adventure.
4. Given no approved adventure, when the game day opens, then the planner of EPC-0090 builds one live. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `adventure plan --preview` command to `meowtower`, the `adventure_approved` event and the unplayed pool, and the server's check at a game day's opening for an approved adventure, as SPC-0090 states. The task statements and answers shown in the preview come from the generator of EPC-0040; until the epic realising ADR-0070 selects tasks the preview lists the stand-in tasks.

## Depends on

- TSK-0600 (blocking): the pre-checked scenes come from the queue and the library that task builds.

The epic realising ADR-0090 builds the live plan that the pool falls back to; the epic realising ADR-0180 draws the preview in the Parent Room.

## Evidence

Not yet.

## Left alone

The Parent Room's preview screen and the swap control, which ADR-0180's epic draws.
