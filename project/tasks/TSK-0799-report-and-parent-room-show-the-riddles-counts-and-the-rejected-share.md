---
id: TSK-0799
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5254, REQ-5294, REQ-5296]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report shows «Может составить задачу» as counts, and the Parent Room lists every riddle with its texts, paraphrase, answer and verdict

After this task, the report shows the line «Может составить задачу» (Can compose a problem) beside the matrix of type by steps as the stream's counts with no state, the Parent Room lists each riddle with its first and corrected texts, the paraphrase, her answer and the verdict, lets the parent label a logged riddle, and shows the share of paraphrases she rejected over the last 30 days.

## Acceptance criteria

1. Given a stream with counts, when the report is built, then the line shows the counts for each verdict beside the matrix and no state is drawn from them (REQ-5254). Closed by: a report test.
2. Given a corrected riddle, when the Parent Room's list is built, then its row holds both texts, the paraphrase as shown, her answer to it and the verdict (REQ-5294). Closed by: a Parent Room test.
3. Given 12 text riddles of which 6 had the paraphrase rejected within 30 days, when the share is built, then it reads 50 %, and a riddle older than 30 days isn't counted (REQ-5296). Closed by: the Parent Room test with a fixed clock.
4. Given the parent labels a logged riddle, when the log is read, then a `compose_labelled` event holds the label and the riddle's verdict is unchanged (REQ-5294). Closed by: the Parent Room test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the line to ADR-0180's graph map and the list and share to the Parent Room. The list is the parent's check on a misparse that she sees only through her confirmation, and the share tells the parent whether the confirmation step catches misparses: near zero while the reference set shows misparses means it doesn't. I took REQ-5296's 30-day window, the window the report's other shares use. The control that labels a riddle writes `compose_labelled`, which the second reversal condition of ADR-0230 reads and no projection of her knowledge reads.

The parent gets no notice for riddles; the one interruption is ADR-0110's serious-path notice.

## Depends on

- TSK-0791 (blocking): the events the list and the share read.
- TSK-0798 (blocking): the stream's counts the report line shows.

The epic realising ADR-0180 supplies the report and the Parent Room.

## Evidence

Not yet.

## Left alone

The wording of the line and the list's strings, which ADR-0160 and ADR-0180's screen spec hold, and the Diary pages, which TSK-0800 holds.
