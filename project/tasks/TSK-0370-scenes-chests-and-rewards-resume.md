---
id: TSK-0370
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-0208, REQ-0216, REQ-0218]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Scenes, drafts, chests and pending rewards resume from the log alone

After this task, everything `resume_snapshot` holds comes from the log: a prepared scene, a free-text draft, a chest's three options and the rewards not yet shown, so a resume on another device continues each without a new request to the Master.

## Acceptance criteria

1. Given play left at each attempt state RES-2550 lists, from `shown` to `second_attempt_shown`, and at a scene line and a chest, when a second browser context resumes, then it shows the same `itemId`, view, step, scene line and chest options, and the log gains no `llm_call` (REQ-0216, REQ-0218). Closed by: the Playwright report, one case per state.
2. Given a draft typed in a scene, when the player leaves and resumes, then the draft returns as `text_draft_saved` last held it, and the client sent it at most once every 10 seconds. Closed by: a Playwright test with a fake clock.
3. Given a grant shown and one not yet shown, when the player resumes, then `ResumeOut` lists only the one not shown. Closed by: an integration test.
4. Given the log alone, when `resume_snapshot` is dropped and rebuilt, then every scene, draft, chest and pending reward in it equals the one before (REQ-0208). Closed by: the rebuild test.

## What to do

Add the event types `scene_prepared`, `text_draft_saved` and `rewards_delivered` with their schemas, the draft through `POST /api/session/:id/scene/input`, the acknowledgement through `POST /api/session/:id/rewards/delivered`, and fold them and `chest_offered` into `resume_snapshot`, as SPC-0030 states them.

Stand-ins: the stand-in adventure's scene, with fixed lines and branches logged as `scene_prepared`, stands in for ADR-0110's scenes, and its chest, logged as `chest_offered` with three fixed options, for ADR-0140's. ADR-0190's definition of done applies.

## Depends on

TSK-0360, because it adds these items to the snapshot and the resume that task builds.

## Evidence

Not yet.

## Left alone

Scene text and chest contents, which ADR-0110 and ADR-0140 define.
