---
id: TSK-1053
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6718, REQ-6720, REQ-6742, REQ-6770, REQ-6772, REQ-6774, REQ-6776]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The language and format bar shows a gap centred on zero, with its presentations and no Dutch row

After this task, the language and format bar shows the share right on bare tasks minus the share right on context presentations in percentage points with Newcombe's 80 % interval, lists each presentation with its own interval, shows two windows and no change line, and has no Dutch row.

## Acceptance criteria

1. Given 47 of 50 right on bare tasks and 19 of 30 on context presentations, when the bar is built, then the gap is 31 points with an 80 % interval from 19 to 43, the context side pools Russian context tasks and tasks whose `forms` holds `bridge`, and the bar lists bare, Russian context and bridge keywords each with its own 80 % interval (REQ-6770, REQ-6774). Closed by: a unit test and a fixture log with the three presentations.
2. Given attempts with a `factId`, attempts on a node with only a bare template, assisted attempts, and an attempt that REQ-6740 gives to another bar, when the bar is built, then none of them counts on either side, and a node's tested state doesn't matter (REQ-6772). Closed by: a fixture log.
3. Given a bare side below the floor, when the bar is built, then the bar reads «мало данных»; given both windows, then it shows both and no change line, and it carries the note that a change in bare accuracy moves this bar and the computational accuracy bar (REQ-6718, REQ-6720, REQ-6742). Closed by: two fixture logs and a unit test on the entry.
4. Given a log whose `forms` hold a Dutch presentation, when the bar is built, then the bar has no Dutch row and no placeholder for one (REQ-6776). Closed by: a unit test on the entry's rows.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/profile/language-format.ts`. The bare side reads the attempts computational accuracy also reads, the one exception to one dimension for each observation. Leave out a Dutch row and its placeholder because an empty Dutch row would read as a missing ability and not as a part not yet built; the owner's amendment to `CLAUDE.md` and ADR-0430's probe add the rows later.

## Depends on

- TSK-1045 (blocking): the routing order that decides which attempts the bar may read.
- TSK-1046 (blocking): the windows.
- TSK-1047 (blocking): the bar builder and the floor.

## Evidence

Not yet.

## Left alone

The Dutch rows, which wait for the owner's amendment of the Russian-only rule and for the epic realising ADR-0430, and the interpretation lines of ADR-0380.
