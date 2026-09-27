---
id: TSK-0120
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2544, REQ-2546]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server sends no push in the MVP, and a check keeps it so

After this task, a static check fails the build when the code base gains VAPID keys, a push subscription table, a push library or a connection to `*.push.apple.com`, so the MVP sends no push and a revoked device has no subscription left.

## Acceptance criteria

1. Given the code base, when group 1 of ADR-0190's verify command runs, then the check passes and names what it searched. Closed by: the verify report.
2. Given a branch that adds a `push_subscriptions` table, a VAPID key or a reference to `*.push.apple.com`, when the check runs, then it fails and names the file. Closed by: a test of the check against such a fixture.

## What to do

Add the static check, as SPC-0010 states the absence of push. REQ-2544 and REQ-2546 hold in the MVP because the server has no push code at all, and the check keeps it that way.

## Depends on

TSK-0010, because the check runs over the code base it starts.

## Evidence

Not yet.

## Left alone

Web push after the MVP, which ADR-0010 places in a later item.
