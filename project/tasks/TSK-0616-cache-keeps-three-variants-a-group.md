---
id: TSK-0616
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0628]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The cache keeps up to three visible variants for each group and shows them in turn

After this task, `explain_cache` holds explanation variants by group, a group asks for a new variant only while it holds fewer than 3 visible ones of the current prompt version, and the variants of a group come round and round in the order they were stored.

## Acceptance criteria

1. Given tasks of one template, template version, trap, graph shape, kind of answer, familiar and locale, when their groups are computed, then they are equal, and a change in any one of the seven changes the group; the graph shape is the canonical string of operations hashed with SHA-256 to 16 hex characters. Closed by: a unit test with a pair for each field.
2. Given a group with 2 visible variants and budget left, when an explanation is asked, then a new variant is requested; given 3 visible, then the next in turn is taken. Closed by: a unit test.
3. Given a simulated 30 days, when the shown texts are read, then no group shows more than 3 distinct texts of one prompt version and each group's texts come in round-robin order (REQ-0628). Closed by: a simulation test.
4. Given a prompt version change, when the cache is read, then the old variants are `retired`, never shown, and a retired row older than 30 days drains; given 10,000 rows, then one report goes to the owner. Closed by: a unit test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Use the `explain_cache` table of migration 0008 with the columns for group, variant, status `visible`, `hidden` or `retired`, prompt version, check results and the reuse failure count, and add the group's counter. Stop asking for new variants when less than $0.03 of the day's budget is left, so reuse solves can still run; that reserve is a choice ADR-0120 made inside the budget. The 10,000-row ceiling is also ADR-0120's.

## Depends on

- TSK-0615 (blocking): the variants stored are the ones it produces.

## Evidence

Not yet.

## Left alone

The Parent Room's hide control, which TSK-0619 adds, and offline filling, which TSK-0618 adds.
