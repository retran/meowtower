---
id: TSK-1022
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-1712, REQ-1716, REQ-1720, REQ-2108, REQ-3534]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The naming filter, the reward return, the chest slots and the assisted share each get one stated rule

After this task, the hatching screen suggests no name in use including canon names she met, a missed reward returns at the next session's first scene after 6 sessions, a success chest keeps one sparkling slot, and an assisted attempt counts at most 0.5 in the room and floor shares.

## Acceptance criteria

1. Given a name she gave and a canon name of something the game showed her, when the hatching screen suggests names, then neither appears among the suggestions (REQ-3534). Closed by: a unit test over a fixture log.
2. Given a `reward_queue` entry that is 6 sessions old and a next session with no floor entry, when the session's first scene is chosen, then the reward returns at it, whatever kind of scene it is, and `reward_reopened` is logged, so no reward waits past 7 sessions (REQ-1720). Closed by: a rewards test over a seven-session log.
3. Given a success chest where Diary pages take the largest shortfall, when its three slots are built, then the pages fill the first slot as good, the sparkling quality moves to the category with the second shortfall and the third slot is ordinary, so the chest still offers one sparkling reward (REQ-2108). Closed by: a chest test.
4. Given an assisted `clean`, an assisted `partial`, an assisted `alt`, a correct rapid guess and a wrong rapid guess, when the room and floor shares are counted, then they count 0.5, 0.5, 0, 0.5 and 0, and a room whose clean share reaches the room threshold takes `success` and otherwise `alt` (REQ-1712, REQ-1716). Closed by: a share test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the naming filter, the reward queue's return rule, the chest builder and the share function in the rules module that ADR-0140 names. REQ-3534 says "already in use in the player's game", and a canon name she has met is in use. ADR-0140's "at most 0.5" is exactly the smaller of an attempt's value and 0.5.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The quality weights of the chest's other slots and the room threshold's value, which ADR-0140 owns.
