---
id: TSK-0370
artifact: task
status: done
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

Collected on 2026-10-10 on the Mac, at commit c37443f of the branch `tsk-0370-scenes-chests-rewards-resume`; the pull request is not opened yet. Every criterion is met except where the notes below say a state can't be told apart.

- Verbs: `meow-verbs` isn't installed on this Mac, so each command of `.meowpaw/profile.toml` ran by itself and exited 0: `npx prettier --check .`, `npm run lint`, `npx tsc --noEmit`, `npm test` (45 Vitest files with 411 tests, and 37 Playwright tests passed, 1 skipped) and `npm run build && docker compose build`. The two `✘` lines of the Playwright list are the `test.fail()` self-tests of the response recorder.
- Criterion 1, REQ-0216 and REQ-0218: `tests/e2e/scene-resume.spec.ts` leaves a first context at the task shown, after a hint, after an explanation, after the answer with the parallel task open, and after that answer, then at the scene and at the chest. A second browser context resumes each time and gets the same `itemId`, view, attempt number, hint levels, scene lines, branches and chest options, and `llm_call` and `scene_prepared` counts don't grow. `tests/integration/scene-resume.test.ts` repeats the scene and chest cases on the API.
- Criterion 2, REQ-0208: the same spec types into the scene with Playwright's clock installed: the first character is sent at once, the rest waits, 9 seconds later nothing more has gone out, and at 10 seconds the full text goes out; the log holds exactly those two drafts, and a reload shows the last one.
- Criterion 3, REQ-0208: `tests/integration/scene-resume.test.ts` acknowledges the scene's grant, takes the chest's, and finds `ResumeOut.rewards` holding only the chest's. `tests/e2e/scene-resume.spec.ts` shows that a resume with an unacknowledged grant draws it, acknowledges it once, and lists nothing on the next resume.
- Criterion 4, REQ-0208: after each of 7 requests of a played finale the stored `resume_snapshot` equals `resumeFromLog` (0 differences), and a rebuild from the log alone gives the same row; the point holds `scene`, `chest` and `rewards`.

Resting on judgement: of the attempt states RES-2550 lists, `explanation_shown` can't be told from `explanation_pending` by any program, because SPC-0030 keeps an explanation's text out of the log and a resume sends it again; the spec covers the two as one state.

Choices made here, because the approved records left them open:

- The stand-in scene and chest come after the adventure's last task, before the end packet, so no other test meets them before the finale. `tests/integration/lifecycle.test.ts` and `tests/integration/packet-recorder.test.ts` pass both before the end, in a commit of their own.
- `POST /api/session/:id/scene/input` takes `kind` `choice`, `text` or `draft`; a choice and a text answer the scene and grant one stand-in reward, and a draft changes nothing else. The stand-in trims the text, because ADR-0110 owns its cleaning. `POST /api/session/:id/chest` is the route SPC-0030 lists, with the pick and its grant, because no other task of EPC-0030 adds it and the finale can't end without it.
- The client resumes through `POST /api/adventure/resume` when an adventure is open and starts a session otherwise, so it draws grants no device showed. The play and lease specs wait for either route.
- `GET /api/session/:id/next` returned the rungs of the session it ran in, so a resume lost them, and it never returned an open second attempt, so a resume showed the next first attempt instead. Both are fixed here, the second with a test of its own, because criterion 1 needs the same step.
- Rows of `resume_snapshot` written before this task have no scene, chest or rewards; the fold defaults them, so no rebuild is needed.

Open, outside this task: a verdict is logged in the session the answer is posted to, and the item routes read the session the item was shown in, so a second attempt asked after a resume and an answer in the new session gets `409 attempt_open`. The specification and TSK-0360's tests don't cover it, and the stand-in screen has no second-attempt control yet. Not fixed here.

## Left alone

Scene text and chest contents, which ADR-0110 and ADR-0140 define.
