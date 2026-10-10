---
id: TSK-0831
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5462, REQ-5464]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report shows four separate counts, the refusal observation and a note that the unanswerable estimates stay unchecked

After this task, the report's Summary shows, beside the word-problem matrix, the counts of «Не знаю», «Нельзя узнать» on solvable problems, answers of class `used_extra_data` and numbers given for unanswerable problems, the observation «склонна отказываться от задачи» while the guard is raised, and a fixed note beside the unanswerable streams.

## Acceptance criteria

1. Given a fixture log with each kind of answer, when the report is built, then the four counts are shown per period beside the matrix, unanswerable problems are absent from the matrix, and surplus problems are in it (REQ-5462). Closed by: a report fixture test.
2. Given a log where the guard is raised, when the report is built, then the observation «склонна отказываться от задачи» shows among the «с помощью» figures, and after a clear it doesn't. Closed by: a report fixture test.
3. Given a plan ended by «Нельзя узнать», when the planning-error count is computed, then the plan counts in no planning-error count. Closed by: a report fixture test.
4. Given the report, when a parent reads the note beside the unanswerable streams at the stage acceptance, then the parent judges whether it says that at about one such problem in two to three weeks these estimates stay «не проверено» or near their prior for months (REQ-5464). Closed by: judgement, because REQ-5464 is verified by a person's reading and no test can tell whether a sentence is understood.
5. Given a fixture log of 4 weeks, when the command `./meowtower status` or its report query runs, then it prints `false_insufficient` rates for T4 against T1 to T3 and for each phase, with the counts beside them. Closed by: the command's output over the fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the four counts, the observation and the note to the Summary screen as ADR-0250 and ADR-0360 set, with every string in the Russian file. Add the query of criterion 5 as a read-only report line.

I chose to give the comparison of ADR-0250's checks 13 and 14 a query and not a screen, because the owner and not the parent reads it and the decision names no screen for it.

## Depends on

- TSK-0821 (blocking): the counts read the new verdicts and classes.
- TSK-0827 (blocking): the observation reads the guard's events.
- TSK-0830 (not blocking): the «Не знаю» count is the same whichever task lands first.

The epic realising ADR-0180 supplies the Summary screen and the matrix. The epic realising ADR-0270 supplies the planning-error count; until it exists the third criterion runs on a fixture count.

## Evidence

Not yet.

## Left alone

The wording judgement of the real report at stage acceptance, which the parent does, and the four-week reading of the comparison, which is the premortem's check and waits for four weeks of play.
