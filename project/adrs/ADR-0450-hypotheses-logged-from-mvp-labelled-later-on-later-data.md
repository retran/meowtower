---
id: ADR-0450
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-7300, REQ-7302, REQ-7304, REQ-7306, REQ-7308, REQ-7310, REQ-7312, REQ-7314, REQ-7316, REQ-7318, REQ-7320, REQ-7322, REQ-7324, REQ-7326, REQ-7328, REQ-7330, REQ-7332, REQ-7334, REQ-7336, REQ-7338, REQ-7340, REQ-7342, REQ-7344, REQ-7346, REQ-7348, REQ-7350, REQ-7352, REQ-7354, REQ-7356, REQ-7358, REQ-7360, REQ-7362, REQ-7364, REQ-7366, REQ-7368, REQ-7370, REQ-7372, REQ-7374]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0450. The parent's hypotheses are two parent events from the first version, and after the MVP a label judges each only on later data by numeric conditions and a hold, with the build check's example conditions fixed here

## Decision

The Parent Room gets a tab «Гипотезы» (Hypotheses). From the first version the parent writes a hypothesis there as text, with what would confirm it and what would refute it, links it to nodes and reads its history. Each save is a `hypothesis_recorded` or `hypothesis_updated` event in the player's log. After the MVP, with the profile and the Dutch probe, a hypothesis also gets numeric conditions. The report then labels it from observations logged after it alone, under a hold of at least 7 play days. This record settles the owner's addendum 2 of 2026-09-28, item 8, as RES-4270 researched it. It cites ADR-0380 for the rules that hold across addendum 2: the 80 % Wilson intervals, the «мало данных» (too little data) floors each measure owns, the owner of each new event type and addendum 2's MVP scope. It also settles the two open findings of REQ-7362 by fixing the example's conditions below.

This record is written for the owner, who evaluates it, and for the building agent, who builds from it. Where I chose a default the research and the requirements left open, the sentence says "I chose".

### The two events and their payloads

ADR-0380 names this record as the owner of both types, and this record defines their payloads in `src/shared/events.ts`. Both are parent events, written only through the `/api/parent/*` routes of ADR-0180, so the server answers 401 to any request that reads or changes a hypothesis without a parent session opened with the PIN (REQ-7306).

| Event | Version 1 payload, first version | Version 2 adds, after the MVP |
| --- | --- | --- |
| `hypothesis_recorded` | `hypothesisId`, a ULID the server assigns; `text`; `criteria`: `confirmText` and `refuteText`; `links`: `nodes`, 0 to 10 node identifiers of ADR-0050's graph, 10 because a hypothesis touching more nodes is about a domain and files better under one | `criteria.conditions`: `confirm` and `refute`, each 1 to 3 conditions; `links.dimensions`, `links.presentations`; `links.schoolGoals` once ADR-0310's screens exist |
| `hypothesis_updated` | `hypothesisId`; `change`: `wording`, `criteria`, `links`, `closed` or `reopened`; `reason`, optional; the whole new `text`, `criteria` and `links` | `shown`, only on `closed` when a computed label exists: the label and the model, threshold, rules and graph versions the report showed at that moment |

Each event carries the whole text, criteria and links, so every version reads from one event and past wording stays in the earlier events, which the log never changes (REQ-7300, REQ-7302). The server derives `change` from the difference to the previous version, so a client can't mislabel it: `criteria` whenever `confirmText`, `refuteText` or a condition differs, else `wording` when the text differs, else `links`. A change to `confirmText` or `refuteText` alone is `criteria` too, because REQ-7302 asks for `criteria` whenever a change touches the criteria, and a rewritten criterion after the data came in is the reframing the judging window exists to date. `closed` and `reopened` are separate actions that change nothing else. A save with no difference writes no event. Each save carries ADR-0030's `clientSeq`, and the server logs the event with `idem_key`, so a lost reply followed by a retry logs one version, not two.

The version 2 fields arrive as a new payload version with an upcaster from version 1, as ADR-0020 and ADR-0210 add fields. I chose version 2 over optional fields in version 1, because the scope guard can then find a post-MVP trace by the schema's version alone.

Ceilings, which I chose: `text` at most 2,000 characters, about a page, since a hypothesis longer than that holds several; each of `confirmText` and `refuteText` at most 1,000; `reason` at most 500. The schema refuses a longer value and the form says which field it couldn't save. The tab shows one notice, once each time the count of open hypotheses rises above 20, because each open hypothesis adds a row a play day and 20 is more than one parent can follow. It refuses nothing, since closing a hypothesis is the parent's own act.

### The first version: text, node links and history, with no label

The first version holds the tab, the form with text criteria and node links, and each hypothesis's history (REQ-7366, REQ-7372). The history lists every earlier version of the text, criteria and links, each with the date it was replaced (REQ-7308). In place of a label, a hypothesis whose criteria are text alone shows «Критерии записаны текстом — отчёт их не проверяет» (the criteria are written as text; the report doesn't check them) (REQ-7370). That text differs from «мало данных» on purpose, because «мало данных» would promise that more play settles it.

The form's route returns node names and nothing else about a node: no state, share, count or estimate (REQ-7310). The requirement admits this buys little, since the parent reads the report in the other tabs, and the judging window below is the rule that protects the test.

The first version holds no numeric condition, no link to a profile dimension or a probe presentation and no computed label (REQ-7358). A hypothesis written in the MVP gets conditions only when the parent rewrites its criteria as numbers, and that rewrite is a `criteria` change, which opens its judging window afresh (REQ-7312). The link to a school goal waits for ADR-0310's two screens (REQ-7374), and never enters a label (REQ-7328).

### After the MVP: conditions over a fixed list of home measures

A condition compares one measure, or one measure minus another, with a number of percentage points the parent writes, and says `above` or `below` (REQ-7322). Each side holds 1 to 3 conditions, and a side is met only when every condition on it is met (REQ-7320, REQ-7368). `confirmText` and `refuteText` stay beside the conditions for what they can't say, and never enter a state or a label (REQ-7326). Links never enter one either (REQ-7328).

Every measure comes from `content/hypothesis-measures.json`, a fixed list of home measures (REQ-7324). The list holds kinds, each an identifier pattern with its observation rule, and the probe's five presentations by name; it doesn't enumerate the graph's node and subtype identifiers, which ADR-0050's graph and its version own:

| Kind | Identifier | Observation |
| --- | --- | --- |
| Profile dimension | `dimension.<id>` | an observation as ADR-0390's `content/profile.dimensions.json` assigns it to that dimension |
| Node share | `node.<id>` | an unassisted first attempt on the node that ADR-0060 admits; right or not |
| Subtype share | `subtype.<id>` | the same, on the subtype |
| Probe presentation share | `probe.bare`, `probe.ru`, `probe.nl`, `probe.nl_after_words`, `probe.nl_source` | a probe attempt in that presentation, right without help as ADR-0430, the probe's decision from RES-4250, counts it |

Each measure registers its floor of 20 observations in ADR-0380's registry, `src/parent/measures.ts`. No school value is on the list, because a school value in a condition would convert a school measure into a home one, which ADR-0310 forbids. Each measure counts only raw attempts, never an estimate. An entry keeps its meaning forever: the list only grows, and a kind or a presentation name is never removed or reused, so a condition means the same on every recompute. A condition on a `node.<id>` or `subtype.<id>` that the active graph no longer holds reads «открыто» under `measure_retired`, with «этой меры больше нет — перепишите критерии» (this measure no longer exists; rewrite the criteria), because a graph version that drops a subtype leaves nothing to count and more play can't help. A group 1 check, `hypothesis_measures_versioned`, fails when the list's content or ADR-0390's `content/profile.dimensions.json` changed and `RULES_VERSION` of ADR-0060 didn't, or when an identifier disappeared. I chose to include the profile's mapping file, because a new mapping changes what a `dimension.<id>` measure counts. That makes a change to the list a change of the rules version, as REQ-7324's default asks. The probe measures exist only once the probe does, and the probe waits on the owner amending the Russian-only rule in `CLAUDE.md`; until then a condition on them stays «открыто» (open) under the failure state `measure_not_collected`.

### The judging window, the condition states and the label

A hypothesis's judging window opens at its `hypothesis_recorded` event, or at its last `hypothesis_updated` whose change is `criteria`, in the log's order by `seq`, not by device time (REQ-7312). `wording`, `links`, `closed` and `reopened` don't move it (REQ-7316). The report counts each measure over the observations in the window.

A condition is «выполняется» (met) when every measure in it has at least 20 observations in the window and its 80 % interval lies wholly on the condition's side of the number (REQ-7330). The interval is Wilson's for one share and Newcombe's hybrid score interval for a difference, as ADR-0380 sets for every addendum 2 figure. It is «не выполняется» (not met) when the counts suffice and the interval lies wholly on the other side, and «открыто» otherwise.

The computed label is «опровергается» (is being refuted) when every refutation condition is met, «подтверждается» (is being confirmed) when every confirmation condition is met and the refutation side isn't, and «мало данных» in every other case, a confirmation that is not met included (REQ-7332). A met refutation outranks a met confirmation, because the report must show a weak side as clearly as a strong one. The label reads condition states only, never ADR-0060's probabilities of knowing a node (REQ-7346). A lint check, `hypothesis_reads_model`, fails when `src/parent/hypotheses/` imports from `src/engine/model/`, because a test catches only the paths it runs.

### The daily record, the hold and version changes

The report keeps a projection `hypothesis_days`, one row per hypothesis, play day and version set (REQ-7336). A play day is a game day of ADR-0090 with an adventure. Each row holds each condition's state with its counts and interval, the computed label, the shown label, the four versions of ADR-0060 and the cause of any change of the shown label: `play`, `version` or `criteria`. The report rebuild after each adventure writes the day's row, and a later adventure on the same game day overwrites it, as ADR-0060's snapshots do.

The shown label changes, in any direction and back to «мало данных» too, only when the computed label has differed from it and been the same on each of the last H play days (REQ-7338). H is 7 until the measurement of REQ-7360 below sets it. H lives in `content/thresholds.json` under `hypothesis.holdDays`, so a new H is a new threshold version and restarts every hold.

A change of any of the four versions restarts the hold of every hypothesis, open or closed (REQ-7340). The full recompute rewrites every past row under the new versions and keeps the rows of earlier versions beside them, as ADR-0060 keeps snapshots. The shown label carries over from the old version set, and only play days after the day of the change count towards the hold. A shown-label change counts as the version's when the computed label under the new versions already differed from the shown label on the day of the change (REQ-7344). The report marks it «пересчитано по новой версии» (recomputed under a new version).

A `criteria` change sets the shown label to «мало данных» until the hold passes under the new criteria (REQ-7364). The report marks the hypothesis «критерии изменены после записи» (criteria changed after it was written) with the date of each such change (REQ-7318).

### What the parent reads about each hypothesis after the MVP

After the MVP the tab «Гипотезы» is the report's line «Гипотезы и их статус» (hypotheses and their status). It isn't a ninth screen of report v1, which keeps its eight screens. For each hypothesis it shows:

- the shown label with the four versions it was computed under (REQ-7348), and, for a closed hypothesis, the label and versions its `closed` event holds beside the current one;
- each condition's state beside the label (REQ-7334), with each measure's right answers, attempts and 80 % interval in the window;
- the same measures over data logged before the window, apart, marked «до записи» (before it was written) for data before the hypothesis and «до смены критериев» (before the criteria changed) for data after it but before the last change of criteria (REQ-7314); these never enter the label;
- how many times the label changed because of new play, leaving out changes a version caused and resets a criteria change caused (REQ-7342), and each version-caused change marked apart (REQ-7344);
- the history and the dated marks of criteria changes.

Every label, state and mark named here comes from `content/i18n/ru.json` under `parent.hypotheses.*` (REQ-7356), so ADR-0180's check of `parent.*` values reads them and an English or Dutch file can add them without a code change.

### Hypotheses stay on the Mac and off her screens

A hypothesis's text, criteria, links, condition states and label never leave the Mac and no language model reads them, the local judges of ADR-0350 included (REQ-7350, REQ-7352). A group 1 check, `hypothesis_to_gateway`, fails when a module under the gateway of ADR-0100 or a request-class builder imports the hypothesis schemas, the `hypothesis_days` projection or `src/parent/hypotheses/`. ADR-0310's `school_export_scope` already keeps them out of the export for the school, since it admits only `school_values` and the Cito results (REQ-6070). The whole-log export of ADR-0020 carries them, on the Mac only. The player's routes carry no field for them, and ADR-0190's end-to-end scan of her screens looks for a canary hypothesis text and every hypothesis label (REQ-7354).

### The hold is measured before the label ships

REQ-7360 sets H: the shortest multiple of 7 play days, at most 56, at which synthetic logs of 180 play days at the probe's planned volume show a label other than «мало данных», on either side and on any day, in at most 10 % of at least 200 hypotheses whose true measures sit exactly at each condition's number. I chose the generator's hypotheses: half compare `probe.ru` minus `probe.nl` with 20 points, at true shares of 75 % and 55 %, and half compare `probe.bare` with 70, at a true share of 70 %. Each holds one condition a side at the same number, the worst case. The tool is `tools/hypothesis-hold.ts` in the simulation group of ADR-0190's verify. When no H up to 56 passes, verify reports `hold_uncalibrated` and the computed label, its UI and the `hypothesis_days` projection don't ship, as REQ-7360 says.

My own simulation on 2026-09-28 predicts that outcome, and I record it as a finding and don't adopt a looser bar. I ran a Python sketch of the rule above, which isn't in the repository, since the repository holds no code yet; the build's tools measure the same things and replace it. It simulated 3 to 5 probe tasks a day until each of the three named presentations held 20 observations or 28 days passed, then 1 to 2 a day. About 21 % of probe tasks fell on each of `ru`, `nl` and `nl_after_words`, and attempts were independent. It gave a false label in about 50 % of hypotheses at H = 7, 29 % at 28 and 16 % at 56, over 200 hypotheses each. The same sketch gave about 20 % at a single look on day 180, which is what an 80 % interval gives on both sides together. So the hold must beat a single look by half, and in my sketch the longest hold REQ-7360 allows, 56 play days, reached only 16 %. These figures are my estimates from simplified logs, not the build's measurement. The post-MVP work therefore starts with `tools/hypothesis-hold.ts`, which needs only the rule functions, before any screen of the label is built. The consequence goes back to research, as the section on reversal says.

### The example hypothesis of REQ-7362, fixed before the check's first run

The owner's example is: the weakness in word problems comes from language, not maths; confirmed if the gap between Russian and Dutch problems exceeds 20 points and vanishes after the words are explained; refuted if Russian problems also fall 20 points below bare ones. I fix its conditions as numbers here, on 2026-09-28, before any code of the check exists:

| Side | Condition | Where it comes from |
| --- | --- | --- |
| Confirmation 1 | `probe.ru` minus `probe.nl` above 20 | the addendum's gap above 20 points |
| Confirmation 2 | `probe.ru` minus `probe.nl_after_words` below 20 | "vanishes": I chose the same 20-point line, so the gap the words close falls back under the line the parent drew |
| Refutation | `probe.ru` minus `probe.nl` below 20 | replaces the addendum's refutation, for the reason below |

The addendum's refutation, `probe.bare` minus `probe.ru` above 20, can never be met by REQ-6668's maths-gap player, whose every presentation sits at 55 %, so its true difference is 0. That refutation tests a player who is weak on word problems even in her own language, which none of check 5's four players encodes. My sketch gave it 0 of 20 seeds. What tells a maths gap from a language gap in check 5's generator is whether Dutch is worse than Russian, so the refutation says Dutch is not 20 points worse. The two conditions on `probe.ru` minus `probe.nl` sit on opposite sides of one number, so at most one can be met on a given day.

A seed passes for the maths-gap player when the shown label is «опровергается» on some play day within 180 and never «подтверждается», and the mirror holds for the language-gap player. The hypothesis is recorded before the probe's first task, and the check runs at the H that REQ-7360 measured, or at 56 when none passed. The bar is REQ-7362's, at least 15 of 20 seeds for each player. The sketch used seeds 0 to 999 for the maths-gap player and 1000 to 1999 for the language-gap player, and 200 hypotheses from seed 9000 for the hold. It gave a single seed about a 93 % chance for the maths-gap player and 94 % for the language-gap player at H = 7, 87 % and 89 % at 28, and 77 % and 79 % at 56. That puts the chance of passing 15 of 20 at about 99.8 % at H = 7, 96 % at 28 and 71 % at 56. The first label came at a median of about 40 and 51 play days at H = 7.

The conditions live in `verify/check5/example-hypothesis.json`. `verify/check5/example-hypothesis.lock` names the file's SHA-256 hash and the approved decision that set it, this record first. A group 1 check, `hypothesis_example_lock`, fails when the file's hash has no entry naming an approved record in `project/adrs/`, as ADR-0180 guards the threshold catalogue. So nobody can tune the conditions until the check passes: a new set needs a new approved decision, which the owner reads. REQ-6668 fixes the players' rates, so the generator can't be tuned either.

### What works once this is accepted, and what doesn't yet

Once built in the first version, the parent opens «Гипотезы» with the PIN, writes a hypothesis with its confirmation and refutation as text, links it to nodes, edits, closes and reopens it, and reads every earlier version with its date. Every change is an event with the whole version, and the page says the report doesn't check text criteria. Nothing in play reads or shows a hypothesis, and without the tab the game plays and logs as before.

The numeric conditions, the links to dimensions, presentations and school goals, the computed label, `hypothesis_days` and the report's line don't work yet. They wait for ADR-0390's profile, ADR-0430's probe and the owner's amendment of the Russian-only rule, and they don't ship unless `tools/hypothesis-hold.ts` finds an H of 56 or less, which my estimate says it won't under the approved requirements.

## Why

The date a hypothesis was written is the one fact a later report can't rebuild, so the events join the first version. Every measure its label reads can be recomputed from the log whenever the label is built (RES-4270, the second options table). The first external result, the Cito M7 of 2027-01-15, will likely arrive before the profile does.

A hypothesis judged on data the parent had already read is a postdiction (Nosek and colleagues, 2018, in RES-4270). She can't tell how much that data shaped it, because judges with outcome knowledge "were, however, largely unaware of the effect" (Fischhoff, 1975, in RES-4270). The game can't check what she has seen, so the judging window by `seq` is the rule that makes a hypothesis a prediction.

No program can judge free text, and the addendum's own example carries "vanishes", which has no number. So the conditions are numbers over a list the parent can recompute by hand, as ADR-0180 builds every report label from an explicit rule (RES-4270). Testing after every new observation raised a nominal 5 % false-positive rate to 22 % (Simmons, Nelson and Simonsohn, 2011, in RES-4270). The report rebuilds after every adventure, so the label needs a hold and a count of its changes.

A daily projection of its own carries the hold, because ADR-0060's `node_snapshots` hold node estimates and none of the probe, subtype or profile measures a condition reads (RES-4270). It also keeps the rows of earlier versions, which is how REQ-7344 tells a version's change from new play.

The example's refutation had to change, because REQ-6668's maths-gap player can't meet the addendum's wording, and REQ-7362's second finding asks that the conditions be fixed before the check runs. A lock file checked by a program fixes them, because a paragraph in this record would not stop an edit to a fixture.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Settle only the first version now, and send RES-4270's conclusions 6, 7 and 15 back to research before designing the label | no design effort spent on a label my sketch expects REQ-7360 to refuse | the sketch is an estimate from simplified logs kept outside the repository, and `tools/hypothesis-hold.ts` is the measurement that counts; it needs the rule functions this record defines, and the requirements are approved as they stand |
| Do nothing: the parent keeps her hypotheses in a notebook and reads the report | costs nothing; no label can mislead her | no date ties a hypothesis to the log, so nothing shows it came before the data, and REQ-7300 and the addendum's falsifiability rule go unmet |
| The literal addendum: free-text criteria with a label the report recomputes at every rebuild over all data | the parent sees a label from the first week, and any hypothesis fits | a label from free text needs a person or a model to judge it, and a model may not read a hypothesis (REQ-7352); recomputing over data she had read is the postdiction and the repeated testing RES-4270 found |
| This record: events and a text form in the MVP; later, numeric conditions judged on later data under a hold | a program judges it the same way every time, the parent can redo the rule by hand, and the date exists from the first day | the measure list limits what she can write, a first label waits about 40 to 50 play days in my sketch, and the hold may never pass REQ-7360 |
| The same, without `hypothesis_days`: replay the last H days of the log at each rebuild | no new table | each rebuild replays H days for every hypothesis under every version set, and REQ-7336 asks for the record itself |
| The example with the addendum's refutation as written, `probe.bare` minus `probe.ru` above 20 | faithful to the owner's words | REQ-6668's maths-gap player never meets it, and my sketch gave 0 of 20 seeds, so the check would fail a correct rule |
| A wider interval for the label, a fixed schedule of looks or a one-sided bar, in place of the hold | each attacks the repeated testing my sketch finds the hold can't bring under REQ-7360's 10 % | REQ-7330 fixes the 80 % interval and REQ-7338 and REQ-7360 impose the hold, so choosing one needs research to change those requirements first; the first reversal condition sends it there |
| The example with the refutation also requiring `probe.nl_after_words` minus `probe.nl` below 20 | refutes only when the words also don't help, closer to "language isn't it" | each added condition needs its own 20 observations and a met state on the same days, so the label comes later, and REQ-7368 makes a two-condition side harder to meet, for no gain in telling check 5's two players apart |

## What it costs

The parent pays about 5 minutes for each hypothesis she writes, which I estimate. She waits about 40 to 50 play days for a first label on a probe hypothesis, 1 to 3 months of play. A hypothesis from the MVP needs its criteria rewritten as numbers, which restarts its window. No step waits for her in real time. Two weeks or a month without her lose nothing and queue nothing, because a hypothesis is her own optional act and the report keeps rebuilding.

The interruption budget is one notice: the open-hypotheses notice, once each time the count rises above 20. The page sends no push and no other notice, and a label change is read on the page, never announced.

The building agent writes two schemas with version 2 and an upcaster, three routes (`GET /api/parent/hypotheses`, `POST /api/parent/hypotheses` and `POST /api/parent/hypotheses/:id`), the tab with its form and history, and after the MVP the measure list, the rule functions, `hypothesis_days`, two simulation tools and four static checks.

The parent also pays a wait on every version change. Each growth of the measure list, each new profile mapping and each new graph is a new version, and each restarts every hold, so every label can wait up to H more play days, as much as 56 at the cap. The same bump runs ADR-0060's full recompute of the knowledge model and adds a complete earlier-version set of `node_snapshots`, a cost the Mac and every report that marks version changes pay for a change that concerns hypotheses alone. I kept it, because REQ-7324 imposes the rules version as the list's version, and a fifth version would add a field to every row ADR-0060 keys. The owner can batch content changes to keep such restarts rare, and the report marks the wait as «пересчитано по новой версии» only when the label moves.

The Mac pays rows. `hypothesis_days` grows by one row for each hypothesis a play day under each version set, about 7,300 rows a year at 20 hypotheses, and version changes multiply it as they multiply `node_snapshots`. I chose a ceiling of 500,000 rows, reported once to the owner in `./tower status`, and no automatic drain, because deleting earlier-version rows destroys the comparison REQ-7344 reads, as ADR-0060 argues for snapshots. I estimate the rows fit inside ADR-0180's budgets of 5 seconds for a rebuild and 60 seconds for a full recompute, which stand in ADR-0190's Baselines table and which this record doesn't change: a rebuild writes one row per open hypothesis, and a full recompute about 7,300 rows a year of play under the active versions. Check 12 below measures it.

The security boundary protects a hypothesis's text, which names what the parent suspects about the player and can hold her name or school. Ordered by the likelihood of damage, it defends against:

1. the player on a shared device, through the PIN, the parent session and player routes with no hypothesis field;
2. a model call carrying the text, through `hypothesis_to_gateway` and REQ-7352's ban on every route;
3. the export for the school, through ADR-0310's `school_export_scope`;
4. a test fixture with real text in the public repository, through fixtures written from invented text and the personal-data scan of ADR-0190.

It doesn't defend against a person with the Mac's user account, who can read the whole-log export, as ADR-0180 states for the report.

Failure states, each with its next step and one audience:

| State | When | What the system does | Audience |
| --- | --- | --- | --- |
| `parent_session_missing` | a hypothesis route gets a request without a parent session | answers 401; the client shows the PIN screen | parent |
| `hypothesis_form_invalid` | a field passes its ceiling, or a side holds 0 or more than 3 conditions | writes nothing; the form says which field it couldn't save and keeps her text | parent |
| `criteria_text_only` | a hypothesis has no numeric conditions | shows «Критерии записаны текстом — отчёт их не проверяет» in place of a label | parent |
| `too_little_data` | a measure in a condition has fewer than 20 observations in the window | the condition reads «открыто» with its count; the label can't leave «мало данных» on it | parent |
| `measure_retired` | a condition names a node or subtype the active graph no longer holds | the condition reads «открыто» with «этой меры больше нет — перепишите критерии»; a side that needs it can't be met until she rewrites the criteria | parent |
| `measure_not_collected` | a condition names a measure whose source isn't built or unlocked, such as the probe | the condition reads «открыто» with «эта мера пока не собирается» (this measure isn't collected yet) | parent |
| `open_hypotheses_many` | open hypotheses rise above 20 | one notice on the tab | parent |
| `hypothesis_days_large` | `hypothesis_days` passes 500,000 rows | one line in `./tower status` | owner |
| `hold_uncalibrated` | `tools/hypothesis-hold.ts` finds no H of 56 or less | verify fails at the stage that builds the label, and the label doesn't ship | owner |
| `hypothesis_example_unlocked` | the example file's hash has no lock entry naming an approved record | verify fails and names the file | building agent |
| `hypothesis_leak_path` | `hypothesis_to_gateway` or `hypothesis_reads_model` finds an import | verify fails and names the module | building agent |

ADR-0180's `too_little_data` counts 3 sessions for a limit, and this one counts 20 observations for a condition. I kept one name because the parent's next step is the same, waiting for more play, and each place shows its own count beside the label, as RES-4270's rejected review finding records.

## What would reverse it

- If `tools/hypothesis-hold.ts` finds no H of 56 or less, as my sketch predicts, the computed label can't ship. RES-4270's conclusions 6, 7 and 15 then go back to research, to choose among a wider interval for the label than the one shown, a fixed schedule of looks, a bar counted on one side, or a longer cap. The events, the form and the history stay.
- If the measured H is above 28, the example check's chance of passing 15 of 20 seeds falls from about 96 % towards 71 % at 56 in my sketch. Then REQ-7362's bar or its 180 days go back to the requirements step, because a failing check would then say more about the bar than about the rule.
- If the parent has written no hypothesis by the stage 0.3 acceptance, the page answers no question she asks, and the post-MVP label moves behind the other addendum 2 items in the backlog.
- If the stage 0.3 review finds that most of her hypotheses name causes outside the measure list, such as sleep or a change of teacher, the list is too narrow, and the kinds of measure go back to research.
- If the owner doesn't amend the Russian-only rule, no probe measure is ever collected, and the example and every probe condition stay «открыто».

The premortem, written as though it had happened: a year after the label shipped, the parent stopped reading it. The measured hold had come out at 56 play days, so every label arrived two months after the data turned, and the only hypotheses with labels were the ones she had written a season before. Two of her hypotheses flipped when the school-group setting changed, and though the report marked the changes «пересчитано по новой версии», she read them as news about the player. Meanwhile the both-gaps reading of the example, «подтверждается» for a player weak in both maths and Dutch, had taught her that the label confirms whatever cause she names. The first failure is why the hold is measured before any screen is built. The second is why version changes are marked and left out of the count. The third is what this record leaves open below.

## Consequences

- ADR-0020's catalogue and SPC-0020's list of parent actions gain `hypothesis_recorded` and `hypothesis_updated`, owned by this record, with the payloads above.
- ADR-0180's Parent Room gains the tab «Гипотезы», which this record owns; report v1 keeps its eight screens.
- ADR-0190's scope guard reads ADR-0380's last trace, a projection that computes a hypothesis's label, as the `hypothesis_days` table, and gains two more traces of the post-MVP part: `content/hypothesis-measures.json` and a version 2 schema of either hypothesis event. Its group 1 gains `hypothesis_measures_versioned`, `hypothesis_reads_model`, `hypothesis_to_gateway` and `hypothesis_example_lock`, and its simulation group gains `tools/hypothesis-hold.ts` and the example run inside check 5, which ADR-0380 owns.
- ADR-0060's recompute rewrites `hypothesis_days` beside `node_snapshots` on a version change.
- `content/thresholds.json` gains `hypothesis.holdDays`, and `content/i18n/ru.json` gains the `parent.hypotheses.*` keys.
- ADR-0390 and ADR-0430 each supply the observation rule of their measures on the list, and a new version of ADR-0390's `content/profile.dimensions.json` needs a new `RULES_VERSION`, which `hypothesis_measures_versioned` checks.

## How I will know it was realised

1. Saving a new hypothesis writes one `hypothesis_recorded` with the whole text, both criteria texts and the node links; editing the text and a criterion in one save writes one `hypothesis_updated` with `change: "criteria"`; resending the same `clientSeq` writes nothing more.
2. Every hypothesis route answers 401 without a parent session, and the end-to-end scan of the player's screens finds neither a canary hypothesis text nor any `parent.hypotheses.*` label.
3. The form's route schema has no numeric field for a node or measure, and a Playwright test of the form finds no percentage or state label on it.
4. The history of a hypothesis edited three times lists three earlier versions, each with the date it was replaced.
5. A first-version build shows «Критерии записаны текстом — отчёт их не проверяет» on every hypothesis, and the scope guard fails when a fixture adds `content/hypothesis-measures.json`, the `hypothesis_days` table or a version 2 hypothesis schema to the tree.
6. After the MVP, a fixture with 100 observations of a measure logged before the hypothesis and 19 after it gives «открыто», and one more observation after it gives a state; the 100 show apart under «до записи».
7. A fixture whose computed label turns on day 1 shows «мало данных» through day 6 of the new label and the new label on day 7 at H = 7.
8. A version change in a fixture restarts the hold, a label change it causes reads «пересчитано по новой версии», and the count of changes from play stays the same.
9. Each of the four static checks fails on a fixture that breaks it: a changed measure list with an unchanged `RULES_VERSION`, an import of the model from `src/parent/hypotheses/`, a gateway import of a hypothesis schema, and an example file whose hash has no approved lock entry.
10. `tools/hypothesis-hold.ts` reports the false-label rate for each H from 7 to 56 on 200 hypotheses, and verify either records the H it chose or reports `hold_uncalibrated`.
11. The example run, with the conditions of `verify/check5/example-hypothesis.json`, reports for the maths-gap and the language-gap players the number of seeds of 20 that pass, and the lock file names this record for that file's hash.
12. On a fixture of a year of play with 20 open hypotheses, the rebuild after an adventure stays within 5 seconds and the full recompute within 60, ADR-0180's budgets.
13. A `criteria` change in a fixture shows «мало данных» until H play days pass under the new criteria, puts the data between the record and the change under «до смены критериев», and leaves the count of changes from play as it was.

## What this does not settle

- The profile's dimensions and how each counts an observation: ADR-0390. The probe's presentations, schedule and help rule: ADR-0430.
- Build check 5, its four players and its bar, the interval family, the «мало данных» floors and addendum 2's MVP list: ADR-0380. This record adds only the example hypothesis run on two of check 5's players.
- The both-gaps player of REQ-6668. The example's criteria test language only, so a player weak in both maths and Dutch reads «подтверждается» in about 60 % of runs of my sketch. Whether the example should add a maths condition, such as `probe.bare` above a number, is a question for the owner and research, not for this record.
- What replaces the hold if REQ-7360 can't be met: research, as the first reversal condition says.
- Whether a hypothesis can be deleted: it can't in this record, since the log never changes an event, and closing it is the only way to set it aside.
- Any Dutch text shown to the player beyond addendum 1's bridge keywords: it waits on the owner amending the Russian-only rule in `CLAUDE.md`.
- The PDF snapshot of the tab: ADR-0180's PDF rule, after the MVP.

## Amends

- ADR-0020: the Event catalogue gains `hypothesis_recorded` and `hypothesis_updated`, owned by ADR-0450, with the payloads ADR-0450 sets.
- SPC-0020: the row "Every parent action" gains `hypothesis_recorded` and `hypothesis_updated`, and the table of event types the addendum's decisions own gains a row for them, owned by ADR-0450.
- ADR-0180: the Parent Room's list of panels gains the tab «Гипотезы», owned by ADR-0450; after the MVP that tab is the report's line «Гипотезы и их статус», and report v1 keeps its eight screens.
- ADR-0180: the list of what doesn't work yet gains the hypothesis label, its condition states and `hypothesis_days`, which come after the MVP as ADR-0450 defines them.
- ADR-0190: the scope guard's trace "a projection that computes a hypothesis's label", as ADR-0380 adds it, becomes "a `hypothesis_days` table", and the traces gain `content/hypothesis-measures.json` and a version 2 schema of `hypothesis_recorded` or `hypothesis_updated`.
- ADR-0190: the MVP contents list's entry for the hypothesis form, as ADR-0380 adds it, becomes "the tab «Гипотезы» with a form that records a hypothesis and what would confirm and refute it as text, its links to nodes and each hypothesis's history, with no status".
- ADR-0190: group 1 gains the static checks `hypothesis_measures_versioned`, `hypothesis_reads_model`, `hypothesis_to_gateway` and `hypothesis_example_lock`, and the simulation group gains `tools/hypothesis-hold.ts` and the example hypothesis run of ADR-0450.
- ADR-0190: the Baselines table gains "Hypothesis text | at most 2,000 characters; each criteria text 1,000; a reason 500 | ADR-0450 | chosen | about a page", "Hypothesis node links | at most 10 | ADR-0450 | chosen | more nodes make a domain", "Open hypotheses | a notice above 20 | ADR-0450 | chosen | more than one parent follows", "`hypothesis_days` | 500,000 rows, then `hypothesis_days_large` once | ADR-0450 | chosen | about 70 years of 20 hypotheses under one version set" and "Hypothesis hold | 7 to 56 play days, in steps of 7 | ADR-0450 | imposed by REQ-7338 and REQ-7360".
- ADR-0060: "When a version changes, the full recompute writes new rows for every past play day under the new versions and leaves every row of the earlier versions in place" gains "and rewrites `hypothesis_days` the same way, whose hold counts only play days after the day of the change".
- ADR-0060: the rules version gains the content of `content/hypothesis-measures.json`, which `hypothesis_measures_versioned` ties to `RULES_VERSION`.
- ADR-0310: once its two screens exist, a hypothesis may link to a school goal for display beside that goal's values, and the link never enters a hypothesis label.

## Open review findings

- The agent review of 2026-09-28 asked that the Python sketch behind the example's refutation, the predicted `hold_uncalibrated` and the pass odds be committed or recorded in research. I recorded its parameters, its seeds and its simplifications in this record, and left the script out, because the repository holds no code yet and the brief for this step forbids a commit; `tools/hypothesis-hold.ts` and the example run in check 5 are the measurements that count. A person approving this record should read the figures as my estimates. Partly resolved on 2026-09-28.
- The same review suggested counting a change to `confirmText` or `refuteText` alone as `wording` once numeric conditions exist, so a typo doesn't restart the window. I rejected it, because REQ-7302 asks for `criteria` whenever a change touches the criteria; I gave the reason beside the rule instead. Rejected on 2026-09-28.
- The second agent review of 2026-09-28 raised seven findings, and I fixed all seven: an alternative that settles only the first version now, the state `measure_retired`, the knowledge-model recompute a rules-version bump costs, the reason for 10 node links, the rebuild budget check, the criteria-change check and the name `hypothesis_form_invalid`. The fixes haven't had a third review, as the method's bound of two rounds sets. Resolved on 2026-09-28.
