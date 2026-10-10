---
id: TSK-0710
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-2302, REQ-2318, REQ-2320, REQ-2322, REQ-2372, REQ-2376, REQ-2378]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The summary screen shows the frontier, the nodes to recheck and a long day

After this task, the Parent Room's summary shows the last session, the week's sessions and tasks, node counts by state, the frontier by domain, the nodes not checked for 30 days, the «почти готово» nodes, the nodes whose errors all carry the language-cause mark, and each day's active time with «долгий день» above 120 minutes.

## Acceptance criteria

1. Given a fixture log, when the summary is built, then it shows the last session, the sessions and tasks this week, the node counts by state for 1F, 1S and stretch, and the frontier nodes grouped by domain (REQ-2320). Closed by: a unit test and a Playwright test.
2. Given a node whose last unassisted first attempt is 31 days old and one whose is 30 days old, when the summary is built, then only the first is listed as not checked for a long time (REQ-2322); given a node below «бегло» with an assisted estimate of 0.7 over 3 assisted attempts in the last 30 days, then it is marked «почти готово», and an estimate of 0.69, or 0.7 over 2 attempts, isn't (REQ-2318). Closed by: a unit test with each boundary.
3. Given a node whose every error carries «возможна языковая причина», when the summary is built, then the node is highlighted; given one error without the mark, then it isn't (REQ-2372). Closed by: a unit test.
4. Given a week of daily active time counted as the soft stop of ADR-0090 counts it, when the summary is built, then it shows each day's time, and a day of 121 minutes carries «долгий день» while a day of 120 doesn't (REQ-2376, REQ-2378). Closed by: a unit test and a Playwright test with both days.
5. Given the summary, the VWO block and the graph map with a fixture log, when the parent reads them, then the parent judges that they answer what the player has mastered, where her frontier is and what holds her back (REQ-2302). Closed by: the parent's judgement, because only a reader can say whether the report answers a question.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the summary part to `src/parent/` and its screen. The 0.7 over at least 3 assisted attempts and the 30-day windows come from RES-2300 and RES-0900 through ADR-0180. The «долгий день» mark informs the parent and changes nothing in play; the 120 minutes follow the Canadian 24-Hour Movement Guidelines' limit on recreational screen time, as REQ-2378 notes. The summary also holds one line per limit once TSK-0717 builds the limits; this task leaves a place for it.

The epic realising ADR-0090 supplies the active time as the soft stop counts it. Until it exists the tests feed per-day minutes directly.

## Depends on

- TSK-0708 (blocking): the part joins the report model and its cache.
- TSK-0709 (blocking): the language-cause mark per attempt comes from the node card's function.
- TSK-0711 (not blocking): criterion 5 reads the graph map; the criteria before it hold without it.
- TSK-0713 (not blocking): criterion 5 reads the VWO block; the criteria before it hold without it.

## Evidence

Not yet.

Criterion 5 rests on the parent's judgement, because REQ-2302 asks whether a report answers three questions, and no program can tell it. The adult's reading at stage 0.2 and the parent's at stage 0.3 belong to the epic realising ADR-0190.

## Left alone

The one line per limit, which TSK-0717 adds, and the sections other decisions define for the summary.
