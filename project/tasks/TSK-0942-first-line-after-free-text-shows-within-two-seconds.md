---
id: TSK-0942
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6150]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After free text, a prepared reaction line shows first within 2 seconds, and the Master's checked reply follows

After this task, the server answers a free-text request with the next reaction line when no serious or narrator trigger fires, logs `reaction_line_shown`, and the client shows its first character on receipt, with the 95th percentile of the time from the tap at most 2 seconds.

## Acceptance criteria

1. Given free text that fires neither a serious nor a narrator trigger, when it is sent, then the reply carries the next line of the `reaction` category, one `reaction_line_shown` holds `lineId`, `adventureId` and the id of the `free_text` event, and the client shows the first character on receipt (REQ-6150). Closed by: a route test and a Playwright test.
2. Given 200 free texts over 20 simulated adventures at the iPad viewport, when the test measures the time from the tap to the first character, then the 95th percentile is at most 2 seconds, it is reported against the target of 1 second, and each reaction line shows before the Master's reply (REQ-6150). Closed by: the Playwright test's report.
3. Given a free text that fires a serious or narrator trigger, when the reply is read, then it carries ADR-0110's fixed line and no reaction line comes before it (REQ-6150). Closed by: a route test for each trigger.
4. Given the same free-text request sent twice with one `clientSeq`, when both replies are read, then the line is the same and the log holds one `reaction_line_shown` (REQ-6150). Closed by: a route test.
5. Given a reaction line that doesn't reach the client within 2 seconds, when the free text's client report arrives, then it carries the measured time from tap to first character, the waiting animation goes on and the Master's reply follows, and the p95 of those reports shows `reaction_late` in the verify output (ADR-0320). Closed by: a client report test with a delayed reply.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the line to the reply of `POST /api/session/:id/scene/input`, after ADR-0110's local triggers run on the raw text. The reaction line waits for neither the judge nor the Master, and the Master's reply still shows only after all of it passes ADR-0110's checks, within its 6-second budget. Before the bank holds 60 approved lines the line comes from the neutral lines in `content/i18n/ru.json`. I chose a target of 1 second, as ADR-0320 did, stricter than the 2 the requirement imposes, because the path is a local request with no model call like the answer reply's 300 ms, and the other second is slack for home Wi-Fi.

## Depends on

- TSK-0941 (blocking): the bank and the neutral lines the server takes the line from.

The epic realising ADR-0110 supplies the free-text path with its triggers and the Master's reply, and the epic realising ADR-0030, which is done, the route and `clientSeq`.

## Evidence

Not yet.

## Left alone

The cycle's no-repeat rule, the flag and the low-bank notice, which TSK-0943 builds. Streaming the Master's reply, which ADR-0110 rejected.
