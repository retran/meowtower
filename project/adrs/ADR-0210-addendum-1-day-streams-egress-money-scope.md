---
id: ADR-0210
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5000, REQ-5002, REQ-5004, REQ-5006, REQ-5008, REQ-5010, REQ-5012, REQ-5014, REQ-5016, REQ-5018, REQ-5020, REQ-5022, REQ-5024, REQ-5026, REQ-5028, REQ-5030, REQ-5032, REQ-5034, REQ-5036, REQ-5038, REQ-5040, REQ-5042, REQ-5044, REQ-5046, REQ-5048, REQ-5050, REQ-5052, REQ-5054, REQ-5056, REQ-5058, REQ-5060, REQ-5062, REQ-5064, REQ-5066, REQ-5068, REQ-5070, REQ-5072, REQ-5074, REQ-5076, REQ-5078, REQ-5080, REQ-5082, REQ-5084, REQ-5086, REQ-5088, REQ-5090, REQ-5092, REQ-5094, REQ-5096, REQ-5098]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0210. The game day stays an unseen 04:00 boundary, screens without tasks open whenever the task window is closed, new forms write streams outside "on her own", only a masked riddle joins what leaves the Mac, the sandbox spends from the offline key, and a fact stage lets the player play before the MVP

## Decision

This decision carries the rules of the owner's addendum 1 of 2026-09-28 that hold for every item, as RES-4000 settled them. It owns seven things: the game day, the screens without tasks, the streams of new forms, what leaves the Mac, the money on the two keys, the owner of every new event type, and the MVP scope with the Dutch bridge and the stage order. Each of the addendum's items gets a decision of its own, built from its research record: ADR-0220 from RES-4010 through ADR-0340 from RES-4130, one number for each. Those decisions cite this one for the rules below and never restate them. This record is written for the owner, who evaluates it, and for the building agent, who works under it. Where I chose a default the research left open, the sentence says "I chose".

### The game day is a service boundary at 04:00 that nothing she sees names

A game day still ends at 04:00 in the time zone of the device she plays on (REQ-5000). ADR-0090 keeps its rule for a changed zone, which takes effect at the next 04:00 of the old zone. The hour is a service value only: no screen, line, number or string she can reach names it (REQ-5002). The story tells the change of day as «Башня перевязалась за ночь» (The Tower re-knitted itself overnight) (REQ-5006). That line is the first line of «В прошлый раз…» (Last time…) on the first adventure of every game day except her first. It comes from ADR-0110's line pool under the key `story.day_turn`, and the parent judges its wording at stage acceptance.

One module, `src/engine/day/`, holds the only function that turns a time into a game day, `gameDayOf(ts, zone)`. Every daily job reads the game-day index it returns and never an hour. A lint rule refuses `getHours`, `getUTCHours`, `Intl.DateTimeFormat` with an `hour` option and `Temporal` hour fields in the engine, the server's job code and the player's client code, outside that module and the task renderer of ADR-0040, which prints times inside timetable tasks. The Parent Room's code stays outside the rule, because ADR-0180 shows the parent when the report was updated and no daily job runs there. A job then can't open or close by the time of day without failing the build (REQ-5010), because the rule must hold every time (D2). At the change of game day the server runs every daily job REQ-5008 lists: the morning's guiding threads, the daily quests and daily rewards, the shop's new slots, the reset of the explanation budget, the end of a pause of live frames, the count of adventure days for the three-day rule, the end of «Закончить на сегодня» (Finish for today), the end of the frontier cap after a second anxiety signal, the end of the lowered creepiness level and the soft stop's daily reset. Each job keeps the owner that already defines it: ADR-0080, ADR-0090, ADR-0100, ADR-0110, ADR-0130, ADR-0140 and SPC-0030.

The server starts at most one new adventure in a game day (REQ-5004). It refuses to log `adventure_planned` when the log already holds an `adventure_planned` event for the same game day. Session 0 counts as that day's adventure, as ADR-0090 already says. After the day's finale she stays in the Tower with the screens without tasks for as long as she likes, and the next adventure is planned at the first server contact of the next game day.

Once they first appear, daily quests and daily rewards come on every game day on which she plays (REQ-5018). ADR-0330's schedule of one new system a day may set the day they first appear, and nothing may switch them off afterwards. Nothing counts consecutive days or punishes a gap, as ADR-0140's day count already ensures. The choice of two routes of the day adds to the three daily quests and never takes a quest's place (REQ-5020).

### Screens without tasks open whenever the task window is closed

Whenever the task window of ADR-0080 is closed, during an adventure too, the client offers the heroine's room, the Diary, the forge, the shop, the familiars, the puzzle branch «Петельки Смотрителя» (the Keeper's Loops) and «Свободное перо» (Free Pen) (REQ-5012). The task window is open from the moment a task is shown until the player taps to leave its review, the states `open` to `twin_review` of ADR-0080. During that span the entries are hidden, so leaving a task half-answered for the shop can't happen. Leaving to one of these screens during an adventure holds the adventure at its current slot. Her way back puts her in the scene or task she left.

A puzzle she already has is open at any moment the task window is closed, so at a rest stop during an adventure and after the finale. Opening a puzzle or any other screen without tasks from a rest stop ends the rest stop, and ADR-0090's 10-minute wait on «Привал» starts then. I chose this, because the campfire scene ends by itself after 5 minutes and would otherwise close under an open puzzle. ADR-0280 logs `puzzle_offered`, and the server writes that event only after the day's `adventure_completed`, so a new puzzle appears only after the finale (REQ-5014).

Time on a screen without tasks counts in the day's active time and in the eye count, whenever she spends it, a puzzle opened at a rest stop included (REQ-5016). The rest stop has ended by then, so ADR-0090's rule that rest stops don't count for the eyes still holds for the campfire scene itself. Every moment on those screens is a boundary, so a due eye exercise plays at once there, as ADR-0090 already does after the finale. A due soft stop waits until she returns to the adventure, and I chose this because the soft stop offers to save the adventure, which means nothing while she is in the shop. ADR-0330 closes «Свободное перо» through a story scene when the soft-stop point passes inside it, which is that decision's own rule.

An adventure day for the three-day rule is a game day on which a task or a scene of that adventure was shown. I chose this over "active time in the adventure", because a visit to the shop during an unfinished adventure moves it no step and would otherwise use up one of its three days.

The screen check of ADR-0090 walks every player screen and still fails on any text matching a clock, a countdown or a minute count, but skips every element inside a task's content, the subtree the renderer marks `data-task-content` (REQ-5022). A timetable task or a clock face to read then passes, while a display of her own current or elapsed time anywhere else still fails. A second Playwright case renders one timetable task from the Sources track and one clock-reading task and asserts that the check passes on them and fails on the same text placed outside the subtree.

### New forms write streams of their own, which stay out of "on her own"

Every form of task the addendum adds writes its observations to a stream of its own (REQ-5024). The stream names are `compose`, `estimate`, `grouping`, `plan`, `bridge`, `surplus` and `missing`, and each item's decision adds its own. The word-problem subtypes with a surplus or a missing number are new forms and write `surplus` or `missing` (REQ-5028). `item_shown` gains the field `forms`, the list of new forms the shown task uses. An ordinary task has an empty list, and a surplus task with Dutch keywords has `["surplus", "bridge"]`. The engine fills `forms` from the template and the Director's choices when it shows the task, so the log alone says which streams an attempt feeds. The estimate is the one exception: an item with an estimate keeps `forms` empty, because its exact answer is an ordinary first attempt and still counts in "on her own". The `estimate` stream reads the field `estimate` of `attempt_submitted` and never `forms`, as ADR-0240 sets.

ADR-0060's observation rule gains one more reason to drop an attempt from the "on her own" estimate: its task's `forms` holds a form that the active model version doesn't admit. The model's parameter file gains `admittedForms`, which is empty in model v1. A form enters that list only through ADR-0060's activation rule, when a model version that admits it predicts held-out unassisted first attempts with lower log-loss and lower calibration error than the active version (REQ-5026). The refit tool is deferred until after the MVP, so no new stream enters the estimate before the MVP is accepted. Each stream keeps its own projection, which the report may read and the Director may read for placement, and which never changes a node's "on her own" state.

### Every new model job runs under a role of its own, with its output checked

The addendum adds four model jobs, and each runs under a role of its own in ADR-0100's gateway (REQ-5030):

| Role | Job | Tier and key | Request class | Default model | Budget |
| --- | --- | --- | --- | --- | --- |
| `PARSE_MODEL` | parse a composed riddle into a graph | player tier, zero retention, play key | `ParseRequest`, new | the model `LIVE_CHECK_MODEL` uses | parse, $0.1 a game day |
| `FRAMING_MODEL` | frame hint rungs in the familiar's voice, offline (ADR-0220) | content tier, offline key | `ContentRequest` | the model `PLANNER_MODEL` uses | the offline run's budget |
| `PUZZLE_MODEL` | draft and retell puzzles, offline (ADR-0280) | content tier, offline key | `ContentRequest` | the model `PLANNER_MODEL` uses | the offline run's budget |
| `FREE_PEN_MODEL` | co-write «Свободное перо» with her | player tier, zero retention, play key | `StoryRequest` | the adventure's Master model | the current adventure's bucket |

The blind check of puzzles uses `CHECK_MODEL` as it stands, since that job is already an offline check. No `GOALS_MODEL` role exists. The framing and the retelling run as offline roles on the offline key, never under the planner's play role (REQ-5034). The gateway already refuses an offline role on the play key. I gave «Свободное перо» a role of its own, with the Master's model as its default, because REQ-5030 covers every new use and the separate role lets `llm_log` show its spend apart from the story's. Its `StoryRequest` keeps every rule the Master's has, so it carries no number, node id or topic name.

The gateway hands a role's output to the game only after it passes the zod schema of the role's declared output and the data rules that bind the role (REQ-5032). An output that fails gets the role's fallback. A parse output that names a number token the request didn't carry, or an operation outside the schema, fails the check. A framed rung or a retold puzzle that fails the content checks ADR-0130 runs on frames fails the same way. A parse that times out after 10 seconds, returns invalid JSON or fails its schema gives the riddle the verdict `unparsed`, with base experience and no observation (REQ-5288), as ADR-0230 sets out. The other fallbacks are the plain rung text from the template for the framing, and the puzzle bank's own text for the retelling. «Свободное перо» falls back to a library scene that closes the book.

### Only a riddle with its numbers masked joins what leaves the Mac

The server sends off the Mac only content made without the player, her story material, the age the parent set, the one-task explanation request and a composed riddle with every number masked (REQ-5042). A `ParseRequest` carries the riddle's text with every number replaced by a token `n1` to `nm` in text order, as REQ-5202 names them (REQ-5036). A number is a digit run, a decimal or a fraction, or a Russian numeral word from the lexicon's numeral list, such as «пять» (five) or «полтора» (one and a half). The engine keeps the map from tokens to numbers on the Mac, in the attempt's own record. The request holds the masked text, the token list and the schema version, and nothing else: no target expression (REQ-5038), no node id, no topic name and no task id. The egress guard gains a rule for this class. It refuses to send a `ParseRequest` whose text still holds a digit or a numeral word after masking, as `mask_incomplete`, and ADR-0230 ends that riddle as `unparsed`. The parser runs on the player tier with `zdr: true`, so only a provider that keeps nothing receives it (REQ-5040).

The school's goal list never leaves the Mac, in whole or in part (REQ-5058). No request class has a field for it and no role takes it. ADR-0290 maps goals to nodes through an offline catalogue on the Mac. A link takes effect only when the parent confirms it, which writes `school_goal_mapped` (REQ-5060), and an unconfirmed link changes nothing the game or the report shows.

The Parent Room's page on what leaves the Mac names five kinds of data, the masked riddles among them, and matches REQ-5042 item for item (REQ-5044). ADR-0100's test that compares the page with the code's defaults gains the five kinds.

### The play key stays under $60, and the sandbox spends from the offline key

The play key's $60 monthly limit stays. Its daily buckets are the adventure's $1.5, the explanations' $0.3 and the new parse bucket of $0.1 a game day (REQ-5046). They sum to $1.9 a day, or $58.90 in a 31-day month, below $60 (REQ-5048). A group 1 check in ADR-0190's verify reads every play-key bucket from `verify/baselines.json`, multiplies the daily ones by 31 and fails when the sum reaches the monthly limit. A new daily bucket can't then push the limit into ordinary spending without a red build. When the parse bucket runs out, «Сплети загадку» (Weave a riddle) offers sentence cards for the rest of the game day.

«Свободное перо» has no bucket of its own (REQ-5054). It spends from the bucket of the current adventure, which is the open one, or after the finale the one that finished that game day. When that bucket runs out, «Свободное перо» closes through a story scene from the library (REQ-5056), and she never sees a budget or an error.

The model features of the parent's sandbox and the agent's command-line sandbox spend from the offline key and never from the play key (REQ-5050). A sandbox call runs under the same role as in play and passes the same tier and egress guard, and the gateway charges it to the offline key under a sandbox bucket. The gateway's rule "a play role never runs on the offline key outside verify mode" gains a second exception, a call marked as a sandbox call, which only the sandbox's own routes can make. The sandbox bucket stops at $20 a month on the offline key, counted from 00:00 UTC on the 1st (REQ-5052). I chose $20 because it pays for about 13 whole test adventures at the $1.5 adventure cap, more than a parent tests in a month, and it stays below the $25 bake-off budget. Sandbox calls write their `llm_log` rows to the sandbox's own file, as RES-4130 settled, so the game's monthly count of the play key never sees them.

Between offline runs, the owner sets the offline key's limit to the sandbox's $20 with a monthly reset. Before an offline run, the owner raises the limit by the run's budget, and lowers it after. This amends ADR-0100's rule that the offline key's limit equals the run's budget, because the key now also carries the sandbox.

### Every new event type has one owning decision before code writes it

The server never writes an event whose type has no owning decision or no payload schema (REQ-5062). `appendEvents` already refuses a payload with no schema. Each schema in `src/shared/events.ts` now also declares its owner, as `owner: "ADR-NNNN"`. A group 1 check fails when a type has no owner, or when its owner isn't an approved decision in `project/adrs/`. The table lists more types than the addendum's 42. It renames the three `snappet_*` types adds the types the item decisions and REQ-5074 need, and drops `estimate_submitted` for the one-record rule below. The owners are these:

| Event types | Owner | Notes |
| --- | --- | --- |
| `rung_framing_approved`, `rung_framing_removed` | ADR-0220 | `rung_framing_approved` is the parent's approval of a rung's framing (REQ-5074) |
| `compose_shown`, `compose_submitted`, `compose_parsed`, `compose_confirmed`, `compose_labelled` | ADR-0230 | |
| `self_check_used` | ADR-0240 | one event per use of the inverse check |
| `refusal_guard_changed` | ADR-0250 | |
| `grouping_submitted` | ADR-0260 | her links and their score |
| `plan_submitted` | ADR-0270 | the card sequence and `planChoice` |
| `puzzle_offered`, `puzzle_opened`, `puzzle_move`, `puzzle_attempt`, `puzzle_hint`, `puzzle_solved`, `puzzle_shelved`, `puzzle_unshelved`, `puzzle_closed`, `puzzle_approved`, `puzzle_rejected` | ADR-0280 | `puzzle_approved` is the parent's approval of a puzzle (REQ-5074) |
| `horizon_set`, `external_test_recorded`, `school_goals_imported`, `school_goal_mapped`, `cito_rule_checked`, `volley_started`, `volley_completed`, `fact_threshold_set` | ADR-0290 | |
| `school_snapshot_imported`, `school_snapshot_parsed`, `school_snapshot_corrected`, `school_snapshot_withdrawn`, `school_snapshot_goal_linked`, `school_snapshot_goal_unlinked` | ADR-0310, after the MVP | no schema before that item starts, so the MVP can't write them |
| `eye_exercise_ended`, `reaction_line_shown`, `reaction_line_flagged` | ADR-0320 | |
| `system_unlocked`, `route_offered`, `route_chosen`, `free_pen_started`, `free_pen_ended`, `starter_inserted`, `share_card_created`, `share_card_viewed`, `scene_rewatched`, `chapter_reread`, `scene_favorited`, `hidden_detail_found`, `parent_day_marked`, `text_freshness_scored` | ADR-0330 | |
| `content_disabled`, `content_restored`, `sandbox_action_applied` | ADR-0340 | `content_disabled` and `content_restored` carry the kind, template or puzzle, and its id (REQ-5074) |
| `bridge_word_seen`, `bridge_card_opened`, `bridge_check_answered`, `facts_trained_marked` | this decision | payloads below |

This decision owns four types, because the Dutch bridge is its part and ADR-0290 leaves the fact-training mark to it:

| Event | Payload | Meaning |
| --- | --- | --- |
| `bridge_word_seen` | `itemId`, `wordIds`, the bridge words the task's view printed | a task with bridge keywords was shown |
| `bridge_card_opened` | `wordId`, `from`: `task` or `dictionary` | she opened a word's card in «Словарь Башни» (the Tower's Dictionary) |
| `bridge_check_answered` | `wordId`, `checkId`, `answer`, `right` | she answered a short check on a word; it feeds the `bridge` stream only |
| `facts_trained_marked` | `facts`, a list of fact ids from `content/facts.yaml`; `lessonDate`; `note`, optional | the parent's mark «тренировали факты» (we trained facts) (REQ-5074) |

The addendum's `snappet_*` names become `school_snapshot_*`. No event type and no code names the vendor of the school's learning system (REQ-5064), because the school's system can change and the repository is public. A group 1 check searches `src/`, `content/` and `tools/` for the vendor's name, which `verify/scope-guard.json` lists, and fails on a hit.

Each fact is logged in one place only (REQ-5072). I chose one rule for the four facts the addendum lists twice. A fact that arrives in the same request as the answer is a field of `attempt_submitted`. A fact she commits before the answer, which a resume must restore, is a type of its own. So the estimate is the field `estimate` of `attempt_submitted`, and `estimate_submitted` doesn't exist, because ADR-0240 sends the pick and the exact answer in one `AnswerIn`. The grouping, the plan and each self-check are types of their own, and `attempt_submitted` carries no `grouping`, `planChoice` or `selfCheck` field. `self_corrected` is no type: the report derives a saved or spoiled answer from `self_check_used` and the attempt that follows it.

A sandbox action that changes the player's game is logged once in the main log, as the action's own event with `source: "sandbox"` in its payload: `item_excluded`, `content_disabled`, `content_restored` or `puzzle_approved`. `sandbox_action_applied` is written only to the sandbox's own file and points to that main-log event, so one fact has one record in the log that is the truth.

The changed fields of `attempt_submitted`, `item_shown` and `verdict` arrive as one new payload version of each, `v: 2`, with an upcaster from `v: 1` (REQ-5066). I chose one version for the whole addendum over one version per item. Otherwise several item decisions each adding version 2 of `attempt_submitted` would collide. Each item's decision names its fields in its own record, and every new field is optional, so a stage that hasn't built an item leaves its field absent. The version 2 fields this record fixes are `forms` on `item_shown`, `estimate` on `attempt_submitted`, and `estimateRight` beside `estimateLabel` on `verdict`, which ADR-0240 defines. The upcaster fills `hintMaxLevel` from `hintLevel` and `forms` with an empty list, and leaves the estimate fields absent. `hint_shown` now means a hint rung shown to the player, whether or not a thread paid for that rung (REQ-5068). `thread_spent` now means a guiding thread spent on opening a task's hint ladder or on an explanation (REQ-5070). ADR-0220 defines both payloads' new versions.

### The MVP holds the addendum's items and the Dutch bridge

The first version holds every part of the MVP contents list REQ-5076 names: the approved list, plus the addendum's items 1 to 9 and 11 to 13. The owner judges it at the stage 0.3 acceptance. The first version holds none of the deferred items REQ-5078 names, which now include snapshots of the school's learning system. The scope guard gains two traces for that item, a schema for a `school_snapshot_*` type and a Parent Room route for a school snapshot, beside the vendor's name it already lists for REQ-5064.

Every text and task the player sees is in Russian, apart from the Dutch keywords of the word bridge and the Dutch word a term hint shows, each once the parent has approved it (REQ-5080). The bridge's words are entries in `lexicon.ru.json`, the file that already holds the glossary's Dutch word beside the Russian term (ADR-0160). A bridge entry carries `bridge: true`, and its Dutch word sits in the same field a glossary entry uses. No Dutch locale file appears, so the scope guard keeps failing on `content/i18n/nl.json` and on any `*.nl.*` file. The Dutch layer stays out of the MVP, and the parent's Dutch memo is allowed, because it is parent-facing. ADR-0160's string check refuses a Latin-script word on a player screen unless the word is an approved Dutch field of the lexicon or sits inside a task's content as a bridge keyword.

The bridge holds 30 to 50 keywords (REQ-5082), and a group 1 check counts the `bridge: true` entries. The parent approves each word through the glossary panel of ADR-0180, which writes `glossary_entry_approved`, and the game never shows a word before that event (REQ-5086). The Director turns the bridge on once 30 words are approved, so a half-approved list never runs the bridge thin. From then on, bridge keywords appear in 15 % to 25 % of the T1 to T4 and Sources tasks shown over any 14 game days on which she plays (REQ-5084). The simulation group of ADR-0190 checks that share over 60 simulated days.

The repository's `CLAUDE.md` already carries this exception, which the owner added on 2026-09-28 for REQ-5080.

### The build order and a fact stage before the MVP

The build takes the addendum's items in this order (REQ-5090):

1. Fact measurement, item 8's facts, with the hint ladder, item 1.
2. The estimate with the inverse check, item 3; word problems with a surplus or a missing number, item 4; solution plan cards, item 6; and the Sources track, item 9.
3. Composing a word problem, item 2, and rational grouping, item 5.

The puzzle branch, item 7, silent play, item 11, the rules that keep the game the player's own, item 12, and the parent's sandbox, item 13, fit around these steps. The owner judges the order at each stage's acceptance.

ADR-0190's stages gain one stage and change one:

| Stage | Change |
| --- | --- |
| 0.1 | The parent's sandbox joins, with the first templates and no model feature (REQ-5092). Until the Parent Room's PIN guards it, the sandbox is served only on ADR-0010's loopback listener, `http://localhost:8080`, which no iPad can reach, so the player can't open it from her screens (REQ-5098). |
| 0.15, the fact stage, new | Item 8's facts and item 1's hint ladder on the stage 0.1 templates, with the bare interface in Russian, rungs as the template's plain text and no model call. The player plays it as soon as a person accepts it (REQ-5088). |
| 0.2 | Items 3, 4, 6 and 9 join the domains. |
| 0.3 | Items 2, 5, 7, 11 and 12 join, and the sandbox gains its model features. |

The fact stage exists so that measurement starts well before the M7 horizon of 2027-01-15, which waiting for the whole enlarged MVP can't promise. It offers one set of fact tasks a game day, as the adventure is one a day. ADR-0290 sizes the set from her pace so that it ends before 15 minutes of active time. I chose 15 minutes because the stage has no eye exercise yet, and 15 stays below ADR-0090's 20-minute eye interval with slack. The stage makes no model call, so nothing leaves the Mac, and its screens pass the same no-clock check as every later stage. Its acceptance is a person playing one set on the iPad, the stage 0.1 checklist and a green verify for groups 1 to 5 and 9. Every event the fact stage logs stays in the one log and counts in the "on her own" estimate like any stage 0.1 attempt, since facts are an ordinary form.

The sandbox offers no model feature until the gateway and the PIN both exist (REQ-5094). Its model routes answer `409 sandbox_models_unavailable` while either is missing, which a test drives.

«Сплети загадку» offers sentence cards in place of free composition until the masked parser has matched the labelled verdicts on at least 95 % of 200 reference riddles in a live run on the offline key (REQ-5096). The setting `COMPOSE_FREE` turns free composition on. The server refuses to start with it on unless `verify/parser-eval.json` records a passing `verify --live` run for the configured `PARSE_MODEL`, so a changed parser model turns free composition off until it passes again. The same sentence cards serve whenever the game day's parse bucket has run out.

### What works once this is accepted, and what doesn't yet

Once this is accepted, the game day keeps every job it had and no screen names its hour. The screens without tasks open during an adventure. The parse and sandbox buckets exist with their keys, and the budget check guards the monthly limit. Every new event type has an owner the build checks. The scope guard knows the new MVP list and the bridge's exception, and the fact stage can be built on stage 0.1 and played before the MVP. The stream rule works as soon as `item_shown` v2 carries `forms`, and with every list empty the model behaves exactly as today.

The items themselves don't work yet: each waits for its own decision, ADR-0220 to ADR-0340, to be approved for its forms, fields, screens and content. Until then, the server writes none of the types those decisions own. The Dutch bridge can't show a word until the parent approves 30. Free composition stays on sentence cards until the parser's live run passes. Removing this decision's increment leaves the approved game as it was, apart from the owner's addendum, which then has no carrier.

## Why

The addendum overrides the approved record where they disagree (RES-4000). It strikes the window after the finale «until 04:00», puts eleven items and a Dutch bridge into the MVP, asks for separate streams, and adds four model jobs, 42 event types and two budgets. Each of those touches a record that several item decisions also touch, such as ADR-0020's catalogue, ADR-0060's observation rule, ADR-0090's day, ADR-0100's gateway and ADR-0190's scope. One decision that owns the shared rules lets the thirteen item decisions build on it without each amending the same lines differently.

The game day stays at 04:00 because RES-4000 compared four boundaries and this one needs the least rework. It keeps ADR-0090's defence against a changed zone and every daily job, while the addendum's aim holds: nothing she sees opens or closes by the hour. Midnight would turn the day during an evening session and grant a new morning's threads mid-play. A boundary set by rest would allow a second adventure after a long afternoon break (RES-4000). Once the screens without tasks open at any time, only the game day keeps play to one adventure a day, which is why REQ-5004 now carries that rule on its own.

New forms stay out of "on her own" because no new form has a tested fit, and an untested form would move the estimate the parent reads without evidence that it predicts her better (RES-4000, REQ-5026). ADR-0060's activation rule already is the test the addendum names, so the design only needs a field that says which forms an attempt used and a list of admitted ones.

The masked riddle is the one way her composed answer can reach a parser and still meet the approved rule that her answers have no field to travel in (RES-4000). Masking keeps the numbers, which are the maths of her answer, on the Mac, and the target expression never travels, so the parse is blind and the engine scores it at home. The goal list stays home because it can name her school group, and the egress guard has no rule for a school group (RES-4000).

The sandbox moves to the offline key because the addendum's $1 a day inside the $60 limit sums to $89.90 in a 31-day month. With the sandbox used every day, the limit runs out around day 21 and every session, hers included, drops to fallbacks (RES-4000). The limit exists to catch a runaway bug, and a limit that ordinary use reaches stops her play. The parse bucket stays on the play key, where the sum is $58.90.

The owners of the new event types come from ADR-0020's rule that each type has one owner defining its payload. The addendum lists 42 types with none (RES-4000). The rule on one record per fact follows from the log being the only truth: two records of one fact can disagree after a bug or a retry, and every projection would have to pick one.

The fact stage exists because the addendum measures fact automaticity "from the first day" with M7 about three and a half months away. ADR-0190 lets her play only at stage 0.3, after all eleven items are built, at a date no record estimates (RES-4000). The facts and the hint ladder need only stage 0.1's templates and no model, so they can reach her early at little risk to privacy or budget.

The strongest objection is that the fact stage puts the player in front of a bare drill months before the game. Her first meeting with "the game" is then a set of number facts with no story, familiar or reward, which is close to the drilling Cito advises against (RES-4080). The MVP's two weeks of play will later judge a game she first met as a chore. I keep the stage because the owner decided on 2026-09-28 that measurement starts before M7 (RES-4000). A set a day under 15 minutes, a hint ladder, no clock and no score shown keep it small. The reversal condition below watches for the case where it costs her interest.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep the approved record as it stands | no rework; the approved decisions stay consistent with each other | the owner's addendum strikes the window «until 04:00», adds eleven MVP items and a Dutch bridge, and overrides the record where they disagree, so every item decision would build on rules the owner removed |
| Let each item decision amend the shared records itself, with no cross-cutting decision | fewer records; each item carries everything it needs | thirteen decisions would each amend ADR-0020, ADR-0060, ADR-0090, ADR-0100 and ADR-0190, collide on version 2 of `attempt_submitted`, and no single record would sum the play key's daily buckets |
| Move the day boundary to midnight, or to the first session after a set rest | ties the day to the calendar, or to no clock at all | midnight turns the day during an evening session; a rest-based boundary allows two adventures in one afternoon and needs a new reference for every daily budget (RES-4000) |
| Parse the riddle unmasked, on the player tier with zero retention, as the addendum wrote | the parser sees the real numbers and may parse better | her scored answer would leave the Mac, which the approved rule on data leaving the Mac forbids (RES-4000); sentence cards cover a masked parser that fails |
| Keep the sandbox on the play key with the addendum's $1 a day inside the $60 | one key and one limit to watch | the daily caps then sum to $89.90 in 31 days, and a busy sandbox month stops her play around day 21 (RES-4000) |
| Wait for stage 0.3 before she plays | her first meeting is with the full game, story and familiars included | no record says when stage 0.3 starts, so measurement might begin after the M7 horizon of 2027-01-15 (RES-4000) |
| Ship the bridge as a Dutch locale file, `bridge.nl.json` | a clean start for the Dutch layer later | the scope guard fails on a Dutch locale file, and a locale file suggests a Dutch interface the MVP doesn't have (RES-4000) |

## What it costs

The family pays up to about $23 a month more at the caps: up to $3.10 on the play key for the parse bucket in a 31-day month, and up to $20 on the offline key for the sandbox, which had no budget before.

The player pays a bare drill before she meets the game, one set of facts a game day in the fact stage, which the strongest objection under Why weighs.

The knowledge model pays in observations. About a fifth of T1 to T4 and Sources tasks carry bridge keywords. Those tasks, and the surplus, missing, plan, compose and grouping forms, stay out of "on her own" for the whole MVP. RES-4040 expects about one word problem a day, so the T nodes' estimates move more slowly than the approved design planned. The Director has to place ordinary word problems often enough for the T nodes to stay measured.

The developer pays a lint rule on hours, a `forms` field and its upcaster, and a parse request class with a masking rule. The developer also pays two buckets, a budget-sum check, an owner field on every event schema, and the vendor-name and Latin-word checks. Each item's decision pays for its own fields inside the shared version 2, which means their field lists must not clash.

The owner does more work. The owner raises and lowers the offline key's limit around each offline run, since the key now also carries the sandbox's $20. The owner also runs the parser's live test before free composition goes on and after each change of `PARSE_MODEL`.

The parent's interruption budget grows by bounded, one-time queues and no alarm. The parent approves 30 to 50 bridge words once, then only a new word. The parent confirms goal links whenever a new goal list is pasted, and reads the page on what leaves the Mac once. The Parent Room shows at most one notice per condition: `sandbox_budget_spent` once a month at most, and the parse bucket only in the day's cost line with no notice. No new notice is pushed to a phone. The parent is never needed in real time. Over two weeks without the parent, play goes on and nothing is lost. The bridge stays off or runs on the words already approved. Unconfirmed goal links change nothing. Free composition stays on sentence cards. The sandbox sits idle. No queue grows past its bound, since the bridge list stops at 50 and a goal list holds what the school pasted.

The ceilings on what accumulates:

- the play key's daily buckets sum below $60 in 31 days, and the build fails otherwise;
- the sandbox bucket stops at $20 a month and drains at each month's start;
- the bridge list holds at most 50 words, and a group 1 check fails at 51;
- stream observations live in the log, under ADR-0020's `log_large` notice at 1 GB;
- event types with no owner stay at zero, and the build fails on the first.

The security boundary protects her composed answers, her school details and the family's money. The threats, most likely first:

1. A code change adds a field to `ParseRequest` or sends the target expression. The strict schema refuses an unknown field, and a test sends every forbidden field.
2. Masking misses a number, such as a spelled numeral. The egress guard's `mask_incomplete` rule and a test set of spelled, decimal and fractional numbers stop it.
3. A sandbox call charges the play key. The key follows the call's sandbox mark, and a test finds the offline key on every sandbox call.
4. A later change sends the goal list to a model. No request class has a field for it, and a test searches every class's schema for one.
5. A provider keeps a riddle. `zdr: true` and ADR-0100's start-up check stop it.

Failure states, each with its next step and one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `parser_not_accepted`: the last live run is missing or below 95 % | free composition stays off; sentence cards | the owner, in the verify report |
| `parse_budget_spent` | sentence cards for the rest of the game day | the parent, in the day's cost line |
| `parse_output_refused`: the output failed its schema or named an unknown token | this riddle gets `unparsed` (REQ-5288) | the owner, in `llm_log` |
| `mask_incomplete`: a digit or numeral word survived masking | the request isn't sent; the riddle gets `unparsed`; reported once per cause | the owner |
| `sandbox_budget_spent` | sandbox model features fall back until the month ends; one notice | the parent |
| `offline_key_refused`: OpenRouter answers 402 on the offline key | the call falls back; the run or sandbox reports it | the owner |
| `sandbox_models_unavailable`: the gateway or the PIN is missing | the sandbox route answers 409 | the parent, on the sandbox screen |
| `bridge_below_minimum`: fewer than 30 words approved | the bridge stays off | the parent, as a count in the glossary panel |
| `bridge_share_out_of_band`, `event_type_unowned`, `bucket_sum_over_limit`, `vendor_name_found`, `hour_read_outside_day_module` | the build fails and names the case | the building agent |

The player sees none of these states as an error: each ends in sentence cards, an `unparsed` riddle with base experience, a library scene or a plain rung, and the story reads the same. `parse_budget_spent` and `parser_not_accepted` look the same to her on purpose, since both give sentence cards.

## What would reverse it

- If the owner says the hour itself must go, and not only the window, the 04:00 boundary is reopened with RES-4000's other options.
- If a T node gets fewer than 5 "on her own" observations over 14 game days of play at stage 0.3, the new forms starve the estimate. The stream rule is then reopened with the owner, for an early refit or a smaller bridge share.
- If the masked parser fails the 95 % test on two live runs in a row, free composition can't ship masked, and item 2 goes back to the owner, as sentence cards only or out of the MVP.
- If the sandbox bucket runs out in two months running, $20 is too low for how the parent tests, and the cap is reopened.
- If the play key's monthly usage passes $50 in a month with no bug found, the buckets sit too close to the limit, and the daily buckets are reopened.
- If, in the fact stage's first two weeks, she leaves the day's set unfinished or declines to play on more than 4 game days, as the log and the parent's note show, the stage pauses and measurement waits for stage 0.3.

The premortem, written as though it had happened. At the stage 0.3 review the report showed the T1 to T4 nodes still near their priors after a month. Bridge tasks, surplus and missing tasks and plan cards had taken more than half of her word problems out of "on her own", and nobody watched the count of ordinary ones. In the same month a riddle left the Mac with «полтора» in it, because the numeral list held the whole numbers and no fractional words, and `mask_incomplete` had no case for it. Late in the month an art run stopped halfway: the owner had set the offline key's limit to the run's $40 and forgot the sandbox's share, which the parent had spent that week. The reversal condition on T-node observations, the fractional words in the masking test set and the rule to raise the offline limit by the run's budget exist for these three.

## Consequences

- ADR-0020's catalogue gains the types in the owner table above, each entering with its schema in the change that first writes it. `item_shown`, `attempt_submitted` and `verdict` gain version 2.
- ADR-0060 reads `forms` and `admittedForms`, and each stream gets a projection that the recompute rebuilds like any other.
- ADR-0090's projections count the screens without tasks at any time, and its screen check skips task content.
- ADR-0100 gains four roles, the `ParseRequest` class, the masking rule in the egress guard, the parse and sandbox buckets and the sandbox exception on the offline key.
- ADR-0160's string check allows approved Dutch fields of the lexicon, and `lexicon.ru.json` gains `bridge: true` entries.
- ADR-0180's glossary panel lists the bridge words beside the glossary entries, with the count of approved ones.
- ADR-0190 gains the fact stage, the new MVP list, the deferred school snapshots, the scope guard's new traces, the budget-sum check and new Baselines rows.
- `verify/parser-eval.json` and `COMPOSE_FREE` are created.
- Each item decision, ADR-0220 to ADR-0340, cites this record for the day, the streams, the roles, the money, its event owners and its stage.

## Amends

- ADR-0020: "`hint_shown` | ADR-0080 | a hint rung was bought and shown" becomes "a hint rung was shown, whether or not a thread paid for it", with ADR-0220 defining its new version.
- ADR-0020: "`thread_spent` | ADR-0080 | a thread was spent on a hint rung or an explanation" becomes "a thread was spent on opening a task's hint ladder or on an explanation".
- ADR-0020: "A later decision adds or renames a type the same way, with a schema, a version and the projections that read it" becomes the same rule, plus "and its schema declares its owner, which a group 1 check reads".
- ADR-0060: the list of reasons that drop an attempt gains "its task's `forms` holds a form the active model version doesn't admit in `admittedForms`, which is empty in v1".
- ADR-0090: "Session 0 counts as that game day's adventure, so after it only screens without tasks open until 04:00" becomes "Session 0 counts as that game day's adventure, so no new adventure starts that game day, and the screens without tasks stay open whenever the task window is closed".
- ADR-0090: the eye-count row "the screens without tasks after the finale included" becomes "time on the screens without tasks included, whenever she spends it".
- ADR-0090: "After the day's finale, and until 04:00, the server sends no task and opens only screens without tasks" becomes "Whenever the task window is closed, the client offers the screens without tasks, and after the day's finale the server sends no task until the next game day".
- ADR-0090: "A game day ends at 04:00 in the time zone of the device she plays on" gains "and no screen, line, number or string she can reach names that hour".
- ADR-0090: "It ends when she taps on, or by itself after 5 minutes" gains "or when she opens a screen without tasks from it".
- ADR-0090: realisation check 7, "finds no text matching a clock", becomes "finds no text matching a clock outside the `data-task-content` subtree".
- ADR-0100: the list of five request classes gains `ParseRequest`, and "the four kinds of data REQ-2646 lets out" becomes "the five kinds REQ-5042 lets out, the masked riddle the fifth".
- ADR-0100: the roles list gains `PARSE_MODEL`, `FRAMING_MODEL`, `PUZZLE_MODEL` and `FREE_PEN_MODEL` with the tiers, keys and classes this record sets.
- ADR-0100: the budget table gains "Parse | $0.1 a game day | `PARSE_MODEL` | sentence cards for the rest of the game day" and "Sandbox | $20 a month on the offline key | every sandbox call | sandbox model features fall back until the month ends".
- ADR-0100: "a play role on the offline key outside verify mode" becomes "a play role on the offline key outside verify mode and outside a call marked as a sandbox call".
- ADR-0100: "The owner sets the offline key's limit to the run's budget before each run" becomes "The offline key's limit is the sandbox's $20 with a monthly reset between runs, and the owner raises it by the run's budget before each run and lowers it after".
- ADR-0100: "The monthly count of $60 sits above the $55.80 the daily caps allow in a 31-day month" becomes "above the $58.90 the daily caps allow in a 31-day month, which a group 1 check computes".
- ADR-0100: the page on what leaves the Mac "names the four kinds of data" becomes "names the five kinds of data, masked riddles among them".
- ADR-0160: "The Dutch glossary word a term hint shows: it lives in `lexicon.ru.json`" gains "and so do the bridge's 30 to 50 keywords, as entries with `bridge: true`".
- ADR-0190: the stage table gains stage 0.15, the fact stage, and stage 0.1 gains the parent's sandbox without model features, as this record sets.
- ADR-0190: "Stage 0.3 holds every part of the MVP contents list (REQ-3700)" becomes "Stage 0.3 holds every part of the MVP contents list (REQ-5076)", with the addendum's items 1 to 9 and 11 to 13 added to the list.
- ADR-0190: the deferred list (REQ-3702) becomes REQ-5078's list, with snapshots of the school's learning system added, and the scope guard's traces gain a `school_snapshot_*` schema, a school-snapshot route and the vendor's name.
- ADR-0190: "Every text and task the player sees is in Russian, because the scope guard allows only the `ru` locale" becomes "Every text and task the player sees is in Russian, apart from the approved Dutch keywords of the bridge and the Dutch word a term hint shows (REQ-5080)".
- ADR-0190: the Baselines table gains "Parse | $0.1 a game day | ADR-0210 | imposed by REQ-5046", "Sandbox | $20 a month on the offline key | ADR-0210 | chosen", "Parser accuracy for free composition | at least 95 % of 200 reference riddles, live | ADR-0210 | imposed by REQ-5096", "Bridge | 30 to 50 words; 15 % to 25 % of T1 to T4 and Sources tasks over 14 game days | ADR-0210 | imposed by REQ-5082 and REQ-5084" and "Fact stage set | under 15 minutes of active time | ADR-0210 | chosen".
- SPC-0030: "An adventure day is a game day, from 04:00 to 04:00, with active time in that adventure" becomes "An adventure day is a game day on which a task or a scene of that adventure was shown".

## How I will know it was realised

1. A day test replays synthetic logs across 04:00 in two time zones and asserts that every job REQ-5008 lists runs once per game day, and that a zone change takes effect at the next 04:00 of the old zone.
2. The lint rule on hours fails on a fixture that calls `getHours` in engine code outside `src/engine/day/`, passes on a Parent Room fixture that formats an hour, and passes on the tree.
3. A test asks for a second adventure on a game day that already has one, Session 0 included, and the server refuses to log `adventure_planned`.
4. A Playwright test during an adventure, with the task window closed, reaches each of the seven screens REQ-5012 names, and finds none of their entries while a task is open. A puzzle offer appears only after `adventure_completed`.
5. A time-projection test asserts that time on a screen without tasks, during an adventure and after the finale, counts in the eye count, and that a soft stop due there plays at her return to the adventure.
6. The screen check passes on a timetable task and a clock-reading task, and fails on the same text outside `data-task-content`.
7. A search of every player-facing string file finds no hour of the day's end, and the first scene of each new game day except the first in a 60-day simulation opens with `story.day_turn`, gaps between days included.
8. A 60-day simulation finds daily quests on every game day with play after they first appear, and the route choice beside them, never in their place.
9. A model test feeds attempts with non-empty `forms` and finds the "on her own" estimate identical to one computed without them, and each stream's projection holding them.
10. A gateway test sends a `ParseRequest` with a target field, a node id and an unmasked «полтора», and the gateway refuses all three before any network call. A recorded test finds `zdr: true` on every parse request.
11. A test finds no request class with a field that can hold the school's goal list, and no role named for goals. A report test shows no effect of an unconfirmed goal link.
12. The budget-sum check fails when a fixture adds a $0.1 daily bucket to the play key, and passes on the real baselines at $58.90.
13. A test in play mode makes sandbox calls and finds the offline key on all of them and no row in the main `llm_log`. At $20 of sandbox spend it finds one `sandbox_budget_spent` notice and fallbacks.
14. The owner check fails on a schema with no owner and on one owned by a draft decision. The vendor-name search fails on a fixture that names the vendor.
15. A replay of stored v1 events through the v2 upcasters of `attempt_submitted`, `item_shown` and `verdict` gives the same projections as before.
16. The scope guard fails on `content/i18n/nl.json` and on a `school_snapshot_*` schema, and passes with 30 to 50 `bridge: true` entries in `lexicon.ru.json`. It fails at 51.
17. A Playwright test finds no bridge word before its `glossary_entry_approved`, and the simulation finds the bridge share between 15 % and 25 % over every 14-game-day window once 30 words are approved.
18. The server refuses to start with `COMPOSE_FREE` on and no passing run in `verify/parser-eval.json`.
19. A gateway test gives `FRAMING_MODEL`, `PUZZLE_MODEL` and `FREE_PEN_MODEL` an output that fails its schema, and the caller gets the plain rung, the bank's text and a closing library scene. A test in play mode calls `FRAMING_MODEL` and `PUZZLE_MODEL` and the gateway refuses both on the play key.
20. A simulated day runs «Свободное перо» until the current adventure's bucket is spent, finds its calls charged to that bucket and the book closed by a library scene, with no bucket of its own in `verify/baselines.json`.
21. A schema test finds no `grouping`, `planChoice` or `selfCheck` field in `attempt_submitted` v2 and no `estimate_submitted` type, and a sandbox test finds `sandbox_action_applied` only in the sandbox file, with one main-log event carrying `source: "sandbox"` per confirmed action.
22. ADR-0100's disclosure test finds the five kinds of REQ-5042 named on the Parent Room's page.
23. A test calls a sandbox model route with no PIN set, and again with the gateway off, and gets `409 sandbox_models_unavailable` both times.
24. A fact-stage test asks for a second set on the same game day and gets none, and a first set on the next game day.
25. The fact stage's epic passes `meow-method ready` after stage 0.1's acceptance and before stage 0.2's. From the iPad, the sandbox's loopback address refuses the connection while no PIN is set.

## What this does not settle

- Each item's forms, fields, screens, content and acceptance tests: ADR-0220 to ADR-0340, which own the payloads of the types in the owner table.
- The hint ladder's price, its twin rule and the "with help" split by depth of help: ADR-0220, which amends ADR-0080.
- The parser's timeout, its graph schema and its verdicts: ADR-0230.
- The size and pace of the fact stage's set within the 15 minutes, the volley and the dates in the Parent Room: ADR-0290.
- The sandbox's file, snapshot, reset, frame and the envelope field its insert trigger reads: ADR-0340.
- The schedule of new systems and the free pen's scenes: ADR-0330.
- Whether an early refit should admit a stream before the MVP ends: this record keeps ADR-0060's deferral of the refit tool.
