---
id: TSK-1145
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7304, REQ-7336, REQ-7338, REQ-7364]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `hypothesis_days` keeps each day's states and the hold decides the shown label

After this task, the report rebuild writes one `hypothesis_days` row for each hypothesis, play day and version set, the shown label changes only after the computed label has held for H play days, a change of criteria shows «мало данных» until the hold passes, and closing a hypothesis that has a computed label records what the report showed.

## Acceptance criteria

1. Given a fixture whose computed label turns on day 1, when the days are rebuilt at H = 7, then the shown label stays «мало данных» through day 6 of the new label and reads the new label on day 7 (REQ-7338). Closed by: a projection test over 8 play days.
2. Given a shown label and a computed label that differs for 6 days and returns on the 7th, when the hold is checked, then the shown label has not moved; given the move is back to «мало данных», then it also waits 7 days (REQ-7338). Closed by: a projection test over both directions.
3. Given a hypothesis with a shown label, when a `criteria` change is logged, then the shown label is «мало данных» from that day and stays until the hold has passed on the new criteria (REQ-7364). Closed by: a projection test over a criteria change on day 10.
4. Given a play day, when the rebuild runs after each adventure, then it writes one row for each open hypothesis holding every condition's state with its counts and interval, the computed label, the shown label, the four versions and the cause of any change of the shown label, and a later adventure the same game day overwrites the row (REQ-7336). Closed by: a projection test over two adventures in one day.
5. Given a hypothesis with a computed label, when the parent closes it, then its `hypothesis_updated` holds `shown` with the label and the model, threshold, rules and graph versions the report showed, and given none, then `shown` is absent (REQ-7304). Closed by: a route test over both cases.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `hypothesis_days` projection to the registry beside `node_snapshots`, as a `knowledge` projection that ADR-0060's full recompute rewrites. H is read from `content/thresholds.json` under `hypothesis.holdDays` with the default 7, so a new H is a new threshold version. A play day is a game day of ADR-0090 with an adventure. The cause of a shown-label change is `play`, `version` or `criteria`; TSK-1146 sets `version`. Add `shown` to the `closed` update of version 2.

This task removes the scope guard's trace for the `hypothesis_days` table.

## Depends on

- TSK-1144 (blocking): the computed label is the projection's input.

The epic realising ADR-0060 supplies the four versions and the recompute; fixture versions stand in until then.

## Evidence

Not yet.

## Left alone

Restarting the hold when a version changes, which TSK-1146 adds, and the report's line, which TSK-1147 builds.
