---
id: TSK-0602
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1818, REQ-1820, REQ-1540, REQ-1542, REQ-1544]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An everyday signal gets a warm answer and a quiet mark, and fear resolves the scene kindly and lowers the level for the day

After this task, an everyday real-life signal in her text makes the order ask for a warm answer inside the story and marks the scene quietly in the dialogue book, and a «мне страшно» or two skipped creepy scenes in one day resolve the intrigue kindly, flag the scene and lower the creepiness level by one until the game day changes.

## Acceptance criteria

1. Given text with an everyday signal such as being tired or a bad day, when it passes the text path, then the order asks for a warm answer inside the story, and a `signal_everyday` mark stands in the dialogue book with no notice for the parent (REQ-1818, REQ-1820). Closed by: an integration test over the order and the log.
2. Given a reply to such an order, when the parent reads it, then the parent judges that it answers warmly inside the story (REQ-1818). Closed by: the parent's judgement of a week of dialogues, because warmth is a reading.
3. Given «мне страшно» found by the `fear` trigger or by the judge's `scared`, or a creepy scene skipped before its last line twice in a row in one game day, when the next scene is built, then a library line shows in which the familiar lights a lamp and the intrigue resolves kindly, the scene is flagged for the parent, and the level in force is one lower, never below 0 (REQ-1540, REQ-1542, REQ-1544). Closed by: a unit test for each cause and each level.
4. Given the lowered level, when the game day changes, then the level is back to the parent's setting. Closed by: a test with a fake clock.
5. Given the `fear` trigger and the `stop` trigger for «не хочу», when they fire, then each reaches the Director as the anxiety signal that EPC-0090 counts. Closed by: an integration test over the event log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the everyday path and the fear path to the text path of TSK-0601. A creepy scene is one shown at level 1 or 2 outside the kinds forced to «Уютно», as ADR-0370 states. The lowered level lasts until the game day index changes, and reads no hour.

## Depends on

- TSK-0601 (blocking): the paths branch from its trigger runner and final level.
- TSK-0603 (blocking): the level in force is the one that task serves.

The epic realising ADR-0090 counts the anxiety signal and responds to it.

## Evidence

Not yet.

## Left alone

The dialogue book's screen, which ADR-0180's epic draws.
