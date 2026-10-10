---
id: TSK-0894
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5862, REQ-5864]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every template declares bare or context, and at least half of a mixed node's scored tasks are bare

After this task, the template schema refuses a template with no `format`, `item_shown` records the format, and the item builder takes a bare template whenever a node's bare scored tasks of the last 30 days don't outnumber its context ones.

## Acceptance criteria

1. Given a fixture template without `format`, when the template schema loads it, then it refuses it; given `format: "bare"` and `format: "context"`, then both load (REQ-5862). Closed by: the schema test.
2. Given mental arithmetic, a Volley row and a control fact, when each is built, then its format is `bare`, and `item_shown` records the format in a new payload version with an upcaster (REQ-5862). Closed by: an item builder test and an upcaster test.
3. Given a node with templates of both formats and a log where bare scored tasks of the last 30 days number no more than context ones, when the item builder picks, then it takes a bare template; over a simulated 60 days, at every choice on every such node, at least half of the node's scored tasks of the last 30 days are bare (REQ-5864). Closed by: a property test over the simulated log.
4. Given a node whose chosen subtype has templates of one format only, when the item builder picks, then it takes that format, the count still spans the whole node, and the Director chooses among the subtypes that have a bare template while the node's bare count doesn't exceed its context count (REQ-5864). Closed by: a unit test with a one-format subtype.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `format: "bare" | "context"` to the template contract, where bare means an expression with no story in the task window, and record it on `item_shown`. Count only tasks whose template the item builder chose by format, and leave out Volley rows, mental arithmetic and control facts, as ADR-0460 set; a Volley row is bare by definition and would swamp the count.

A subtype under the format hold of ADR-0410 takes a bare template whatever the count. That rule belongs to the epic realising ADR-0410, which adds a first step to the choice this task writes.

## Depends on

Nothing. The epic realising ADR-0040 supplies the template contract and `item_shown`; this task adds the field to that contract, and the existing fixture templates take a format.

## Evidence

Not yet.

## Left alone

Accuracy and fluency by format on the report, which TSK-0897 shows. The 60-day simulation across all profiles, which TSK-0895 runs with this rule on.
