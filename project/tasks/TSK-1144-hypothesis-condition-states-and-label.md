---
id: TSK-1144
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7312, REQ-7316, REQ-7326, REQ-7328, REQ-7330, REQ-7332, REQ-7346, REQ-7368]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Condition states and the label come from counted observations after the judging window opened

After this task, `src/parent/hypotheses/` holds the rule functions that give each condition one of «выполняется», «не выполняется» and «открыто» and a hypothesis one computed label, from observations logged after its judging window opened and from nothing else.

## Acceptance criteria

1. Given a fixture with 100 observations of a measure logged before the hypothesis and 19 after it, when the states are computed, then the condition reads «открыто» with its count of 19; given one more observation after it, then it reads a state, and the 100 appear in no count of the window (REQ-7312, REQ-7330). Closed by: a unit test over the two fixtures.
2. Given a measure with at least 20 observations whose 80 % interval lies wholly on the condition's side, wholly on the other side, or across the number, when the state is computed, then it reads «выполняется», «не выполняется» and «открыто» in that order; a difference uses Newcombe's hybrid score interval and a single share Wilson's (REQ-7330). Closed by: a unit test with one fixture for each of the three cases and each interval family.
3. Given the labels, when every refutation condition is met, then the label is «опровергается» even when every confirmation condition is met too; when every confirmation condition is met and the refutation side is not, then «подтверждается»; and in every other case, a confirmation that is not met included, «мало данных»; and given a side of 2 conditions of which 1 is met, then the side is not met (REQ-7332, REQ-7368). Closed by: a unit test over the labels' truth table.
4. Given an update with `change` of `wording`, `links`, `closed` or `reopened`, when the window start is computed, then it is unchanged, and given `criteria`, then it moves to that event's `seq`; given a changed `confirmText`, `refuteText` or links with the conditions unchanged, then the states and label are unchanged (REQ-7316, REQ-7326, REQ-7328). Closed by: a unit test over the five kinds of change.
5. Given the module, when the lint verb runs on a fixture where `src/parent/hypotheses/` imports from `src/engine/model/`, then `hypothesis_reads_model` fails and names the import, and no rule function reads a probability of knowing a node (REQ-7346). Closed by: the fixture test of the check.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write pure functions over a list of observations in `seq` order: the window start, the observations in the window, the state of one condition, the state of a side and the label. Order by the log's `seq` and never by device time, because an entry a device queued offline can carry an earlier time than events logged before it. A measure retired from the active graph gives `measure_retired` and a measure with no source gives `measure_not_collected`; each reads «открыто» with its own message key under `parent.hypotheses.*`. Add `hypothesis_reads_model` to `tools/static-checks.ts`.

## Depends on

- TSK-1143 (blocking): it reads the condition shape and the measure list.

The epic realising ADR-0380 supplies the Wilson and Newcombe functions through `src/parent/`; this task writes a stand-in with the same signature where that epic hasn't landed, and that epic replaces it. The observations come from a fixture reader until the epics realising ADR-0390 and ADR-0430 supply the profile and probe observation rules.

## Evidence

Not yet.

## Left alone

The daily rows, the hold and the shown label, which TSK-1145 builds on these functions.
