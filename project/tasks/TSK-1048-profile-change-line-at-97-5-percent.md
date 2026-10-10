---
id: TSK-1048
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6722, REQ-6730, REQ-6732, REQ-6734]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A change line claims a rise or a fall only when a 97.5 % interval excludes zero

After this task, each bar whose two windows both pass the floor shows «возможно, выросло», «возможно, снизилось» or «без заметного изменения», and a comparison over changed content says so, so eight lines read at once don't show a false change on one report in five.

## Acceptance criteria

1. Given two windows that both pass the floor, when Newcombe's hybrid score interval at 97.5 %, z = 2.2414, built from the two Wilson intervals at the same level, lies wholly above zero, wholly below it or holds it, then the line reads «возможно, выросло», «возможно, снизилось» or «без заметного изменения» (REQ-6730, REQ-6732). Closed by: three unit tests with counts whose bounds are written out in the test.
2. Given a previous window with 9 observations, when the bar is built, then it shows no change line at all (REQ-6722). Closed by: a fixture log.
3. Given a template that carries a version in the current window that it didn't carry in the previous one, when the comparison is built, then it carries «контент изменён», also on the language and format bar and on a bar whose change line is hidden; given a template that appears in one window only, then the label stays off (REQ-6734). Closed by: three fixture logs.
4. Given 1,000 seeds of a synthetic student whose accuracy in every family stays constant, when one profile per seed is computed at played game day 56, then at most 20 % of the profiles claim a change in any bar (REQ-6730). Closed by: a simulation test with seeds 1 to 1000.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/profile/change.ts`. Take the Wilson bounds at 97.5 % inside Newcombe's interval because the method takes each share's bounds at the level of the difference. The change lines are entries of `verify/contrasts.json` approved by ADR-0390: add the entry for the profile's change lines and implement it in `src/parent/contrasts.ts` where the epic realising ADR-0380 has built that file; until then keep the function in `src/parent/profile/change.ts` and register it when that file exists. The «контент изменён» label sits on the comparison, not on the line.

The language and format bar gets no change line; TSK-1053 enforces that.

## Depends on

- TSK-1046 (blocking): the two windows.
- TSK-1047 (blocking): the shares and the floor the line tests.

## Evidence

Not yet.

## Left alone

The labels «без контрольных прогонов: сравнимость ниже» and the one-device-type rule, which ADR-0180 states for every dynamics view, and the interpretation lines at 95 %, which belong to ADR-0380.
