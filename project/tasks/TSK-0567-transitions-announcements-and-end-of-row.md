---
id: TSK-0567
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0130, REQ-0144, REQ-0146, REQ-0148]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A task opens between the System's announcement and its outcome line, transitions ignore the chosen node, and the end of the row names her growth in words

After this task, each task is announced by the System before it opens and answered by an outcome line after the first attempt, a change of node or floor shows the next transition from a cycle the adventure seed shuffles, and the end of the row names her growth in words.

## Acceptance criteria

1. Given one seed and two different node choices by the Director, when the transitions are listed, then the sequence is the same (REQ-0130). Closed by: a transition test that runs the seed twice.
2. Given any task in a played adventure, when the packets are read, then a System window announcing the knot comes before the task window, and the outcome line comes after the first attempt (REQ-0144, REQ-0146). Closed by: an integration test over 60 tasks.
3. Given an adventure that reaches its finale, when the end of the row is read, then it names experience, level, familiars, quests, star-steel shards and star yarn in words, and holds no score, no percentage and no comparison with past days (REQ-0148). Closed by: an integration test over the finale's packet.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw the transition cycle of four, a hidden hatch, a portal, a braided staircase and a door, shuffled by the adventure seed and stored in the plan of TSK-0565, and read it at each change of node or floor without reading which node was chosen. Add the announcement and the outcome line as scenes from the content library, with their line pools in the per-language file. Choice I made: until ADR-0110's Master and ADR-0140's amounts exist, the lines come from the library and the end of the row names the stand-in growth the routes already hold, so each of the six items appears in words with a placeholder amount.

## Depends on

- TSK-0565 (blocking): the cycle is part of the plan it builds.

The epic realising ADR-0110 supplies the Master's story text, the epic realising ADR-0140 supplies the growth amounts, and the epic realising ADR-0160 supplies the language file's checks. This task leaves each of them to that epic.

## Evidence

Not yet.

## Left alone

The task window and its review, which ADR-0080 governs.
