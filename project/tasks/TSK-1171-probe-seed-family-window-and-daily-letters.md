---
id: TSK-1171
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-7106, REQ-7136, REQ-7514]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A letter's seed is its task's base seed, a family closes at its last presentation, and the day's letters follow the count of templates

After this task, a probe presentation's seed is replayable like any task's, a family closes when its last presentation is shown or its 14-day window ends, the day's letters are 3 to 5 on a day with at least 3 templates that hold an approved pair, and the profile reads a Dutch letter only as a presentation row. This settles entries 7, 67, 79 and 81 of ADR-0460.

## Acceptance criteria

1. Given a probe presentation created for a family, when its task is built, then the seed ADR-0430 draws is that task's `baseSeed`, `item_shown` logs the effective seed as `base/k` or `base/f<i>`, and rebuilding the task from the log gives the same view (REQ-7106). Closed by: a replay test over the five presentations of one family.
2. Given a family whose last presentation is shown on day 5 and another whose window ends on day 14, when the families are read from the log, then both are closed with no event written, every presentation of a family falls fewer than 14 days after its first, and an open family with nothing left to show takes no place of the day's 4 or 2 (REQ-7136). Closed by: a unit test over both families.
3. Given a game day with 3 eligible templates that hold an approved pair, when the day's letters are planned, then it shows 3 to 5 until the Russian, Dutch and Dutch-after-words presentations each hold 20 observations or the player has played on 28 game days of the probe, and 1 to 2 after that; given a day with 2 such templates, then it shows what it can and `probe_day_short` counts the day for the parent (REQ-7514). Closed by: a planner test over the three counts of templates.
4. Given the mapping version that first lists `nl_probe`, when the profile reads a Dutch letter's attempt, then it joins the language and format bar as a presentation row and never the pooled context side, and the other projections still skip it. Closed by: a profile fixture test over a log with Russian and Dutch letters.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 7, 67, 79 and 81 as written. A family that closes at its last presentation frees its place, because an open family with nothing left to show would cut the day's letters below the floor. The pooled side measures Russian word problems, and a Dutch letter pooled into it would mix language into that measure. ADR-0460 reopens entry 16 with ADR-0430 if more than 2 adventures in 30 game days resume the next day only because the graph minimum and the letters didn't both fit.

## Depends on

- TSK-1160 (not blocking): its planner counts the letters this task plans; it runs on a fixed 3 letters until this task lands, and the two touch only through that count.

The epics realising ADR-0390 and ADR-0430 own the profile and the probe; this task runs on fixture families and a fixture mapping.

## Evidence

Not yet.

## Left alone

The approved pairs' text and checks, which TSK-1170 and the epic realising ADR-0430 build; every rule here changes nothing she sees until the owner amends `CLAUDE.md` and the probe is built.
