---
id: SPC-0290
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-5800, REQ-5802, REQ-5804, REQ-5806, REQ-5808, REQ-5810, REQ-5812, REQ-5814, REQ-5816, REQ-5818, REQ-5820, REQ-5822, REQ-5824, REQ-5826, REQ-5828, REQ-5830, REQ-5832, REQ-5834, REQ-5836, REQ-5838, REQ-5840, REQ-5842, REQ-5844, REQ-6424, REQ-5848, REQ-5850, REQ-5852, REQ-5854, REQ-7148, REQ-5858, REQ-6426, REQ-5862, REQ-5864, REQ-5866, REQ-5868, REQ-5870, REQ-5872, REQ-5874, REQ-5876, REQ-5878, REQ-5880, REQ-7058, REQ-5884, REQ-5886, REQ-5888, REQ-5890, REQ-5892, REQ-5894, REQ-5896, REQ-5898]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Preparation toward the Cito M7 and E7 horizons: Cito blocks, tracked basic facts and the Volley, the bare-task share, the home scale and entered results

## Scope

This document covers how the game prepares the player for the Cito M7 and E7 tests without showing her a test. It covers the Cito facts file and its check, the horizons and the active horizon, the Cito block on every node and subtype, block readiness, the two value terms the Director gains, the basic facts and their states, the fact threshold, the «Залп» (Volley), the maths floor's order, the nodes ahead of school, the bare-task share, the home skill scale, the Parent Room's Cito panel and the report sections built on all of these, two parent settings, the multiplication sign and the Dutch bridge's switch, and the bridge's gate on the tested state. It is written at the level of files, commands, routes, events, projections and states.

It leaves out what other parts define. The rest of the value formula, the flow corridor, the three-day window, the stretch gate and the slot sources belong to SPC-0070, and the estimates, the tested states and the full recompute to SPC-0060. The graph file's other fields and its validator belong to SPC-0050, templates, rendering and answer checking to SPC-0040, and the attempt flow and the hint ladder to SPC-0080. The route contract, idempotency and the lease belong to SPC-0030, the event log and its projections to SPC-0020, the forbidden-word list, the text gate and the bridge's keywords to SPC-0160, and grants, the streak and shards to SPC-0140. The Parent Room's screens and the report's nine screens belong to SPC-0180, the day plan to SPC-0090, the verify groups and the build stages, the fact stage among them, to SPC-0190, and the Sources track to ADR-0300. The school snapshots, the goal-mapping panel and the timeline of results belong to ADR-0310, and the day a new system such as the Volley first opens to ADR-0330. The format hold belongs to ADR-0410, what reads a Cito result's category entries and what values they take to ADR-0420, and the Dutch probe letters to ADR-0430.

## Boundary

### Files and commands

| Surface | What it is |
| --- | --- |
| `content/cito.rules.json` | One entry per statement about Cito that the game's logic or report text depends on: `id`, `statement` in English, `url`, `quote`, `checkedOn`, `status` (`confirmed` or `unconfirmed`) and `usedBy`, the data keys and `parent.*` string keys resting on it. |
| `content/cito.horizons.json` | The default horizons: `cito:M7` on 2027-01-15 and `cito:E7` on 2027-05-15. |
| `content/facts.yaml` | Every basic fact once: `factId`, operands, node and subtype. |
| `content/director.v2.json` | The Director's weights, v1's plus `block_priority` 1.5 and `school_goal` 1.0. |
| `content/graph.yaml` | Gains `citoBlock`, 1 to 6 or `null`, on every node and subtype. |
| `content/scale.vN.json` | A home-scale version: the item difficulties of one refit. |
| `src/parent/scale/` | The home skill scale. |
| `tools/fit-scale.ts` | The owner's refit of the home scale. |
| `./meowtower cito-check` | Runs the Cito check from the command line. |
| `./meowtower graph check` | Reports the graph validator's result, `citoBlock` included. |

The content folder is read-only to the running game, so no route and no command of this part writes a file under `content/`.

### Routes

The routes follow SPC-0030's contract. Every `/api/parent/*` route needs the parent session and answers `401` without it. The paths are this document's choice, because ADR-0290 names the actions and not the paths.

| Route | What it does |
| --- | --- |
| `GET /api/parent/cito` | The Cito panel: horizons and the active one, entered results, Cito entries with their marks and last check, the pages the last check found changed, the fact threshold, the multiplication sign. The panel's school goals come from ADR-0310's `GET /api/parent/school/goals`, and its Dutch memo is the string `parent.cito.memo`. |
| `PUT /api/parent/cito/horizons/:horizon` | `{ date }` sets, adds or, with `null`, removes a horizon; logs `horizon_set`. |
| `POST /api/parent/cito/results` | `ExternalTestIn`; logs `external_test_recorded`. A correction names the result it replaces in `replaces`. |
| `POST /api/parent/cito/check` | Starts the Cito check; logs `cito_rule_checked` when it ends. |
| `POST /api/parent/school-goals/import` | The pasted goal list; logs `school_goals_imported`. Mounted only on the loopback listener. |
| `PUT /api/parent/fact-threshold` | `{ ms }`; logs `fact_threshold_set`. |
| `PUT /api/parent/settings` | SPC-0030's route; carries `notation.multiplicationSign` and `bridge.enabled`, and logs `settings_changed`. |

The import route and the route that serves the Cito panel's goal list mount only on ADR-0010's loopback listener `http://localhost:8080`. The same paths through the home network answer `404`, and a Cito panel opened on another device shows no goal list and offers no import.

On the player's side the Volley adds one packet kind to `GET /api/session/:id/next`, `volley`, which carries `volleyId` and its rows, each with an `itemId` and a rendered `view`. Each row's answer goes to `POST /api/session/:id/answer`, and its `AnswerOut` carries the row's mark, the correct answer after a miss, the miss line, and after the last row the on-target result and the record line. No player packet or reply carries a horizon, a date, a result, a school goal, a `factId`, a time or any Cito field (REQ-5812).

### Events this part logs

ADR-0290 owns all eight types, in the change that adds each schema.

| Event, v1 | Payload |
| --- | --- |
| `horizon_set` | `horizon`, `date`; a `date` of `null` removes the horizon |
| `external_test_recorded` | `resultId`, the fields of `ExternalTestIn`, the optional `categories` among them, `replaces` |
| `school_goals_imported` | `importId`, and each goal's `goalId` and text |
| `school_goal_mapped` | `goalKey` from `src/engine/school/keys.ts`, `nodes`, `source` (`catalogue` or `parent`), `confirmed` |
| `cito_rule_checked` | `runId`, `startedBy`, each page's URL, `read` and SHA-256 text hash, each entry's `quoteFound` |
| `volley_started` | `volleyId`, the floor, the `factId` list |
| `volley_completed` | `volleyId`, hits, misses, rapid guesses, `onTarget`, `perfect` |
| `fact_threshold_set` | the new value in ms, the threshold version |

`item_shown` gains `factId`, `format` and `volleyId` in a new payload version with an upcaster.

### Projections

| Projection | What it holds |
| --- | --- |
| `cito_rules` | Each entry's mark, from the file's `status` and the latest `cito_rule_checked`. |
| `horizons` | The horizons after defaults and `horizon_set`, the entered results that no later result replaces, and the active horizon. It is the projection of Cito results the Director reads, and it holds every field of a result except `categories`. |
| `fact_states` | One row per fact of `content/facts.yaml`, 308 rows, with its state, last 3 shows, next due game day and review interval. |
| `cito_blocks` | Per block, its members' share fluent or stable, the facts' share automatic for blocks 1 and 2, and whether it is ready. |
| `volley_record` | The highest day's count of facts on target. |

### States and their audience

| State | What happens next | Audience |
| --- | --- | --- |
| `cito_page_unreadable` | The check lists the page as not read and leaves its entries' marks as they were; a later run reads it again. | the parent, in the check's result |
| `cito_rule_unconfirmed` | The report shows «не подтверждено» (unconfirmed) beside every text resting on the entry until a person updates the file. | the parent |
| `cito_rules_stale` | The Summary shows one line once a school year until a check runs. | the parent |
| `horizon_overdue` | The Summary shows one line asking for the result or a new date; the Director keeps the horizon. | the parent |
| `goal_import_too_long` | The import refuses the list and says how many goals it read. | the parent |
| `fact_threshold_refused` | A value outside 1.5 s to 6 s isn't saved, and the field names the accepted range. | the parent |
| `graph_block_invalid`, `fact_list_invalid` | The validator fails the build, naming the node, subtype or fact. | the owner |
| `scale_refit_rejected` | The refit fails its acceptance test or doesn't converge; the active scale version stays. | the owner |
| `volley_interrupted` | The resume reopens the same Volley at its first unanswered row, which comes back as the same first attempt; that row's answer counts for accuracy and its time counts in no measure. | the player, who sees the Volley resume |

### What this part requires from other parts

- SPC-0020 supplies `appendEvents`, the projection rebuild and the event schemas.
- SPC-0060 supplies the tested states, the motor correction per device type, the threshold versions and the full recompute.
- SPC-0070 supplies the value formula this part extends, the candidate set, the flow share and the repeat window.
- SPC-0040 supplies the item builder, the renderer and the answer parser; SPC-0160 the forbidden-word list, the text gate and `ru.json`.
- SPC-0140 supplies the yarn grant; ADR-0310 the goal-mapping panel and its catalogue; ADR-0330 the day the Volley opens.
- ADR-0410 supplies the format hold; ADR-0420 the values of a category entry and the fold that reads `categories`; ADR-0430 the Dutch probe letters, after the MVP.
- ADR-0190's Baselines table holds this part's budgets: the per-node model update of 50 ms, the answer reply of 300 ms, the report rebuild of 5 s, the Cito check within 60 s and the scale refit within 10 minutes.

The permitted dependencies run one way. No module under `src/engine/` imports `src/parent/scale/`, and a lint rule fails the build when one does. The Director reads `fact_states`, `cito_blocks`, `horizons` and `school_goal_mapped`, and nothing else of this part. The Cito check reads only `content/cito.rules.json` and the pages it names, writes only `cito_rule_checked`, and calls no model. The home scale reads only the log and `content/scale.vN.json`. Player routes import no schema that holds a horizon, result, goal or Cito field. Of this part, only the results form's module reads the `categories` field of `external_test_recorded`, and ADR-0420's group 1 check `cito_categories_scope` fails the build when another module of this part reads it.

## Behaviour

### Cito facts and the check

Each statement about Cito that the game's logic or report text depends on is one entry in `content/cito.rules.json` (REQ-5800). A zod schema refuses a `confirmed` entry without a `url`, a `quote` and a `checkedOn` date. The file starts with twelve entries: the ten claims RES-4080 confirms, each with its quotation and the date 2026-09-28, and two `unconfirmed` ones, the parent's access to the bare-versus-context split and Cito's multiplication sign (REQ-5808).

The `cito_rules` projection gives an entry the mark «не подтверждено» when the file says `unconfirmed` or the latest check read its page and didn't find its quotation (REQ-5802). A page the check couldn't read leaves the mark as it was. Every report text whose key an entry's `usedBy` lists shows that mark beside the text (REQ-5804).

The Parent Room's button «Проверить сведения Cito» (Check the Cito facts) and `./meowtower cito-check` run one function (REQ-5806). The function fetches each distinct URL in the file with a plain GET, a timeout of 10 s each and no query, cookie or player data. It reads a PDF through the local text reader the school-snapshot parser uses, normalises white space, and searches each entry's quotation. It compares each page's text hash with the hash the previous `cito_rule_checked` recorded for that URL, and its result and the Cito panel list each page whose hash changed, whether or not its quotations are still there. It writes one `cito_rule_checked` event and does nothing else: it never edits the file, never rewrites a rule, never renders or runs a page and never passes page text to a model. A person updates the file with a new quotation and date in a commit. The button stays inactive while a run is in progress and for 10 minutes after it, and a run finishes within 60 s. When the last check is more than 365 days old, the Summary shows `cito_rules_stale` once a school year.

### Horizons

A horizon is a Cito test moment with a date. Its identifier matches `^cito:[BME][3-8]$`, and every record, data file and screen names a test moment only through that identifier or the formatter that prints «Cito M7» (REQ-5818). The moment-identifier check in ADR-0190's group 1 fails on a moment named `M7` alone.

The horizons start as `cito:M7` on 2027-01-15 and `cito:E7` on 2027-05-15 with no event, and the parent changes a date, adds a horizon or removes one in the Cito panel, which logs `horizon_set` (REQ-5814). The active horizon is the earliest horizon with no entered result. A result entered for a horizon's moment, in any subject, ends that horizon, and the Director works toward the next one; with no horizon left, block priority is 0 until the parent sets a new one (REQ-5816). A date that passes without a result doesn't end the horizon. 45 days after the date, the Summary shows `horizon_overdue` once for that horizon.

### What the player never sees

The player sees no copy of a Cito item, no task laid out as one and no mock test (REQ-5810). Every task comes from a template tied to a node, and no template, string or data file quotes a Cito item. A group 1 check fails on the words "Cito", "LVS" or "Leerling in beeld" in `src/templates/`, `content/probe/`, `tools/probe/`, `src/shared/events.ts` or any player string, and the parent judges the layouts.

No player screen shows a test's date, the name Cito or a word naming a test (REQ-5812). The forbidden-word list holds «тест» (test), «контрольная» (test paper), «экзамен» (exam), «Cito» and «Цито» for every player text, and the text gate refuses a line holding one. The API schema test finds no horizon, result, goal or Cito field in any player response, and an end-to-end scan of the player's screens finds no test word and no horizon date.

### Cito blocks and readiness

Every node and every subtype in `content/graph.yaml` carries `citoBlock`, an integer from 1 to 6 or `null`, and every S node, stretch node and track node carries `null` (REQ-5820). The blocks are 1 the basic operations, 2 the times tables and division, 3 fractions, decimals, percentages and ratios, 4 measures, 5 geometry and 6 word problems. A node's own value is one of its subtypes' values, and the report groups the node under it. The validator refuses a missing field, a value outside the range, a non-null value on an S, stretch or track node, or a node value none of its subtypes carries, with `graph_block_invalid`.

A block's members are the pairs of node and subtype whose subtype carries that block. The `cito_blocks` projection counts a block ready when at least 80 % of its members belong to nodes whose tested state is «Бегло» (fluent) or «Устойчиво» (stable), and, for blocks 1 and 2, at least 90 % of their facts are «автоматизм» (automatic) (REQ-5830). The count is unweighted and reads tested states only. Volley facts count toward it like any other observation.

### Two value terms

The Director's value of a node is:

```text
value(v) = 2.0 * uncertainty(v) + 1.5 * staleness(v) + 1.5 * frontier(v)
         + 1.5 * escalation(v) + 1.0 * stretch(v) + 1.5 * spaced_review(v)
         + 1.5 * block_priority(v)
         + max(2.0 * recheck(v), 1.5 * parent_topic(v), 1.0 * school_goal(v))
         - 1.0 * recent_shows(v)
```

`block_priority(v)` is `(7 - b) / 6`, where `b` is the node's own `citoBlock`. It is 0 when that block is ready, the node's `citoBlock` is `null`, or no horizon is active (REQ-5822). `school_goal(v)` is 1 when a goal the parent entered reaches the node through a link the parent confirmed in `school_goal_mapped`, and 0 for an unconfirmed link or a goal from a school snapshot (REQ-5824). A node reached by a confirmed goal and a fresh lesson mark scores the larger of the two terms, never both (REQ-5826). The weights live in `content/director.v2.json`.

Neither term reads the expected chance of success. The flow share still decides only between frontier and review, and the three-day window and the stretch cap of 2 tasks a day stay as SPC-0070 states them. A 60-day simulation in ADR-0190's group 3 runs both terms on every profile and asserts the corridor, the window, the stretch cap and the honest-difficulty property (REQ-5828).

A parent import holds at most 200 goals, and a new import replaces the previous parent-entered list. ADR-0310 states how a goal maps to nodes.

### Nodes ahead of school

A 1S node up to the end of group 8 opens for tasks as soon as its prerequisites are ready, whatever the school has reached (REQ-5872). Neither the school-group setting, a school goal nor a school snapshot gates the candidate set; the school group moves only the priors. A property test holds a state fixed, changes the school-group setting and finds the same candidate set. Stretch nodes keep their gate, which SPC-0070 states. A player who meets a new topic first in a task gets its short solution and no lesson.

### Basic facts and their states

`content/facts.yaml` lists 308 basic facts, 200 in block 2 and 108 in block 1 (REQ-5832). They are the times tables 1 to 10 and their divisions, the additions of two digits from 2 to 9 across ten with their subtractions, and a digit from 1 to 9 times 10, 100 or 1000 with its division where the table doesn't already hold it. A `factId` reads as `mul:7x8`, `div:56/8`, `add:8+5` or `sub:13-5`. The validator refuses a fact whose node or subtype is missing from the graph or carries a block other than 1 or 2, with `fact_list_invalid`. The file's hash is part of the graph version, so a new fact list is a full recompute.

The item builder sets `factId` on `item_shown` when the task is bare, has one step and its operands form a fact in the file, whether it is a Volley row, mental arithmetic, a control fact or a room task. A show of a fact is an unassisted first attempt with a `factId`, not a rapid guess and not excluded. Its time runs from the fact's show to its submission, and an `interrupted` show counts for accuracy with no time.

The `fact_states` projection gives each fact one state over its last 3 shows (REQ-5832):

| State | Rule |
| --- | --- |
| «автоматизм» (automatic) | right and no slower than the fact threshold on 2 of the 3, the last of them within the past 14 days (REQ-5834) |
| «вычисляет» (computes) | not automatic, and right on at least 2 of the 3 |
| «не знает» (doesn't know) | everything else, a fact shown fewer than 2 times included |

### The fact threshold

The fact threshold is 3 s plus the motor correction of the device type in use, measured from the fact's show to its submission (REQ-5836). It is a threshold of its own; node fluency reads the catalogue thresholds. The parent changes the 3 s in the Cito panel to a value from 1.5 s to 6 s. The change logs `fact_threshold_set`, the `thresholds` projection makes it a new threshold version, and the full recompute replays every fact under it (REQ-5838). A value outside the range is refused with `fact_threshold_refused`.

### Minimum time, repeats and the review schedule

The minimum time of every fact in the file and of every control fact is the motor correction plus 600 ms, so `mul:7x100` answered 1 ms faster than that is a rapid guess and 1 ms slower isn't (REQ-5840). The repeat window exempts every item with a `factId` and every control fact, while every other generated task keeps the window of 30 days or 20 % of its subtype's parameter space, whichever ends first (REQ-5842).

A fact returns on the next game day after a wrong answer or one slower than the fact threshold, and that answer restarts its ladder at 1 day, so the next answer right and within the threshold waits 1 day (REQ-6426). After an answer right and within the threshold, the fact returns after the next interval of 1, 3, 7 and 14 days, and every 14 days after that (REQ-6426).

### The Volley

The Volley is a form of mental arithmetic. It shows 8 to 10 facts in one task window, one row a fact, answered on one keypad without leaving the window (REQ-5844). It holds 10 facts whenever the first three steps below find at least 10, and never fewer than 8. The Director picks its facts from blocks 1 and 2 in this order:

1. Three places go to facts that aren't automatic, or to every such fact when fewer than 3 exist. A Volley holds more than 3 such facts only when too few automatic facts exist to fill its other places (REQ-6424). Due facts come first, then «вычисляет» before «не знает», then the lower block number, with ties broken by the adventure's seed.
2. The other places go to automatic facts, as far as they reach: those due by the review schedule first, then those with the oldest last show.
3. The places automatic facts can't fill go to facts in «вычисляет», then to facts never shown, in the file's order.
4. While the Volley holds fewer than 8 facts, the places up to 8 go to any other fact of blocks 1 and 2, the least recently shown first.

The seed sets the order of the rows, with no two facts that aren't automatic side by side where the mix allows it, and as few such pairs as it allows otherwise. `volley_started` records the list.

Each row runs `open`, `first_answered` and `closed` in the Volley's window. The player types the answer and presses «Готово» (Done); the reply marks the row and, after a miss, shows the correct answer at once, and the next row opens. A row offers no hint ladder, no twin and no detailed explanation. «Не знаю» (I don't know) stays on the keypad and counts as a miss. The window shows no time, no timer and no speed.

A row hits when it is right and not a rapid guess, and misses otherwise. A Volley is on target when at most one row misses, and an on-target Volley gives 1 star yarn, whatever its times (REQ-5848). A rapid guess counts as a miss toward the on-target result and adds nothing to the day's count (REQ-5850). A Volley with no miss is perfect and adds a spark to the scene's animation, with no extra reward. The Volley counts as 2 first attempts for the buttons, and its rows move neither the streak nor the clean-attempt shards. `volley_completed` records the result.

The day's count is the distinct facts hit across the day's Volleys, so a fact hit in two Volleys on one day counts once, and the record in `volley_record` is the highest day's count ever. The record never falls after a worse day or a wrong answer (REQ-5852). After a Volley the System shows it in one line from `ru.json`, with no time in it.

The reply to a missed row is a line from a pool of at least 20 fixed reply templates under `volley.miss.*` in `ru.json`. Every template names the fact through its fact placeholder, a joke about the Tangle or the System may follow the fact, and no template speaks about the player (REQ-5854). A content check fails a template without the fact placeholder. No line repeats twice in a row. The text gate refuses the forbidden list in them, «ошибка» (mistake), «неправильно» (wrong) and «промах» (miss) included, and the parent judges the rest.

Volley rows are observations of their node for the "on her own" estimate and for fluency. They never enter a full block of 5 observations or a probe. The flow corridor counts a Volley as one entry, scored by its share of hits.

### The floor and the Volley's share

Each maths floor runs in this order: an entry scene, an unscored warm-up, either 2 mental arithmetic tasks or one Volley, the Sources track's tasks on a floor that carries them, at most 2 Dutch probe letters on a floor that carries them, 1 or 2 rooms of trials, sometimes a Guardian, then the floor chest (REQ-7148). The Volley counts as mental arithmetic, so the day plan never trims it.

No floor carries a Dutch probe letter in the MVP. The letters come after the MVP, and only once the owner has amended the Russian-only rule of the principle `project_in_english` in `CLAUDE.md`; until then each floor runs the same order with no letters. ADR-0430 states which floors carry letters and how many a day.

A Volley takes the place of the mental arithmetic tasks only while blocks 1 and 2 hold a fact that isn't automatic. It does so on 2 floors in 3 while `cito:M7` is the active horizon, and on 1 floor in 2 after it (REQ-5858). The Director counts, across game days, the maths floors on which a Volley could run: floors from the day the Volley opened, while blocks 1 and 2 hold a fact that isn't automatic. The count starts when the active horizon last changed, or at the first such floor for a default horizon, which has no `horizon_set`. The Director gives a floor a Volley when:

```text
volleys_so_far < round_half_up(share * (floors_so_far + 1))
```

Here `floors_so_far` and `volleys_so_far` count the earlier counted floors and leave out the floor being planned, and `share` is 2/3 or 1/2. The Director never gives a Volley on more than 2 of any 3 consecutive maths floors (REQ-5858). At 2/3 the first six floors run Volley, mental arithmetic, Volley, Volley, mental arithmetic, Volley. Once every fact of blocks 1 and 2 is automatic, every floor keeps its 2 mental arithmetic tasks. ADR-0330 states the day of play on which the Volley first opens.

### The bare-task share

Every template declares `format: "bare"`, an expression with no story in the task window, or `format: "context"`, and the template schema refuses a template without it (REQ-5862). Mental arithmetic, the Volley and control facts are bare. `item_shown` records `format`.

A subtype under ADR-0410's format hold takes a bare template whatever the count. Otherwise, in a node with templates of both formats, while the node's bare scored tasks of the last 30 days number no more than its context ones, the Director chooses among the node's subtypes that have a bare template, and the item builder takes a bare template (REQ-5864). A chosen subtype with templates of one format takes that format, and the count spans the whole node. The 60-day simulation asserts at least half bare tasks on every node with both formats.

### The home skill scale

The home scale is a Rasch model over the log, a projection that feeds no estimate, state, obligation or choice of the knowledge model or the Director (REQ-5876). It gives each template and difficulty feature an item difficulty `b` from the feature formula, or from the active `content/scale.vN.json`. It estimates θ for each domain and overall by expected a posteriori over the unassisted first attempts of the last 30 days, with a standard normal prior on 41 quadrature points. A domain with fewer than 20 such attempts shows «мало данных» (too little data).

The report labels the scale «домашняя шкала — не балл Cito» (home scale, not a Cito score), and that label rests on the Cito entry for OPLM, so an unconfirmed mark on the entry shows beside it (REQ-5878). The scale shows the weekly θ with rough ticks at the mean `b` of the templates of each typical group, and lists the entered Cito results beside it with no conversion between the two.

The owner runs `tools/fit-scale.ts` after 4 to 6 weeks; nothing runs it by itself. The refit estimates one θ per player-week, tied by a random-walk prior, shrinks each `b` towards its feature formula, and writes `content/scale.vN.json` within 10 minutes. The owner activates a version only after it passes the refit test in ADR-0190's group 3: on simulated pupils whose ability grows during the simulation, the refit recovers the true item difficulties within a root mean square error of 0.3 logits and each pupil's true ability gain within 25 % (REQ-5880).

### The Cito panel and entered results

The Parent Room's Cito panel holds the horizons, the results form, the school goals, the Cito entries with their check button, the Dutch memo, the fact threshold and the multiplication sign.

The results form's fields are the test moment, the test taken and its level, the vaardigheidsscore, the functioneringsniveau with "<" and ">" allowed, the referentieniveau, the level with its scale of I to V or A to E, the subject, an optional split between bare and context items, an optional expected test advice, an optional list of category entries and a note (REQ-7058). The list holds at most 16 entries, each with the category, the signal and the deviation in per cent where the printout shows it; a category or a signal the list doesn't offer is typed, as `typedCategory` or `typedSignal`, and `deviationPercent` is `null` where the printout shows none. ADR-0420 states the listed values and the limits of each field. The form saves a result with every field empty except the moment and the subject (REQ-5884). A correction logs a new `external_test_recorded` whose `replaces` names the earlier result, and its category list replaces the earlier list whole. The form opens a correction with the earlier result's list for editing. In the MVP nothing else of the game reads the category list but the whole-log export.

The Dutch memo is a fixed text under `parent.cito.memo` in `ru.json`, in Dutch with a Russian gloss. It lists what the parent can ask the school for: the level of the test taken, the expert view of the group report and the split between bare and context items (REQ-5886). After the MVP the list also names the category analysis and the test conditions, as ADR-0420 states.

### Report sections

The report places five sections inside the nine screens SPC-0180 states, as a view at the level of the report's screens:

| Section | Screen | What it shows |
| --- | --- | --- |
| Cito preparation | VWO readiness | The active horizon and its date; per block and per week, the share of members fluent or stable and, for blocks 1 and 2, the share of facts automatic, beside whether the block is ready (REQ-5890); accuracy and fluency by format (REQ-5866); the home scale and the entered results; the Cito entries with their marks. |
| Careless errors | VWO readiness | Per week and per error class, the share of wrong first attempts on nodes fluent or stable and on facts automatic at that moment, with its count (REQ-5868). |
| Beyond school | VWO readiness | The nodes fluent or stable whose typical group is later than the school group the parent set (REQ-5874). |
| Fact report | Graph map, under domain A | A 10 x 10 heat map of the multiplication facts and one of the division facts, each cell in its fact's state (REQ-5888); a printable list of the facts that aren't automatic, grouped by operation in the file's order, with no topic order and no dates (REQ-5892). |
| Bare and context | Node card | Accuracy and fluency of the node's bare and context tasks apart (REQ-5866). |

The Summary raises «небрежные ошибки на знакомом» (careless errors on familiar material) for a week whose share of wrong first attempts on fluent, stable or automatic material, all error classes together, is above 10 %, at most once a week (REQ-5870). The line shows the count beside the share, such as 1 of 4. The weekly values come from replaying the projections to each week's end. The printable list prints through the browser's print with a print stylesheet.

### The multiplication sign

`notation.multiplicationSign` is a parent setting, «×» by default or «·», changed through `settings_changed` (REQ-5898). The renderer reads it at render time for task text, short solutions, hint rungs and explanation placeholders rendered in Russian. Division stays «:» and the decimal comma stays. `item_shown` stores the rendered view, so the node card shows what she saw, and the answer parser accepts either sign.

### The Dutch bridge's two gates

A bridge word shows only in a task of a node whose tested state, computed without the `bridge` stream, is «Понимает» (understands) or higher (REQ-5894). When `bridge.enabled` is off, rendering shows no bridge word, no bridge card, no mixed task and no bridge part of the Diary's dictionary (REQ-5896). The switch acts at render time. A task shown before the switch keeps its stored view in the log, and when it resumes after the parent turns the bridge off, the renderer renders it again from its seed with the same numbers and no bridge word; its `item_shown.forms` keeps `bridge`. SPC-0160 states the bridge's words, their approval and their share.

## Failure paths

| Condition | What happens |
| --- | --- |
| A Cito page can't be read or times out after 10 s | `cito_page_unreadable`: the check lists it as not read, leaves its entries' marks, and still writes its one event. |
| A page is read and an entry's quotation is missing | The entry gets «не подтверждено», and every text in its `usedBy` shows the mark until a person updates the file. |
| The check button is pressed during a run or within 10 minutes after one | The button is inactive; nothing runs. |
| A `confirmed` entry lacks its URL, quotation or date | The schema refuses the file and the build fails. |
| A horizon's date passes with no result | The horizon stays active; after 45 days `horizon_overdue` shows once. |
| No horizon is left | Block priority is 0 until the parent sets one. |
| A moment is named without the `cito:` prefix | The moment-identifier check fails the build. |
| A player string or template holds a test word or a Cito name | The text gate or the group 1 check refuses it. |
| A node, subtype or fact breaks the block rules | `graph_block_invalid` or `fact_list_invalid` fails the build, naming it. |
| `content/facts.yaml` is absent | No fact state exists, and every floor keeps its 2 mental arithmetic tasks. |
| Every `citoBlock` is `null` | Block priority is 0 and the Director runs on its other terms. |
| A school goal has no confirmed link, or comes from a snapshot | `school_goal` is 0. |
| A Cito result sends more than 16 category entries, or a typed field over 80 characters | ADR-0420's `category_list_too_long`: the form refuses the save, names the limit and keeps what was typed. |
| A goal list holds more than 200 goals | `goal_import_too_long`: the list is refused with the count read. |
| The parent enters a fact threshold outside 1.5 s to 6 s | `fact_threshold_refused`: nothing is saved, and the field names the range. |
| A Volley row is answered faster than its minimum time | The row is a rapid guess and counts as a miss toward the on-target result, and it adds nothing to the day's count. |
| The player leaves mid-Volley | `volley_interrupted`: the resume reopens the Volley at its first unanswered row as the same first attempt; that row's answer counts for accuracy and its time counts in no measure. |
| A subtype is under the format hold | The item builder takes a bare template, whatever the node's bare and context counts. |
| A node's subtype has templates of one format only | The item builder takes that format for the subtype; while the node's bare count doesn't exceed its context count, the Director chooses among subtypes with a bare template. |
| Steps 1 to 3 of the Volley's pick find fewer than 8 facts | Step 4 fills the Volley to 8 with other facts of blocks 1 and 2, the least recently shown first. |
| A goal-list route is called through the home network | It answers `404`; the route serves only the loopback listener. |
| A scale refit fails its acceptance test or doesn't converge | `scale_refit_rejected`: the active scale version stays; with no refit the scale runs on the feature formula. |
| A domain has fewer than 20 unassisted first attempts in 30 days | The scale shows «мало данных» for it. |
| An engine module imports `src/parent/scale/` | The lint rule fails the build. |
| The bridge is switched off | Rendering drops every bridge element; stored views of earlier tasks stay in the log, and a resumed task renders again from its seed without bridge words. |

## Open findings

- ADR-0290 and ADR-0360 item 76 key `school_goal_mapped` by the `goalKey` of `src/engine/school/keys.ts`, and this part's goal import, the Cito panel's goal list and REQ-5824's `school_goal` term are in the MVP. ADR-0310, as SPC-0190's scope guard applies it, keeps `src/engine/school/` and the goal-mapping panel out of the tree until the MVP ends. The two decisions contradict each other on whether entered goals can be keyed and mapped in the MVP. The owner decides between two ways: the import, the mapping and `school_goal` wait for ADR-0310's part, with `school_goal` at 0 in the MVP, or the key function and the panel for entered goals ship in the MVP with an exemption in the scope guard.
- ADR-0430 extends ADR-0290's group 1 check on the words "Cito", "LVS" and "Leerling in beeld" to `src/shared/events.ts`, and its test 13 fails a build with "Cito" in an event schema value. ADR-0290 puts this part's own schemas in that file, `cito_rule_checked` among them, and SPC-0020 keeps every event schema there. The two decisions contradict each other on whether this part's own event names and Cito fields pass the check; the owner decides whether the match is case-sensitive, whole-word or exempts the schemas ADR-0290 owns.

## Open review findings

- Agent review of addendum 2, round 1: rename `school_goal_mapped`'s field `source` to `proposedBy`, because other events use `source` for other values. Rejected: ADR-0290's Consequences name the field `source` with the values `catalogue` and `parent`, and a rename is a change to that decision.
- Agent review of addendum 2, round 1, preference: point to ADR-0300, ADR-0310, ADR-0410 and ADR-0430 in place of ADR-0300, ADR-0310, ADR-0410 and ADR-0430. Rejected: this document cites only lower-numbered specifications and names a higher-numbered subject by its decision.
- Agent review of addendum 2, round 2: "while `cito:M7` is the active horizon" drops the Volley share to 1/2 before M7 once the parent adds an earlier horizon, and it doesn't say which share applies once M7 is removed. Open: the text is ADR-0290's, and REQ-5858 says "before the M7 horizon"; the owner decides the reading.
- Agent review of addendum 2, round 2: the bare-task count doesn't say whether Volley rows, mental arithmetic and control facts count toward a node's bare scored tasks. Open: ADR-0290 and ADR-0360 item 65 don't say, and the choice changes which tasks the Director picks.
- Agent review of addendum 2, round 2, preference: say whether a `horizon_set` that only moves the active horizon's date restarts the Volley count. Open: ADR-0290 doesn't say.
- Agent review of addendum 2, round 2, preference: step 3 of the Volley's pick skips shown «не знает» facts, which only step 4 admits. Open: the order is ADR-0290's, and whether it is intended is the owner's call.
- Agent review of addendum 2, round 2, preference: REQ-6426 requires each interval to be longer than the one before, while a restart after a wrong answer waits 1 day again. Open: a wording gap in the requirement, which this document can't amend.
- Agent review of addendum 2, round 2, preference: use one path prefix for the goal routes, `/api/parent/school/goals/import` in place of `/api/parent/school-goals/import`. Open: the path is this document's choice, and ADR-0310 depends on it, so the rename waits for both documents to change together.

- Agent review, round 1: carry ADR-0290's reasons into the sentences for the 10 s timeout, the 10-minute cooldown, the 45 days, the 200-goal cap, the 1.5 s to 6 s range, the Volley's 10 facts and floor of 8, the spacing of weak facts, the 2 first attempts, the one corridor entry, the count across days, the 41 quadrature points and the 20 attempts. Rejected: a specification states what the system does and never why (spec rule S8), and each reason stays in ADR-0290.
- Agent review, round 2, preference: remove or change the comment under the front matter, because this document gives no reasons. Rejected: every record in the repository carries the same comment naming the writing standard, and changing it is a change to the record template, outside this document.
- Agent review, round 2, preference: carry ADR-0290's reasons for the numbers into the body. Rejected under spec rule S8, as in round 1.
