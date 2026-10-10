---
id: ADR-0190
artifact: adr
status: approved
revised: 2026-10-10
addresses: [REQ-2900, REQ-2902, REQ-2904, REQ-2906, REQ-2908, REQ-2910, REQ-2912, REQ-2914, REQ-2916, REQ-2918, REQ-2920, REQ-2922, REQ-2924, REQ-2926, REQ-2928, REQ-2930, REQ-2932, REQ-2934, REQ-2936, REQ-2938, REQ-2940, REQ-2942, REQ-2944, REQ-2946, REQ-2948, REQ-2950, REQ-2952, REQ-3000, REQ-3002, REQ-3004, REQ-3006, REQ-3008, REQ-3010, REQ-3012, REQ-3014, REQ-3016, REQ-3018, REQ-3020, REQ-3708]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0190. One verify command, simulations and a person's acceptance gate every stage, and the MVP holds exactly the approved scope

## Decision

Every stage of the build passes one command, `npm run verify` in the `tools` container, and then a person's acceptance on a real iPad before the next stage starts. The command runs the nine check groups of RES-2900 against fixed seeds, synthetic students and recorded model answers, and writes one report. The stages run in the order RES-3000 sets, 0, 0.1, 0.2 and 0.3, and stage 0.3 is exactly the MVP contents list; backlog items follow one at a time.

This record is written for the owner, who evaluates it, and for the building agent, who works under it. Where I chose a default the research left open, the sentence says "I chose".

### The verify command runs every automated check and writes one report

`docker compose run --rm tools npm run verify` runs every group below and writes `artifacts/verify-report.html` for a person and `artifacts/verify-report.json` for a program (REQ-2900). It exits 0 only when every group required at the current stage passes. Each group declares the first stage at which it is required. Before that stage it reports "not required yet" by name in the report, so a missing group is visible and never counts as green.

`verify --fast` runs groups 1 and 2 on 1,000 seeds after each small step of work. It never gates a stage, because the requirements ask for 10,000 seeds. `verify --live` is a separate evaluation with real model calls, described further down.

| Group | What it runs | Requirements | Required from stage |
| --- | --- | --- | --- |
| 1. Types, lint and static checks | `tsc --noEmit`, ESLint, the scope guard, the record checks, the personal-data scan, the static checks other decisions name | REQ-2948, REQ-3702, REQ-3704 | 0 |
| 2. Unit and property tests | fast-check over 10,000 fixed seeds per template; determinism; migrations; API schemas; exports | REQ-2902, REQ-2904, REQ-2906, REQ-2924, REQ-2926, REQ-2928, REQ-2930 | 0.1 |
| 3. Simulation | ten synthetic profiles, single runs and 30-day runs, and the timed adventure | REQ-2908 to REQ-2922 | 0.1; the timed adventure from 0.2 |
| 4. End-to-end | Playwright on the MVP matrix: WebKit emulating an iPad in landscape and Chromium at 1280x720 | REQ-3004 in emulation | 0 |
| 5. Model calls, replayed | recorded OpenRouter answers, Jev's among them, through the gateway of ADR-0100 | REQ-2950, REQ-2952 | 0.1 |
| 6. Safety provocations | the harmful inputs and creepiness provocations of RES-2900, replayed | none of mine | 0.3 |
| 7. Visual | screenshots against references, axe-core and contrast | none of mine | 0.2 |
| 8. Performance | load time, bundle size, scene frames per second with the CPU slowed 4 times | none of mine | 0.3 |
| 9. Docker smoke test | `docker compose up`, the health check, HTTPS through Caddy, SSE without buffering, a rebuild without data loss, `db-snapshot` | none of mine | 0 |

Other decisions add checks to these groups: ADR-0040 its template checks, ADR-0100 its gateway lint rule, ADR-0140 its content checks, ADR-0180 its report and threshold checks. This record owns the command, the groups, the report and the gate, and each check's content belongs to the decision that names it.

The Baselines table under Consequences is the repository's one place for non-functional baselines (D18): every latency, cost, size and time budget the design chose or had imposed, with its reason and its owning decision, and each other decision points to it. `verify/baselines.json` holds the same numbers for the checks, with the source record of each beside it, and a group 1 check fails when a value there differs from the table. The report prints the values next to the measured ones. A decision may set a stricter budget when it says why; a measurement past a baseline is recorded as a defect, and the baseline doesn't move to meet it.

### The property tests use fixed seeds and a reference solver written apart

Group 2 runs every template on the same 10,000 seeds each time, so a failure reproduces from its seed. For each seed the engine's answer equals the answer of a reference solver in `tests/reference/`, which imports nothing from `src/templates/` and is written from the node's description in the graph of ADR-0050 (REQ-2902). The rendered task holds no unfilled placeholder (REQ-2904). For each number followed by a noun, the noun's form equals the form that `Intl.PluralRules` for `ru` selects from the lexicon's forms of that noun (REQ-2906); I chose this test because it needs no morphology library and matches how ADR-0160 inflects.

The determinism test feeds the same seeds, times and verdicts twice and compares outcomes, branches, states, awards, chests, the reward queue and the chapter finale by a hash of canonical JSON (REQ-2924). The export test builds each export from a 30-day simulated log and checks its row count against the matching events (REQ-2926). It checks that the field dictionary names every column (REQ-2928) and opens every JSONL, CSV and Parquet file in DuckDB and in pandas (REQ-2930). The `tools` image therefore carries Python with pandas and pyarrow beside Node.

### The simulation checks the core against synthetic students

Group 3 simulates the ten profiles of RES-2900, from «всё знает» (knows everything) to «учится после разбора» (learns after review), each with a model of answer time and fixed seeds. Its checks and their baselines:

- at least 90 % of nodes classified correctly on every profile, including the 30-day run under the reduced frontier budget (REQ-2908, RES-3900);
- over 30 days, each node's estimate converges towards the profile's true state (REQ-2910). I chose the test: for every node observed at least 5 times, the absolute error at day 30 is no larger than at day 10 and below 0.3;
- a 60-minute adventure targets 30 to 40 graded first attempts calibrated by task difficulty and yields at least 28 scored first attempts at 1.0 times the fluency threshold and at least 25 at 1.5 times (REQ-1040, REQ-2912, REQ-2914). The guideline was set by the owner's decision of 2026-09-28, and the minimums were imposed by the owner's decision of 2026-09-26;
- on mixed profiles after the cold start, every session's success share stays between 0.65 and 0.85 and the mean lies between 0.70 and 0.80 (REQ-2916, REQ-2918);
- after 30 days the knowledge model tells "knows" from "doesn't know" with at least 90 % accuracy (REQ-2920);
- a new version of the knowledge model scores no lower than the version before it on any accuracy metric (REQ-2922). The metrics of each approved version are kept in `verify/model-metrics/<version>.json`, and the check compares against the latest one.

ADR-0060, ADR-0070 and ADR-0140 supply what the simulation runs; this record sets the checks and their thresholds.

### Automated checks replay model answers, and live calls are a separate run

Every automated check runs with recorded answers and makes no live call to the judge model or any other (REQ-2950). The checks run the gateway of ADR-0100 in its `replay` mode, which answers from `tests/recordings/` by the hash of the request and opens no network connection. The no-shame check replays the answers of the model that play uses for that check, Jev as `JUDGE_MODEL` or `SAFETY_MODEL` as RES-1600 assigns it, so the test and play judge with the same model (REQ-2952). A request with no recording fails the check as `recording_missing`. `verify --record` runs the gateway in its `verify` mode, makes the missing calls on the offline key and stores them, as a deliberate step outside the gate.

`verify --live` makes real calls and measures what only live calls can. It checks that at most 30 % of live frames are discarded (REQ-2932) and that both room branches are ready before the room ends in at least 95 % of rooms (REQ-2934). It also checks the p95 wait for the Master at 6 seconds or less (RES-2900). It plays 10 simulated adventures, about 90 rooms, so the 95 % share rests on enough rooms to mean something. It is an offline run under REQ-2728, so it runs the gateway in its `verify` mode, in which every call, play roles included, spends from the offline key, and I chose a budget of $10 a run, `VERIFY_LIVE_BUDGET_USD`, which the owner sets as the offline key's limit before the run. It runs at the stage 0.3 acceptance and after every change of a model role.

### The building agent records decisions and questions in the project record

The building agent leaves every decision that changes the method, the budget or the child's safety to a person (REQ-2938). A decision that reaches past one task becomes a draft decision record in `project/adrs/` (REQ-2942), and a question on method, budget or safety becomes an open question in the record it concerns (REQ-2944). Before it implements a task, the agent runs `meow-method ready`, which refuses a task that rests on a draft record, so nothing is built on an unapproved decision (REQ-2946). Group 1 fails when `docs/decisions.md`, `docs/questions.md` or any other decision log exists outside the project record (REQ-2948).

Every run ends with `artifacts/handoff.md`, which `tools/handoff.ts` writes so the agent can't forget a part (REQ-2940). It lists what the run did, the verify status, every draft record and open question the run added, what waits for a person, and the run's spend: the offline key's usage as OpenRouter reports it at the end of the run minus at its start.

I chose a ceiling of 5 draft records the agent has written and the owner hasn't approved. At 5, the agent starts no work that needs a new decision, works only on what the approved record already covers, and says so once in the handoff. The ceiling keeps the owner's queue short enough to read, because a long queue of drafts ends in approval unread.

### Stages run in order, each gated by verify and a person's acceptance

| Stage | Content (RES-3000) | Automatic check | Human acceptance |
| --- | --- | --- | --- |
| 0: iPad spike and bake-off | Docker, Caddy and its certificate authority, the home-screen app, the maths keyboard with fractions, sound, dictation, one model request, one event in the log, the bake-off | groups 1, 4 and 9, and the bake-off report | the iPad checklist: certificate, icon, keyboard, fraction, sound, dictation, a Mac restart, and 30 seconds without Wi-Fi losing 0 answers; the parent's blind rating of the bake-off |
| 0.1: diagnostic core | Q, rng, the graph, templates N, A, F, T1 and T2, the event log and projections, knowledge model v1, task selection, the single mode, `minMs`, outcomes, the resume snapshot, a bare interface | groups 1 to 5 and 9 | the parent plays a bare session, leaves mid-task, continues on another device, and reads the log and the export |
| 0.2: all domains | every domain with stretch, the frame library, the science bank, the explanation pipeline, report v1, CSV and Parquet export | groups 1 to 5, 7 and 9, with the timed adventure | an adult plays an adventure of about 60 minutes; report v1 reads clearly without explanation; explanations read well |
| 0.3: MVP with the player | exactly the MVP contents list below | every group | two weeks of daily play, described below |
| Backlog item | one item from the backlog of RES-3000 | every group, with the item's own tests | a week of play with no loss of interest |

The spike on a real iPad is finished before any other stage begins, because the iPad is the main technical risk (REQ-3000, REQ-3002). The 0 lost answers after 30 seconds without Wi-Fi rest on the answer queue of ADR-0030, and the checklist proves them on the device (REQ-3004). The diagnostic core passes its checks before work on the game shell begins (REQ-3006). An adult plays through an adventure of about 60 minutes at the stage 0.2 acceptance, as the owner imposed on 2026-09-26 (REQ-3010). Stage 0.3 starts only after the family has shown the player the key-art pictures and the heroine sheets and recorded her choice (RES-3000).

From stage 0 on, an adult runs `docs/ipad-checklist.md` on a real iPad at every stage, because the WebKit in Playwright isn't Safari on an iPad and the agent has no iPad (REQ-2936). The checklist grows with each stage.

Each stage is an epic in the method, and its acceptance is the owner's approval of that epic's review record, which holds the verify report, the checklist result and the acceptance notes. The next stage's epic doesn't pass `meow-method ready` until that approval exists, so a program enforces the order (REQ-3008). I chose the epic's review as the place for acceptance because the method already gates on it, and a separate acceptance file would be a second log.

The MVP is accepted only after two weeks of daily play in which the player wants to come back, spends guiding threads without fear and isn't upset by the other path, as the parent judges from watching her (REQ-3012). Over those two weeks, fast guesses stay below 15 % of her scored first attempts, read from the rapid-guess row of ADR-0180's limits table (REQ-3014). After the MVP, work starts on one backlog item only once the one before it is accepted (REQ-3016), and each item is accepted after a week of play with no loss of interest (REQ-3018).

### The nine open questions are answered or deferred on the record

Each open question of RES-3000 is settled before the part it affects is built (REQ-3020). Seven are answered in RES-3000, and I defer the other two to the stage 0.3 review, with the flags the draft names as the interim behaviour:

| Question | Status | Where |
| --- | --- | --- |
| 1. A pure-measurement mode | deferred to the stage 0.3 review; until then, the fast-guess flag above 15 % in the report and the Director's own reaction | this record, ADR-0180 |
| 2. Hints before an answer as a habit | deferred to the stage 0.3 review; until then, the flag above 30 % assisted first attempts | this record, ADR-0180 |
| 3. The three-day rule | answered: adventure days, limit 3, changeable | RES-3000, RES-0200 |
| 4. Model v1 values | answered: RES-0900's values, refit after 4 to 6 weeks | RES-3000, RES-0900 |
| 5. Outcome thresholds | answered: RES-1700's values | RES-3000, RES-1700 |
| 6. Alarm notification | answered: the Parent Room notice in the MVP, web push later | RES-3000, RES-1800 |
| 7. Provider allowlist | answered: the lists of RES-2600 | RES-3900, RES-2600 |
| 8. Jev | answered: the judge model on OpenRouter's zero-retention route | RES-3000, RES-1600 |
| 9. Placeholder names | answered: familiars, floors and Tangles; the Guardians keep theirs | RES-3000, RES-1600 |

Both deferrals are method questions, so the owner decides them by approving or rejecting this record.

### The MVP holds exactly the approved scope

Stage 0.3 holds every part of the MVP contents list (REQ-3700): levels and experience with daily quests; chests of 1 from 3, the forge and the buttons-only shop; the MVP familiar roster with friendship and evolution; the Master's story with success and other-path branches, floor states, Diary pages, names she gives, free text and light dreamcore; the single mode with guiding threads, explanations, the event log and knowledge model v1; and for the parent, lesson marks, report v1 and the raw data export. The owner judges it at the stage 0.3 acceptance.

It holds none of the deferred items (REQ-3702): Ascents and anchor forms, story battles and the ring of elements, AI-made items and familiars with live pictures, Diary ciphers, «Свободная прогулка» (Free Walk), characteristics, paths and ranks by the calendar, room decor, the Dutch layer, and the full roster with full dreamcore. A scope guard in group 1 reads `verify/scope-guard.json`, which names the traces a deferred item leaves in the tree. They are a Dutch locale string file, a template with `curriculum: "nl"`, the `checkpoints` or `generated_entities` table, an Ascent or Free Walk route, and a push subscription route. The guard fails when one appears. The glossary's Dutch words are one data field beside a Russian term (RES-1300), so the guard allows them.

Every text and task the player sees is in Russian, because the scope guard allows only the `ru` locale of ADR-0160 (REQ-3704). The game offers no lesson that teaches a new topic: every task comes from a template tied to a node, the short solution and the second attempt stay tied to their task, and the parent judges it (REQ-3706). At each stage's review the agent reads the canon against the approved record on method, time, rewards and safety, and writes each contradiction as a defect against the canon, which is corrected (REQ-3708).

### What works once this is accepted, and what doesn't yet

From stage 0, the command exists, runs groups 1, 4 and 9, reports every other group as not required yet, and blocks a stage that fails. Each later stage turns on the groups its content makes testable, so verify grows with the game and never waits for it. The handoff, the draft ceiling, the scope guard and the stage gate work from the first run.

The full browser matrix, the tests of backlog items and the performance budgets don't exist yet. `verify --live` can't run before the gateway and the Master exist at stage 0.3. Removing this record's increment leaves the game working and unchecked, which is why every other decision's checks name this command.

## Why

The agent builds unattended, so each stage needs a result a program can check, and a person keeps the judgement no program can make (RES-2900). One command with one report gives the agent and the owner the same answer to "is this stage done", which separate commands don't.

Replayed answers make the checks repeatable and free, and keep a flaky provider from turning the gate red at random. REQ-2950 forbids live judge calls in the automated checks for the same reason. Live behaviour still needs measuring, so it runs as its own evaluation with its own budget.

The stages follow the risks. The iPad goes first because a failure there changes the platform (RES-3000). The core goes before the shell because every part of the shell stands on its measurement. The MVP ends with the player because only her play shows whether she wants to come back, which no simulation can.

The epic review as the acceptance record keeps one record, which is the rule RES-2900 set for decisions and questions. The ceiling on drafts exists because the owner is the bottleneck: every approval waits on one person.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: the owner tests by hand at the end | no tooling to build or keep | the agent works alone for weeks, so a fault found at the end reaches every part built on it; REQ-2900 asks for one command |
| Hosted CI, such as GitHub Actions, as the gate | runs on every push, visible to anyone | the gate would run on a second environment that must match the Docker setup on the Mac; the Safari behaviour it can't test stays the same; recordings and fixtures in a public repository raise the stakes of a personal-data slip. It can be added later as a copy of the same command |
| Separate commands per group, with no single report | fast feedback on one area | nothing says whether a stage is done, and a group nobody ran looks the same as a group that passed |
| Automatic gates only, with no person's acceptance | the agent never waits | whether the player wants to come back, whether a label reads as a grade and whether the iPad works in her hands are judgements RES-3000 gives to people |
| Build every part, then test the whole | no stage boundaries to manage | the iPad risk would surface last, and a fault in the core would reach every part of the shell before anyone saw it |

## What it costs

The `tools` image carries Playwright's browsers, Python with pandas and pyarrow, DuckDB and LanguageTool, which makes it the largest image in the setup. I chose budgets of 3 minutes for `verify --fast` and 30 minutes for a full verify on the Mac, because a fast loop longer than that stops being run after each step. Both are chosen, not imposed. Recordings need keeping: each change to a prompt adds requests without recordings, and `verify --record` spends a little of the offline key to fill them.

The owner pays in attention. The owner approves each draft record, at most 5 open at once. The owner runs or delegates the iPad checklist at each stage, which I estimate at 30 minutes, plays an adventure of 60 minutes at stage 0.2, and watches two weeks of play at stage 0.3 and a week per backlog item. Each live run costs up to $10 of the offline key.

If the owner is away for two weeks, the agent keeps working on approved work until it hits the draft ceiling. It then works only on what the approved record covers, and the handoff says once what waits. No data is lost and no queue grows past 5 drafts, so the owner returns to a short list. A stage waiting for acceptance waits with no timeout, because an accepted stage is worth more than a fast one.

The accumulating piles and their ceilings: open drafts at 5; `artifacts/` holds the reports of the last 20 runs and drops older ones, which is safe because git holds what changed; `tests/recordings/` drops a recording no test has used for 30 days, which is safe because `verify --record` makes it again.

## What would reverse it

- A full verify takes longer than 60 minutes on the Mac for 3 runs in a row. Then the slow groups move to a nightly run, and the stage gate reads the latest nightly report.
- At stage 0.3, `verify --live` results differ from the replayed ones by more than the baselines allow, such as a discard share above 30 % where replays show none. Then the recordings are stale, and live runs join the gate more often.
- The simulation passes and the stage 0.3 play shows node states the parent judges wrong on more than 1 in 10 nodes she knows well. Then the synthetic profiles don't model the player, and the simulation checks lose their weight in the gate.
- The owner misses two stage acceptances in a row for lack of time. Then the gate needs a delegate, which is a change to this record.

## Consequences

- ADR-0100's gateway provides the two modes this record uses: `replay`, which answers from `tests/recordings/` and calls no model, for every automated check, and `verify`, which spends every call from the offline key, for `verify --live` and `verify --record`.
- ADR-0040 exposes its templates to a reference solver that imports none of them; ADR-0060, ADR-0070 and ADR-0140 run headless inside the simulation.
- ADR-0180's limits table supplies the fast-guess share of the stage 0.3 acceptance.
- `verify/baselines.json`, `verify/scope-guard.json`, `verify/model-metrics/`, `tests/reference/`, `tests/recordings/`, `tools/handoff.ts` and `docs/ipad-checklist.md` are created.
- Each stage becomes an epic in the method.

The security boundary protects the player's real data and the family's money. Ordered by the likelihood of damage, it defends against:

1. the agent committing personal data to the public repository in a fixture or a recording. Recordings come from synthetic inputs only, and when `personal/player.md` exists, group 1 scans every tracked file for the values it holds;
2. verify touching the real database. Verify runs on its own data directory and refuses to start when that directory is the one the `tower` service uses;
3. a live run overspending. It uses the offline key with its limit set to the run's budget, never the play key;
4. the agent building on a decision nobody approved, which `meow-method ready` refuses.

The failure states, each with its audience:

| State | When | What happens next | Audience |
| --- | --- | --- | --- |
| `verify_red` | a required group fails | the stage can't close; the report names the group and the failing case | building agent |
| `not_required_yet` | a group's stage hasn't come | the report lists it by name | building agent |
| `recording_missing` | a request has no recording | the check fails; `verify --record` fills it | building agent |
| `live_budget_spent` | a live run reaches its budget | the run stops and reports what it measured as incomplete | owner |
| `draft_ceiling_reached` | 5 drafts wait for approval | the agent works only on approved scope; the handoff says so once | owner |
| `acceptance_pending` | a stage passed verify and waits for its acceptance | the next stage's epic waits | owner |
| `acceptance_refused` | the owner or the checklist rejects a stage | each finding becomes a defect, and the stage reopens | building agent |
| `scope_guard_hit` | a deferred item appears in the tree | group 1 fails and names it | building agent |
| `canon_contradiction` | the canon disagrees with the record on method, time, rewards or safety | a defect against the canon, which is corrected | building agent |

The strongest objection: the simulation checks the knowledge model and the Director against synthetic students the same agent wrote, so a green group 3 shows the code agrees with its own assumptions, not that it measures a real child. The only check against a real child is two weeks of play at stage 0.3, after the whole core and shell are built on those assumptions. The iPad spike and the adult's hour of play at 0.2 reduce this, and they measure a person who knows the answers.

Premortem, written from 2027-02 as if it had happened. Verify stayed green through stage 0.2, and the owner accepted each stage from the report. At stage 0.3 the player's first week showed «пока не освоено» on half of the fractions she did well at school, because every synthetic profile answered faster than she did on the iPad and the fluency thresholds never met a real hand. The recordings were eight weeks old by then, and the first `verify --live` found 40 % of live frames discarded after a provider changed its model. The agent had 5 drafts waiting, so it spent the week on approved polish while the owner sorted them. The first failure is the objection above and the reason the iPad spike measures input time; the second is why a model change triggers `verify --live`; the third is why the ceiling is 5 and not more.

### Baselines

This table is the repository's one list of non-functional budgets. A budget marked chosen is a decision's own and changes with that decision; one marked imposed comes from a requirement or an approved research record and changes only through it. A path where a person waits carries slack below the point where the wait would be felt.

| Budget | Value | Decision | Chosen or imposed | Reason |
| --- | --- | --- | --- | --- |
| Answer reply, request to reply in the server log | p95 at most 300 ms | ADR-0030 | chosen | she waits for it after every answer, and the path makes no model call |
| State-changing requests per device | at most 20 a second, then 429 | ADR-0030 | chosen | caps a runaway retry loop from a bug |
| Task generation | p95 at most 50 ms on the family Mac | ADR-0040 | chosen | the task appears while she waits |
| Generation candidates per task | at most 1,000, then the fallback list | ADR-0040 | imposed by RES-1200 | bounds rejection sampling |
| Per-node model update | p95 at most 50 ms | ADR-0060 | chosen | runs between tasks while she waits |
| Next task choice, `nextTask` | p95 at most 100 ms with a year of log | ADR-0070 | chosen | she waits between tasks, inside RES-1000's 4 seconds of transition |
| Day and floor planning | at most 1 s | ADR-0070 | chosen | hidden behind the floor's entry scene |
| Wait after her free text | p95 at most 6 s | ADR-0110 | imposed by REQ-1622 | she waits for the Master's answer |
| Split of that wait | 100 ms local, 4,400 ms Master, 1,000 ms checks, 500 ms slack | ADR-0110 | chosen | keeps the 6 s with slack |
| Fallback line after free text | at 12 s without a checked reply | ADR-0110 | imposed by REQ-1624 | the scene never stalls |
| Detailed explanation shown | within 10 s of the spend, else the template | ADR-0120 | imposed by RES-0600 and REQ-0622 | she waits after spending a thread |
| Explanation model reply | within 7 s | ADR-0120 | chosen | leaves 3 s for the judge and the blind solve |
| Judge timeout before `SAFETY_MODEL` | 1500 ms | ADR-0100 | chosen | three times the 500 ms upper latency RES-1600 cites |
| Catalogue re-check when OpenRouter is unreachable | every 10 minutes | ADR-0100 | chosen | turns live calls back on soon after a network fault |
| Screen change on the iPad | at most 100 ms | ADR-0150 | chosen | a tap must feel immediate |
| Text gate per line | under 1 ms | ADR-0160 | chosen | runs on every line before it leaves the server |
| Graph load and validation at start | at most 1 s | ADR-0050 | chosen | the file is small, and start-up shouldn't wait on it |
| Snapshot of a 1 GB database | at most 60 s | ADR-0010 | chosen | runs after each session on a worker, and `./tower status` measures it |
| Full recompute of every projection over a year of log | at most 60 s | ADR-0020, ADR-0180 | chosen | a version change shouldn't keep the report stale for long; play goes on in shadow tables |
| Knowledge-model full recompute over a year | at most 10 s | ADR-0060 | chosen, stricter than the row above | the model is one part of that rebuild |
| Report rebuild after an adventure | at most 5 s | ADR-0180 | chosen | the parent opens the report right after play |
| `verify --fast` | at most 3 minutes | this record | chosen | a longer loop stops being run after each step |
| Full verify on the Mac | at most 30 minutes | this record | chosen | a stage gate that takes longer is run less often |
| Adventure model spend | $1.5 an adventure | ADR-0100 | imposed by REQ-2702 | the owner's cost line (RES-2700) |
| Explanations | $0.3 and 20 live generations a game day | ADR-0100, ADR-0120 | imposed by REQ-2704 and REQ-2706 | the owner's cost line (RES-2700) |
| Explanation reserve for reuse solves | no new variant below $0.03 left in the day | ADR-0120 | chosen | stored variants can still be checked when the day's money runs low |
| Month of play | $60 on the play key | ADR-0100 | imposed by REQ-2718 and REQ-2720 | a cap above the daily caps that catches a runaway bug |
| Art run | $40 a run | ADR-0100, ADR-0170 | imposed by REQ-2708 | the owner's art budget (RES-2700) |
| Bake-off | $25 | ADR-0100 | imposed by REQ-2710 | the owner's bake-off budget (RES-2700) |
| Live art | $0.5 an adventure, off in the MVP | ADR-0100 | imposed by REQ-2712 | after the MVP only |
| `verify --live` | $10 a run on the offline key | this record | chosen | about 10 adventures of live calls, enough for the 95 % branch share |
| Draft-pad image | at most 512 KB, 1024 px on the long side | ADR-0020 | chosen | bounds the blob store per answer |
| `data/` on the Mac | notice at 20 GB, then every 10 GB | ADR-0010 | chosen | monthly snapshots never drain (REQ-2530) |
| Snapshot retention | newest 30 plus the first of each month | ADR-0010 | imposed by REQ-2530 | recovery points without a person pruning |
| `events` table | notice at 1 GB | ADR-0020 | chosen | the log never drains, by design |
| `node_snapshots` | notice at 2 million rows | ADR-0060 | chosen | earlier-version rows are kept on purpose |
| `graph_versions` | notice at 1,000 versions | ADR-0050 | chosen | that many edits suggest a script rewrites the file |
| `llm_log` bodies | kept 90 days; notice at 1 GB | ADR-0100 | chosen | the metadata row stays for the cost count |
| `explain_cache` | notice at 10,000 rows; retired rows drain after 30 days | ADR-0120 | chosen | at most 20 new rows a day |
| `frames` table | notice at 50,000 rows | ADR-0130 | chosen | every live frame is kept by requirement |
| Frame candidates | expire after 60 days; at most 1.5 times a structure's shortfall | ADR-0130 | chosen | the queue never holds more than the parent needs |
| Pool line candidates | at most 100 pending, each expiring after 30 days | ADR-0110 | chosen | keeps the parent's queue from being approved unread |
| Master reply | 1 to 12 lines of at most 280 characters | ADR-0110 | chosen | a scene the child reads in one breath |
| Story memory in a request | 7 session summaries, 200 facts, about 3,000 dynamic tokens | ADR-0110 | chosen | the size RES-2700 costed |
| Reward queue | notice at 40 entries | ADR-0140 | chosen | entries drain at 6 sessions, so 40 means the drain stopped |
| `text_blocked` log | at most 1,000 rows, oldest out | ADR-0160 | chosen | an operational log, not a record |
| Art variants waiting | notice at 400; unchosen variants drain 30 days after a choice | ADR-0170 | chosen | 400 is more than 2 full MVP catalogues |
| Story log in the DOM | latest 200 messages | ADR-0150 | chosen | a long day's log never slows the iPad |
| `corrections.css` and `divergences.json` | 30 entries each | ADR-0150 | chosen | a longer list means the port has become a separate design |
| Sound loudness | -20 LUFS integrated, -3 dBTP true peak | ADR-0150 | chosen | no sound starts loud |
| `artifacts/` and `tests/recordings/` | the last 20 reports; recordings unused for 30 days drop | this record | chosen | git and `verify --record` rebuild what is dropped |

Group 8's load time, bundle size and frames per second have no baseline yet; the specification step adds their rows here.

## How I will know it was realised

1. At stage 0, `npm run verify` in the `tools` container writes both report files, runs groups 1, 4 and 9, and names every other group as not required yet.
2. Making one template's answer wrong on one seed turns group 2 red, and the report names the template and the seed.
3. Deleting one recording makes the dependent check fail as `recording_missing`, with no network call made.
4. Adding `docs/decisions.md`, a `checkpoints` migration or a Dutch locale string file turns group 1 red.
5. The report's thresholds equal the values in `verify/baselines.json`, and each carries its source record.
6. `artifacts/handoff.md` exists after every run and lists the run's drafts, open questions, verify status and offline-key spend.
7. The epic of stage 0.1 doesn't pass `meow-method ready` before the owner has approved the review of stage 0.
8. At stage 0.3, `verify --live` reports the discard share, the branch readiness share and the Master's p95 wait within the $10 budget.
9. The stage 0.3 review records two weeks of play, a fast-guess share below 15 % and the parent's judgement, and the owner approves it before any backlog item starts.

## What this does not settle

- The content of each check another decision names, from template properties to gateway lint, belongs to that decision: ADR-0040, ADR-0060, ADR-0070, ADR-0100, ADR-0140 and ADR-0180.
- The answer queue that loses no answer offline belongs to ADR-0030; this record only checks it.
- The budgets of group 8, load time, bundle size and frames per second, aren't set by the research. The specification step sets them, and until then group 8 reports its measurements without failing.
- The full browser matrix and the tests of each backlog item come with the items, after the MVP.
- Which backlog item comes first is the family's choice at the stage 0.3 review, by the signals in RES-3000.
- The pure-measurement mode and the habit of hints before an answer stay open until the stage 0.3 review, as the ledger above says.
- How the Russian strings are stored and checked belongs to ADR-0160.

Amended by ADR-0210, ADR-0220, ADR-0230, ADR-0240, ADR-0260, ADR-0280, ADR-0290, ADR-0300, ADR-0310, ADR-0320, ADR-0330, ADR-0340 and ADR-0350, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0380, ADR-0390, ADR-0410, ADR-0420, ADR-0430, ADR-0440 and ADR-0450, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0460, approved on 2026-09-29, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended on 2026-10-10: this record no longer addresses 4 requirements that were superseded, because a decision cannot realise a requirement that is no longer in force: REQ-3700 (superseded by REQ-5076, which ADR-0210 addresses); REQ-3702 (superseded by REQ-5078, which ADR-0210 addresses); REQ-3704 (superseded by REQ-5080, which ADR-0210, ADR-0370 addresses); REQ-3706 (superseded by REQ-5736, which ADR-0280 addresses).
