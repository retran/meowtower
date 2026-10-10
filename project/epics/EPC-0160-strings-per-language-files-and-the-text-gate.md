---
id: EPC-0160
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0160
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every player-facing string lives in a per-language file, and one forbidden list in one gate checks every line

Realises exactly ADR-0160: the string file and the typed `t`, the checks that fail a string written in the code, the world's labels and the rejected ones, the System section the parent reads, the forbidden list with every form written out, the text gate, and its two calls, one at build time for fixed text and one on the server for generated text.

Until the epics realising ADR-0040, ADR-0110 and ADR-0120 exist, the gate's fallbacks are `system.fallback.line` and the build check renders the fixture templates of the epic realising ADR-0040. Each task names what it leaves to those epics.

## Acceptance criteria

1. `grep -rP '[\x{0400}-\x{04FF}]' src --exclude-dir=__fixtures__` prints nothing, and the lint run reports no `no-literal-string` finding. Evidence: the command's output and the lint verb's output, from TSK-0677.
2. Deleting one key from `ru.json` makes `npx tsc --noEmit` fail at every call site of that key. Evidence: the type test's report, from TSK-0676.
3. A render of every screen with a pseudo-language file whose values are the keys finds no visible or accessible text that isn't a key. Evidence: the Playwright test's report, from TSK-0677.
4. The fixtures «ошибкой», «задачку», «Урок», «ОЦЕНКА» and the Latin look-alike «зaдача» are blocked, and «примерно», «примерить», «мимоза» and «верно» pass. Evidence: the unit tests' reports, from TSK-0680 and TSK-0681.
5. A server test sends one line from each of the Master, the pool, the Explainer, a template and a fixed string, each holding a forbidden form, and none reaches the event stream and each leaves one `text_blocked` row. Evidence: the integration test's report, from TSK-0683.
6. The tests for REQ-3310 and REQ-3322 find the exact labels, and the thread button reads «Путеводная нить · 0» at zero threads with no shortage phrase on the screen. Evidence: the unit test's and the Playwright test's reports, from TSK-0678 and TSK-0680.
7. The parent reads the `system.*` section at the stage 0.3 acceptance and signs off REQ-3300, REQ-3306 and REQ-3318. Evidence: the parent's judgement, from TSK-0679.
8. Every requirement ADR-0160 addresses lands in a closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the number of forms in `content/shaming.ru.json`, which TSK-0680 reports against the estimate of about a thousand, and the share of lines blocked for each source and game day, which the counter table of TSK-0683 holds. ADR-0160 reverses to a model check for a source whose blocked share stays above 5 % over a week, and TSK-0683's report is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0676 One typed function reads every string from the language file, and a language is shipped only when its keys match
      closes: REQ-3810, REQ-3304
      depends: none
- [ ] T-002 [P] TSK-0677 A string written into the code fails the build
      closes: REQ-3810
      depends: TSK-0676 - the pseudo-language run needs the typed `t` and the language files it loads.
- [ ] T-003 [P] TSK-0678 The interface uses the world's labels, and a label that brings back the test, the clock or the streak fails the build
      closes: REQ-3310, REQ-3312, REQ-3322
      depends: TSK-0676 - the labels are keys of the typed file.
- [ ] T-004 [P] TSK-0679 Every fixed System line sits in one section the parent reads in one sitting
      closes: REQ-3300, REQ-3306, REQ-3318
      depends: TSK-0676 - the lines are keys of the typed file and the pause form is its System message shape.
- [ ] T-005 [P] TSK-0680 One forbidden list holds every inflected form, every phrase and the knot's wrong word
      closes: REQ-3314, REQ-3320, REQ-3324
      depends: none
- [ ] T-006 TSK-0681 `textGate` checks a line against the one list and returns a pass or the rule that failed
      closes: REQ-3328, REQ-3302
      depends: TSK-0680 - the gate reads the list and its fixtures.
- [ ] T-007 [P] TSK-0682 The build passes every fixed string and 200 rendered seeds of every template through the gate
      closes: REQ-3326, REQ-3308
      depends: TSK-0681 - the check calls the gate.; TSK-0676 - the check walks the keys and groups of the typed file.
- [ ] T-008 [P] TSK-0683 The server runs the gate on every line before it leaves, and a blocked line is replaced by its source's fallback
      closes: REQ-3326
      depends: TSK-0681 - the server calls the gate.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0676 and TSK-0680.
- After TSK-0676: TSK-0677, TSK-0678 and TSK-0679.
- After TSK-0680: TSK-0681.
- After TSK-0681: TSK-0683, and TSK-0682 once TSK-0676 is done as well.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0676 | REQ-3810, REQ-3304 |
| TSK-0677 | REQ-3810 |
| TSK-0678 | REQ-3310, REQ-3312, REQ-3322 |
| TSK-0679 | REQ-3300, REQ-3306, REQ-3318 |
| TSK-0680 | REQ-3314, REQ-3320, REQ-3324 |
| TSK-0681 | REQ-3328, REQ-3302 |
| TSK-0682 | REQ-3326, REQ-3308 |
| TSK-0683 | REQ-3326 |

REQ-3810 and REQ-3326 sit in two tasks each, because each needs a program change and a check on top of it.

The smallest set of tasks that would test the decision is TSK-0676, TSK-0680, TSK-0681 and TSK-0683. Together they show whether a missing key fails the compile, whether the list catches the forms and spares the neighbours, and whether a forbidden line from any source stays off the event stream, which are the failures the decision's premortem names.

## Not covered

None of the 15 requirements is deferred. The epic leaves four things to other work, each named in ADR-0160's section on what it does not settle:

- Guilt and attachment phrases (REQ-3316): they have no fixed wording, so ADR-0110's safety check measures them on its test set.
- The ally's name from the autumn finale (REQ-3330): the string file holds it under `canon.ally.name`, and ADR-0110's canon memory decides when the story uses it.
- Generated text for REQ-3320: the gate rejects «узелок» only in the knot's own keys, and ADR-0110 and ADR-0120 hold the rule in the Master's and the Explainer's text.
- A second language: no Dutch or English file is written, because a person writes its strings and its forbidden list at the Dutch stage.
