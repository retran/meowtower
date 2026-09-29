---
id: SPC-0190
artifact: spec
status: live
revised: 2026-09-29
checked-at:
states: [REQ-2900, REQ-2902, REQ-2904, REQ-2906, REQ-2908, REQ-2910, REQ-2912, REQ-2914, REQ-2916, REQ-2918, REQ-2920, REQ-2922, REQ-2924, REQ-2926, REQ-2928, REQ-2930, REQ-2932, REQ-2934, REQ-2936, REQ-2938, REQ-2940, REQ-2942, REQ-2944, REQ-2946, REQ-2948, REQ-2950, REQ-2952, REQ-3000, REQ-3002, REQ-3004, REQ-3006, REQ-3008, REQ-3010, REQ-3012, REQ-3014, REQ-3016, REQ-3018, REQ-3020, REQ-3708, REQ-5076, REQ-5078, REQ-5080, REQ-5088, REQ-5090, REQ-5092, REQ-5094, REQ-5098, REQ-6666, REQ-6670, REQ-6674, REQ-6676, REQ-6682, REQ-7402, REQ-7500]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The verify command, the simulations, the build stages with their acceptance, and the MVP scope guard

## Scope

This document covers how the build is checked and gated: the `verify` command and its report, its nine check groups, the property tests, the simulation of synthetic students, build check 5 of the second addendum, the replayed and live model runs, the building agent's handoff and its duties to the project record, the stages from 0 to 0.3 with the fact stage 0.15, each stage's automatic check and human acceptance, the MVP acceptance and the backlog after it, the nine open questions of the draft, and the scope guard that keeps the first version to the MVP contents list. It is written at the level of commands, files, check groups, stages and records; it describes no code inside a check.

It leaves out what each check tests inside another part. The templates and their answer check belong to SPC-0040, the knowledge model to SPC-0060, task selection to SPC-0070, the model gateway and its keys and buckets to SPC-0100, the strings, the lexicon and the Dutch bridge's word count and share to SPC-0160, the Parent Room's limits table to SPC-0180, the fact set's size and the Volley to ADR-0290, the story-interest signal to ADR-0330, the sandbox's file, routes and confirmed actions to ADR-0340, and the report's language and maths lines, its intervals and its contrast list to ADR-0380. Each part of the second addendum belongs to its own decision, ADR-0390 to ADR-0450, including the checks each adds to the groups below. The answer queue that loses no answer offline belongs to SPC-0030; this document only checks it.

## Boundary

### Commands

| Command | What it does |
| --- | --- |
| `docker compose run --rm tools npm run verify` | Runs every check group and writes one report. Exits 0 only when every check required at the current stage passes, and non-zero otherwise. |
| `verify --fast` | Runs group 1, and group 2 on 1,000 seeds. It never gates a stage. |
| `verify --record` | Runs the gateway in its `verify` mode, makes each call that has no recording, spends from the offline key and stores the answers in `tests/recordings/`. It never gates a stage. |
| `verify --live` | Plays 10 simulated adventures, about 90 rooms, with real model calls on the offline key, within `VERIFY_LIVE_BUDGET_USD`, $10 a run, which the owner sets as what remains of the offline key's limit. |
| `verify --live --compose` | Runs ADR-0230's acceptance test 3 for the configured `PARSE_MODEL` and prompt on the offline key, with ADR-0440's family subsets, within $9 a run, and writes the result to `verify/parser-eval.json`, which the server reads before it starts with `COMPOSE_FREE` on. |
| `verify --check5-rates` | Measures check 5's rates with the report's own line functions and writes them to `artifacts/check5-rates.json`. It never gates a stage. |

### Files

| Path | What it holds |
| --- | --- |
| `artifacts/verify-report.html` | The report for a person: every group, each check's result, each threshold beside its measured value, and each group not yet required, by name. |
| `artifacts/verify-report.json` | The same report for a program. |
| `artifacts/handoff.md` | The handoff that ends every run of the building agent. |
| `verify/baselines.json` | Every budget of ADR-0190's Baselines table, as its amending decisions extend it, each model role's timeout and `max_tokens` included, each with its source record. |
| `verify/scope-guard.json` | The traces a deferred item leaves in the tree. |
| `verify/check5/example-hypothesis.json` | The example hypothesis of ADR-0450's example run. |
| `verify/check5/example-hypothesis.lock` | The lock file of that example hypothesis, as ADR-0450 states. |
| `verify/model-metrics/<version>.json` | The simulation's accuracy metrics for each approved knowledge-model version. |
| `verify/parser-eval.json` | The last `verify --live --compose` result for each pair of parse model and prompt hash, as ADR-0440 keys it. |
| `artifacts/check5-rates.json` | The last `verify --check5-rates` result, overwritten on each run. |
| `tests/simulation/probe-students.ts` | Check 5's four synthetic students, created at the stage that builds the Dutch probe. |
| `tests/reference/` | The reference solvers, one per template. |
| `tests/recordings/` | The recorded model answers, keyed by the hash of the request. |
| `docs/ipad-checklist.md` | The checklist an adult runs on a real iPad at each stage. |
| `data/snapshots/` | The server's snapshots of the log; verify reads the newest one to count accepted frames. |

`artifacts/` keeps the reports of the last 20 runs, and `tests/recordings/` drops a recording no test has used for 30 days.

### Check groups

| Group | What it runs | Required from stage, the first stage of its earliest check |
| --- | --- | --- |
| 1. Types, lint and static checks | `tsc --noEmit`, ESLint, the scope guard, the record checks, the personal-data scan, the baselines check, the frame count and the static checks other decisions add | 0 |
| 2. Unit and property tests | the template properties on 10,000 fixed seeds, determinism, migrations, API schemas and exports | 0.1 |
| 3. Simulation | ten synthetic profiles in single runs, 30-day runs and 60-day runs, and the timed adventure | 0.1; the timed adventure from 0.2; check 5 from the backlog stage that builds the Dutch probe |
| 4. End-to-end | Playwright on WebKit emulating an iPad in landscape and on Chromium at 1280x720 | 0 |
| 5. Model calls, replayed | the gateway in `replay` mode, answering from `tests/recordings/`, and the blind solve and safety check of each template's explanation and short solution | 0.1 |
| 6. Safety provocations | the harmful inputs and creepiness provocations of RES-2900, replayed | 0.3 |
| 7. Visual | screenshots against references, axe-core and contrast | 0.2 |
| 8. Performance | load time, bundle size, and scene frames per second with the CPU slowed 4 times | 0.3 |
| 9. Docker smoke test | `docker compose up`, the health check, HTTPS through Caddy, SSE without buffering, a rebuild without data loss, `db-snapshot` | 0 |

### States the report and the gate name

| State | When | Audience |
| --- | --- | --- |
| `verify_red` | a required check fails | the building agent |
| `not_required_yet` | a check's first stage hasn't come | the building agent |
| `explanation_template_rejected` | a template's explanation or short solution fails the blind solve or the safety check | the building agent |
| `frames_acceptance_unchecked` | no snapshot exists, so verify counts the frame file without checking acceptance | the building agent |
| `recording_missing` | a replayed request has no recording | the building agent |
| `scope_guard_hit` | a deferred item's trace appears in the tree | the building agent |
| `check5_bar_missed` | a bar of check 5 fails on the fixed seeds | the building agent, then the owner |
| `check5_phase_short` | a seed of check 5 still has a presentation with fewer than 20 observations after 120 simulated game days | the building agent |
| `check5_rate_low` | the measured joint rate for check 5's student with both gaps falls below 0.825 | the owner |
| `canon_contradiction` | the canon disagrees with the specification on method, time, rewards or safety | the building agent |
| `live_budget_spent` | a live run reaches its budget | the owner |
| `draft_ceiling_reached` | 5 draft records wait for the owner | the owner |
| `acceptance_pending` | a stage passed verify and waits for its acceptance | the owner |
| `acceptance_refused` | the owner or the checklist rejects a stage | the building agent |
| `sandbox_models_unavailable` | a sandbox model route is called while the gateway or the PIN is missing | the parent, on the sandbox screen |

### Parts and the dependencies permitted between them

The parts are the verify runner, the check groups it calls, the reference solvers, the simulation, the gateway in `replay` or `verify` mode, `tools/handoff.ts`, and the game's code under `src/`. The permitted dependencies run one way:

- The verify runner calls the groups and reads `verify/`; a group reads the code under `src/` and never changes it.
- `tests/reference/` imports nothing from `src/templates/`.
- The simulation runs the engine, the knowledge model, the Director and the game rules headless, with no server and no client.
- Every automated check reaches a model only through the gateway in `replay` mode, which opens no network connection.
- Verify runs on its own data directory and never on the one the `tower` service uses; it reads the newest file in `data/snapshots/` and never writes there.

## Behaviour

### One command, one report

One command, `docker compose run --rm tools npm run verify`, runs every group and writes `artifacts/verify-report.html` and `artifacts/verify-report.json` (REQ-2900). Each check declares its own first stage, the stage at which the stage table builds the item it checks, and before that stage the report lists the check as `not_required_yet` by name, so a check nobody ran never reads as passed. A group is required once any of its checks is, and the command exits 0 only when every check required at the current stage passes.

Verify reads the current stage from the project record: the first stage, in the order 0, 0.1, 0.15, 0.2, 0.3 and then the backlog items in the latest recorded order, whose epic has no approved review record, so two epics without one never both count as current. A check on a part after the MVP names as its first stage the backlog item whose epic builds that part. No file holds the stage, so the building agent can't set it, and only the owner's approval of a stage's review record moves it. The report also shows each text source's share of blocked lines from verify's own replayed and live runs, as SPC-0160 states.

Other decisions add checks to the groups, and the check's content belongs to the decision that names it. Group 1 carries, among them, ADR-0040's template checks, ADR-0100's gateway lint rule, ADR-0140's content checks, ADR-0180's report and threshold checks, ADR-0210's budget-sum, event-owner and vendor-name checks, ADR-0290's `citoBlock`, fact, format and Cito-entry validators with its test-word search, scale import lint and moment-identifier check, ADR-0310's `school_events_in_model`, `school_data_to_gateway`, `school_snapshot_in_director` and `school_export_scope`, and ADR-0340's import check on `src/server/sandbox/` and its snapshot table-list check. Group 1 counts the frames of `content/frames.ru.json` as SPC-0130 states, and counts a frame only when the newest snapshot in `data/snapshots/` holds its `frame_accepted` and no later `frame_removed`; with no snapshot it counts the file and reports `frames_acceptance_unchecked`. Group 2 carries ADR-0220's rung and ladder-length checks and ADR-0260's grouping tests.

The second addendum's decisions add checks in the same way. Group 1 carries ADR-0380's floor registry, contrast list and label checks, ADR-0390's validator of `content/profile.dimensions.json` and its import lint on `src/parent/profile/`, ADR-0410's `contexts_append_only` and its other static checks, ADR-0420's `cito_categories_scope` and its category file test, and ADR-0450's four `hypothesis_*` static checks. Group 2 carries ADR-0380's interval reference test and ADR-0390's profile tests, group 3 carries ADR-0410's first-encounter simulation and ADR-0450's `tools/hypothesis-hold.ts` with its example run, which runs a fixed 2,000 synthetic hypotheses, reads the 95 % Wilson interval of their false-label rate once and accepts the hold only when the interval's upper limit lies at or below 10 %, and group 4 carries ADR-0390's Playwright test of the profile screen and its scan of the player's screens, which fails on any string under `parent.profile.*`. Each check is required from the stage that builds the part it checks, so a check on a part after the MVP reports `not_required_yet` until then.

A group 1 check fails when a value in `verify/baselines.json` differs from ADR-0190's Baselines table as its amending decisions extend it. The report prints each baseline beside its measured value, and a measurement past a baseline is recorded as a baseline finding and a defect while the baseline stays and the full verify still passes. ADR-0340's check 17 records a sandbox snapshot of a 1 GB file that takes over 180 seconds as such a finding. Group 8 has no baseline yet, so it reports its measurements and fails nothing.

When `personal/player.md` exists, group 1 scans every tracked file for the values it holds, and it also fails on a tracked file matching `snap-[0-9A-HJKMNP-TV-Z]{26}`. Recordings are made from synthetic inputs only.

### The property tests

Group 2 runs every template on the same 10,000 seeds each time, so a failure reproduces from its seed, and the report names the template and the seed. For each seed the engine's answer equals the answer of the template's reference solver in `tests/reference/`, which is written from the node's description in the graph (REQ-2902). No rendered task holds an unfilled placeholder (REQ-2904). For each number followed by a noun, the noun's form equals the form `Intl.PluralRules` for `ru` selects from the lexicon's forms of that noun (REQ-2906).

The determinism test feeds the same seeds, times and verdicts twice and compares the outcomes, branches, states, awards, chests, reward queue and chapter finale by a hash of canonical JSON (REQ-2924). The export test builds each export from a 30-day simulated log and checks that its row count equals the number of matching events (REQ-2926), that the field dictionary names every column (REQ-2928), and that every JSONL, CSV and Parquet file opens without error in DuckDB and in pandas (REQ-2930). The `tools` image carries Python with pandas and pyarrow beside Node for that test.

### The simulation

Group 3 simulates the ten synthetic profiles of RES-2900, from «всё знает» (knows everything) to «учится после разбора» (learns after review), each with a model of answer time and fixed seeds. It checks:

- at least 90 % of nodes classified correctly on every profile, the 30-day run under the reduced frontier budget included (REQ-2908);
- over 30 days, for every node observed at least 5 times, an absolute error at day 30 no larger than at day 10 and below 0.3 (REQ-2910);
- a 60-minute adventure yields at least 28 graph first attempts at 1.0 times the fluency threshold (REQ-2912) and at least 25 at 1.5 times (REQ-2914), with the estimate and inverse-check times of ADR-0240 added to the profiles' answer times, and the report counts track first attempts apart;
- on mixed profiles after the cold start, every session's success share lies between 0.65 and 0.85 (REQ-2916), and the mean between 0.70 and 0.80 (REQ-2918);
- after 30 days, the knowledge model tells "knows" from "doesn't know" with at least 90 % accuracy (REQ-2920);
- a new knowledge-model version scores no lower than the latest file in `verify/model-metrics/` on any accuracy metric (REQ-2922).

Group 3 also runs ADR-0140's threshold simulation on the mixed profiles after a cold start, which passes the chapter finale's triumph variant when it plays in 40 % to 60 % of simulated chapters, and the 60-day runs other decisions add: ADR-0290's Cito simulation and scale refit test, ADR-0330's test 17, and ADR-0210's check of the bridge share, whose thresholds ADR-0290, ADR-0330 and SPC-0160 state.

### Check 5: the report tells a language gap from a maths gap

Group 3 runs build check 5 from the backlog stage that builds the Dutch probe, after the MVP. Check 5 runs four synthetic students from `tests/simulation/probe-students.ts`, each over the fixed seeds 1 to 20, and a change of seeds is a change of the check. Unlike the ten profiles above, each student's accuracy depends on the task's presentation (REQ-6666):

| Student | Bare and Russian | Dutch | Dutch after the words |
| --- | --- | --- | --- |
| Maths gap | 55 % | 55 % | 55 % |
| Language gap | 90 % | 45 % | 85 % |
| No gap | 90 % | 90 % | 90 % |
| Both gaps | 55 % | 15 % | 50 % |

Each seed runs the Director, the engine and the report over simulated game days, with the student playing every game day and answering each probe task at its presentation's rate, until the `bare`, `ru`, `nl` and `nl_after_words` cells each hold at least 20 graded first attempts (REQ-7500). Bare tasks follow the probe's own schedule, and the run goes on past the probe's first phase until all four cells reach 20. Check 5 then reads the report `report_cache` holds at the first rebuild at which all four cells hold 20, and counts the language line or the maths line on a seed when the report shows it there, by ADR-0380's contrasts. The report records each seed's game days.

Check 5 passes only when every bar holds:

- the student with a maths gap gets the maths line on at least 15 of 20 seeds and the language line on at most 4 (REQ-6670);
- the student with a language gap gets the language line on at least 15 of 20 seeds and the maths line on at most 4 (REQ-6670);
- the student with no gap gets the language line or the maths line on at most 4 of 20 seeds (REQ-6674);
- the student with both gaps gets both lines on the same seed's report on at least 14 of 20 seeds (REQ-7402).

A bar that fails on the fixed seeds fails the build as `check5_bar_missed`. The agent then runs `verify --check5-rates` and writes the measured rates into the stage's review record. When each student's rates are at or above those ADR-0380's check 5 table and its joint rate of 0.840 give, the owner can approve a new seed set in a decision, and only such a decision changes the seeds; when they are below, the build stays red and the report's defect is fixed. A seed whose four cells still don't hold 20 after 120 simulated game days fails as `check5_phase_short`, naming the seed and the presentation.

`verify --check5-rates` takes the shown-task counts each of check 5's 80 seeds reached at its read, draws 500 fresh answer sets at each seed's counts, calls the line functions the report calls, and writes each student's own, other, both and either rates, with their 95 % Wilson intervals, to `artifacts/check5-rates.json`. It runs without the Director, at the probe stage's acceptance and after each change to `src/parent/contrasts.ts` or `src/parent/intervals.ts`. When the joint rate for the student with both gaps falls below 0.825, the report shows `check5_rate_low` and the bar goes back to the owner.

### Replayed and live model calls

Every automated check runs with recorded answers and makes no live call to the judge model or to any other model (REQ-2950). The gateway in `replay` mode answers from `tests/recordings/` by the hash of the request, the local judges' requests included, and a request with no recording fails its check as `recording_missing`. The no-shame check replays the answers of the model to which play routes the same check, a local judge or Jev as ADR-0350 routes it, so the test and play judge with one model (REQ-2952).

Group 5 runs the blind solve and the safety check on each template's explanation and short solution with the template's sample seeds, and fails a template whose text fails either as `explanation_template_rejected`, the failure SPC-0120 names.

`verify --live` runs the gateway in its `verify` mode, where every call, play roles included, spends from the offline key. It reports the share of live frames discarded, which passes at 30 % or less (REQ-2932), the share of rooms whose two branches were ready before the room ended, which passes at 95 % or more (REQ-2934), and the 95th percentile of the wait from `free_text` to `scene_shown` in the log, over a first-try reply, a retried reply, a library scene and the pool line alike, which passes at 6 seconds or less. It runs at the stage 0.3 acceptance and after every change of a model role, and stops as `live_budget_spent` when it reaches $10. Before each offline run the owner sets the offline key's limit so that what remains of it equals the run's budget, and after the run sets it back to the sandbox's $20 a month.

### The building agent and the project record

The building agent leaves every decision that changes the method, the budget or the child's safety to a person (REQ-2938). It writes each decision that reaches past one task as a draft decision record in `project/adrs/` (REQ-2942), and each open question on method, budget or safety into the record the question concerns (REQ-2944). Before it implements a task, it runs the method's `ready` check, which refuses a task resting on a draft record or an open question, so it builds nothing on what the owner hasn't approved (REQ-2946). Group 1 fails when `docs/decisions.md`, `docs/questions.md` or any other log of decisions or questions exists outside the project record (REQ-2948).

While 5 draft records the agent wrote wait for the owner, the agent starts no work that needs a new decision, works only on what the approved record covers, and says so once in the handoff as `draft_ceiling_reached`.

Every run ends with `artifacts/handoff.md`, which `tools/handoff.ts` writes (REQ-2940). It lists what the run did, the verify status, every draft record and open question the run added, what waits for a person, and the run's spend on the offline key, read from OpenRouter at the end of the run minus at its start.

### The stages

The build runs in these stages, each an epic in the method:

| Stage | Content | Automatic check | Human acceptance |
| --- | --- | --- | --- |
| 0: iPad spike and bake-off | Docker, Caddy and its certificate authority, the home-screen app, the maths keyboard with fractions, sound, a sound test page with a music switch and an effects switch, dictation, one model request, one event in the log, the bake-off | groups 1, 4 and 9, and the bake-off report | the iPad checklist: the certificate, the icon, the keyboard, a fraction, the three sound rows on the sound test page, dictation, a Mac restart, and 30 seconds without Wi-Fi losing 0 answers; the parent's blind rating of the bake-off |
| 0.1: diagnostic core | Q, rng, the graph, templates N, A, F, T1 and T2, the event log and projections, knowledge model v1, task selection, the single mode, `minMs`, outcomes, the resume snapshot, a bare interface, and the parent's sandbox with no model feature | groups 1 to 5 and 9 | the parent plays a bare session, leaves mid-task, continues on another device, and reads the log and the export |
| 0.15: the fact stage | the facts of the M7 and E7 preparation and the hint ladder on the stage 0.1 templates, with the bare interface in Russian, rungs as the template's plain text and no model call | groups 1 to 5 and 9 | a person plays one set on the iPad and runs the stage 0.1 checklist |
| 0.2: all domains | every domain with stretch, the frame library, the science bank, the explanation pipeline, report v1, CSV and Parquet export, the estimate with the inverse check, word problems with a surplus or a missing number, solution plan cards and the Sources track | groups 1 to 5, 7 and 9, with the timed adventure | an adult plays an adventure of about 60 minutes; report v1 reads clearly without explanation; explanations read well |
| 0.3: MVP with the player | the MVP contents list, with composing a word problem, rational grouping, the Keeper's Loops, silent play, the Dutch word bridge, the rules that keep the game the player's own and the second addendum's parts that shape the log joining, and the sandbox gaining its model features | every group | the three sound rows on the game's own settings, and two weeks of daily play |
| Backlog item | one item from the backlog of RES-3000 or one part of the second addendum after the MVP | every group, with the item's own tests | a week of play |

The spike on a real iPad is finished before work on any other stage begins (REQ-3000). Its acceptance shows on a real iPad that the maths keyboard enters fractions and that sound, dictation and the home-screen icon work (REQ-3002), and that 30 seconds without Wi-Fi lose 0 of the answers given in that time (REQ-3004). Group 4 drives the same loss of connection in WebKit emulation.

The spike's sound test page has a music switch and an effects switch, both off on a new install, and plays through the audio path the game uses. The stage 0 checklist runs its three sound rows on that page: a new install plays nothing, each switch sounds its own channel, and silent mode silences both. The stage 0.3 checklist runs the same three rows on the game's own settings.

From stage 0 on, an adult runs `docs/ipad-checklist.md` on a real iPad at every stage, and the checklist grows with each stage (REQ-2936).

A stage's acceptance is the owner's approval of that stage epic's review record, which holds the verify report, the checklist result and the acceptance notes. The next stage's epic doesn't pass the method's `ready` check until that approval exists, so a stage begins only after the stage before it has passed its automatic check and its human acceptance (REQ-3008). The order is 0, 0.1, 0.15, 0.2, 0.3, then one backlog item at a time. The diagnostic core of stage 0.1 therefore passes its checks before work on the game shell begins (REQ-3006). A stage waiting for acceptance waits as `acceptance_pending` with no timeout, and a refused stage reopens with each finding as a defect.

The acceptance of stage 0.2 includes an adult playing through an adventure of about 60 minutes (REQ-3010). Stage 0.3 starts only after the family has shown the player the key-art pictures and the heroine sheets and recorded her choice. The choice goes into the stage 0.2 epic's review record as an acceptance note naming the chosen sheet's asset id, and the Parent Room's choice screen records the same choice in `art_jobs`, so the stage 0.3 epic's `ready` check sees it through the owner's approval of that review.

### The addendums' build order and the fact stage

The stages take the first addendum's items in this order (REQ-5090): fact measurement with the hint ladder at stage 0.15; the estimate with the inverse check, word problems with a surplus or a missing number, solution plan cards and the Sources track at stage 0.2; composing a word problem, rational grouping and the Dutch word bridge at stage 0.3. The bridge's checks are required from stage 0.3. The Keeper's Loops, silent play, the rules that keep the game the player's own and the parent's sandbox fit around these steps, as the stage table places them. The second addendum's parts that shape the log join at stage 0.3, and each of its other parts is a backlog item after the MVP.

The player plays the fact stage as soon as a person accepts it, before stage 0.3 (REQ-5088). The stage offers one set of fact tasks a game day, sized so that it ends before 15 minutes of active time, as ADR-0290 states. It makes no model call, and its screens pass the same no-clock check as every later stage. Every event it logs goes into the one log and counts in the "on her own" estimate like any stage 0.1 attempt.

### The parent's sandbox across the stages

The parent's sandbox is available from stage 0.1, with the first templates (REQ-5092). It offers no model feature until the model gateway and the Parent Room's PIN both exist, and while either is missing its model routes answer `409 sandbox_models_unavailable` (REQ-5094). Until the PIN guards it, the sandbox is served only on ADR-0010's loopback listener, `http://localhost:8080`, which no iPad can reach, so the player can't reach it from her screens (REQ-5098). ADR-0340 states the sandbox itself.

### The MVP acceptance and the backlog

The MVP is accepted only after two weeks of daily play in which the player wants to come back, spends guiding threads without fear and isn't upset by the other path, as the parent judges from watching her play (REQ-3012). Over those two weeks, fast guesses stay below 15 % of her scored first attempts, read from the rapid-guess row of the Parent Room's limits table (REQ-3014).

After the MVP, work starts on a backlog item only once the item before it has been accepted (REQ-3016). A backlog item is accepted after a week of play in which the signal "the story is stopping being hers" didn't rise and she passed at most 80 % of free-action points with «Дальше» (Next) and no send, as the parent judges (REQ-3018). The family records its order of backlog items as a numbered list in the acceptance notes of the stage 0.3 epic's review record, and each later backlog item's review record may reorder the items not yet begun.

### The nine open questions of the draft

Each of the nine open questions of RES-3000 is answered or deferred on the record before the part it affects is built (REQ-3020):

| Question | Status | Where |
| --- | --- | --- |
| 1. A pure-measurement mode | deferred to the stage 0.3 review; until then, the fast-guess flag above 15 % in the report and the Director's own reaction | ADR-0190, ADR-0180 |
| 2. Hints before an answer as a habit | deferred to the stage 0.3 review; until then, the flag above 30 % assisted first attempts | ADR-0190, ADR-0180 |
| 3. The three-day rule | answered: adventure days, limit 3, changeable | RES-3000, RES-0200 |
| 4. Model v1 values | answered: RES-0900's values, refit after 4 to 6 weeks | RES-3000, RES-0900 |
| 5. Outcome thresholds | answered: RES-1700's values | RES-3000, RES-1700 |
| 6. Alarm notification | answered: the Parent Room notice in the MVP, web push later | RES-3000, RES-1800 |
| 7. Provider allowlist | answered: the lists of RES-2600 | RES-3900, RES-2600 |
| 8. Jev | answered: the judge model on OpenRouter's zero-retention route, or, check by check, a local judge that passed ADR-0350's gate | RES-3000, RES-1600, ADR-0350 |
| 9. Placeholder names | answered: familiars, floors and Tangles; the Guardians keep theirs | RES-3000, RES-1600 |

### The MVP scope and its guard

The first version holds every part of the MVP contents list (REQ-5076): levels and experience with daily quests; chests with a choice of 1 from 3, the forge and the buttons-only shop; the MVP familiar roster with friendship and evolution; the Master's story with success and other-path branches, floor states, Diary pages, names the player gives, free text and light dreamcore; the single mode with guiding threads, explanations, the event log and knowledge model v1; for the parent, lesson marks, report v1 and the raw data export; and the first addendum's items 1 to 9 and 11 to 13, from the hint ladder to the parent's sandbox.

The first version also holds the second addendum's parts that shape the log (REQ-6676):

- the event types `hypothesis_recorded` and `hypothesis_updated`, and the Parent Room tab «Гипотезы» (Hypotheses) with a form that records a hypothesis and what would confirm and refute it as text, its links to nodes and each hypothesis's history, with no status, as ADR-0450 states;
- the context tag on every accepted frame, `contexts` on templates, the Director's hold on first encounters and the projection `first_exposures`, as ADR-0410 states;
- `itemId` on `solution_shown` and `hint_shown`, as ADR-0400 states;
- the optional `categories` field on the Cito result form, as ADR-0420 states.

The owner judges both lists at the stage 0.3 acceptance.

The first version holds none of the items deferred until after the MVP (REQ-5078): Ascents and anchor forms; story battles between familiars and the ring of elements; items and familiars made by AI, and live pictures; Diary ciphers, though the Keeper's Loops stay in; «Свободная прогулка» (Free Walk); characteristics, paths and story ranks by the calendar; room decor; the Dutch layer; the full roster of familiars with the full set of dreamcore; and snapshots of the school's learning system.

The first version holds no other part of the second addendum (REQ-6682): the profile, the weekly breakdown and trajectories, retention checks and their Director rules, the transfer report, the home-and-school quadrants, the Dutch probe, the extension of «Сплети загадку» (Weave a riddle), hypothesis statuses, and build checks 1 to 5. The owner judges this at the stage 0.3 acceptance.

The Dutch probe has a further condition. No Dutch probe text, prompt, file or screen is built until the owner amends the rule in `CLAUDE.md` that the text the player sees is in Russian only, and if the owner declines the amendment, the probe and check 5 are never built, as ADR-0430 states.

The scope guard in group 1 reads `verify/scope-guard.json` and fails as `scope_guard_hit`, naming the trace, when one of these appears in the tree:

- a Dutch locale string file, `content/i18n/nl.json` or any `*.nl.*` file;
- a template with `curriculum: "nl"`;
- a `checkpoints` or `generated_entities` table;
- an Ascent route or a Free Walk route;
- a push subscription route;
- a schema for a `school_snapshot_*` event type, a Parent Room route for a school snapshot, `src/engine/school/`, or the school-system vendor's name;
- a schema for `retention_check_planned` or `probe_family_created`, a template with `probeFamily`, or the string `retention_check` or `nl_probe` in `src/engine/`;
- a route under `/api/parent/profile`;
- the route `/api/parent/report/home-and-school`, `src/parent/school/quadrants.ts`, a schema for `cito_category_resolved`, or the category resolution panel;
- the directory `content/probe/` or `tools/probe/`, a schema for any event type ADR-0430 owns, or the route `/parent/probe`;
- a `hypothesis_days` table, `content/hypothesis-measures.json`, or a version 2 schema of `hypothesis_recorded` or `hypothesis_updated`.

Each trace in `verify/scope-guard.json` names the backlog item whose epic builds its part, and the first task of that epic removes the trace, so the guard loses a trace only in the change that starts building its part. The Dutch locale traces and the probe's traces leave only in a change that follows the owner's amendment of the Russian-only rule in `CLAUDE.md`. The weekly breakdown and trajectories, the transfer report and the extension of «Сплети загадку» leave no trace the guard reads, so the owner's judgement at the stage 0.3 acceptance alone keeps them out.

Every text and task the player sees is in Russian, apart from the Dutch keywords of the word bridge and the Dutch equivalent a term hint shows, each once the parent has approved it (REQ-5080). Both Dutch words live as fields of `lexicon.ru.json` beside a Russian term, a bridge entry marked `bridge: true`, so the scope guard allows them and no Dutch locale file exists. The parent's Dutch memo is parent-facing and outside this rule. SPC-0160 states the string check that enforces it on player screens.

### The canon against the specification

At each stage's review the agent reads `canon/` against the specification on method, time, rewards and safety, and writes each contradiction as a `canon_contradiction` defect against the canon, which is corrected, so the canon never contradicts the specification on those four subjects (REQ-3708).

## Failure paths

| Condition | What happens |
| --- | --- |
| A required check fails | verify exits non-zero as `verify_red`; the report names the group, the check and the failing case, and the stage can't close. |
| A template's explanation or short solution fails the blind solve or the safety check | Group 5 fails the template as `explanation_template_rejected`. |
| `data/snapshots/` holds no snapshot | Group 1 counts `content/frames.ru.json` as it stands and reports `frames_acceptance_unchecked`. |
| A template's answer differs from its reference solver on one seed | Group 2 fails and names the template and the seed. |
| A replayed request has no recording | The check fails as `recording_missing` with no network call; `verify --record` fills it outside the gate. |
| A value in `verify/baselines.json` differs from ADR-0190's Baselines table as its amending decisions extend it | Group 1 fails. |
| A measurement passes its baseline | The report shows both values as a baseline finding, the case is recorded as a defect, the baseline stays, and the full verify still passes. |
| `docs/decisions.md`, `docs/questions.md` or another decision log appears | Group 1 fails. |
| A deferred item's trace appears in the tree | Group 1 fails as `scope_guard_hit` and names it. |
| A tracked file holds a value from `personal/player.md` or matches `snap-[0-9A-HJKMNP-TV-Z]{26}` | Group 1 fails. |
| Verify is pointed at the `tower` service's data directory | Verify refuses to start. |
| A live run reaches its budget | The run stops as `live_budget_spent` and reports what it measured as incomplete. |
| 5 draft records wait for the owner | The agent works only on approved scope, and the handoff says so once as `draft_ceiling_reached`. |
| A stage passed verify and has no acceptance | The next stage's epic fails the `ready` check as `acceptance_pending`, with no timeout. |
| The owner or the checklist rejects a stage | `acceptance_refused`: each finding becomes a defect, and the stage reopens. |
| A sandbox model route is called before the gateway or the PIN exists | `409 sandbox_models_unavailable`. |
| An iPad reaches for the sandbox before the PIN guards it | The loopback listener refuses the connection. |
| A bar of check 5 fails on the fixed seeds | Group 3 fails as `check5_bar_missed`; the agent writes the rates `verify --check5-rates` measures into the stage's review record. Rates at or above ADR-0380's send the seed set to the owner's decision; rates below leave the build red until the report's defect is fixed. |
| A seed of check 5 lacks 20 observations on a presentation after 120 simulated game days | Group 3 fails as `check5_phase_short` and names the seed and the presentation. |
| The measured joint rate for check 5's student with both gaps falls below 0.825 | `check5_rate_low`: the bar goes back to the owner in the stage's review record. |
| The canon contradicts the specification on method, time, rewards or safety | A `canon_contradiction` defect against the canon, which is corrected. |
| Group 8 measures a slow load, a large bundle or a low frame rate | The report shows the measurement, and group 8 fails nothing until its baselines exist. |

## Open review findings

An agent reviewer raised these on 2026-09-28.

- Rejected: the reviewer asked to move five gaps into ADR-0190 and ADR-0210 as open questions. An approved decision changes only through a new record, and ADR-0370 is that record.
- Rejected: the reviewer asked for the reason beside the draft ceiling, the spike's place first, the real-iPad checklist, verify's own data directory, synthetic recordings and the retention of reports and recordings. A specification states what the system does and never why (S8), and ADR-0190 keeps those reasons.
- Rejected: the reviewer asked for file-name patterns the decision-log check matches. ADR-0190 names `docs/decisions.md` and `docs/questions.md` and no pattern, and the check's author sets the patterns in the check.
- Rejected: the reviewer asked to send each part of the second addendum and the sandbox to its specification. ADR-0340 to ADR-0450 have higher numbers than this document, and this repository cites a higher-numbered subject by its decision, so the parts stay with ADR-0340 and ADR-0380 to ADR-0450.
- Rejected: the reviewer asked to drop the template's header comment, or add a reason beside each rule. The comment comes from `paw template spec`, and the reasons stay in ADR-0190 for the reason given above.
