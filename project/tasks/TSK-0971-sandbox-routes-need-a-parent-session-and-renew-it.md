---
id: TSK-0971
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6342, REQ-6344, REQ-6376]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every sandbox route on the network listener needs the parent's PIN session, renews it, and writes nothing to the player's file

After this task, `/api/parent/sandbox/*` and `/api/parent/sandbox/play/*` answer only a parent session opened with the PIN on the requesting device, each request renews the session's 30-minute idle expiry, and the session's activity is kept in memory.

## Acceptance criteria

1. Given a request with no parent session, with an expired one, or with another paired device's cookie, when it reaches a sandbox route, then it gets `401 parent_session_missing` or `401 parent_session_expired` and no sandbox answer (REQ-6342). Closed by: an integration test over each route family.
2. Given a sandbox adventure played as the player for 40 minutes with a request every 5 minutes, when the session is read, then it never expired (REQ-6344). Closed by: an integration test with a fake clock.
3. Given a play-shaped request under `/api/parent/sandbox/play/*`, when it arrives, then it counts as parent activity and not as player activity, and her lease, heartbeat, event stream and answer queue are as they were (REQ-6344). Closed by: an integration test with the player holding the lease.
4. Given a hundred sandbox requests after the PIN login, when each table of her file is hashed, then the hashes equal those taken just after the login (REQ-6376). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Mount the sandbox route trees in `main.ts` with the middleware of TSK-0966, and put the play handlers on the sandbox's engine context under `/api/parent/sandbox/play/*`. Guard both with the existing parent session of ADR-0030 and renew its idle expiry on every request. Keep `ParentSessions` in memory, and record no activity in her file. The PIN login's one `lockouts` row stays as SPC-0010 states, and the test of criterion 4 starts after it. Leave the player's screens with no link to the sandbox.

## Depends on

- TSK-0964 (blocking): the routes use the sandbox handle that task opens.
- TSK-0966 (blocking): the middleware that sets the flag is mounted on these trees.
- TSK-0967 (blocking): the play handlers take the engine context.

The epic realising ADR-0030 supplies the parent session and its expiry. Features that run inside the sandbox, such as the engine panel and batches, belong to the decisions that own them.

## Evidence

Not yet.

## Left alone

The two `sandbox-actions` routes, which TSK-0973 mounts outside the sandbox's prefix on purpose.
