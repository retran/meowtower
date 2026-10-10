---
id: TSK-0873
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5716, REQ-5736, REQ-5752, REQ-5754, REQ-5756, REQ-5760, REQ-5770]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent approves each puzzle by hash on one screen, and the game serves only the content she approved

After this task, the Parent Room's review screen shows a puzzle's filled statement and figure, three rungs, full solution, the check's result on the reference, the source of its idea, theme and difficulty, and offers «принять / отклонить / поправить»; `puzzle_approved` and `puzzle_rejected` hold a hash of the exact content; and the game serves a puzzle only when the log holds an approval for its current hash.

## Acceptance criteria

1. Given a puzzle in the queue, when the review screen shows it, then it holds the filled statement with its figure, the three rungs, the full solution, the check's result on the reference solution, the source, the theme and the difficulty (REQ-5756). Closed by: a Playwright test on the Parent Room's screen.
2. Given an approval, when the log is read, then `puzzle_approved` holds the puzzle's id, locale, SHA-256 hash of the canonical JSON of the data file and the locale's text file together, `as_written` or `as_edited`, the source `parent_room` or `sandbox`, the moment it was queued and the seconds the screen showed it; a rejection holds the same except `as_written` or `as_edited` (REQ-5754). Closed by: a schema test and a log test.
3. Given an approved puzzle, when its file is edited, then the server doesn't serve it until a new `puzzle_approved` holds the new hash, and a puzzle added to `content/` by hand with no approval is never served (REQ-5752). Closed by: a test that edits a file and one that adds a file.
4. Given an edit on the screen, when it is saved, then step 3's code checks run at once, and the puzzle leaves the queue until the next run's blind solve passes and brings it back, so no edit is approved before a blind solve (REQ-5746). Closed by: a unit test and an integration test with a recording gateway.
5. Given the rungs the player sees, when they are served, then each is the fixed text the parent approved with the puzzle and not a model's text (REQ-5760). Closed by: a test that compares each served rung with the approved text's hash.
6. Given a puzzle in the queue, when the parent approves it, then the parent judges that its clue and signature keep the canon's pace (REQ-5716), that its statement, story, figure and solution are written anew and not copied from the source (REQ-5770), and that its solution page teaches an idea and no new maths topic of the skill graph (REQ-5736). Closed by: judgement of the parent at approval, because these three requirements name the parent's reading, and no program can compare a text with a source it never sees.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the review screen to the Parent Room, following ADR-0130's frame screen, the two event types and the serve gate that reads the log for the current hash. The sandbox's disabling and restoring belong to ADR-0340, and this task only reads them. Add the three judgements as a line on the screen that names the source, because ADR-0280 reasons that the review of a long queue tends to end approved unread unless everything to judge is on one screen.

## Depends on

- TSK-0872 (blocking): the queue holds the candidates that run produces.
- TSK-0876 (blocking): `puzzle_approved` and `puzzle_rejected` are among the event types that task registers.

The epics realising ADR-0180 and ADR-0340 supply the Parent Room and the sandbox.

## Evidence

Not yet.

## Left alone

The parent's real reading of the first 50 puzzles, which is the parent's time and happens at stage 0.3, and the sandbox's turn-off, which ADR-0340 owns.
