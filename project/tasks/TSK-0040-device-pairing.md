---
id: TSK-0040
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2516, REQ-2518]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A device pairs by a 6-digit code and keeps its access

After this task, `./tower pair` prints a 6-digit code that lives 5 minutes, a device that enters it gets a lasting token, and every request except pairing needs that token.

## Acceptance criteria

1. Given a code from `./tower pair`, when a device enters it within 5 minutes, then the reply sets an `HttpOnly`, `Secure`, `SameSite=Strict` cookie with no expiry date, and the `devices` table holds the token's SHA-256 hash and not the token. Closed by: an integration test and a query of `devices`.
2. Given a code issued more than 5 minutes ago, when a device enters it, then the server refuses it. Closed by: an integration test with a fake clock.
3. Given a request with no device token from a second machine on the home network, when it reaches any route except pairing, then the server answers 401. Closed by: the request's transcript.
4. Given a paired device, when it returns after the server and the Mac have restarted, then it is still paired. Closed by: an integration test.

## What to do

Add the `devices` table, the pairing route, `./tower pair` and the token check on every other route, as SPC-0010 states them. The token is 256 random bits. A code issued by the Parent Room follows the same rules, and TSK-0050 adds that entry point.

## Depends on

TSK-0030, because the `devices` table lives in the database it opens.

## Evidence

Collected on 2026-09-27 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0; 19 test files, 243 Vitest tests and 2 Playwright tests passed. The crash test still keeps 100 of 100 writes and 100 of 100 answers.
- Seen failing first: `tests/unit/pairing.test.ts` failed 6 of its cases before the pairing route and the token check existed (404 on `/pair-code` and `/api/pair`).
- Criterion 1, REQ-2516: the test pairs with a code 4 minutes old and gets a cookie `meowtower_device=<43 characters>` with `HttpOnly`, `Secure`, `SameSite=Strict` and no `Expires` or `Max-Age`; `devices` holds the token's SHA-256 hash and not the token. On the Mac: `./meowtower pair` printed a code, and `POST https://code-swirl.local/api/pair` over the trusted chain returned `HTTP/2 200` with `set-cookie: meowtower_device=…; Path=/; HttpOnly; Secure; SameSite=Strict`.
- Criterion 2, REQ-2516: with an injected clock, a code 5 minutes and 1 ms old is refused with 403 `pairing_code_invalid`; a code used once and a wrong code are refused too.
- Criterion 3: every `/api` route but pairing answers 401 without a token (the session, next, answer and both stage-0 routes), while the page, manifest, icon and health stay public so a new device can load the app. On the Mac, a request without a token sent to the Mac's home-network address answered `{"error":"device_token_missing"} HTTP 401`; the check doesn't depend on where a request comes from.
- Criterion 4, REQ-2518: a device paired before the database was closed and reopened starts a session with its cookie.
- `./meowtower pair` asks the Parent Room's listener (`POST /pair-code`), so only the Mac can issue a code. The `devices` table came with TSK-0300, which needed a token first; this task adds `pairing_codes` (migration 4). The stage-0 tests and the crash test now pair a device, because the stage-0 routes need a token too.

## Left alone

The pairing lockout and revocation (TSK-0050), and the interface choice stored in `devices` (TSK-0100).
