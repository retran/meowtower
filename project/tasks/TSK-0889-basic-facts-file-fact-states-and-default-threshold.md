---
id: TSK-0889
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5832, REQ-5834, REQ-5836]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each of the 308 basic facts has a state over its last 3 shows

After this task, `content/facts.yaml` lists every basic fact once, `item_shown` carries the `factId` of a bare one-step task that forms a fact, and the `fact_states` projection gives each fact «автоматизм», «вычисляет» or «не знает» and the day it is next due.

## Acceptance criteria

1. Given `content/facts.yaml`, when the validator runs, then it reports 308 facts, 200 in block 2 and 108 in block 1, each tied to a node and subtype of block 1 or 2, with ids such as `mul:7x8`, `div:56/8`, `add:8+5` and `sub:13-5`; given a fixture fact tied to block 3, then it fails with `fact_list_invalid` (REQ-5832). Closed by: the validator's test and its output.
2. Given a fixture log, when `fact_states` is built, then a fact right and no slower than the threshold on 2 of its last 3 shows, the last within 14 days, is automatic; the same fact 15 days later isn't; a fact right on 2 of 3 but slow is «вычисляет»; a fact shown once is «не знает» (REQ-5832, REQ-5834). Closed by: a projection test.
3. Given a fact with no parent setting, when the threshold is read for a tablet, then it is 3 s plus the motor correction of that device type, measured from the fact's show to its submission (REQ-5836). Closed by: a unit test on each device type.
4. Given a bare one-step task whose operands form a fact in the file, whether a mental arithmetic task, a control fact or a room task, when it is shown, then `item_shown` carries its `factId` in a new payload version, an old event upcasts without one, and an `interrupted` show counts for accuracy and has no time (REQ-5832). Closed by: an item builder test and an upcaster test.
5. Given a wrong answer, or one slower than the threshold, on a fact, when `fact_states` is built, then the fact is due the next game day, and after right answers within the threshold it returns after 1, 3, 7 and 14 days and then every 14 days; a fact shown again within 30 days logs no `repeat_forced` (ADR-0290's review schedule). Closed by: a schedule test over fixture logs.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `content/facts.yaml` by the definition in ADR-0290: the times tables 1 to 10 with their divisions, the additions of two digits from 2 to 9 across ten with their subtractions, and a digit from 1 to 9 times 10, 100 or 1000 with its division where the table doesn't hold it. Each fact has a `factId`, its operands, its node and subtype, and so its block. The file's hash is part of the graph version, so a new fact list is a full recompute.

Add the `fact_states` projection with, for each fact, its state, its last 3 shows, its next due game day and its review interval. A show of a fact is an unassisted first attempt with a `factId`, not a rapid guess and not excluded. A fact that is automatic loses the state 14 days after its last show, which is why the interval stops at 14 days.

The review schedule is stated by REQ-7510, which ADR-0460 addresses; this task builds the schedule the Volley picks from, and the epic realising ADR-0460 owns that requirement.

## Depends on

Nothing. The epic realising ADR-0050 supplies the graph file, and the epic realising ADR-0040 the item builder and `item_shown`; until they exist the task runs on a fixture graph and a fixture item builder.

## Evidence

Not yet.

## Left alone

The parent's control for the 3 s, which TSK-0890 adds. The Volley, which TSK-0891 builds on these states.
