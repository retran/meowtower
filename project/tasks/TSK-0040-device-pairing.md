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

Not yet.

## Left alone

The pairing lockout and revocation (TSK-0050), and the interface choice stored in `devices` (TSK-0100).
