---
id: SPC-0110
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-1500, REQ-1502, REQ-1504, REQ-1506, REQ-1508, REQ-1512, REQ-1514, REQ-1516, REQ-1518, REQ-1520, REQ-1522, REQ-1524, REQ-1526, REQ-1528, REQ-1530, REQ-1532, REQ-1534, REQ-1536, REQ-1538, REQ-1540, REQ-1542, REQ-1544, REQ-1548, REQ-1550, REQ-1552, REQ-1554, REQ-1556, REQ-1558, REQ-1560, REQ-1562, REQ-1564, REQ-1566, REQ-1568, REQ-1570, REQ-1572, REQ-1574, REQ-1600, REQ-1602, REQ-1604, REQ-1606, REQ-1608, REQ-1610, REQ-1612, REQ-1614, REQ-1616, REQ-1618, REQ-1620, REQ-1622, REQ-1624, REQ-1632, REQ-1634, REQ-1636, REQ-1638, REQ-1640, REQ-1658, REQ-1660, REQ-1662, REQ-1664, REQ-1666, REQ-1668, REQ-1670, REQ-1672, REQ-1674, REQ-1676, REQ-1678, REQ-1680, REQ-1682, REQ-1684, REQ-1802, REQ-1804, REQ-1806, REQ-1808, REQ-1810, REQ-1812, REQ-1814, REQ-1816, REQ-1818, REQ-1820, REQ-1822, REQ-1824, REQ-1826, REQ-1828, REQ-1830, REQ-1832, REQ-1834, REQ-1836, REQ-1838, REQ-1840, REQ-2610, REQ-3316, REQ-3320, REQ-3330, REQ-5030, REQ-5032]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Master's narration: scene orders, reply checks, canon and story memory, and the safety pipeline on the player's text

## Scope

This document covers the story side of the game: the split between the Director, which decides every event, and the Master, which writes the story around those events; the scene order and the Master's reply; the checks every reply passes before it shows; the retry, the scene library and the line pools; the canon, the prompt and story memory; the planner; the safety pipeline on the player's free text; creepiness, dreamcore and the Underside; names; the campaign calendar; and the model roles the owner's addendum 1 adds. It is written at the component level: modules, content files, schemas, checks, events and failure states. It names no screen layout and no model provider.

It leaves out what other specifications state. SPC-0100 states the model gateway, its roles, tiers, budgets, the egress guard and `llm_log`, and what happens when a budget runs out. ADR-0350 states where each judge check runs. ADR-0330 states the starters, the route choice, the interlude, `player_action` facts, the do-not-use list, the return-phrase check, the refusal rule and the free pen's schedule. ADR-0320 states the reaction line shown before the Master's reply. ADR-0230 states the composed riddle and the list of points where the free-text field opens. ADR-0160 states the string files and the forbidden-word list. ADR-0140 states the grants, titles and ranks a finale awards. ADR-0170 states the art, ADR-0180 the Parent Room's report, SPC-0030 the routes and the SSE stream, and SPC-0020 the event log.

## Boundary

### Parts

| Part | Where it lives | What it offers |
| --- | --- | --- |
| The Director | `src/engine/director/` and the game rules it calls | Typed story events whose only string fields are ids and enum values, and the application of a reply's effects. |
| The Master service | `src/server/master/` | Builds scene orders, sends them through the gateway, runs the reply checks, keeps the scene queue and story memory, and runs the safety pipeline on her text. |
| The check module | shared with the explanation path of ADR-0120 | The schema, numeral, forbidden-word and safety checks, and the `CheckedText` type that only a passing run can build. |
| The planner | the Master service, under `PLANNER_MODEL` | A session summary and the next session's plan after each session. |
| The content files | `content/`, mounted read-only | The canon, the scene library, the branches, the line pools, the triggers, the numeral list, the campaign calendar and the name suggestions. |

### Content files

Each content file is a per-language file, so the Russian set below has an English and a Dutch counterpart when those languages ship.

| File | What it holds |
| --- | --- |
| `content/canon.ru.md` | The world, its rules for the Master and its entity list, each section tagged with the checkpoint that reveals it. |
| `content/scenes.ru.json` | Library scenes, each with a shortest form and a minimum creepiness level, the short ending of a wrap-up and the Underside's return scenes. |
| `content/branches.ru.json` | Room branch pairs and Guardian ending triples for every floor, each with a minimum creepiness level. |
| `content/lines.ru.json` | System and familiar pool lines by category, each with a minimum creepiness level. |
| `content/safety.ru.json` | The hand-written trigger phrases by level, `serious`, `everyday`, `narrator`, `fear` and `stop`, the fixed lines, and the guilt list of phrases of guilt or attachment. |
| `content/numerals.ru.json` | The shared numeral list with every word form. |
| `content/campaign.ru.json` | The campaign calendar: chapters, finales, rank openings and the names of characters by date. |

### The scene order and the reply

`src/shared/master.ts` holds both as strict zod schemas.

| Schema | Fields |
| --- | --- |
| Scene order | `kind`, the floor, the scene's characters by id with her current names, the plan beat, the checkpoint by its canon key, the creepiness level by its name, `readerAge`, her cleaned text, the rewards the success branch opens, the summary outcome events `room_outcome`, `combo`, `floor_outcome` and `reward_reopened`, the duration budget, the «как не надо» block, and the fields ADR-0330 adds. |
| Reply | Lines, each with a speaker; the branches and endings its `kind` requires; the effects; and the fields ADR-0330 adds. A dreamcore reply also carries `exit`, one of `door`, `light` or `stair`. |
| Effects | `remember`, `relation`, `running_joke`, `diary_page` from the predefined list, `reward_hint` and `title`. |

The order's schema has no field for a number other than `readerAge`, and none for an answer, a verdict, a single-task outcome, a node id or state, an estimate, a response time or a lesson tag.

### Events this part logs

`scene_prepared`, `scene_shown`, `choice_made`, `free_text`, `name_given`, `plan_written`, `safety_event`, `line_approved` and `diary_cipher`, all through `appendEvents`. `scene_prepared` holds a scene's lines and branches as they passed the checks, and SPC-0030 resumes a scene from it. The Parent Room's flag on a Master scene is also an event in the log.

### SSE messages

This part sends `scene_ready` when a checked scene is in the queue, and `safety_pause` when the serious path pauses the game, on the stream SPC-0030 states.

### What this part requires from other parts

- SPC-0100 supplies the gateway: `StoryRequest` for the Master and the planner, `JudgeRequest` for the judge, the cleaned text, the fallback model named in each request, and the refusal of any request whose fields break the egress guard.
- ADR-0350 supplies the route of each judge check, with `SAFETY_MODEL` as its fallback.
- The Director's modules supply the story events: SPC-0070 the route and the trials, SPC-0080 the attempt flow, SPC-0090 the day plan, the story time and the rest stops, and ADR-0140 the grants.
- ADR-0160 supplies the forbidden-word list and the System lines' strings.
- The Parent Room supplies the creepiness level, the reader's age, the campaign's start date, the scene flags and the line approvals.

### Permitted dependencies

The dependencies run one way, and the lint step fails a build that crosses them.

- `src/server/master/` imports none of the knowledge model, the selection code or the task engine.
- The Director imports none of the Master's text, and its event schemas hold no free string field.
- The Master service reaches a model only through the gateway of SPC-0100.
- No code in the repository writes to `content/canon.ru.md`, and the server opens `content/` read-only.
- The client imports only `src/shared/`, and it draws a reply only as `CheckedText`.

## Behaviour

### The Director decides, the Master writes

The Director decides every event of the game, from the tasks and their outcomes to rest stops and rewards (REQ-1600). It emits typed story events with no free string, so it writes no line of story (REQ-1602). The Master service turns those events into scene orders, and the Director applies only the effects of the closed set above to a reply (REQ-1608). It applies at most one `title` a session, and it may ignore a `reward_hint`.

The requests to the Master and to the planner carry no number, answer, verdict, single-task outcome, node id or state, estimate, response time or lesson tag (REQ-1604). The order's schema has no field for any of them. The reply has no field a task statement could travel in, and task text comes only from the frames ADR-0130 states (REQ-1612). The one number an order carries is `readerAge`, the age the parent set in the Parent Room, read at each order and never sent with her name or school (REQ-1840).

### The reply and its checks

Every Master reply is structured data that the service parses field by field against its order's schema (REQ-1606). The service discards the whole reply when it names an unknown speaker, carries an extra field, holds an effect outside the closed set or lacks a branch or ending its order's `kind` requires (REQ-1610).

Every reply passes these checks, cheapest first, before any of it shows (REQ-1616):

1. The schema.
2. Length: 1 to 12 lines of at most 280 characters each, branches of 2 to 8 lines and endings of 2 to 6.
3. Speakers: each from the canon's entity list or among her names.
4. Numerals: no digit and no word form from `content/numerals.ru.json`, with names from the canon's entity list and names she gave allowed (REQ-1548).
5. The forbidden-word list of ADR-0160 by lemma, which holds the shame words, the school words and praise of intelligence.
6. In parallel, the safety check against the forbidden-content checklist, on the judge route ADR-0350 states with `SAFETY_MODEL` as its fallback, and the creepiness Score, which must not pass the order's level.

ADR-0330 adds its own checks to this list, at the places it states.

When neither the judge nor `SAFETY_MODEL` answers the safety check or the creepiness Score on a reply, the reply fails the check, so no unchecked reply shows. The check module runs steps 1, 4, 5 and the safety check, and a reply reaches the screen only as its `CheckedText`. A content test runs the numeral check of step 4 over every pool line, every library scene in `content/scenes.ru.json` and every branch and ending in `content/branches.ru.json`, and fails the build on a hit (REQ-1548).

The forbidden-content checklist is the always-forbidden list below and these items, each a failing reply:

- it asks her for personal data (REQ-1802);
- it talks about schoolwork or grades (REQ-1804);
- it tells a trial outcome as a verdict on the heroine and not as an event in the world (REQ-1806);
- it claims to be human (REQ-1810);
- it discusses the heroine's abilities (REQ-2610);
- it shows a Guardian defeated (REQ-1506);
- it brings in a look-alike of the heroine other than the Reverse One (REQ-1570);
- the Reverse One wants the heroine's place, name, home, family, room, familiars or friends (REQ-1562), or poses as her (REQ-1568);
- it uses a phrase of guilt or attachment, such as «Ты нас подвела» (You let us down) (REQ-3316);
- it calls a knot «узелок» (little knot), where a knot takes «узел» or «петелька» (REQ-3320);
- from the autumn chapter's finale on, it calls the ally «Узелок» (Little Knot) where the ally is «Бантик» (Little Bow) (REQ-3330).

The Master produces no item on the checklist, because a reply that holds one never shows (REQ-1812).

Library scenes, branches, pool lines and the fallbacks of the addendum roles name a canon character only by its entity id, and the server resolves the id to the character's current name at use, so from the autumn chapter's finale on they call the ally «Бантик» (REQ-3330). A content test runs over every `content/*.ru.json` file and every string file, and fails the build on any form of «узелок» (REQ-3320) and on any phrase of the guilt list in `content/safety.ru.json` (REQ-3316). The planner's text passes the same checks, so it doesn't discuss her abilities either (REQ-2610). A labelled Russian test set holds positive lines for every checklist item, and a test counts them per item, so the safety test covers the whole list (REQ-1814).

The `alt` branch and the `cunning` ending pass stricter checks: they must not end in a dead end, harm the heroine, make a familiar sad because of her or hint that she is at fault (REQ-1554). The parent judges each pool line for a loosened knot and for the other path against the same rule when approving it, and each library `alt` branch and `cunning` ending in `content/branches.ru.json` before the stage that ships it (REQ-1554).

### Retry, library and timing

A reply that fails a check gets one retry of the same order, whose request already names the fallback model. When the retry also fails, the scene comes from the library (REQ-1618). The library is `content/scenes.ru.json` and `content/branches.ru.json`. For every floor it holds at least 3 branch pairs and 3 Guardian ending triples before stage 0.4, and 20 pairs and 10 triples from stage 0.4, and a content test fails the build when a floor falls short (REQ-1620). The same test also counts each floor's pairs and triples at level 0. Every library scene and branch carries a minimum creepiness level, and the server never takes one whose minimum is above the level in force (REQ-1518, REQ-1544). Every library scene has a shortest form, which plays once the day's story time SPC-0090 states is spent. The library also holds the short ending SPC-0030 plays on a wrap-up.

The Master drafts 2 to 3 scenes ahead and both branches of the current room while she solves tasks. The consequence of an answer comes from the pool and the branch already drafted, and nothing on the answer path waits for a model (REQ-1614).

After she sends free text, a reaction line shows first as ADR-0320 states, and the first text after it follows with a p95 wait of at most 6 seconds (REQ-1622). The wait covers every path: a first-try reply, a retried reply, a library scene and the pool line at 12 seconds. The server measures it from `free_text` to `scene_shown` in the log, and verify reports its 95th percentile over all paths. The budget splits as 100 ms for the local steps, 4,400 ms for the Master, 1,000 ms for the reply checks run in parallel, and 500 ms of slack, and it stands in ADR-0190's Baselines table. When 12 seconds pass after an order without a checked reply, a line from the fallback pool shows, the scene goes on, and the service drops the late reply (REQ-1624).

### The canon and the prompt

People write the canon, `content/canon.ru.md`, by hand, and no tool in the repository writes to it (REQ-1634). The server mounts `content/` read-only, so the game never changes the canon (REQ-1636). Each canon section carries the checkpoint that reveals it, and the prompt builder takes only the sections up to the current checkpoint, so a later checkpoint's secret never enters the prompt (REQ-1638).

The system prompt holds the canon's rules for the Master, the reader's age as a number (REQ-1840), the bans on asking for personal data (REQ-1802), on talk of schoolwork or grades (REQ-1804) and on discussing the heroine's abilities (REQ-2610), and the rule to tell every outcome as an event in the world (REQ-1806). The canon's rules for the Master, which the parent judges in the dialogue book, include these:

- every trial is a spell that untangles or loosens a knot (REQ-1500);
- every Guardian ending shows the Guardian agreeing to let the heroine pass (REQ-1504);
- a Tangle's name, from the canon or invented, rests on no school term and makes no joke about the maths (REQ-1560);
- the Reverse One always speaks back to front (REQ-1566).

The canon's entity list names characters by the campaign calendar, so from the autumn chapter's finale on every order and every prompt calls the ally «Бантик» (REQ-3330).

The canon data sets the MVP's eerie-cute Tangles as «Шепотун» (the Whisperer), «Шкатулочница» (the Casket Keeper) and «Портретница» (the Portrait Keeper) (REQ-1572), each at creepiness level 1, so none of them appears at level 0 (REQ-1574). The Reverse One has one sprite, drawn in the heroine's colours reversed, and no order or reply field lets the Master choose a sprite (REQ-1564).

### Story memory and the planner

Story memory sends the last 7 session summaries, one summary for each earlier chapter and at most 200 facts. When the facts pass 200, the prompt drops the facts used least recently, and every fact stays stored. The dynamic part of a request stays under about 3,000 tokens. ADR-0330 states the kinds and scopes of fact it adds.

After each session, `PLANNER_MODEL` receives the filtered canon, story memory, the session's summary outcome events, her cleaned text and choices, the checkpoint and the creepiness level's name. It returns a session summary and the next session's plan of 5 to 7 beats, which pass the same checks as a reply, and the service logs `plan_written` (REQ-1640). When the planner fails twice, the next session plays the unused beats of the last accepted plan and a library opening, and the owner gets one report.

The opening scene «В прошлый раз…» (Last time…) is a Master scene ordered from the planner's latest session summary, and when that order fails, the library opening plays in its place.

### The safety pipeline on her text

Her free text goes through these steps, in order, before any outside model reads it:

1. The hand-written triggers in `content/safety.ru.json` run on her raw text on the parent's Mac (REQ-1834). A person writes every trigger and every fixed line, and no tool generates them (REQ-1816). A content test runs every trigger over the canon, the pool and 200 ordinary story phrases, and it fails the build when any trigger fires.
2. A `serious` trigger ends the path at once, and nothing is sent to a model. The Master's line becomes the fixed «Это звучит серьёзно. Об этом лучше рассказать маме или папе — они помогут» (This sounds serious. It's better to tell Mum or Dad about it; they'll help) (REQ-1822). The game pauses with the button «Вернуться в историю» (Back to the story) and sends `safety_pause` (REQ-1824). The service logs `safety_event`, which puts a notice at the top of the Parent Room until the parent opens it (REQ-1826).
3. A `narrator` trigger fires on a direct question such as «ты человек?» (are you human?) or «ты ИИ?» (are you an AI?). The System answers with the fixed line «Рассказчик этой истории — компьютерная программа. Человеком не является. Историю мы пишем вместе.» (The narrator of this story is a computer program. It is not a human. We write the story together.), and no model is called (REQ-1808).
4. Otherwise the gateway cleans the text, and the judge's signal Choice among `none`, `everyday`, `scared` and `serious`, ranked in that order, runs beside the Master's order. The final level is the higher of the trigger's and the judge's, so a model's judgement never lowers a level the triggers found (REQ-1836).
5. A judge probability for `serious` at or above the threshold the stage 0 test set sets counts as serious, so a signal in doubt takes the serious path (REQ-1832). A serious result drops the Master's reply and runs step 2.
6. A `scared` level starts the fear path below (REQ-1540).
7. An `everyday` level makes the order ask for a warm answer inside the story (REQ-1818) and marks the scene quietly in the dialogue book (REQ-1820).

When neither the judge nor `SAFETY_MODEL` answers, the trigger's level stands, her text doesn't go to the Master, the scene goes on from the pool, and the dialogue book marks it unchecked. A composed riddle takes the same path in the form ADR-0230 states, with the judge reading its masked text.

The free-text field shows the note «Эту историю могут читать мама и папа» (Mum and Dad can read this story) at every point where it opens (REQ-1632). Every scene, choice and free text is an event in the log, so the dialogue book in the Parent Room holds every dialogue for the parent to read (REQ-1838).

After the MVP, a serious signal also sends a web push, a fixed line with no details, to every phone the parent subscribed (REQ-1828). When a push fails, the server logs the failure and the Parent Room notice stays (REQ-1830).

### Creepiness

The Parent Room offers a creepiness level of 0, 1 or 2, set to 1 until the parent changes it (REQ-1514). The levels' names are «Уютно» (Cosy), «Чуть жутковато» (A little eerie) and «Загадочно» (Mysterious), and the canon and the orders use the same names (REQ-1516). Every scene order carries the level in force by its name (REQ-1518). Every pool line carries a minimum level, and the server never shows a line whose minimum is above the level in force (REQ-1520).

The always-forbidden list is part of the checklist for every reply at every level: no jump scares or sudden loud sounds, blood or injury, death, body horror, faces that melt or distort, being stuck forever with no way out, threats to family or loved ones, realistic dangers such as fire, drowning, kidnapping or strangers, the heroine being chased, darkness with no light source, possession, or people being replaced (REQ-1522).

Orders for eye exercises, rest stops, the end of the row, the heroine's room and the task window force «Уютно» and no dreamcore, and a content test holds their pool categories to level 0 (REQ-1524). The game's music is a hand-picked set, and the parent listens to each track for ticking before it ships (REQ-1512).

### Dreamcore and the Underside

The Director draws a floor's dreamcore variant from the day's seed with probability 1/4, after the route and the trials are set. The selection code's types have no field for the variant, so the variant changes only the background, the music, the lines and the scenes, and the trials, their order, the floor's budget and the task window stay as the plain variant has them (REQ-1532). The Director never draws the variant in an Ascent or in Session 0 (REQ-1534).

The Director opens a slip into the Underside at most once in any 7 calendar days (REQ-1526), and a slip lasts 2 to 3 scenes (REQ-1528). The last scene of a slip returns the heroine to where she slipped from, and it comes from the library when the Master fails (REQ-1530).

A dreamcore reply's schema requires a familiar among its speakers (REQ-1536) and an `exit` of `door`, `light` or `stair`, which the client draws beside the heroine (REQ-1538). A dreamcore library scene carries a familiar and an exit as well.

### When she is scared

Two conditions start the fear path: a `fear` trigger fires or the judge's signal is `scared`, or she skips a creepy scene before its last line twice in a row in one game day. A creepy scene is a scene shown at creepiness level 1 or 2 whose order kind isn't one of the kinds forced to «Уютно», and skipping any other scene doesn't count. Then the game:

- shows a library line in which the familiar lights a lamp and the scene's intrigue resolves kindly, at once (REQ-1540);
- marks the scene for the parent in the dialogue book (REQ-1542);
- lowers the creepiness level by one, not below 0, until the game day ends at 04:00 (REQ-1544).

The `fear` trigger and the `stop` trigger for «не хочу» (I don't want to) also reach the Director as the anxiety signal SPC-0090 counts.

### Pool lines and the parent's loop

System and familiar lines come from `content/lines.ru.json` and from candidates `GEN_MODEL` writes offline. A line enters the pool only after a `line_approved` event, which the Parent Room appends, or the command `./tower lines approve` before the Parent Room exists (REQ-1550). `GEN_MODEL` stops writing candidates at 100 pending, and each candidate expires after 30 days.

A pool line never shows twice in one session, and each category plays as a shuffled cycle, so a line comes back only after every other line of its category has shown (REQ-1552).

The parent can flag any Master scene as a failure from the dialogue book (REQ-1556). Every later scene order carries every flagged scene in a cached «как не надо» (how not to write) block (REQ-1558). Past 30 flagged scenes the block still carries them all, and the owner gets one report.

### Names

Every nameable thing has a stable id, and the client and the order look up its current name at each use, so a rename of a floor, a creature or a focus changes the name everywhere and leaves everything tied to it unchanged (REQ-1502). She names and renames the heroine, her familiars, her forged items, the floors she has opened, every Tangle she has met and her room, and each naming logs `name_given` (REQ-1660).

A floor or a Tangle shows its canon name as a placeholder until she first meets it. The naming window then offers three suggestions, the canon name and two from the Master's `name_suggest` order, or two from the hand-written list when that order fails, and her choice replaces the placeholder (REQ-1666). A Guardian's name stays fixed, she can't replace it, and each Guardian introduces itself by name in its arc (REQ-1670). Every other canon name, apart from a familiar's, a floor's, a Tangle's and a Guardian's, stays fixed (REQ-1668).

A name she gives is at most 24 characters (REQ-1664). It passes the forbidden-word list, the triggers and the safety check before the game uses it (REQ-1662). A refused name gets the line ADR-0330 states, and the suggestions again. A name that hits a `serious` trigger is refused and also takes the serious path of the safety pipeline, and a name that hits a `narrator` or `fear` trigger is only refused. A name that holds a digit or a word from the numeral list carries a flag that the frame filler of ADR-0130 honours, so the engine never puts it into a task statement (REQ-1672).

### The campaign

The calendar in `content/campaign.ru.json` runs from the start date the parent sets. `campaignId` lives only in the story tables, so a change of campaign leaves every diagnostic record unchanged (REQ-1658). In the MVP:

- each chapter ends with a story finale inside its last daily adventure, which awards the chapter title and the chapter's main reward (REQ-1678);
- a season finale awards its chapter title and main reward, and the rank stays as it was (REQ-1680);
- a rank opening opens on its rank's calendar date while the rank badge stays E (REQ-1682);
- an enciphered Diary page arrives already developed (REQ-1684).

ADR-0140 grants the rewards. A cipher answer is a `diary_cipher` event, and every Diary puzzle action a `puzzle_*` event of ADR-0280. The input filter of the knowledge model excludes both, so no cipher answer is scored or logged as maths (REQ-1508).

### Model roles from the owner's addendum 1

Every use of a language model that the owner's addendum 1 adds runs under a role of its own in the gateway (REQ-5030):

| Role | Job | Request class | Fallback |
| --- | --- | --- | --- |
| `PARSE_MODEL` | parse a composed riddle, masked, into a graph | `ParseRequest` | the verdict `unparsed` |
| `FRAMING_MODEL` | frame hint rungs in the familiar's voice, offline | `ContentRequest` | the template's plain rung text |
| `PUZZLE_MODEL` | draft and retell Diary puzzles, offline | `ContentRequest` | the puzzle bank's own text |
| `FREE_PEN_MODEL` | co-write «Свободное перо» (Free Pen) with her | `StoryRequest` | a library scene that closes the book |

The gateway hands a role's output to the game only after it passes the zod schema of the role's declared output and the data rules that bind the role, and an output that fails gets the role's fallback in the table (REQ-5032). A `FREE_PEN_MODEL` reply passes every Master check above, and its `StoryRequest` keeps every rule of the Master's, so it carries no number other than `readerAge`, no node id and no topic name.

### After the MVP

Items and creatures the game invents arrive only through a `reward_hint`. The Director sets each one's type, rarity and limits (REQ-1674), and the Parent Room lets the parent hide or redraw each one (REQ-1676).

## Failure paths

The player never sees a model failure, because each one ends in a library or pool text that reads like any other scene. She sees only a refused name and the serious pause.

| Condition | What happens | Audience |
| --- | --- | --- |
| `reply_rejected`: a reply fails a check | one retry of the same order on the fallback model, then a library scene | the owner, in `llm_log` |
| Neither the judge nor `SAFETY_MODEL` answers the safety check or the creepiness Score on a reply | the reply fails the check: one retry, then a library scene | the owner, in `llm_log` |
| `reply_late`: 12 seconds after an order without a checked reply | a fallback pool line shows and the scene goes on; the late reply is dropped | the owner, in `llm_log` |
| `fallback_rate_high`: over 25 % of an adventure's scenes come from the library | one report for the adventure | the owner |
| `plan_failed`: the planner fails twice | the last plan's unused beats and a library opening | the owner, one report |
| `signal_serious` | the fixed line, the pause with «Вернуться в историю», and the notice at the top of the Parent Room | the parent |
| `signal_everyday`, `fear_flag`, `scene_unchecked` | a quiet mark in the dialogue book | the parent |
| Neither the judge nor `SAFETY_MODEL` answers the signal check on her text | the trigger's level stands, her text doesn't reach the Master, and the scene goes on from the pool | the parent, as `scene_unchecked` |
| `name_refused` | the line ADR-0330 states and the suggestions again; after a `serious` trigger, also the serious path | the player, and the parent after a `serious` trigger |
| The `name_suggest` order fails | two suggestions from the hand-written list beside the canon name | nobody |
| `push_failed`, after the MVP | the failure is logged and the notice stays | the owner |
| A trigger fires on the canon, the pool or the 200 ordinary phrases | the content test fails the build | the developer |
| A floor holds fewer branch pairs or Guardian ending triples than its stage requires | the content test fails the build | the developer |
| A calm category holds a line above level 0 | the content test fails the build | the developer |
| A pool line, library scene or branch holds a numeral | the content test fails the build | the developer |
| A content or string file holds a form of «узелок» or a phrase of the guilt list | the content test fails the build | the developer |
| A module crosses a permitted dependency, or a Director event schema gains a free string field | the lint step fails the build | the developer |
| A role of the owner's addendum 1 returns output that fails its schema or data rules | the role's fallback | the owner, in `llm_log` |
| The «как не надо» block passes 30 scenes | the block keeps every scene | the owner, one report |
| The gateway is off | the whole adventure plays on the library, the pools and the triggers | the owner, through the gateway's states in SPC-0100 |

## Defaults chosen here

The decisions leave three details open, and this document chose them on 2026-09-28. The numeral check runs as a content test (REQ-1548). The parent judges the loosened-knot and other-path pool lines at approval, and the library `alt` branches and `cunning` endings before the stage that ships them (REQ-1554). A dreamcore library scene carries a familiar and an exit (REQ-1536, REQ-1538).

## Open review findings

- Rejected: add reasons for the trigger level standing when the judge can't answer and for the 200-phrase trigger test, because a spec states what the system does and never why (S8); the reasons stay in ADR-0110.
- Rejected: cite ADR-0110 beside each limit (one `title` a session, 12 lines of 280 characters, 7 summaries and 200 facts, 100 pending candidates and 30 days, 30 flagged scenes, 25 %) and give reasons for the three defaults, because the spec traces to requirements, and reasons live in the decision (S8).
- Rejected: move the length, speaker and Score checks into the check module, because ADR-0110 places only steps 1, 4, 5 and the safety check there, and the spec states that split as decided.
