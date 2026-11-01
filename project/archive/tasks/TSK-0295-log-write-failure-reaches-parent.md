---
id: TSK-0295
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0020
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A failed log write replies 503 on every route and reaches the parent as a notice

After this task, a request whose log write fails gets `503 log_write_failed` on any route, and the parent sees `log_write_failed` in `./meowtower status` and on the Mac's Parent Room page until a later write succeeds. ADR-0020's failure table and SPC-0020's failure paths ask for both; only the stage 0 route did the first, and nothing did the second. The epic's verification found the gap, and the owner asked on 2026-09-28 to fix it, which approves this task.

## Acceptance criteria

1. Given a play route whose `appendEvents` fails, when the request arrives, then it gets `503` with `{"error":"log_write_failed"}` and the log gains nothing. Closed by: an integration test that makes the write fail.
2. Given that failure, when the parent runs `./meowtower status` or opens the Mac's Parent Room page, then `log_write_failed` shows once, with the time. Closed by: the same test, reading `notices.json` and the page.
3. Given the notice, when a later request's write succeeds, then the notice clears. Closed by: the same test.

## What to do

Turn a `LogWriteFailed` from any route into the `503` reply in one place, and raise `log_write_failed` into the parent's notices in `data/snapshots/notices.json`, beside TSK-0080's and TSK-0260's, with its line in `./meowtower status` and on the Mac's Parent Room page. Clear it on the next successful state-changing request.

## Depends on

TSK-0200, because it raises `LogWriteFailed`; TSK-0080, because the notices live in its file.

## Evidence

Collected on 2026-09-27 (UTC) on the Mac. Every criterion holds.

- Verbs: `meow-verbs evidence --keep format lint check test build` exited 0 with every verb passed at tree `092a38220b07`: format record `d32ce939dfa7`, lint `9328caba4c16`, check `225e08cfc6fb`, test `3848d07ed77c` (39 test files, 353 Vitest tests, 13 Playwright tests) and build `e19ad0d78459`, each kept in `project/evidence/`.
- Seen failing first, each break alone and restored: with the app's error handler passing `LogWriteFailed` on, the test failed on the status; with no notice written, it failed on `notices.json`; with the notice never cleared, it failed after the later write.
- Criterion 1: `tests/integration/log-write-failure.test.ts` sets the database to `query_only`, as a full disk would refuse writes, and `POST /api/session/start` gets `503 {"error":"log_write_failed"}` with the log's length unchanged. Before this task a play route let the error through as `500`.
- Criterion 2: `notices.json` then holds `log_write_failed` with the time `2026-09-27T23:40:00.000Z`, and the Mac's Parent Room page shows one alert «Игра не смогла записать событие…». `./meowtower status`'s new line reads the same time from a sample file.
- Criterion 3: with writes allowed again, the next session start gets `200`, and the notice and the page's alert are gone.
- `docs/reference/parent-notices.md` gains the `log_write_failed` row.

## Left alone

The client's queue and the waiting scene the player sees on a `503`, which ADR-0030 and TSK-0340 define.
