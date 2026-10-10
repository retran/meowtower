---
id: TSK-0642
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3650]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A science question is served only when the log holds the parent's approval of its current hash

After this task, the Parent Room's science review screen shows each question with its correct option and each wrong option beside its misconception, the parent approves or rejects it, and the server serves a question only while an approval of its current hash stands.

## Acceptance criteria

1. Given an unapproved question, when the Director asks for a question of its topic, then the question isn't served, `science_unapproved` is counted for the parent, and a topic whose questions are all unapproved gives `science_topic_empty` and the Director takes another topic (REQ-3650). Closed by: an integration test over the log and the bank.
2. Given the review screen behind the PIN, when the parent opens a question, then it shows the correct option and each wrong option beside its misconception and offers approve and reject; approving writes `science_approved` with the question's hash and rejecting writes `science_rejected` (REQ-3650). Closed by: a Playwright test and an integration test that reads the log.
3. Given an approved question, when its text or any option is edited in the file, then its hash changes and it isn't served until a new `science_approved` event holds the new hash (REQ-3650). Closed by: an integration test that edits the bank file between two requests.
4. Given the parent reads a question at approval, when a wrong option marked as the correct one or a misconception that is untrue appears, then it is the parent who catches it, because no automatic check tests a fact (REQ-3650). Closed by: the parent's judgement at the first sitting, with the reason that ADR-0130 records this as the decision's weakest defence.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the routes and the page beside the frame review of TSK-0634, and a projection of `science_approved` and `science_rejected` keyed by hash. Show the count of unapproved questions on the screen when the parent opens it, and send no notification. A question enters the bank by the file; the screen never writes the file.

## Depends on

- TSK-0641 (blocking): the bank file, its schema and its hash.

The epic realising ADR-0180 builds the Parent Room's navigation; this task adds the page to the shell that exists.

## Evidence

Not yet.

## Left alone

Which question a slot gets, which TSK-0643 decides, and the parent's time: about 2 minutes a question by ADR-0130's estimate, so about 7 hours for the first bank, which no task shortens.
