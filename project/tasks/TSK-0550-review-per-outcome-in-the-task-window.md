---
id: TSK-0550
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0112, REQ-0402, REQ-0404, REQ-0406, REQ-0408]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After an answer the window shows a review that depends on the outcome, titled «Схема узла»

After this task, the task window's review shows a dry accepted line and an offer of the short solution under «Как легла нить» after a `clean` answer, the short solution at once after `partial` or `alt`, an offer of the detailed explanation after every outcome, and the title «Схема узла».

## Acceptance criteria

1. Given a correct first attempt, when the review shows, then the answer is marked as accepted with a dry outcome line and the short solution is offered under «Как легла нить» (REQ-0402, REQ-0404). Closed by: a Playwright test on the tablet viewport.
2. Given a wrong answer, a partial answer and «Не знаю», when the review shows, then the short solution is on the screen at once with no extra tap (REQ-0408). Closed by: a Playwright test for each.
3. Given any outcome, when the review shows, then the detailed explanation is offered (REQ-0406). Closed by: a Playwright test for each of the three outcomes.
4. Given the review, when its title is read, then it is «Схема узла» (REQ-0112). Closed by: a Playwright test and a check that the string lives in the language file.
5. Given the short solution, when it opens by itself or on request, then the server logs `solution_shown` once for the task. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the review's states to the task window of `src/client/play.ts`, driven by the `review` state of TSK-0548, and the strings to the language file `content/i18n/ru.json`, because a string in a component has to be moved before a second language can ship. The window's look is ADR-0150's; this task shows the content with the components that exist and plain text for the rest.

A Dutch probe letter's review shows the short solution only, and a riddle runs another flow; both are those decisions' changes.

## Depends on

- TSK-0548 (blocking): the flow states the review reads.
- TSK-0551 (not blocking): the short solution's steps come from the graph, and this task can show the stand-in solution until that lands.

## Evidence

Not yet.

## Left alone

The detailed explanation's text and model, which ADR-0120's epic builds, and the strings' forbidden-word check, which ADR-0160's epic runs.
