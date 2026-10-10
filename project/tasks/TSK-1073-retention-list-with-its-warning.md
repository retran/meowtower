---
id: TSK-1073
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6884, REQ-6886]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The retention list shows each node's series and every observation, with its warning beside it

After this task, the report lists for each node «проверка запланирована» with its window, «удержание подтверждено» or «удержание не подтвердилось» with the deciding date and its count, every retention observation with date and result, and a warning that 2 of 2 is weak evidence.

## Acceptance criteria

1. Given nodes with a planned, a confirmed, a failed and a cancelled series, and an exempt node with a natural observation, when the report is built, then each node shows its state with the count of right observations out of the total and, for a decided series, the date of the deciding observation; a cancelled series shows «проверка отменена» with its date and reason; every observation is listed with date and result, those without a check, on the exempt node and after a confirmed series included (REQ-6884). Closed by: a report test over a fixture log.
2. Given a held node on the summary's list of nodes not checked for more than 30 days, when the summary is built, then it shows «проверка запланирована» with its window, so the parent reads the gap as planned (REQ-6884). Closed by: a report test.
3. Given the list, when the parent reads it, then a warning beside it says that 2 right of 2 can't reliably tell a child who is right 90 % of the time from one right 70 % of the time, at the size of the list's own text (REQ-6886). Closed by: judgement, the parent reads the dynamics screen with the four series at the stage's acceptance, because whether the wording says that plainly is a matter of reading; and a Playwright test that the warning sits in the list's container with the list's text size.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the list to the post-MVP dynamics screen and the node card, reading `retention_series` and `retention_observations`. All strings live in the Russian string file of ADR-0160: the six labels of ADR-0400's Consequences and the warning. This decision adds no text the player sees, so the Russian-only rule of `CLAUDE.md` isn't touched.

## Depends on

- TSK-1069 (blocking): the decided results the list shows.
- TSK-1071 (not blocking): the cancelled state is read from the `retention_check_cancelled` event, which a fixture can write.

The epic realising ADR-0180 supplies the dynamics screen and the node card.

## Evidence

Not yet.

## Left alone

The layout of the list, which ADR-0150's design system owns.
