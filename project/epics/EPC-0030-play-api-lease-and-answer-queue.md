---
id: EPC-0030
artifact: epic
status: approved
revised: 2026-09-27
realises: ADR-0030
checked-at:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server decides play through HTTP and SSE, one device holds an adventure, and the client queue loses no answer

This epic realises ADR-0030: the shared schemas in `src/shared/api.ts`, the play routes, the SSE stream and its poll route, idempotent requests and charges, the adventure and session lifecycle, the device lease, the resume point, the three-day rule, the parent session, the finish-today route, and the client's answer queue and offline state. SPC-0030 states what the finished part does. The epic is complete when every criterion below holds with its evidence, and each task is done when its own criteria hold and the definition of done in ADR-0190 holds: `npm run verify` passes at the current stage.

Until the epics realising ADR-0040, ADR-0070, ADR-0080, ADR-0110, ADR-0120, ADR-0140 and ADR-0150 exist, the tasks run on stand-ins, as ADR-0030 allows for the packets. The stand-in adventure is a fixed sequence of hand-written test tasks, each with its answer, short solution, three hint rungs and a parallel twin, some marked scored and some not, plus one scene, one chest of three options, a list of secrets and a finale. The stand-in screens are the plainest screens the client shell of TSK-0100 can draw, with every string in the `ru` language file. Each task names the stand-ins it uses, and the epic that builds the real part replaces them.

## Acceptance criteria

1. A test records every packet the server sends in a simulated 30-day run and finds no field named `node`, `templateId`, `seed`, `params`, `purpose`, `scored`, `frameId`, `flowSlot` or `why`, and no correct answer in any packet sent before that task's first attempt. Evidence: the packet recorder's report, from TSK-0310, over the stand-in adventure now and over ADR-0190's simulation once it exists.
2. The static test finds neither `верно` nor `неверно` as a whole word in any string the answer reply can carry. Evidence: the lint verb's output, from TSK-0310.
3. Sending the same answer, hint, explanation and second-attempt request twice with the same `clientSeq` appends events once, charges one thread for each paid action, and returns equal replies; a hint repeated after a resume with a new `clientSeq` charges nothing. Evidence: the idempotency test's report, from TSK-0320, and the resume charge test's report, from TSK-0360.
4. After every event in the 30-day simulation, the stored `resume_snapshot` equals the one derived from the log alone. Evidence: the snapshot equality test's report, from TSK-0360.
5. A Playwright test leaves at each attempt state RES-2550 lists, from `shown` to `second_attempt_shown`, resumes on a second browser context, and finds the same `itemId`, view, step, scene line and chest options, with no new model request logged. Evidence: the Playwright report, from TSK-0370.
6. With two browser contexts, the second one's tap to continue makes the first show the view-only sentence within 5 seconds, and the first one's next answer gets `409 lease_moved`. Evidence: the Playwright report, from TSK-0350.
7. A test cuts the network after an answer, closes and reopens the client, restores the network, and finds that answer in the log exactly once, with the waiting scene shown and the three help controls inactive while the network was down. Evidence: the Playwright report, from TSK-0380.
8. An adventure played on three separate game days, with game days without play between them, is wrapped up on the first session of the fourth day it is played; it keeps every grant, and its unopened secrets appear in `reward_queue`. Evidence: the three-day test's report, from TSK-0400.
9. After `POST /api/parent/finish-today`, the next boundary sends `stop_offer` with `canExtend: false`, and `extend` gets `409 day_finished` until 04:00. Evidence: the finish-today test's report, from TSK-0410.
10. A parent request 31 minutes after the last one gets `401 parent_session_expired`. Evidence: the parent session test's report, from TSK-0390.
11. An attempt paused mid-task carries `interrupted: true`, and one finished on another device kind carries `crossDevice: true`. Evidence: the attempt flag tests' report, from TSK-0360.
12. The parent plays scored and unscored tasks side by side and can't tell them apart (REQ-2430). Evidence: the parent's signed-off judgement, from TSK-0340.
13. Every requirement ADR-0030 addresses lands in exactly one closed task. Evidence: `paw check coverage` with no finding for EPC-0030.

The epic can measure two things before it is finished. Once TSK-0300 is done, TSK-0030's crash test runs against the answer request and reports how many of 100 kills lose an answer whose reply was sent, where ADR-0010 predicts 0. TSK-0300 also reports the answer reply's 95th percentile against the 300 ms budget in ADR-0190's Baselines table.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number.

## Tasks

- [x] T-001 TSK-0300 An answer posted to the server is logged and committed before the reply, which returns the outcome and the correct answer (`src/shared/api.ts`, `src/server/`)
      evidence: meow-verbs exit 0, 236 tests; answer committed before reply; p95 4.33 ms; crash 100 of 100 (TSK-0300 Evidence)
      closes: REQ-2416, REQ-2418, REQ-2442
      depends: TSK-0210 and TSK-0220 - `item_shown`, `attempt_submitted`, `verdict` and `session_started` need their schemas; TSK-0040 - the device token identifies the device
- [x] T-002 [P] TSK-0310 No packet carries the task's design or its answer early, and no reply says «верно» or «неверно» (`src/shared/api.ts`, `tests/e2e/fixtures.ts`, `tools/static-checks.ts`)
      closes: REQ-2414, REQ-2420, REQ-2428
      depends: TSK-0300 - it checks the packets and replies that task sends
- [x] T-003 [P] TSK-0320 Repeated answers, hints, explanations and second attempts are recorded and charged once, and the SSE stream delivers the explanation
      closes: REQ-2422, REQ-2424, REQ-2426, REQ-2432
      depends: TSK-0300 - it keys the routes that task opens
- [x] T-004 [P] TSK-0330 The adventure and session lifecycle, the leave route, the break route and the guard against reopening
      closes: REQ-0200, REQ-0226, REQ-2404, REQ-2412
      depends: TSK-0300 - the session start and `next` it extends; TSK-0250 - `adventures` and `sessions` are registered projections
- [x] T-005 [P] TSK-0390 The parent session expires after 30 minutes, and the parent sets the three-day limit
      closes: REQ-0234, REQ-2440
      depends: TSK-0050 - the PIN check and its lockout open the session; TSK-0220 - `settings_changed` needs its schema
- [ ] T-006 TSK-0340 The client draws packets, checks only the input format, and pauses on background and idle
      closes: REQ-2402, REQ-2406, REQ-2408, REQ-2410, REQ-2430
      depends: TSK-0310 - it draws the final packet shapes; TSK-0330 - the pause route; TSK-0100 - the client shell it draws in
- [ ] T-007 [P] TSK-0350 One device holds the adventure through a lease, and the displaced device turns view-only
      closes: REQ-0202, REQ-0220, REQ-0222
      depends: TSK-0320 - `lease_moved` travels on its SSE stream; TSK-0340 - the view-only screen replaces its play screen
- [ ] T-008 [P] TSK-0380 The client queues every answer before sending it, and plays no task while offline
      closes: REQ-2400, REQ-2434, REQ-2436, REQ-2438
      depends: TSK-0320 - a resent answer must be recorded once; TSK-0340 - the controls and screens it disables; TSK-0110 - the unsent-answer store
- [ ] T-009 TSK-0360 Resume returns the exact step from `resume_snapshot`, and attempt flags keep broken times out of every measure
      closes: REQ-0204, REQ-0206, REQ-0210, REQ-0212, REQ-0214, REQ-0224
      depends: TSK-0350 - resume takes the lease; TSK-0320 - the charge keys it tests across a resume; TSK-0250 - `resume_snapshot` is a registered projection
- [ ] T-010 [P] TSK-0370 Scenes, drafts, chests and pending rewards resume from the log alone
      closes: REQ-0208, REQ-0216, REQ-0218
      depends: TSK-0360 - it adds these items to the snapshot and the resume that task builds
- [ ] T-011 [P] TSK-0400 The three-day rule wraps up an adventure after its adventure days and queues its secrets
      closes: REQ-0228, REQ-0230, REQ-0232, REQ-0236
      depends: TSK-0360 - `ResumeOut.wrapUp`; TSK-0390 - `threeDayLimit`
- [ ] T-012 TSK-0410 «Закончить на сегодня» brings a stop offer with no extension for the rest of the game day
      closes: REQ-2444
      depends: TSK-0390 - the parent session guards the route; TSK-0330 - the `next` boundary; TSK-0400 - the game day that ends at 04:00

These tasks can run in parallel once their dependencies are done:

- From the start, once TSK-0050 and TSK-0220 are done: TSK-0390, beside everything below.
- After TSK-0300: TSK-0310, TSK-0320 and TSK-0330.
- After TSK-0340, once TSK-0320 is also done: TSK-0350 and TSK-0380.
- After TSK-0360: TSK-0370 and TSK-0400.

## Coverage

Every one of the 42 requirements ADR-0030 addresses lands in exactly one task above, and none is deferred.

| Task | Requirements |
| --- | --- |
| TSK-0300 | REQ-2416, REQ-2418, REQ-2442 |
| TSK-0310 | REQ-2414, REQ-2420, REQ-2428 |
| TSK-0320 | REQ-2422, REQ-2424, REQ-2426, REQ-2432 |
| TSK-0330 | REQ-0200, REQ-0226, REQ-2404, REQ-2412 |
| TSK-0340 | REQ-2402, REQ-2406, REQ-2408, REQ-2410, REQ-2430 |
| TSK-0350 | REQ-0202, REQ-0220, REQ-0222 |
| TSK-0360 | REQ-0204, REQ-0206, REQ-0210, REQ-0212, REQ-0214, REQ-0224 |
| TSK-0370 | REQ-0208, REQ-0216, REQ-0218 |
| TSK-0380 | REQ-2400, REQ-2434, REQ-2436, REQ-2438 |
| TSK-0390 | REQ-0234, REQ-2440 |
| TSK-0400 | REQ-0228, REQ-0230, REQ-0232, REQ-0236 |
| TSK-0410 | REQ-2444 |

The smallest set of tasks that would test the decision is TSK-0300, TSK-0310, TSK-0320, TSK-0330, TSK-0340, TSK-0350 and TSK-0380. Together they show whether a client that knows nothing about the measurement can play, whether a retry is harmless, whether a lease taken only on a tap stops two devices fighting, and whether write-then-send loses no answer, which are the two failures ADR-0030's premortem names and the ground of its three reversal conditions.

## Not covered

- Real tasks, the answer check, the next task's choice, thread amounts, scene and explanation text, grants, chests and secrets beyond the stand-in adventure, because ADR-0040, ADR-0070, ADR-0080, ADR-0110, ADR-0120 and ADR-0140 define them and their epics replace the stand-ins.
- The soft stop at 60 minutes, extensions of 20 minutes, eye exercises and rest stops as story, because ADR-0090 defines them; until its epic exists `stop_offer` comes only from «Закончить на сегодня».
- The real screens of both interfaces and the Parent Room's pages, because ADR-0150 and ADR-0180 define them.
- How the knowledge model weighs `interrupted`, `crossDevice` and `attempt_late`, because ADR-0060 defines it.
- The forge and shop routes and the other `/api/parent/*` routes, because their contents belong to ADR-0140 and ADR-0180.
- The force-quit test on a real iPad, 50 kills after the tap, because ADR-0030 names it as a reversal condition and not as a criterion; the iPad checklist of ADR-0190 runs it.
