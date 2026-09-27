---
id: TSK-0390
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-0234, REQ-2440]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent session expires after 30 minutes, and the parent sets the three-day limit

After this task, the PIN opens a parent session with its own cookie that expires 30 minutes after its last request, and the parent reads and changes `threeDayLimit`, or switches the rule off, through `/api/parent/settings`.

## Acceptance criteria

1. Given a parent session, when a parent request arrives 31 minutes after the last one, then it gets `401 parent_session_expired`, and the client shows the PIN screen with the page kept; a request at 29 minutes succeeds and restarts the 30 minutes (REQ-2440). Closed by: an integration test with a fake clock and a Playwright test.
2. Given a parent session cookie on an unpaired device, when it calls a parent route, then it gets `401`. Closed by: an integration test.
3. Given the default settings, when the parent reads them, then `threeDayLimit` is 3; when the parent sets it to 5 or off, then `settings_changed` is logged and the next read returns the new value (REQ-0234). Closed by: an integration test and a Playwright test on the stand-in settings page.

## What to do

Add `POST /api/parent/login`, the parent session cookie apart from the device token, the 30-minute expiry, and `GET` and `PUT /api/parent/settings` with `threeDayLimit`, as SPC-0030 states them. A stand-in settings page in the Parent Room holds the one control until ADR-0180's epic builds the pages. ADR-0190's definition of done applies.

## Depends on

TSK-0050, because the PIN check and its lockout open the session. TSK-0220, because `settings_changed` needs its schema.

## Evidence

Not yet.

## Left alone

The PIN's storage and lockout (TSK-0050), the rule itself (TSK-0400), and the other settings, which ADR-0180 defines.
