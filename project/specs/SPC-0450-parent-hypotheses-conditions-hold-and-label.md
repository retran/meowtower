---
id: SPC-0450
artifact: spec
status: live
revised: 2026-09-29
states: [REQ-7300, REQ-7302, REQ-7304, REQ-7306, REQ-7308, REQ-7310, REQ-7312, REQ-7314, REQ-7316, REQ-7318, REQ-7320, REQ-7322, REQ-7324, REQ-7326, REQ-7328, REQ-7330, REQ-7332, REQ-7334, REQ-7336, REQ-7338, REQ-7340, REQ-7342, REQ-7344, REQ-7346, REQ-7348, REQ-7350, REQ-7352, REQ-7354, REQ-7356, REQ-7358, REQ-7504, REQ-7362, REQ-7364, REQ-7366, REQ-7368, REQ-7370, REQ-7372, REQ-7374]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent's hypotheses: the two events, the text form and history, and after the MVP the numeric conditions, the hold and the label

## Scope

This document covers the parent's hypotheses in the Parent Room: the tab «Гипотезы» (Hypotheses), its three routes, the events `hypothesis_recorded` and `hypothesis_updated`, the history of each hypothesis, and, after the MVP, the numeric conditions, the list of home measures they read, the judging window, the condition states, the computed and shown labels, the hold, the projection `hypothesis_days`, the hold calibration and the example hypothesis that build check 5 runs. It is written at the component level: routes, events and their payloads, files, tables, rule functions, static checks and the states the parent reads. The tab's layout is the interface specification's (SPC-0150).

The first version holds the events, the text form, the node links and the history. Everything from "Conditions" on in Behaviour comes after the MVP, and each section says so.

It leaves out what other documents state. The PIN, the parent session and its 30-minute expiry are SPC-0010's and SPC-0030's, and the Parent Room's other panels and report v1 are SPC-0180's. The log, `appendEvents`, upcasters and the whole-log export are SPC-0020's. The four versions and the full recompute are SPC-0060's. The game day is SPC-0090's. The profile dimensions and how each counts an observation are ADR-0390's, the probe's presentations, schedule and help rule ADR-0430's, and the 80 % intervals, the «мало данных» (too little data) floors registry, build check 5 with its four synthetic players and addendum 2's MVP scope ADR-0380's. The probe's cells are SPC-0430's. The school goals and their two screens are SPC-0310's.

## Boundary

### Routes

Every route needs a paired device and a parent session opened with the PIN, as SPC-0180 states for `/api/parent/*`, and answers `401` without one (REQ-7306). Every request that changes state carries `clientSeq`, as SPC-0030 states.

| Route | What it does |
| --- | --- |
| `GET /api/parent/hypotheses` | Returns every hypothesis with each of its versions and the date each was replaced, the names of the nodes the graph holds for the node picker, and, after the MVP, each hypothesis's report line. It returns nothing else about a node: no state, share, count or estimate. |
| `POST /api/parent/hypotheses` | `{ text, criteria, links, clientSeq }`. Writes `hypothesis_recorded` and returns the new `hypothesisId`. |
| `POST /api/parent/hypotheses/:id` | Either `{ text, criteria, links, reason?, clientSeq }`, a new version, or `{ action: "close" \| "reopen", reason?, clientSeq }`. Writes one `hypothesis_updated`, or nothing when the new version equals the current one. |

### Events this part owns

Both are parent events, written only through the routes above and `appendEvents`. ADR-0380 names this part's decision as their owner, and SPC-0020 lists them among the parent actions.

| Event | Version 1, the first version | Version 2 adds, after the MVP |
| --- | --- | --- |
| `hypothesis_recorded` | `hypothesisId`, a ULID the server assigns; `text`; `criteria`: `confirmText` and `refuteText`; `links`: `nodes`, 0 to 10 node identifiers of SPC-0050's graph | `criteria.conditions`, optional: `confirm` and `refute`, each 1 to 3 conditions; `links.dimensions` and `links.presentations`; `links.schoolGoals` once SPC-0310's two screens exist |
| `hypothesis_updated` | `hypothesisId`; `change`: `wording`, `criteria`, `links`, `closed` or `reopened`; `reason`, optional; the whole new `text`, `criteria` and `links` | `shown`, only on `closed` while a computed label exists: the shown label and the model, threshold, rules and graph versions the report showed at that moment |

Version 2 is a new payload version with an upcaster from version 1, as SPC-0020 states for added fields.

### Files, tables and modules

| Surface | What it is |
| --- | --- |
| `src/shared/events.ts` | The two event schemas. |
| `src/parent/hypotheses/` | The rule functions: condition state, side, computed label, hold and change count. After the MVP. |
| `content/hypothesis-measures.json` | The list of home measures. After the MVP. |
| `hypothesis_days` | The projection with one row per hypothesis, play day and version set. After the MVP. |
| `content/thresholds.json` | Holds the hold length under `hypothesis.holdDays`. After the MVP. |
| `content/i18n/ru.json` | Holds every label, state, mark and notice of the tab under `parent.hypotheses.*`. |
| `tools/hypothesis-hold.ts` | The hold calibration, in the simulation group of SPC-0190's verify. After the MVP. |
| `verify/check5/example-hypothesis.json` | The example hypothesis's conditions. |
| `verify/check5/example-hypothesis.lock` | For each SHA-256 hash of the example file, the approved decision in `project/adrs/` that set it; ADR-0450 is the first entry. |

A play day is a game day of SPC-0090 on which the player played an adventure.

### Static checks

SPC-0190's group 1 runs four checks of this part, each failing verify and naming the file or module:

- `hypothesis_measures_versioned` fails when the content of `content/hypothesis-measures.json` or of ADR-0390's `content/profile.dimensions.json` changed and `RULES_VERSION` of SPC-0060 didn't, or when an identifier disappeared from the list.
- `hypothesis_reads_model` fails when a module under `src/parent/hypotheses/` imports from `src/engine/model/`.
- `hypothesis_to_gateway` fails when a module under `src/server/gateway/` or a request-class builder of SPC-0100 imports the hypothesis schemas, `hypothesis_days` or `src/parent/hypotheses/`.
- `hypothesis_example_lock` fails when the hash of `verify/check5/example-hypothesis.json` has no entry in the lock file naming an approved record in `project/adrs/`.

SPC-0190's scope guard fails the first version on three traces of the part after the MVP: the `hypothesis_days` table, `content/hypothesis-measures.json` and a version 2 schema of either event.

### What this part requires from other parts

- SPC-0020 supplies `appendEvents`, the unique `idem_key`, upcasters, the projections' rebuild and the whole-log export.
- SPC-0010 and SPC-0030 supply the PIN, the parent session and `clientSeq`; SPC-0180 supplies the Parent Room, the report rebuild after each adventure and its check of `parent.*` values.
- SPC-0050 supplies the graph's node and subtype identifiers and names; SPC-0060 supplies the four versions, `RULES_VERSION`, the full recompute and the unassisted first attempts it admits; SPC-0090 supplies the game day.
- ADR-0380 supplies the Wilson and Newcombe interval module and the floor registry `src/parent/measures.ts`; ADR-0390 supplies the profile dimensions and their observation rule; ADR-0430 supplies the probe presentations and what counts as right without help.
- SPC-0190 runs the static checks, the scope guard, the simulations and the end-to-end scan of the player's screens.

### Permitted dependencies

- The routes write only through `appendEvents`, and `src/parent/hypotheses/` reads the log, the projections and the measure list and writes only `hypothesis_days` and the report's hypothesis part.
- `src/parent/hypotheses/` imports nothing from `src/engine/model/`.
- Nothing under `src/server/gateway/`, no request-class builder and no local judge of SPC-0350 imports a hypothesis schema, `hypothesis_days` or `src/parent/hypotheses/`.
- No player route, player projection or player screen reads a hypothesis event or `hypothesis_days`.

## Behaviour

### Access

The server refuses every request that reads or changes a hypothesis unless it comes from a parent session opened with the PIN, and answers `401` (REQ-7306). The player's routes carry no field for a hypothesis, so no screen the player sees shows a hypothesis's text, criteria, links, condition states or label (REQ-7354). SPC-0190's end-to-end scan of her screens looks for a canary hypothesis text and every `parent.hypotheses.*` label.

### Saving a hypothesis

Saving a new hypothesis logs one `hypothesis_recorded` with its whole text, criteria and links (REQ-7300). Saving a change logs one `hypothesis_updated` with the whole new text, criteria and links, the kind of change and the reason the parent gives, if any (REQ-7302). Every version reads from one event, and earlier wording stays in the earlier events, which the log never changes.

The server derives `change` from the difference to the previous version, and ignores any kind a client sends. The kind is `criteria` whenever `confirmText`, `refuteText` or a condition differs, else `wording` when the text differs, else `links`. Closing and reopening are actions of their own, logged as `closed` and `reopened`, that change nothing else. A save with no difference logs nothing. A save is logged under SPC-0030's key `<route>:<deviceId>:<clientSeq>`, so a retry after a lost reply logs one version.

When the parent closes a hypothesis that has a computed label, after the MVP, the `closed` event holds in `shown` the shown label and the model, threshold, rules and graph versions the report showed at that moment (REQ-7304). A hypothesis closed with no computed label, as every hypothesis in the first version, holds no `shown`. A hypothesis can't be deleted; closing it is the only way to set it aside.

The server refuses a `text` over 2,000 characters, a `confirmText` or `refuteText` over 1,000, a `reason` over 500, more than 10 node links, and, after the MVP, conditions with a side that holds 0 or more than 3. A closed hypothesis takes only `reopen`; any other change to it answers `409 hypothesis_closed` and logs nothing. A `close` sent to a closed hypothesis or a `reopen` sent to an open one logs nothing and returns the current version. The tab shows the notice `open_hypotheses_many` once each time the count of open hypotheses rises above 20, and refuses nothing for it.

### The first version: text criteria, node links and history

The first version holds the tab, the form with the text, `confirmText`, `refuteText` and node links, and each hypothesis's history (REQ-7366, REQ-7372). The history lists every earlier version of the text, criteria and links, each with the date it was replaced (REQ-7308).

The form shows no current value of any measure: no state, share, count, estimate or label of a linked node or of a measure a condition names (REQ-7310). The form draws only the version's own fields and the node names of `GET /api/parent/hypotheses`, never its report line.

The first version holds no numeric condition, no link to a profile dimension or a probe presentation and no computed label (REQ-7358), and the scope guard enforces it through its three traces. The form offers no link to a school goal until SPC-0310's two screens exist (REQ-7374).

A hypothesis with no numeric conditions shows «Критерии записаны текстом — отчёт их не проверяет» (the criteria are written as text; the report doesn't check them) in place of a label, the state `criteria_text_only` (REQ-7370). That holds for every hypothesis in the first version and for any hypothesis after the MVP that the parent wrote or kept without conditions.

### Conditions, after the MVP

`criteria.conditions` is optional as a whole: the parent can still write a hypothesis with text criteria alone after the MVP, and it shows `criteria_text_only`. When conditions are present, they hold 1 to 3 conditions for confirmation and 1 to 3 for refutation (REQ-7320). A condition compares one measure, or one measure minus another, with a number of percentage points the parent writes, and says `above` or `below` (REQ-7322). A side is met only when every condition on it is met (REQ-7368).

`confirmText` and `refuteText` stay beside the conditions and never affect a condition state or a label (REQ-7326). The links to nodes, dimensions, presentations and a school goal never affect one either (REQ-7328); a school-goal link shows the hypothesis beside that goal's values on SPC-0310's screens. A hypothesis written in the first version gets conditions only when the parent rewrites its criteria as numbers, which is a `criteria` change.

### The list of home measures, after the MVP

Every measure a condition names comes from `content/hypothesis-measures.json` (REQ-7324). The list holds kinds, each an identifier pattern with its observation rule, and the probe's five presentations by name; it doesn't enumerate the graph's nodes and subtypes, which SPC-0050's graph and its version own.

| Kind | Identifier | Observation |
| --- | --- | --- |
| Profile dimension | `dimension.<id>` | an observation as ADR-0390's `content/profile.dimensions.json` assigns it to that dimension |
| Node share | `node.<id>` | an unassisted first attempt on the node that SPC-0060 admits, right or not |
| Subtype share | `subtype.<id>` | the same, on the subtype |
| Probe presentation share | `probe.bare`, `probe.ru`, `probe.nl`, `probe.nl_after_words`, `probe.nl_source` | an observation of SPC-0430's probe cell for that presentation: a graded first attempt on a letter of that presentation, less the tasks the parent excluded, counted right when its outcome is `clean` and not marked assisted |

Each measure counts raw attempts, never an estimate, and registers its floor of 20 observations in ADR-0380's registry. The list holds no school value. The list only grows: a kind or presentation name is never removed or reused. Its content and ADR-0390's mapping file belong to the rules version, which `hypothesis_measures_versioned` enforces, so a change to either is a change of `RULES_VERSION`.

A condition on a `node.<id>` or `subtype.<id>` the active graph no longer holds reads «открыто» (open) under `measure_retired`. A condition on a measure whose source isn't built or unlocked reads «открыто» under `measure_not_collected`. The probe measures exist only once the probe does, and the probe's Dutch text waits on the owner amending the Russian-only rule in `CLAUDE.md`; until that amendment, every condition on a `probe.*` measure reads «открыто» under `measure_not_collected`.

### The judging window, after the MVP

A hypothesis's judging window opens at its `hypothesis_recorded` event, or at its last `hypothesis_updated` whose change is `criteria`, in the log's order by `seq`, never by device time (REQ-7312). A `hypothesis_updated` whose change is `wording`, `links`, `closed` or `reopened` doesn't move the window (REQ-7316). The report counts each measure over the observations in the window alone.

The report also shows each measure over the observations logged before the window, apart, and never lets them enter a state or a label (REQ-7314). It marks data logged before the hypothesis «до записи» (before it was written), and data logged after it but before its last criteria change «до смены критериев» (before the criteria changed).

### Condition states and the label, after the MVP

A condition is «выполняется» (met) when every measure in it has at least 20 observations in the window and its 80 % interval, Wilson's for one share and Newcombe's hybrid score interval for a difference, lies wholly on the condition's side of the number (REQ-7330). It is «не выполняется» (not met) when the counts suffice and the interval lies wholly on the other side, and «открыто» otherwise. A measure with fewer than 20 observations leaves its condition «открыто» with its count, the state `too_little_data`.

The computed label is «опровергается» (is being refuted) when every refutation condition is met, «подтверждается» (is being confirmed) when every confirmation condition is met and the refutation side isn't, and «мало данных» in every other case, a confirmation that isn't met included (REQ-7332). The label and the states read only the condition rules over counted attempts, never SPC-0060's probabilities of knowing a node (REQ-7346), which `hypothesis_reads_model` enforces.

### The daily record, after the MVP

`hypothesis_days` holds one row per hypothesis, play day and set of the four versions (REQ-7336). Each row holds each condition's state with its counts and interval, the computed label, the shown label, the model, threshold, rules and graph versions, and the cause of any change of the shown label: `play`, `version` or `criteria`. The report rebuild after each adventure writes the day's row for each open hypothesis with numeric conditions, and a later adventure on the same game day overwrites it; a hypothesis with text criteria alone gets no row. A closed hypothesis's last row is its close day's, and counts observations only up to the `seq` of its `closed` event, in the live rebuild and the full recompute alike; it gets no row for a later play day. On `reopened`, the judging window stays where it was and rows resume with the next adventure after the `reopened` event's `seq`. The hold starts afresh, and only play days after the reopen day count towards it, as for a version change.

When `hypothesis_days` passes 500,000 rows, `./meowtower status` shows `hypothesis_days_large` once to the owner, and nothing is deleted. The rebuild after an adventure and the full recompute stay within SPC-0180's budgets of 5 and 60 seconds, measured on a fixture of a year of play with 20 open hypotheses.

### The hold, after the MVP

The shown label changes, in any direction and back to «мало данных» too, only when the computed label has differed from it and been the same on each of the last H play days (REQ-7338). H is `hypothesis.holdDays` in `content/thresholds.json`, 7 until `tools/hypothesis-hold.ts` sets it, and a new H is a new threshold version.

`tools/hypothesis-hold.ts` sets H to the shortest multiple of 7 play days, at most 56, at which the upper limit of the 95 % Wilson interval of the false-label rate lies at or below 10 % (REQ-7504). It runs synthetic logs of 180 play days at the probe's planned volume for a fixed 2,000 hypotheses whose true measures sit exactly at each condition's number, with one condition a side, and reads the interval once for each H. A false label is one other than «мало данных», on either side and on any play day within the 180. Half its hypotheses compare `probe.ru` minus `probe.nl` with 20, at true shares of 75 % and 55 %, and half compare `probe.bare` with 70, at a true share of 70 %, each with one condition a side at the same number. It reports, for each H from 7 to 56, the false-label rate, its 95 % Wilson interval and the number of hypotheses run. When no H up to 56 passes, verify fails as `hold_uncalibrated`, and the computed label, its screens and `hypothesis_days` don't ship. The tool runs before any screen of the label is built.

### Version changes, after the MVP

A change of any of the four versions restarts the hold of every hypothesis, open or closed, and only play days after the day of the change count towards it (REQ-7340). The full recompute of SPC-0060 rewrites every past row of `hypothesis_days` under the new versions and keeps the rows of earlier versions beside them. The shown label carries over from the old version set.

A shown-label change counts as the version's when the computed label under the new versions already differed from the shown label on the day of the change (REQ-7344). The report marks it «пересчитано по новой версии» (recomputed under a new version) and leaves it out of the count of changes from play.

### Criteria changes, after the MVP

A `criteria` change sets the shown label to «мало данных» until the hold passes under the new criteria (REQ-7364). The report marks the hypothesis «критерии изменены после записи» (criteria changed after it was written) with the date of each such change (REQ-7318).

### What the tab shows for each hypothesis, after the MVP

After the MVP, the tab «Гипотезы» is the report's line «Гипотезы и их статус» (Hypotheses and their status), apart from the nine screens of report v1 that SPC-0180 lists. For each hypothesis it shows:

- the shown label with the model, threshold, rules and graph versions it was computed under (REQ-7348), and, for a closed hypothesis, the label and versions its `closed` event holds beside the shown label of its last row under the active versions;
- each condition's state beside the label, with each measure's right answers, attempts and 80 % interval in the window (REQ-7334);
- the same measures before the window, apart, under «до записи» and «до смены критериев» (REQ-7314);
- how many times the shown label changed because of new play, leaving out each change a version caused and each reset a criteria change caused (REQ-7342), and each version-caused change marked apart (REQ-7344);
- the history and the dated marks of criteria changes.

### Strings

Every label on the tab and in a hypothesis's report line comes from `content/i18n/ru.json` under `parent.hypotheses.*` (REQ-7356): the three labels, the three condition states, the marks «до записи», «до смены критериев», «критерии изменены после записи» and «пересчитано по новой версии», the text-criteria line, the measure notices, the open-hypotheses notice, and the form's field labels, actions, history dates and error messages. SPC-0180's check of `parent.*` values reads them, and an English or Dutch file adds them with no code change.

### Hypotheses stay on the Mac

A hypothesis's text, criteria, links, condition states and label never leave the Mac (REQ-7350). No request class of SPC-0100's gateway has a field for them, and `hypothesis_to_gateway` enforces it. The export for the school admits only `school_values` and the Cito results, as SPC-0310's `school_export_scope` states, so it carries no hypothesis. The whole-log export of SPC-0020 carries them, on the Mac only.

No language model reads a hypothesis's text, criteria, links, condition states or label, on any route, the local judges of SPC-0350 included (REQ-7352). Test fixtures carry invented text only, and SPC-0190's personal-data scan checks them.

### The example hypothesis in build check 5, after the MVP

The example states that the weakness in word problems comes from language, not maths. Its conditions, in `verify/check5/example-hypothesis.json`, are:

| Side | Condition |
| --- | --- |
| Confirmation 1 | `probe.ru` minus `probe.nl` above 20 |
| Confirmation 2 | `probe.ru` minus `probe.nl_after_words` below 20 |
| Refutation | `probe.ru` minus `probe.nl` below 20 |

On the synthetic logs of check 5's maths-gap and language-gap players (REQ-7500), the hypothesis is recorded before the probe's first task and runs at the H `tools/hypothesis-hold.ts` set, or at 56 when none passed. A seed passes for the maths-gap player when the shown label is «опровергается» on some play day within 180 and never «подтверждается», and for the language-gap player when it is «подтверждается» on some play day within 180 and never «опровергается». The run passes with at least 15 of 20 seeds for each player (REQ-7362), and reports the count for each. `hypothesis_example_lock` keeps the conditions fixed: a new set needs a new approved decision named in the lock file.

## Failure paths

| State | When | What the system does | Audience |
| --- | --- | --- | --- |
| `parent_session_missing` | a hypothesis route gets a request without a parent session | answers `401`; the client shows the PIN screen | parent |
| `hypothesis_form_invalid` | a field passes its ceiling, more than 10 node links, or a side holds 0 or more than 3 conditions | writes nothing; the form names the field it couldn't save and keeps the parent's text | parent |
| `criteria_text_only` | a hypothesis has no numeric conditions | shows «Критерии записаны текстом — отчёт их не проверяет» in place of a label | parent |
| `too_little_data` | a measure in a condition has fewer than 20 observations in the window | the condition reads «открыто» with its count; the label can't leave «мало данных» on that condition | parent |
| `measure_retired` | a condition names a node or subtype the active graph no longer holds | the condition reads «открыто» with «этой меры больше нет — перепишите критерии» (this measure no longer exists; rewrite the criteria); a side that needs it can't be met until the criteria are rewritten | parent |
| `measure_not_collected` | a condition names a measure whose source isn't built or unlocked, such as the probe | the condition reads «открыто» with «эта мера пока не собирается» (this measure isn't collected yet) | parent |
| `open_hypotheses_many` | open hypotheses rise above 20 | one notice on the tab | parent |
| `hypothesis_days_large` | `hypothesis_days` passes 500,000 rows | one line in `./meowtower status`; nothing is deleted | owner |
| `hold_uncalibrated` | `tools/hypothesis-hold.ts` finds no H of 56 or less whose interval's upper limit lies at or below 10 % | verify fails at the stage that builds the label, and the label doesn't ship | owner |
| `hypothesis_example_unlocked` | the example file's hash has no lock entry naming an approved record | verify fails and names the file | building agent |
| `hypothesis_measures_versioned` fails | the measure list or ADR-0390's `content/profile.dimensions.json` changed with no new `RULES_VERSION`, or an identifier left the list | verify fails and names the file and whether the version or a removed identifier is at fault | building agent |
| `hypothesis_closed` | a change other than `reopen` reaches a closed hypothesis | answers `409`, logs nothing; the tab offers the reopen action | parent |
| `hypothesis_leak_path` | `hypothesis_to_gateway` or `hypothesis_reads_model` finds an import | verify fails and names the module | building agent |
| `scope_guard_hit` | the first version's tree holds `hypothesis_days`, `content/hypothesis-measures.json` or a version 2 schema of either event | verify fails and names the trace, as SPC-0190 states | building agent |
| a save with no difference | the new version equals the current one | writes nothing and returns the current version | parent |
| a repeated `clientSeq` | a retry after a lost reply | appends nothing and returns the reply the first request produced, as SPC-0030 states | parent |

SPC-0180's `too_little_data` counts 3 sessions for a limit, and this part's counts 20 observations for a condition; each place shows its own count beside the state.

## Choices made in this document

ADR-0450 names the three routes and left their bodies to the specification step, and this document chose them:

- `POST /api/parent/hypotheses/:id` takes either a whole new version or an action, `close` or `reopen`, so closing and reopening never carry a changed version.
- `GET /api/parent/hypotheses` carries the node names for the picker, and the form draws only on the version fields and those names, never on the report line, which is how the form shows no current value.
- A save with no difference returns the current version, with no error, so a double tap on save costs the parent nothing.
- A closed hypothesis takes only `reopen`, and any other change answers `409 hypothesis_closed`, so every version change happens while the hypothesis is open and has rows; a repeated `close` or `reopen` logs nothing.
- ADR-0450 counts a rebuild's rows per open hypothesis and restarts the hold of closed ones too, and doesn't say what a closed hypothesis's rows are. This document ends a closed hypothesis's rows at its `closed` event, shows its last row's label under the active versions beside its `closed` label, and starts its hold afresh after the reopen day, because a closed hypothesis has no rows to carry a hold across the gap, and play days before the close must not complete a hold that ends after the reopen.
