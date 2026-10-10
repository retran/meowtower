---
id: TSK-0090
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0010
closes: [REQ-2504]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The OpenRouter key never reaches a client

After this task, no client receives the model key, and two checks prove it: the key never leaves the server side, because a client that held it could spend the parent's budget.

## Acceptance criteria

1. Given a client build, when `grep -r "sk-or-" dist/client` runs after `npm run build`, then it finds nothing. Closed by: the `key_in_client` check of `tools/static-checks.ts` in the lint verb and its failing fixture in `tests/unit/static-checks.test.ts`; ADR-0190's group 1 check takes it over when the verify command exists.
2. Given the end-to-end tests run, when Playwright records every response body and header the client receives, then none carries the key or the prefix `sk-or-`. Closed by: the Playwright report.


## What to do

Keep each key in `.env`, pass it only to the services that spend it, and add the two checks, as SPC-0010 states them. The response recorder runs as a fixture of every end-to-end test, so it covers each screen as screens are added. The run of a simulated day through the gateway moved to TSK-0130 on 2026-10-10, because it needs ADR-0100's gateway and that epic isn't written, and a task that waits on it can never be done.

## Depends on

TSK-0010, because the key's `.env` and the client bundle must exist.

## Evidence

Collected on 2026-09-27 on the Mac, and criterion 1 again on 2026-09-29. Criteria 1 and 2 are met, and the five verbs exit 0 again on 2026-10-10 at commit d730d97. The simulated-day check, which was criterion 3, moved to TSK-0130.

- Verbs: `meow-verbs run format lint check test build` exited 0; Vitest 26 tests and Playwright 2 tests passed.
- The key: `compose.yaml` gives `.env` to `meowtower` only; `tests/smoke/compose.test.ts` reads the file and fails if `proxy` gets `.env` or `OPENROUTER`.
- Criterion 1, REQ-2504: on 2026-09-29 `npm run build` then `npx tsx tools/static-checks.ts` exited 0 with `dist/client` present. `tools/static-checks.ts` runs in the lint verb as a stand-in for ADR-0190's verify group 1 and searches `dist/client`, `src/client` and `content` for `sk-or-`; it passes here and names the file for a fixture carrying a key (`tests/unit/static-checks.test.ts`).
- Criterion 2, REQ-2504: `tests/e2e/fixtures.ts` records every response header and body in every Playwright test, with the server started on a fake key `sk-or-v1-e2e-fake-key-0000`. The shell test passes, and a self-test that serves the key is marked `test.fail()` and does fail, so the recorder catches a leak.
- On 2026-09-29 the recorder skips the body of an event stream, whose body never ends, and checks its headers; the stream carries only `explanation_ready` and `lease_moved`.

## Left alone

The model gateway and the separate keys per role, which ADR-0100 defines.
