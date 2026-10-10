---
id: TSK-0640
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3644]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One action moves a live frame into the library

After this task, the Parent Room lists live frames with their status and offers «В библиотеку» for a `ready`, `used` or `expired` frame, which writes the frame's acceptance and marks it `moved`.

## Acceptance criteria

1. Given live frames in each status, when the parent opens the list, then each row shows the text and the status, and «В библиотеку» is offered for `ready`, `used` and `expired` only (REQ-3644). Closed by: a Playwright test.
2. Given a `used` frame, when the parent presses «В библиотеку», then the log holds one `frame_accepted` event marked `as_written` with the frame's text and hash, the frame's status is `moved`, and the frame is served from the library afterwards (REQ-3644). Closed by: an integration test that reads the log and the next pick.
3. Given a moved frame, when its `candidateSince` is read, then it is the game day the frame was generated (REQ-3644). Closed by: an integration test.
4. Given the same frame moved twice, when the second action runs, then no second event is written (REQ-3644). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the list and the action to the Parent Room routes. Moving a frame counts as the parent accepting it as written, so the library still holds only frames the parent accepted. The action works only behind the PIN.

## Depends on

- TSK-0637 (blocking): the table and the statuses.
- TSK-0635 (blocking): the library the moved frame joins.

## Evidence

Not yet.

## Left alone

An action for a `rejected` or a `final_failed` frame, which has none, because those failed a check.
