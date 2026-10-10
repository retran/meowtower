---
id: TSK-0400
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-0228, REQ-0230, REQ-0232, REQ-0236]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The three-day rule wraps up an adventure after its adventure days and queues its secrets

After this task, the server counts an adventure's adventure days, and on the first session of a new game day past `threeDayLimit` it finishes the open task and room, plays the short ending, logs `adventure_wrapped_up` with the unopened secrets, and puts them in `reward_queue`.

## Acceptance criteria

1. Given an adventure played on three game days with game days without play between them, when the first session of a fourth game day starts, then `ResumeOut.wrapUp` is true; the gaps don't count (REQ-0236). Closed by: the three-day test with a fake clock.
2. Given `wrapUp`, when the player finishes the open task and room, then the stand-in short ending plays and `adventure_wrapped_up` is logged with the secrets she didn't open (REQ-0228). Closed by: the three-day test.
3. Given the wrap-up, when `inventory` and `reward_queue` are read, then every grant from before it is still held, no event was removed or reversed, and the unopened secrets are in `reward_queue` (REQ-0230, REQ-0232). Closed by: the three-day test.
4. Given `threeDayLimit` off, when the same days pass, then no wrap-up happens. Closed by: the three-day test.

## What to do

Count adventure days as SPC-0030 states them: a game day runs from 04:00 to 04:00 in the time zone of the device she plays on. ADR-0090 owns the game day; until its epic exists, add the boundary function in `src/shared/` for that epic to take over. Set `wrapUp`, finish the room, log `adventure_wrapped_up`, and fold its secrets into `reward_queue`.

Stand-ins: the stand-in adventure's secrets list for ADR-0140's secrets, and a stand-in ending scene for the library's short ending, which ADR-0110 writes. ADR-0190's definition of done applies.

## Depends on

TSK-0360, because `wrapUp` travels in `ResumeOut`. TSK-0390, because the rule reads `threeDayLimit`.

## Evidence

Collected on 2026-10-10 on the Mac, at commit 5602b8b of the branch `tsk-0400-three-day-rule`; the pull request is not opened yet. Every criterion is met.

- Verbs: `meow-verbs` isn't installed on this Mac, so each command of `.meowpaw/profile.toml` ran by itself and exited 0: `npx prettier --check .`, `npm run lint`, `npx tsc --noEmit`, `npm test` (47 Vitest files with 426 tests, and 37 Playwright tests passed, 1 skipped; the two `✘` lines are the response recorder's `test.fail()` self-tests) and `npm run build && docker compose build`.
- Criterion 1, REQ-0236: `tests/integration/three-day-rule.test.ts` sets the clock with fake timers. Play on days 1, 3 and 6 gives `wrapUp` true on day 7 and false before; sessions that started and showed nothing count no day; 03:00 and 05:00 of one calendar day are two game days; `POST /api/adventure/resume` returns the same flag. `tests/unit/game-day.test.ts` covers the 04:00 boundary, a zone and a clock change.
- Criterion 2, REQ-0228: with `wrapUp` the server shows the open task again, the rest of the room, then the stand-in ending, and logs `adventure_wrapped_up` with the secrets; the ending stays until she answers it, and then the next packet is the end.
- Criterion 3, REQ-0230 and REQ-0232: an earlier `reward_granted` is still in `inventory` after the wrap-up, the log's earlier events are byte-equal and none was removed, `reward_queue` holds the three stand-in secrets, and both tables rebuild from the log alone.
- Criterion 4: with `threeDayLimit` set to `null`, six game days of play give no `wrapUp` and no `adventure_wrapped_up`.

Choices made here, because the approved records left them open:

- `gameDayOf(ms, zone)` is in `src/shared/game-day.ts` for ADR-0090's epic to take over. The device sends its IANA zone when a session starts or resumes, and a device that sends none gets the server's own zone.
- `session_started` gains version 2 with `zone`, upcast from version 1 with `null`, so each session's zone is in the log.
- `wrapUp` is true when the adventure has `threeDayLimit` adventure days before today's game day. It holds for the whole of that game day, whatever she is shown on it, and a limit lowered below the days an adventure already has takes hold at the next new game day.
- `inventory` (one row per `reward_granted`) and `reward_queue` (one row per queued secret) are added as the smallest projections criterion 3 can read; ADR-0140's epic gives them their rules. Neither existed before this task.
- The stand-in secrets are three fixed ids and none can be opened yet, so all three are queued. The stand-in ending has one option and gives no grant.

Open, outside this task: the short ending is drawn by the scene screen of TSK-0370, and no browser test plays a wrap-up.

## Left alone

When queued secrets return, which ADR-0140 decides, and the short ending's text, which ADR-0110 writes.
