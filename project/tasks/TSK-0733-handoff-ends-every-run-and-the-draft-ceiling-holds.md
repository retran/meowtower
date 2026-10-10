---
id: TSK-0733
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2938, REQ-2940, REQ-2942, REQ-2944, REQ-2946]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every agent run ends with a handoff, and five unapproved drafts stop work that needs a new decision

After this task, `tools/handoff.ts` writes `artifacts/handoff.md` at the end of every run with what the run did, the verify status, every draft record and open question the run added, what waits for a person and the run's spend, and it says once when 5 drafts wait for the owner.

## Acceptance criteria

1. Given a run, when it ends, then `artifacts/handoff.md` exists and lists what the run did, the verify status, each draft record and each open question the run added, what waits for a person, and the spend read as the offline key's usage at the end minus at the start (REQ-2940). Closed by: an integration test with a stub OpenRouter usage of $1.20 at the start and $1.85 at the end, which must read $0.65.
2. Given a run that adds a draft record in `project/adrs/` and a record with an `## Open questions` section, when the handoff is written, then it lists the draft under its identifier and the question under the record it concerns (REQ-2942, REQ-2944). Closed by: an integration test over a fixture record tree.
3. Given 5 draft records the agent wrote that the owner hasn't approved, when the handoff is written, then it states `draft_ceiling_reached` once and that only approved scope is being worked on; given 4, it states nothing. Closed by: two integration tests.
4. Given a task that rests on a draft decision record, when `paw ready implement` runs on it, then it refuses (REQ-2946). Closed by: the command's output on a fixture record.
5. Given a run's handoff and the records the run changed, when the owner reads them, then no decision that changes the method, the budget or the child's safety was settled by the agent, and no code was built on a draft record or an open question (REQ-2938, REQ-2946). Closed by: the owner's judgement from the handoffs and the history of each change, because a program can't tell whether a change in code rests on a decision nobody approved.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `tools/handoff.ts` and the run's closing step that calls it. The ceiling of 5 draft records is a value ADR-0190 chose, because a long queue of drafts ends in approval unread.

Two choices this task makes. The record has no fixed shape for an open question, so the handoff finds one as a `## Open questions` section in the record it concerns. And ADR-0190 names the ready check `meow-method ready`; the repository's tool for it is `paw ready`, so the criterion uses that name.

## Depends on

- TSK-0724 (blocking): the handoff reads the verify status the runner writes.

## Evidence

Not yet.

Criterion 5 rests on the owner's judgement, because REQ-2938 and REQ-2946 ask whether the agent left a decision to a person, and only the history shows that.

## Left alone

The method's own `ready` check and its rules, which the plugin owns, and the agent's behaviour once the ceiling holds, which the handoff reports and no program enforces.
