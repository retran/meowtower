---
id: TSK-1115
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7152, REQ-7154, REQ-7158, REQ-7160, REQ-7162, REQ-7164]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A letter keeps one set of controls in every presentation and gets no twin and no second attempt

After this task, every presentation of a letter takes the final answer only with the same controls, a wrong answer shows the short solution at once with no second attempt, and every other T1 to T4 task keeps «Нельзя узнать», its four options and its twin.

## Acceptance criteria

1. Given every presentation of a T1 to T4 family, when a packet test reads each letter's `InputSpec`, then it is the same for all: the final answer with the keypad, «Не знаю», the thread button and «Готово», and no model choice, plan cards, step fields, «Нельзя узнать», options for what is missing, estimate or inverse check (REQ-7154). Closed by: the packet test over every presentation.
2. Given an ordinary T1 to T4 word problem that is no letter, when its packet is read, then «Нельзя узнать» stands beside «Не знаю» in every phase and the task has 4 options for what is missing, each naming a quantity of the story its text doesn't state (REQ-7158, REQ-7160). Closed by: the Playwright test of ADR-0150 as ADR-0430 amends it, which finds the button on every phase of every such problem and on no letter.
3. Given a wrong answer or «Не знаю» on a letter, whatever hint rung she saw, when the flow continues, then it shows the short solution at once, offers no second attempt, writes no `twin_open` and offers no detailed explanation (REQ-7162). Closed by: a state-machine test, one fixture for each rung.
4. Given a first attempt on any task other than a letter that ends wrong or «Не знаю», or after a rung 2 or rung 3 hint whatever its outcome, when the flow continues, then it gives one second attempt on a parallel task, and a «Не знаю» after rung 3 gets one twin (REQ-7164). Closed by: the state-machine test, three fixtures.
5. Given a clean letter in each presentation, with cards and without, when the reward is computed, then the experience and the streak effect equal those of an ordinary task of its kind (REQ-7152). Closed by: a reward test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Give a letter the template's final-answer input in every presentation and drop the model choice, plan cards, step input, «Нельзя узнать», options, ADR-0240's estimate and its inverse check from letters of every track, because the bare presentation must carry the same controls as the text ones and each step adds Russian interface text inside a Dutch presentation. Since a letter is never unanswerable, leaving «Нельзя узнать» out hides nothing that exists. Change ADR-0080's state 4 and its review so a letter gets no twin and no detailed explanation, and ADR-0250's button and options rules so they cover every other T1 to T4 problem. A bought hint rung marks every letter assisted, as ADR-0080 already does.

## Depends on

- TSK-1113 (blocking): the controls belong to the presentations that task builds.

The epic realising ADR-0080 supplies the attempt flow, the epic realising ADR-0250 the button and options rules, and the epic realising ADR-0140 the rewards; the task runs on fixtures of each.

## Evidence

Not yet.

## Left alone

Word cards and the assisted mark they set, which TSK-1116 builds, and the stream a letter's attempt is recorded in, which TSK-1117 sets.
