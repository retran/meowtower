---
id: TSK-1015
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-0208, REQ-0214, REQ-2424, REQ-2434, REQ-5642]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A bought explanation comes back on resume, and the client sends every kind of event through one queue

After this task, a resume lists the explanations she bought and a repeated request produces the text again for free, the client's queue holds answers, grouping sets, `looks_set`, `glossary_opened` and `plan_draft` in the order she made them, and a plan draft travels through its own route.

## Acceptance criteria

1. Given a room whose explanation she bought, when she resumes, then `ResumeOut` lists the item, and a repeated `POST /api/item/:itemId/explain` on it spends no thread, produces the text again by ADR-0120's order and sends it as `explanation_ready` (REQ-0214, REQ-2424). Closed by: an integration test over a fixture log.
2. Given an answer, a grouping set, `looks_set`, `glossary_opened` and a `plan_draft` made offline in that order, when the device restarts and reconnects, then the server receives them in that order, and the queue holds at most one answer for the device (REQ-2434). Closed by: a Playwright test with the network cut and the page reloaded.
3. Given a plan row that changes, when she lays cards, then `POST /api/item/:itemId/plan/draft` with `{ laid, clientSeq }` is sent at most once every 10 seconds, and at once when she leaves the task window or the page turns hidden (REQ-0208). Closed by: a Playwright test with a fake clock.
4. Given a submitted plan she hadn't answered yet, when she resumes, then her plan and her place in the solving phase are restored (REQ-0208, REQ-5642). Closed by: an integration test over the log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change `src/client/event-queue.ts` and `src/client/answer-queue.ts` so one persisted queue holds all five kinds, since ADR-0150 part 3 already sends `looks_set` through ADR-0030's queue and a second queue on one device would need an order between the two. At most one answer per device is enough because one device holds the lease and plays one task at a time, and IndexedDB holds any unsent entry. The 10 seconds are `text_draft_saved`'s interval, and the draft sent on leaving is the one a resume needs. The text of an explanation never entered the log, so producing it again is the only way to deliver what she paid for.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The story waiting scene while offline, which the answer queue of the epic realising ADR-0030 already holds.
