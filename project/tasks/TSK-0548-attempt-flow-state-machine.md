---
id: TSK-0548
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0400]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every adventure task runs one attempt flow that the server owns, and the game has no measurement mode

After this task, `src/engine/attempt/` computes the state of one task's flow from that task's events, the play routes take every task, scored or not, through the states `open`, `first_answered`, `review`, `twin_open`, `twin_review` and `closed`, and no route or flag names a measurement mode.

## Acceptance criteria

1. Given a task answered `clean`, `partial`, `alt` from a wrong answer and `alt` from «Не знаю», when the state machine is driven in each case, then the states and the window's contents follow SPC-0080's table, no twin follows `clean` or `partial` with at most rung 1 shown, one twin follows `alt` or any outcome with rung 2 or 3 shown, and no third attempt follows any twin. Closed by: a state-machine test for each of the four cases.
2. Given a warm-up, a mental arithmetic task, a room task, an easy task and a Guardian task, when each is answered, then each passes through the same states in the same order, so the flow gives the player no sign of which tasks are scored (REQ-0400). Closed by: a state-machine test over the five kinds.
3. Given the play routes and their schemas, when they are searched, then none has a route, parameter or flag for a measurement mode, and every task of an adventure both trains and measures (REQ-0400). Closed by: a search test over the route schemas.
4. Given a request that arrives out of order, such as a second attempt before the first verdict or on a second attempt, when it is sent, then the server answers `409 attempt_open` or `409 not_a_first_attempt` and logs nothing. Closed by: an integration test for each.
5. Given a resumed task in `review`, when the flow state is computed from its events alone, then it is the state before the leave. Closed by: a unit test over a hand-written log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/attempt/flow.ts` as a pure function of the task's events and the next state for a request, importing only `src/shared/`, and route the existing hint, explain, second-attempt and answer routes in `src/server/play.ts` through it in place of their own checks. The outcome is `clean` for a right answer, `partial` for a partial one and `alt` for a wrong answer or «Не знаю».

The twin's trigger is the one SPC-0080 states as ADR-0220 amended it; those requirements, REQ-5130 to REQ-5134, belong to that epic. A riddle runs ADR-0230's flow, a Diary puzzle ADR-0280's, a Volley fact ADR-0290's shortened flow, and a Dutch probe letter the changes of ADR-0430; each epic adds its flow beside this one.

## Depends on

Nothing. The routes and the log exist from the epics realising ADR-0020 and ADR-0030.

## Evidence

Not yet.

## Left alone

What each state shows and charges, which TSK-0550 to TSK-0556 build, and the spell that plays a first attempt's outcome, which ADR-0140's epic builds.
