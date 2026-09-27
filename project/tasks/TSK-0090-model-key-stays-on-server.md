---
id: TSK-0090
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2504]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The OpenRouter key never reaches a client

After this task, the OpenRouter key lives only in `.env` and the `tower` process's environment, and two checks prove no client receives it.

## Acceptance criteria

1. Given a client build, when `grep -r "sk-or-" dist/client` runs, then it finds nothing. Closed by: a group 1 check in ADR-0190's verify command and its exit status.
2. Given the end-to-end tests run, when Playwright records every response body and header the client receives, then none carries the key or the prefix `sk-or-`. Closed by: the Playwright report.
3. Given a full simulated day exists, when the same recording runs over it, then no response carries the key. Closed by: the Playwright report of that run.

## What to do

Keep the key in `.env`, pass it only to `tower`, and add the two checks, as SPC-0010 states them. The response recorder runs as a fixture of every end-to-end test, so it covers each screen as screens are added. Criterion 3 runs once the epics realising ADR-0030 and ADR-0040 make a simulated day.

## Depends on

TSK-0010, because the key's `.env` and the client bundle must exist.

## Evidence

Collected on 2026-09-27 on the Mac. Criteria 1 and 2 are met; criterion 3 waits for a simulated day from the epics realising ADR-0030 and ADR-0040.

- Verbs: `meow-verbs run format lint check test build` exited 0; Vitest 26 tests and Playwright 2 tests passed.
- The key: `compose.yaml` gives `.env` to `meowtower` only; `tests/smoke/compose.test.ts` reads the file and fails if `proxy` gets `.env` or `OPENROUTER`.
- Criterion 1, REQ-2504: `tools/static-checks.ts` runs in the lint verb as a stand-in for ADR-0190's verify group 1 and searches `dist/client`, `src/client` and `content` for `sk-or-`; it passes here and names the file for a fixture carrying a key (`tests/unit/static-checks.test.ts`).
- Criterion 2, REQ-2504: `tests/e2e/fixtures.ts` records every response header and body in every Playwright test, with the server started on a fake key `sk-or-v1-e2e-fake-key-0000`. The shell test passes, and a self-test that serves the key is marked `test.fail()` and does fail, so the recorder catches a leak.
- Open: criterion 3, the same recording over a full simulated day.

## Left alone

The model gateway and the separate keys per role, which ADR-0100 defines.
