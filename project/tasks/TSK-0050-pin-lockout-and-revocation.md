---
id: TSK-0050
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2520, REQ-2522]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The PIN guards the Parent Room, both lockouts hold, and the parent revokes a device

After this task, `./tower set-pin` sets the PIN, a Parent Room devices page opens only after it, the parent issues pairing codes and revokes devices there, and 5 wrong entries in a row of either kind lock that kind out for 15 minutes.

## Acceptance criteria

1. Given a device revoked on the Parent Room devices page, when it sends any later request, then the server answers `401 device_revoked`, and the device shows that it needs pairing from the Parent Room. Closed by: an integration test and the transcript from a second machine.
2. Given 5 wrong pairing codes in a row, when a sixth attempt arrives within 15 minutes, then the server refuses it with `pairing_locked` even when the code is correct, and the screen names the time it takes attempts again. Closed by: an integration test with a fake clock and the transcript from a second machine.
3. Given 5 wrong PINs in a row, when a sixth attempt arrives within 15 minutes, then the server refuses it with `pin_locked` even when the PIN is correct, and the pairing counter is unchanged. Closed by: an integration test with a fake clock.
4. Given 4 wrong entries of one kind, when a correct entry follows, then that kind's count returns to 0. Closed by: an integration test.

## What to do

Add `./tower set-pin`, the PIN check behind the parent login route ADR-0030 names, the two separate counters, the Parent Room devices page with the revoke control, and the Parent Room's entry point for a pairing code, as SPC-0010 states them. Revoking marks the device's row revoked. The devices page is a client screen, so it exists in both interfaces.

## Depends on

TSK-0040, because revocation and the pairing lockout act on pairing. TSK-0100, because the devices page is a client screen in both interfaces.

## Evidence

Not yet.

## Left alone

The parent session's idle expiry (REQ-2440), which ADR-0030 owns, and the Parent Room's report pages, which ADR-0180 defines.
