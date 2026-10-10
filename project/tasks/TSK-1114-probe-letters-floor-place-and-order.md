---
id: TSK-1114
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7130, REQ-7132, REQ-7134, REQ-7136, REQ-7146, REQ-7148]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Letters take a fixed place on the floor, one presentation of a family a game day, in a balanced order

After this task, `planDay` places the day's letters on each maths floor after the Sources track's tasks and before the rooms, at most 2 on a floor, and gives each open family at most one presentation a game day in an order that is fixed at its creation and balanced across families.

## Acceptance criteria

1. Given a family presentation, when it reaches the player, then it arrives as a letter from the Mainland whose short story frame comes from the line pool and the same frame opens every presentation of the family, and the letter's task opens in the ordinary task window in the same slot (REQ-7146). Closed by: a Playwright test and a unit test on the frame choice.
2. Given a maths floor, when `planDay` plans it, then the order is entry scene, unscored warm-up, 2 mental arithmetic tasks or one Volley, the Sources track's tasks where it has them, at most 2 letters, 1 or 2 rooms, sometimes a Guardian, then the floor chest; and a letter not shown when its floor ends moves to the first later maths floor of the same game day with fewer than 2 letters, then to the next game day, so no floor holds more than 2 (REQ-7148). Closed by: a planner test over a fixture day.
3. Given the probe's first phase, when a day is planned, then 4 families are open on 4 different templates and each shows at most one presentation that day, and after the first phase 2 families stay open, so no two presentations of one family fall on one game day (REQ-7134). Closed by: a planner test over 14 simulated days.
4. Given a family's order, when it is created, then `nl_after_words` directly follows `nl` on a later game day with no presentation between, and each of `bare`, `ru` and `nl_source` goes before or after that pair by the balancing rule, so over the families built so far its before-count and after-count differ by at most 1 and a replay of the log gives the same order (REQ-7130, REQ-7132). Closed by: a unit test over 20 fixture families and a replay test.
5. Given a family, then every presentation falls fewer than 14 game days after its first, counted by `gameDayOf` whether she plays or not, and a family whose window ends before all its presentations are shown closes with the ones it has and plans no more, with no event written for the closing (REQ-7136). Closed by: a unit test with days skipped.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the letters to `planDay` as a fixed part of a maths floor that takes no room slot, so the Director's slot sources and the flow corridor stay as ADR-0070 sets them. The first phase plans 3 or 4 letters a day: where ADR-0070 can't plan its floor of at least 28 graph first attempts, or 25 when rooms are trimmed, with 4 letters, it plans 3, and the family with the most game days left in its window skips the day. When fewer than 3 eligible templates hold an approved pair, the day shows fewer letters and the server counts `probe_day_short`. The first phase ends when the `ru`, `nl` and `nl_after_words` cells of the overall table each hold 20 graded first attempts, or when she has played on 28 game days with the switch on, whichever comes first; the phase is a projection and is logged nowhere else. A family also closes when its last presentation is shown, as ADR-0460 settles. The line pool holds no letter scene before the canon record of TSK-1120 is approved.

## Depends on

- TSK-1113 (blocking): it plans the presentations that task builds.

The epic realising ADR-0070 supplies `planDay` and the epic realising ADR-0290 the Sources track's fixed place in the floor; the task runs on fixtures of both.

## Evidence

Not yet.

## Left alone

The letter's controls, which TSK-1115 sets, and the 60-day run of all these rules together, which TSK-1121 makes.
