---
id: TSK-0782
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5124, REQ-5128]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent accepts, rejects or edits each framing line, and the server shows a line only after its approval event and the owner's commit

After this task, the Parent Room's framing screen shows each candidate with its familiar kind and rung and offers «принять / отклонить / поправить» (accept / reject / edit), an acceptance writes `rung_framing_approved`, and the server serves a line only when the log holds its approval, no later `rung_framing_removed` and the line is in the committed `content/framings.ru.json`.

## Acceptance criteria

1. Given a line in `content/framings.ru.json` with no `rung_framing_approved`, when a rung is shown, then the line never shows, and a line removed by `rung_framing_removed` stops showing (REQ-5128). Closed by: an integration test.
2. Given an edit of a candidate, when the parent saves it, then the code checks of TSK-0781 run again at once and a failing edit isn't accepted (REQ-5124). Closed by: a Parent Room test.
3. Given an approval, when the server writes `data/exports/framings.ru.json`, then it holds every approved line and no removed one, and the server serves lines only from the committed `content/framings.ru.json` (REQ-5128). Closed by: an export test and an integration test.
4. Given the first set of candidates, when the parent reads each line at the stage acceptance, then the parent judges that none carries a number, a step, an operation or a reference to a part of the task (REQ-5124). Closed by: the parent's judgement, because code catches numbers and only a person catches task content.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the Parent Room's framing screen after the pattern of ADR-0130's frame screen. It shows the count of kinds and rungs with no approved line and the count of approved lines awaiting a commit, because the owner commits the exported file after a batch. The screen sends no notification and its interruption budget is zero: if nobody opens it, every rung shows with the portrait and no line.

The server picks nothing from a line that has no approval event; at start it reports once the lines in the file with no approval, as `framing_unapproved`. Approval lives in the log as an event with a hash, because anyone can edit a line in a file and code checks an event at load.

## Depends on

- TSK-0781 (blocking): the code checks the edit reruns and the candidates the screen lists.
- TSK-0772 (blocking): the two framing event types.

The epic realising ADR-0180 supplies the Parent Room's shell and the epic realising ADR-0130 the frame screen's pattern; this task adds the screen in the Parent Room as it stands.

## Evidence

Not yet.

Criterion 4 rests on judgement, as REQ-5124 says: the parent judges each line.

## Left alone

The portrait and line in the task window, which TSK-0783 holds.
