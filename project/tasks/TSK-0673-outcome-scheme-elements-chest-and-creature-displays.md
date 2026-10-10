---
id: TSK-0673
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3214, REQ-3216, REQ-3218, REQ-3220, REQ-3222, REQ-3226, REQ-3228, REQ-3240]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Outcomes, the knot scheme, the experience bar, elements, chests, unmet creatures and quests show what the rules require

After this task, each of these displays follows its rule: an outcome shows an icon and a word, the scheme shows her answer, the experience bar never tracks the day, an element shows its colour, icon and name, a chest names its quality, an unmet creature shows «???» and an unfinished quest isn't marked failed.

## Acceptance criteria

1. Given each of the five outcome views of `OutcomeBadge`, when it renders, then it holds an icon and a word together, and a view with colour alone fails the test (REQ-3214). Closed by: a Playwright test over the five views.
2. Given a task whose answer was 7, when the knot scheme renders, then her answer sits beside the steps the code built (REQ-3216). Closed by: a Playwright test that reads both.
3. Given a day with 3 floors cleared, when the experience bar renders, then it shows points toward the next level and the same bar at the day's start and end differs only by the points earned, with no element that grows with the time of day (REQ-3218). Closed by: a Playwright test with a stubbed clock.
4. Given an element, when it appears anywhere, then its colour, icon and name appear together, and when she has named the element herself, then every place shows her name in place of the default (REQ-3220, REQ-3222). Closed by: a Playwright test over each screen that shows an element, with and without her name.
5. Given a chest, when it shows its three rewards, then each states its quality in words; given a creature she hasn't met, then its name reads «???»; given an unfinished quest, then it carries no failed mark, no cross and no word of failure (REQ-3226, REQ-3228, REQ-3240). Closed by: a Playwright test for each of the three.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Take the data each display needs from the server's reply fields that the epic realising ADR-0140 defines, and draw it with the ported components. The `OutcomeBadge` maps the three game outcomes to its five views as RES-3200 sets out, with `soft` for the knot loosened after a wrong answer and `unknown` for «Принято» after «Не знаю». Take every label from the language file.

## Depends on

- TSK-0660 (blocking): the ported components these displays are made of.

The epic realising ADR-0140 supplies the outcome, the badge, the grants, the chest contents and the bestiary state. Until it lands, tests render each component from fixture props.

## Evidence

Not yet.

## Left alone

Which reward a chest offers, and when a quest ends, which ADR-0140 decides.
