---
id: TSK-0758
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5002, REQ-5006]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The story tells the change of day as the Tower re-knitting itself, and no string she can reach names the hour

After this task, the first line of «В прошлый раз…» (Last time…) on the first adventure of every game day but her first is «Башня перевязалась за ночь» (The Tower re-knitted itself overnight), drawn from the line pool under `story.day_turn`, and no player-facing string names the hour at which the game day ends.

## Acceptance criteria

1. Given a 60-day simulation with gaps between days of play, when the first scene of each game day with play is read, then every one except the first opens with a line from `story.day_turn`, and no gap changes that (REQ-5006). Closed by: the simulation's report.
2. Given every player-facing string file, when a search runs for an hour of the day, such as `04:00`, `4:00`, `4 утра` or `четыре часа`, then it finds none, and a fixture that adds one makes the check fail (REQ-5002). Closed by: the string check's test with a failing fixture.
3. Given the Tower's change of day told as «Башня перевязалась за ночь», when the parent reads the line in its place at the stage acceptance, then the parent judges that it reads as the Tower changing and never as a deadline (REQ-5006). Closed by: the parent's judgement, because wording that sounds like a deadline to a child isn't something a program can measure.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the key `story.day_turn` to the line pool of ADR-0110 with the one line above, and make the story's first-scene builder put it first in «В прошлый раз…» when the adventure is the first of a game day and not her first day. The scene builder reads the game-day index from `gameDayOf` and never the hour.

Add a string check to the screen check of ADR-0090 that searches every language file for a time of day written as digits with a colon or as a spelled hour, and fails on a hit that sits outside a task's content. A timetable task prints times of day in its content, which REQ-5022 lets through.

Until the epic realising ADR-0110 builds the line pool, a fixture pool holds the key and the scene builder reads it by key, so the pool's later entries need no change here.

## Depends on

- TSK-0756 (blocking): the game-day index that decides the first adventure of a day.

The epic realising ADR-0110 supplies the line pool; this task runs on a fixture pool and leaves the other lines of «В прошлый раз…» to that epic.

## Evidence

Not yet.

The parent's judgement in criterion 3 rests on judgement: no program tells a deadline from a change in the Tower.

## Left alone

Other lines of «В прошлый раз…» and the story's wording of a day's end inside an adventure, which ADR-0110 owns.
