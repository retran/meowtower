---
id: TSK-0805
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5300, REQ-5302, REQ-5304]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A catalogue flag and a seeded draw give an estimate to 10 % to 20 % of eligible tasks, one in a room, scored or not alike

After this task, a subtype carries an estimate when its row in `content/catalogue.yaml` has `estimate: true`, `nextTask` decides by a seeded draw that reads neither the purpose nor the scored flag whether an eligible item carries one, and a room holds at most one estimate.

## Acceptance criteria

1. Given 30 simulated days on each profile, when the estimates are counted over at least 200 scored items of each estimate subtype, then the share is between 10 % and 20 % (REQ-5300). Closed by: the simulation group's report.
2. Given the same days, when the unscored items are counted, then their estimate share is in the same bounds and a two-proportion test doesn't find a difference from the scored share at the 5 % level (REQ-5304). Closed by: the simulation group's report.
3. Given every simulated room, when its items are read, then none holds two estimates, and outside rooms the warm-up, mental arithmetic and the Guardian share one estimate for each floor (REQ-5302). Closed by: the simulation group's report.
4. Given a flagged subtype whose answer kind isn't a number, when the build runs, then it fails (REQ-5300). Closed by: a build check with a fixture row.
5. Given a T2 to T4 word problem with a correct result under 1000, when its item is drawn, then it carries no estimate, and a multi-digit multiplication at any size may (REQ-5300). Closed by: a unit test with the two items.
6. Given estimate and check times added to the profiles' answer times, when the 60-minute adventure is simulated, then it still yields at least 28 scored first attempts at 1.0 times the fluency threshold (REQ-5300). Closed by: the simulation group's report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `estimate` to the catalogue's rows and the build's flag for multi-digit multiplication and division, decimals, percentages, and area and volume, and for T2 to T4 word problems with the bound of a correct result of 1000 or more, which covers the word problems alone as ADR-0240 reads REQ-5300: a word problem's size depends on its story and a small one lets her find the order by calculating.

Add the draw to ADR-0070's `nextTask` with probability `q = min(0.5, 0.15 / (1 - b))`, where `b` is the share of the subtype's last 200 eligible items that couldn't carry one because their room already had an estimate or the option builder refused them. I took ADR-0240's cap of 0.5 as an unmeasured default that stops a subtype the builder mostly refuses from drawing on every item. The room's estimate stays open until an item carries one. The draw reads neither `purpose` nor the scored flag, because an estimate asked only on scored tasks would tell her which tasks are scored. A Dutch probe letter never carries one, as ADR-0430 amends.

## Depends on

- TSK-0804 (blocking): the builder's refusal feeds `b`, and the draw can't carry an estimate the builder refuses.

The epic realising ADR-0070 supplies `nextTask` and the epic realising ADR-0050 the catalogue's subtypes; this task adds the flag and the draw to them as they stand.

## Evidence

Not yet.

## Left alone

The director's choice of any task by the estimate stream or the labels, which nothing reads in the MVP, and the sizing of the room.
