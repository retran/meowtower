---
id: TSK-0776
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5158, REQ-5160, REQ-5168]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A resume shows the open ladder with the rungs she saw, spends no thread and logs no second `hint_shown`

After this task, resuming a task whose ladder she opened shows the ladder open with every rung she already saw, spends no guiding thread to reopen it, and logs no `hint_shown` for a rung it restores, so the depth of help counts each rung once.

## Acceptance criteria

1. Given a task with a ladder opened and rungs 1 and 2 shown, when the client resumes on a second browser context, then the same rungs show with the ladder open and the button active for rung 3 (REQ-5158). Closed by: a Playwright test.
2. Given the same resume, when the log is read, then `thread_spent` and `hint_shown` hold the counts they held before the resume (REQ-5160, REQ-5168). Closed by: the Playwright test and a ledger test.
3. Given a stock of 0 threads after the opening, when the task is resumed, then no thread is spent and the open ladder stays open (REQ-5160). Closed by: the ledger test.
4. Given the log at every event of a 30-day simulation, when `resume_snapshot` is derived, then it holds whether the ladder is open and which rungs she saw, and equals the stored one (REQ-5158). Closed by: the snapshot equality test of the resume projection.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend the `resume_snapshot` projection in `src/engine/projections/resume.ts` to keep, for the task in progress, whether its ladder is open and which rungs she saw. Make the resume route return them and the client draw them, with no charge and no `hint_shown`. A resume isn't a new request, and the approved rules on resuming and on repeated requests forbid charging a thread twice.

The portrait and line a restored rung shows come from TSK-0783; this task restores the rungs and their text.

## Depends on

- TSK-0773 (blocking): the ladder's ledger and charge key, which this task keeps unchanged on resume.

## Evidence

Not yet.

## Left alone

The framing line stored with a restored rung, which TSK-0783 adds to the same snapshot, and the thread ledger's grants, which ADR-0080 keeps.
