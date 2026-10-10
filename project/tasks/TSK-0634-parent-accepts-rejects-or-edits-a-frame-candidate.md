---
id: TSK-0634
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3636]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent accepts, rejects or edits each frame candidate in the Parent Room

After this task, the Parent Room lists the candidates with their structure and floor and offers «принять», «отклонить» and «поправить» for each, and each decision is an event in the log.

## Acceptance criteria

1. Given two candidates, when the parent opens the review screen behind the PIN, then it shows each candidate's text with its structure and floor and the three actions, and a request without a parent session gets the refusal every Parent Room route gives (REQ-3636). Closed by: a Playwright test and an integration test of the routes.
2. Given a candidate, when the parent accepts it, then the log holds a `frame_accepted` event with its text and hash marked `as_written`, and the candidate leaves the file; given the parent rejects it, then the log holds `frame_candidate_rejected` and the candidate leaves the file (REQ-3636). Closed by: an integration test that reads the log.
3. Given an edit, when the parent saves it, then step 3 reruns at once and the screen shows each failing rule in words, and an edit that fails stays a candidate; given an edit passes step 3, then it waits for the blind solves of the next `frames:generate` and writes `frame_accepted` marked `as_edited` only after they pass (REQ-3636). Closed by: an integration test with a failing and a passing edit.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the routes under the existing Parent Room router in `src/server/parent-room.ts` and a review page in its shell, and take the text from the candidates file. The decision events carry `candidateSince` so the interval between a candidate's entry and the decision can be measured, as ADR-0370 sets. The screen shows its counts when the parent opens the Parent Room and sends no notification. An edit keeps the candidate's `candidateSince`.

## Depends on

- TSK-0633 (blocking): the candidates file and its record.

The epic realising ADR-0180 builds the Parent Room's navigation and its look. This task adds the page to the shell that exists and that epic places it.

## Evidence

Not yet.

## Left alone

The library file and the rule that only the log's acceptances are served, which TSK-0635 builds, and the live frames list, which TSK-0640 adds to the same screen family.
