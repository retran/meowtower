---
id: TSK-0587
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2718, REQ-2720, REQ-2722]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The play key's month stops at $60, every later session uses the fallbacks, and the parent sees a notice

After this task, the gateway counts the month's play spend from `llm_log`, refuses every call once it reaches $60 or once OpenRouter answers HTTP 402, appends one `budget_month_spent` event, and the Parent Room shows a notice until the month ends.

## Acceptance criteria

1. Given the play key's settings, when the owner reads them, then they show `limit: 60` with `limit_reset: monthly` (REQ-2718). Closed by: the owner's judgement of the OpenRouter key's settings, because the setting lives in the account and no test can read it; the setup check lists it.
2. Given a replayed month of calls past $60 and a mocked HTTP 402, when the next call is made, then the gateway refuses it, one `budget_month_spent` event is appended, and the game plays on fallbacks to the month's end (REQ-2720). Closed by: an integration test over a month of synthetic calls.
3. Given `budget_month_spent`, when the parent opens the Parent Room, then a notice shows and stays until the month ends (REQ-2722). Closed by: a Playwright test with a fake clock.
4. Given the month changes at 00:00 UTC on the 1st, when the next call is made, then the count is zero and the notice is gone. Closed by: a test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Count every call on the play key, the judge's included and read from the main file's `llm_log` only, as ADR-0340 states. Add the `budget_month_spent` event if EPC-0020's schemas lack it, and the notice to the Parent Room's stand-in page. The $60 sits above the $58.90 the daily caps allow in a 31-day month, so the limit fires only when something bypasses the daily caps.

## Depends on

- TSK-0585 (blocking): the month's count is a bucket of that engine.
- TSK-0589 (blocking): the count reads that task's log.

The epic realising ADR-0180 draws the notice in the Parent Room's own page.

## Evidence

Not yet.

## Left alone

The owner's setting of the key in the OpenRouter account, which is hand work at stage 0.

