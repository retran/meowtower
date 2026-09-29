---
id: TSK-0440
artifact: task
status: approved
revised: 2026-09-29
epic: EPC-0010
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The stage 0 write routes answer 404

After this task, the server no longer mounts `POST /api/stage0/write` or `GET /api/stage0/write/:id`, and the version 0 `attempt_submitted` events they wrote stay readable. ADR-0360 entry 3 settled SPC-0010's open finding this way, because a write route that bypasses the play API puts events in her log that no play rule checked. It closes no requirement of its own: the entry settles a conflict between ADR-0010 and ADR-0190, not a requirement.

## Acceptance criteria

1. Given the server, when a paired device calls `POST /api/stage0/write` or `GET /api/stage0/write/:id`, then each answers 404; and without a device token each still answers 401, because the device check runs before routing. Closed by: a route test, and `tests/unit/pairing.test.ts`, which keeps both routes in its list of routes that answer 401 without a token.
2. Given a fixture database whose version 0 `attempt_submitted` events were appended through `appendEvents`, as the routes wrote them, when the server starts and the projections rebuild, then `eventByIdemKey` reads each one back unchanged and the rebuild succeeds. Closed by: an integration test on that fixture.
3. Given the crash test, when its first `describe`, which writes through the stage 0 route, is deleted, then its answer-route `describe` still kills the process after each reply 100 times and finds the answer in `events` 100 times out of 100. Closed by: the crash test's report, which stays the evidence for REQ-2508 and ADR-0010's first reversal condition.
4. Given `tests/unit/stage0.test.ts` deleted, when the test verb runs, then TSK-0295's `tests/integration/log-write-failure.test.ts` still proves the 503 `log_write_failed` reply on a play route. Closed by: the test verb's output, and a line in TSK-0200's Evidence saying its criterion 8 is now proved by that test, because the route criterion 8 names no longer exists.

## What to do

Remove `mountStage0` from `src/server/app.ts`, delete `src/server/stage0.ts` and `tests/unit/stage0.test.ts`, delete the crash test's stage 0 `describe`, and add the route test, the fixture test and the line in TSK-0200's Evidence. The variant of the crash test that restarts the Docker virtual machine, which the owner runs from the stage 0 checklist, writes through the play API's answer route, because after this task no other write route remains.

## Depends on

TSK-0030, because its crash test writes through these routes.

## Evidence

Collected on 2026-09-29 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0 at tree `d12512c3b74a`: 39 test files and 355 Vitest tests passed, 15 Playwright tests passed, and the build made both images. `meow-verbs evidence --keep` kept the records: format `66b21c37748e`, lint `1476f4f1ef4d`, check `3acfbbdff2bc`, test `f3527d97dc7f`, build `2afd29135b63`, under `project/evidence/`.
- Seen failing first: before the routes were removed, `tests/integration/stage0-retired.test.ts` failed criterion 1 with `expected 201 to be 404`. Its criterion 2 test passed before and after, because it guards the reading of version 0 events, which this task mustn't break.
- Criterion 1: that file sends a paired device's `POST /api/stage0/write` and `GET /api/stage0/write/w1`, and both answer 404 with no event logged. `tests/unit/pairing.test.ts` still lists both routes and still gets 401 without a token, because the `/api/*` device check runs before routing.
- Criterion 2: three version 0 `attempt_submitted` events are appended through `appendEvents` as the routes wrote them, every projection table is dropped, and `rebuildMissing` rebuilds all of them from the log. `eventByIdemKey` then returns each event unchanged, with payloads `{raw:"12"}`, `{raw:""}` and `{raw:"3/4"}`.
- Criterion 3: the crash test's stage 0 `describe` is deleted, and its port check moved into the answer-route `describe`, which printed `crash test (answer): 100 of 100 answers kept, 0 lost`.
- Criterion 4: `src/server/stage0.ts` and `tests/unit/stage0.test.ts` are deleted, `tests/integration/log-write-failure.test.ts` passes in the test verb, and TSK-0200's Evidence gained the line saying its criterion 8 is now proved there.

### Open review findings

An agent reviewed this record after the work. These findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- What to do's last sentence reads as though this task changed the Docker virtual machine variant of the crash test. It didn't: that variant is still unwritten and runs by hand from the stage 0 checklist (TSK-0030, EPC-0010's Not covered). The sentence is guidance for it: with no other write route left, it has to write through the answer route. Not changed: What to do is frozen.
- Depends on gives TSK-0030's stage 0 writes as the reason, which this task removed. The dependencies the criteria rest on are TSK-0030's answer-route `describe` and TSK-0295's `log-write-failure.test.ts`, both done. Not changed: Depends on is frozen, and the order of work is unaffected.
- Criterion 3 puts the deletion in its "when" slot; the event under test is the kill after each reply. Not changed: the criterion is frozen, and the evidence above covers the kills.

## Left alone

The play API's answer route, because EPC-0030 builds it and this task only removes routes.
