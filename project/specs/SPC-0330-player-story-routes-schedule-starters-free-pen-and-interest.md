---
id: SPC-0330
artifact: spec
status: live
revised: 2026-09-28
states: [REQ-6438, REQ-6202, REQ-6204, REQ-6206, REQ-6436, REQ-6210, REQ-6212, REQ-6214, REQ-6216, REQ-6218, REQ-6434, REQ-6221, REQ-6222, REQ-6224, REQ-6226, REQ-6228, REQ-6230, REQ-6232, REQ-6233, REQ-6234, REQ-6236, REQ-6238, REQ-6240, REQ-6242, REQ-6243, REQ-6244, REQ-6245, REQ-6246, REQ-6248, REQ-6250, REQ-6252, REQ-6254, REQ-6256, REQ-6258, REQ-6260, REQ-6262, REQ-6264, REQ-6266, REQ-6268, REQ-6270, REQ-6272, REQ-6274, REQ-6276, REQ-6278, REQ-6279, REQ-6280, REQ-6282, REQ-6284, REQ-6286, REQ-6288, REQ-6290, REQ-6292, REQ-6294, REQ-6296, REQ-6298]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The player's own story: two routes, the schedule of new systems, starters, her words answered later, the free pen and the Interest section

## Scope

This document covers the rules that keep the story the player's own: the choice between two routes at the start of each adventure, the schedule that opens new systems by days of play, the starters that insert and never send, the free-action points and the later scene that answers her own words, the scene without tasks and the known character in every adventure, refusals, the first scene after a gap, the freshness of the Master's text, the screens she owns (the story log, favourites, hidden details, rituals and "Show" cards), «Свободное перо» (Free Pen), and the Parent Room's "Interest" section with the day mark, the signal and the 60-day acceptance run. It is written at the level of the game's parts: the modules, the routes, the fields they add to the scene order and the reply, the events they log and the states they report.

It leaves out what other documents state. SPC-0070 states how `planDay` ranks and picks a floor, and SPC-0090 states the day plan's timing, the game day, the soft stop and the screens without tasks. SPC-0110 states the scene order and the reply as a whole, the checks, retry and library path, the safety pipeline and the review queue. SPC-0140 states the daily quests and daily rewards and the other game rules each system runs once it is open; the volley, the first knot, the puzzles and the Tower's dictionary belong to their own documents, and this document only opens them. SPC-0080 states how a thread opens the hint ladder once threads are open. SPC-0180 states the report's other screens and the story book screen, SPC-0020 the event log itself, and SPC-0190 the verify command.

## Boundary

### Parts and what each offers

| Part | What it offers |
| --- | --- |
| `src/engine/director/` | Routes A and B from `planDay`, the interlude order and the known character it names, the free-action points of the day plan. |
| `src/engine/systems/` | The schedule of new systems, the event unlocks of evolution and the Underside, the projection `systems_open` and the check every route of a closed system runs. |
| The Master service | The origin of each send, the `player_action` facts, the return-phrase check, the do-not-use list and its regeneration, the decks, the opening similarity, the weekly sample and the `free_pen` order kind. |
| The client's `StoryInput` | Three starter chips, keys 1 to 3, «Дальше» (Next) and the free-pen button. |
| `src/parent/` | The Interest projection, the task-window share, the signal, the day-mark question, the card panel, the memo's checklist and the story book's print stylesheet. |
| ADR-0190's simulation group | The 60-day acceptance run. |

### Routes

Every route needs a paired device, as SPC-0030 states, and every route under `/api/parent/` also needs the parent session. Every request that changes state carries `clientSeq`.

| Route | What it does |
| --- | --- |
| `GET /api/story/chapters` | The past chapters of the story log, with favourites marked. |
| `GET /api/story/chapters/:chapterId` | One past chapter's scenes, built from `scene_shown`; logs `chapter_reread`. |
| `GET /api/story/scenes/:sceneId` | One past scene as it was shown; logs `scene_rewatched`. |
| `PUT /api/story/scenes/:sceneId/favourite` | `{ favourite, clientSeq }`; logs `scene_favorited`. |
| `POST /api/story/details/:detailId/found` | `{ sceneId, clientSeq }`; logs `hidden_detail_found`. |
| `POST /api/cards` | `{ sceneId?, moment?, clientSeq }`; creates a "Show" card and logs `share_card_created`. |
| `POST /api/pen/start` | Opens a pen session; logs `free_pen_started`. Answers `404 system_closed` before the pen has opened, and `409 pen_unavailable` with `reason`: `parent_off`, `budget`, `gateway_off` or `task_window_open` when the pen can't open. |
| `POST /api/pen/:penSessionId/turn` | Her text; replies with the checked pen reply or the closing library scene. Answers `409 pen_closed` for a session that has ended. |
| `POST /api/pen/:penSessionId/end` | Closes the pen; logs `free_pen_ended` with `reason: "player"`. |
| `GET /api/parent/cards` | The card panel. |
| `POST /api/parent/cards/:cardId/viewed` | Logs `share_card_viewed`. |
| `POST /api/parent/day-mark` | `{ gameDay, cameBackAlone, clientSeq }`; logs `parent_day_marked`. |
| `GET` and `PUT /api/parent/settings` | Gain `freePen`, on by default, and `openAllSystems`; a change logs `settings_changed`. |
| `GET /api/parent/story-book` | The story book screen of SPC-0180, with favourites and the print stylesheet. |

The route choice travels as a scene choice on `POST /api/session/:id/scene/input` of SPC-0030, and `starter_inserted` travels through the client's write queue that SPC-0030 states. No route lists or reads a card outside `/api/parent/`.

### Fields this part adds to the scene order and the reply

| Schema | Field or kind | What it carries |
| --- | --- | --- |
| Scene order | `route_choice`, `interlude`, `free_pen` | Three order kinds. |
| Scene order | `echoes` | The `player_action` facts the scene's beat answers. |
| Scene order | `doNotUse` | At most 30 lemma sequences, the most frequent first. |
| Scene order | `deckCards` | The cards dealt from the opening, finale and temperament decks. |
| Scene order | `trialFixed` | `true` on a trial's lead-in. |
| Scene order | `hiddenDetailId` | Optional; at most one detail id. |
| Reply | `starters` | A tuple of three strings of 3 to 5 words each, present only on a scene with the free-text field open. |
| Reply | `choices` | Options that send on a tap; the schema admits them only on `route_choice` and `name_suggest`. |
| Planner reply | `echoes` on each beat | The open `player_action` facts that beat answers. |
| Story memory | kind `player_action` | A fact the service stores from her send at a free-action point, with its `origin`. |
| Story memory | scope `pen` | A fact a pen reply stores; the adventure's planner never reads it. |

The reply schema has no refusal field, and no event schema of the Director has a field the Master or a route teaser could use to change a trial.

### Events this part logs

Every field is required unless marked optional, and none carries her text, which stays in `free_text` (REQ-6298).

| Event | Payload |
| --- | --- |
| `system_unlocked` | `system`, one of the 16 systems of the schedule, `dayOfPlay`, and `source`: `schedule`, `event` or `parent` |
| `route_offered` | `adventureId`, `routes`: two of `{ routeId, floors: floorKey[] }`, `defaultRouteId`, `displayOrder`: routeId[], `differsIn`: `floor` or `order` |
| `route_chosen` | `adventureId`, `routeId`, `via`: `choice` or `next` |
| `free_pen_started` | `penSessionId`, `during`: `adventure` or `after_finale` |
| `free_pen_ended` | `penSessionId`, `reason`: `player`, `soft_stop`, `budget`, `parent_off`, `gateway_off` or `reply_failed`, `turns` |
| `starter_inserted` | `sceneId`, `index`: 1 to 3, `via`: `tap` or `key` |
| `share_card_created` | `cardId`, `sceneId` (optional), `moment` (optional, an enum of room moments) |
| `share_card_viewed` | `cardId` |
| `scene_rewatched` | `sceneId` |
| `chapter_reread` | `chapterId` |
| `scene_favorited` | `sceneId`, `favourite`: boolean |
| `hidden_detail_found` | `detailId`, `sceneId`, `checkpoint` |
| `parent_day_marked` | `gameDay`, `cameBackAlone`: boolean |
| `text_freshness_scored` | `sceneId`, `kind`: `scene` or `reply`, `listedHits`, `regenerated`: boolean, `openingSimilarity` (optional, 0 to 1) |
| `free_text`, version 2 | Version 1's fields, plus `origin`: `own`, `starter_edited` or `starter_unchanged`, and `ownWords`; the upcaster sets `origin: "own"` and counts `ownWords` for version 1 |

SPC-0020 holds these types in the event catalogue.

### Content files

| File | What it holds |
| --- | --- |
| `content/decks.ru.json` | Three decks, openings, finales and character temperaments, each card an instruction to the Master. |
| `content/return-phrases.ru.json` | The phrases that miss her, wait for her or ask where she was, every form written out. |
| `content/rituals.ru.json` | The rituals, each with `on` from the enum `floor_first_scene`, `chest_opened`, `finale` and `familiar_evolved`, and no field for a time or a date. |
| `content/lemmas.ru.json` | A form-to-lemma table a tool script builds once from the OpenCorpora dictionary. |
| `content/scenes.ru.json` | At least 20 hand-written interludes, three starters on every library scene with the free-text field open, and the library teaser of every floor. |
| `content/canon.ru.md` | Sections tagged `cast: recurring`, `catchphrase` and `hidden_detail` with its checkpoint, and the rule that no character misses her, waits for her or asks about her absence. |

Each is a per-language file, as SPC-0160 states.

### Constants

| Constant | Value |
| --- | --- |
| Starters per scene | 3, of 3 to 5 words each |
| Guiding threads added each game day once open | 3 |
| Do-not-use window and threshold | 14 days; more than 3 uses of a sequence of 3 to 5 lemmas |
| Do-not-use entries per order | 30 |
| Regenerations of a repeating scene | 1, and 0 for a reply to her free text |
| Openings compared for similarity | the last 14 |
| Weekly sample | 5 Master scenes of the last 7 days; at most 10 unread in the queue |
| Open `player_action` facts in a planner order | 10: those older than the current adventure first, then the newest |
| Age at which an unechoed `player_action` fact closes | older than 3 adventures |
| Interlude's story budget | 90 seconds of the 10 minutes of story |
| Pen facts in a pen order | 50, the least recently used dropped |
| Hidden details per scene order | 1 |
| Task-window share target | 60 % |
| Signal: fall in own words | 30 % or more, last 14 days of play against the 14 before |
| Days of play before the signal can rise | 28 |
| Day-mark question | days of play in the last 7 days |
| Unviewed cards reported | at 50 |

### Failure states

| State | Audience |
| --- | --- |
| `404 system_closed` | the developer, in the server log |
| `routes_identical` | the developer, in verify's count |
| `consequence_missed` | the owner, one report per adventure |
| `route_teaser_fallback` | the owner, in `llm_log` |
| `interlude_fallback` | the owner, in `llm_log` |
| `interlude_missing` | the owner, one report per adventure and a red simulation check |
| `known_character_none` | the owner, one report |
| `return_line_refused` | the owner, in `llm_log` |
| `repeat_after_regeneration` | the parent, through the repetitiveness figure |
| `pen_closed_soft_stop`, `pen_closed_budget` | the player, who sees only a story scene |
| `409 pen_unavailable`, `409 pen_closed` | the client, which draws no pen button and shows a library line |
| `name_refused` | the player |
| `interest_too_little_data` | the parent |
| `interest_signal` | the parent |
| `share_cards_unviewed_high` | the parent |

### What this part requires from other parts

- SPC-0070 supplies `planDay`, the total value of each floor and the three-day window check; SPC-0090 supplies the day plan's order, the adventure's active time, the soft-stop point, the eye count and Session 0's steps.
- SPC-0110 supplies the scene order and reply schemas, the checks, the retry and library path, the planner, story memory, the safety pipeline, the parent note on free text and the review queue.
- SPC-0100 supplies the gateway, `FREE_PEN_MODEL` and the adventure's model bucket; ADR-0350 supplies the judge's route.
- SPC-0080 supplies the task window's states `open` to `closed`, the thread ledger, the hint ladder, the explanations and the short solution.
- SPC-0140 supplies each system's own rules once it opens, the chest's categories and the daily quests.
- SPC-0160 supplies the strings of the System lines and the name-refusal lines.
- SPC-0020 supplies `appendEvents` and the projections' storage; SPC-0030 supplies the routes' contract, the write queue and the lease.

### Permitted dependencies

The dependencies run one way, and the lint step fails a build that crosses them.

- `src/engine/systems/` reads only the log's `system_unlocked` and `scene_shown` events, the settings, and the friendship grant and the slip whose transactions it joins, and imports nothing from the Master service or the client.
- `src/engine/director/` imports none of the Master's text; the route teasers reach the Director only as the chosen `routeId`.
- The Master service computes a send's origin and `ownWords` from the scene's stored starters, and never reads an origin the client sends.
- The story log's routes build from `scene_shown` and never import the gateway.
- The client imports only `src/shared/`; the player's client code never imports the card panel.
- `src/parent/` reads the projections and never writes to the day plan; nothing in the Director reads the task-window share or the Interest projection.

## Behaviour

### The adventure's order and the route choice

The adventure of the day runs in this order: «В прошлый раз…» (Last time…) with the daily quests once they have opened, the route choice, 3 maths floors, or 4 when the forecast leaves time, an interlude after a floor's chest, and a finale that ends on a cliffhanger (REQ-6234). Once daily quests have opened, on day 3 of play, the daily quests and their daily rewards come every game day, as SPC-0140 states, and the route choice adds to them and never takes a quest's place (REQ-6234).

`planDay` returns two routes, A and B, for every new adventure. Route A is the route `planDay` builds alone. Route B keeps every floor the window forces: each domain overdue for 2 adventure days, and each domain that would miss the three-day window without a floor today. Both routes have the same number of floors and the same planned number of graded slots, the smaller of their two forecasts, so both keep the three-day domain window, the overdue-first rule and the day's planned graded slots (REQ-6236). Among the other places, B swaps A's free floor of lowest total value for the domain of highest total value not on A, when the swap keeps the window for the next two days. When no swap keeps it, B holds A's floors in another order with another opening beat (REQ-6238). `route_offered` records which, in `differsIn`.

The choice plays as a story scene of kind `route_choice` straight after «В прошлый раз…». The Master writes one teaser for each route from the route's floor keys and opening beat. The two doors appear in an order drawn from the adventure seed. The route choice is a plot choice, so its options send on a tap, and the scene holds its `choices` and no free-text field (REQ-6218). «Дальше» takes whichever of A and B has the higher total value by the Director's ranking, and A on a tie, and logs `route_chosen` with `via: "next"` (REQ-6240). A resumed adventure keeps the chosen route, and only the chosen route's floors count in the three-day window.

### The schedule of new systems

Unless the parent has opened every system at once, systems open by days of play on this schedule (REQ-6244):

| Day of play | Systems that open |
| --- | --- |
| 1 | levels and the chest |
| 2 | guiding threads, the hint ladder and the volley |
| 3 | daily quests and the first knot |
| 4 | the Diary and the bestiary |
| 5 | a second familiar |
| 6 | the forge |
| 8 | the shop, «Свободное перо» and the Tower's dictionary |
| its event | evolution, at the first friendship grant that brings a familiar to its evolution threshold; the Underside, at the Director's first slip |

A day of play is a game day whose log holds at least one `scene_shown` of an adventure, Session 0 excluded, so a calendar day without play moves the schedule on by nothing. When the day's first adventure scene, «В прошлый раз…», starts, the server appends `system_unlocked` with `source: "schedule"` for each system the schedule opens on that day of play and that isn't open yet, and that scene introduces the new system in one System line. A scheduled system never opens in the middle of an adventure, and a day spent only in her room or the pen opens nothing. `src/engine/systems/` appends `system_unlocked` with `source: "event"` for evolution in the transaction of the first friendship grant that brings a familiar to its evolution threshold, and for the Underside in the transaction of the first slip the Director opens, as ADR-0110 part 7 decides. A system whose event never happens stays closed. Task forms aren't systems, and the schedule holds none back.

The projection `systems_open` reads `system_unlocked`. Every route of a closed system answers `404 system_closed`, and the client draws no entry to it. A system once open stays open.

The Parent Room's setting `openAllSystems` appends `system_unlocked` with `source: "parent"` for every system still closed (REQ-6246). Switching the setting off again closes nothing.

Session 0 appends the day-1 unlocks, the levels and the chest, because its fourth step is the first chest. Session 0's training step trains the answer field and «Не знаю» (I don't know) on trivial numbers, and never guiding threads, hints or explanations (REQ-6243).

Every chest offers three rewards from three different categories. The categories are cosmetics; star-steel shards and star yarn, which form one category; buttons; and, once the Diary has opened, Diary pages. Until the Diary opens, every chest offers one reward from each of the other three (REQ-6252).

### Threads before and after they open

Until guiding threads open on day 2 of play, every attempt is unassisted. The task window draws no thread button and offers no hint rung, detailed explanation or backpack pocket, and it still shows the free short solution after `partial` and `alt` (REQ-6245). Before threads open, only a clean row grants a thread, into her stock, where it stays undrawn until threads open; no other source grants one, and nothing is back-filled.

At the start of each game day after guiding threads have opened, the game adds 3 guiding threads to her stock (REQ-6248). On the day threads open, the morning grant comes with the unlock at the start of the adventure, even when the day's first contact came earlier, so day 2 of play already gives 3 threads. Once threads have opened, the task window always shows «Путеводная нить · N» (Guiding thread · N) with her current number of threads (REQ-6250). SPC-0080 states what a thread does.

### Starters and «Дальше»

Every scene offers «Дальше», which moves the story on without her typing, and every scene with the free-text field open also offers three starters (REQ-6436). A scene without the field, the `route_choice` scene included, offers no starters. Each starter is the start of a sentence of 3 to 5 words. The Master's reply carries them as `starters`, and each library scene with the field open carries its own three. The third starter of every scene is strange and funny (REQ-6214).

A tap on a starter inserts its words at the cursor, with a space before them when the field already holds text, and never sends (REQ-6210). On a physical keyboard, keys 1, 2 and 3 insert the matching starter while the field is empty and never send; on a field that holds text, the key types its digit (REQ-6212). Each insertion appends `starter_inserted` with `via: "tap"` or `"key"`.

Options that send on a tap appear only where the plot offers a choice, the route or a name: the reply schema admits `choices` only on the order kinds `route_choice` and `name_suggest` (REQ-6218). A static check fails the build when a reply schema admits `choices` on any other kind. The free-text field opens at the points SPC-0230 lists.

### Free-action points, her own words and their consequences

While the free-text field is on, the day plan marks as free-action points every floor entry, the campfire when a rest stop comes, and the finale's `session_end`. A floor entry isn't the lead-in to a trial, so a plan of 3 floors carries at least 4 points, at least 3 of them not tied to a trial, and every adventure played with the field on has at least 2 points, at least one not a trial's lead-in (REQ-6438). An adventure played with the field off has no free-action points, and its `session_end` counts no own action. A free action changes only the story: it travels through `remember`, `relation`, `running_joke`, `title` and the planner's beats, and it never changes a trial, its outcome or which task comes.

When she sends, the server writes `free_text` at version 2. The server compares the normalised text with the scene's stored starters and sets `origin`: `own` when her text holds no starter, `starter_edited` when she changed an inserted starter or added to it, and `starter_unchanged` when she sent a starter as it was. `ownWords` is the number of words she sent minus the words of an inserted starter. The finale's `session_end` is the adventure's own-words point: there an unchanged starter still moves the story, as any send does, and doesn't count as her own action (REQ-6216).

Every send at a free-action point becomes a story fact of kind `player_action` with its `origin`, an unchanged starter included, which the service stores itself before it calls the Master, and a later scene reads it (REQ-6438). The planner's order lists the open `player_action` facts, at most 10: those older than the current adventure first, then the newest. The planner's reply names, in some beat's `echoes`, every fact the order carried that is older than the current adventure and has the origin `own` or `starter_edited`, so a later scene of the same adventure or the next one shows her a consequence of each own action (REQ-6202). The check reads only the facts the order carried. A plan that leaves such a fact unechoed fails the planner's checks and takes the retry and then the fallback plan of SPC-0110. The fact stays open for the next plan, and a fact older than 3 adventures closes unechoed. Scene orders carry their beat's `echoes`, and `scene_shown` logs them.

### The scene without tasks and the known character

Every adventure plan holds one order of kind `interlude`, which is neither a trial's lead-in nor a transition and holds no task (REQ-6204). It plays after the second floor's chest on a plan of 3 or more floors, and after the first floor's chest on a plan of 1 or 2, before the next floor's entry or the finale. A resumed adventure plays it once if it hasn't played yet. Its budget is 90 seconds of the 10 minutes of story SPC-0090 allows. When the interlude's reply fails twice, a library interlude plays, dealt like the decks.

The interlude's order names one character from the canon's recurring cast whom she has met: the one she met least recently, by the speakers in `scene_shown` (REQ-6266). The cast is the canon's sections tagged `cast: recurring`, without her familiars and the System. Session 0's first scene introduces one member of the cast.

### Refusals and names

The Master refuses a story action only on the safety path of SPC-0110 or on an item of its safety checklist (REQ-6278). The prompt carries the canon's «Да, и…» (Yes, and…) rule, and the judge's checklist holds the item "refuses or blocks her action without a safety reason", so a reply that refuses on other grounds fails and takes the retry. A reply that refuses carries a turn in the story in the same reply (REQ-6279).

A trial's lead-in order carries `trialFixed: true`, and when her action would cancel the trial, the Master answers with a "yes, and" redirection that keeps the trial (REQ-6280). No effect in the Director's closed set touches a trial.

When the game refuses a name she gives, its line names the limit the name broke, its length or a word the Tower doesn't take, without the number, and her text stays in the field beside the suggestions so she can shorten or change it (REQ-6282). The words come from the string file of SPC-0160.

### The first scene of every adventure

A scene order has no field for a date, a gap or a count of days. Every line of the first scene of every adventure, from the Master, the pool or the library, passes a check against `content/return-phrases.ru.json`, so no first scene after a game day without play mentions the gap or her absence, says anyone missed her or waited for her, or asks where she was (REQ-6232). The game refuses any return line that holds a phrase from that list (REQ-6233). A Master reply that fails takes the retry and library path of SPC-0110, and a pool or library line that fails fails the build. The owner writes the list and the parent approves it at the stage 0.3 acceptance, and the family adds a phrase through a commit the parent approves.

### Freshness of the Master's text

The projection `phrase_counts` counts each sequence of 3 to 5 lemmas in the Master's scene text over the last 14 days. The lemmas come from `content/lemmas.ru.json`, and an unknown word counts as its normalised form, so Russian inflections of one phrase match. A sequence seen more than 3 times joins the do-not-use list that each later order carries in `doNotUse`, at most 30 entries, the most frequent first (REQ-6254). A sequence that holds a running joke from story memory, a section of the canon tagged `catchphrase` or one of her current names never joins the list (REQ-6264). A content test runs the do-not-use rule over every line of the canon's recurring cast and familiars as though each line were used 4 times in 14 days, and fails the build on any line it would strike that the canon hasn't tagged `catchphrase`. SPC-0110 states the canon's limit of once a session for each running joke.

After a drafted scene passes the checks of SPC-0110, the service looks for do-not-use sequences in it. A scene that holds one and isn't a reply to her free text is regenerated once, and a reply to her free text is never regenerated (REQ-6256). A regenerated scene that still holds a listed sequence shows anyway. The service appends `text_freshness_scored` for every Master scene.

Openings, finales and character temperaments come from the three decks of `content/decks.ru.json`, dealt without replacement by the adventure seed and reshuffled when a deck is spent (REQ-6258). The dealt cards travel in `deckCards`. The service scores each opening's similarity to the last 14 openings as the largest Jaccard overlap of their lemma pairs, on the Mac and with no model call (REQ-6260), and nothing gates on the score.

Each week the server draws 5 Master scenes of the last 7 days, by the week's seed, into the parent's review queue of SPC-0110 (REQ-6262). The queue holds at most 10 unread sample scenes, and a new week's draw drops the oldest, which stay in the dialogue book.

### The screens she owns

She can reread any past chapter and rewatch any past scene from the story log, which the server builds from `scene_shown` with no model call (REQ-6268). She marks a scene as a favourite there, and favourites show in the story log and in the Parent Room's story book (REQ-6270).

Hidden details are canon sections tagged `hidden_detail` with their checkpoint, and the prompt builder's checkpoint filter of SPC-0110 keeps out every detail of a checkpoint she hasn't reached (REQ-6272). A scene order carries at most one `hiddenDetailId`, which the client draws as a spot she can tap. No progression rule, quest template or Director event reads a detail, so she can progress through the whole story without finding one (REQ-6274).

Every ritual follows a game event named in its `on` field, and the schema has no field for a time or a date (REQ-6276). A static check fails the build when a ritual entry carries one.

She makes a "Show" card from a scene or from a moment in her room, and the card reaches only the Parent Room's card panel behind the PIN (REQ-6284). The player's routes can create a card and never list or read one. At 50 unviewed cards the card panel shows one line saying so.

### «Свободное перо»

«Свободное перо» opens on day 8 of play. From then on, while the parent's setting `freePen` is on, she opens it from the heroine's room or from a button on the scene screen at any moment the task window is closed, during an adventure included (REQ-6434). The pen stays closed while the gateway is off or the current adventure's bucket can't pay a turn (REQ-6434). The setting starts on, and the parent can switch it off at any time (REQ-6224). Switching it off while the pen is open closes the pen with `reason: "parent_off"`.

Each pen turn runs the safety pipeline and the reply checks of SPC-0110, and the field shows the same parent note as every other free text (REQ-6221). Each turn is a `StoryRequest` of kind `free_pen` to the `FREE_PEN_MODEL` role. It carries story memory and no task, score or Director event, and the service writes no knowledge-model event for it (REQ-6222). A pen reply may apply only `remember` with scope `pen`, and a pen order carries at most 50 pen facts. When a pen reply fails its schema or checks twice, a library scene closes the book, `free_pen_ended` logs `reason: "reply_failed"`, and she can open the pen again.

Pen time counts in the day's active time and in the eye count (REQ-6226). When the day's active time passes the soft-stop point, or the adventure's bucket can't pay for the next turn, the pen closes the book through a library scene and offers no extension (REQ-6228). After a soft-stop close she can open the pen again, and each time it closes the book again after its first turn, until an «Ещё один ряд» (One more row) in the adventure moves the soft-stop point on. After a budget close the pen stays closed while the bucket can't pay a turn.

The pen spends only what the bucket of the current adventure left, and it has no bucket of its own (REQ-6230). The current adventure is the open one, or after the finale the one that finished that game day; the day's plan creates it at the game day's first contact, so a pen opened before the first floor spends from it too. While that adventure is unfinished, the pen spends only what exceeds the forecast cost of its remaining scenes. With the gateway off, the pen shows a library line and stays closed, and a pen that is open when the gateway goes off closes the book through a library scene and logs `free_pen_ended` with `reason: "gateway_off"`. While the pen can't open, `POST /api/pen/start` answers `409 pen_unavailable` with the reason, and the client draws no pen button.

### The Parent Room

The report's summary screen holds the "Interest" section, built from the event log and the parent's day marks (REQ-6288). For the last 14 days of play and for each adventure in them, it shows:

- whether she came back by herself, from the parent's mark;
- her extensions;
- her own words per adventure, the share of her sends whose origin is `own` or `starter_edited`, and the share of free-action points she passed with «Дальше» and no send;
- the optional activities she used: the free pen, rereading, favourites, hidden details, cards and puzzles;
- the systems she used;
- the repetitiveness figure, the share of Master scenes whose draft held a do-not-use sequence, with the week's median opening similarity;
- the task-window share against its 60 % target.

The task-window share of an adventure is the active time during which a task window was open, from its `open` state to its `closed` state, over the adventure's active time (REQ-6206). The plan never reads it.

The Parent Room asks, for each day of play in the last 7 days with no mark, one question with two answers, whether she came back to the game by herself, and the answer appends `parent_day_marked` (REQ-6290). A day older than 7 days drops out of the question.

The signal "the story is stopping being hers" rises when her own words per adventure, starter text excluded, fall by 30 % or more between the last 14 days of play and the 14 before, and the share of her sends with origin `starter_unchanged` rises over the same two windows (REQ-6292). Both windows leave out every adventure played with the free-text field off. While it is raised, one line at the top of the Interest section says so. Before 28 days of play, the section shows «мало данных» (too little data) in place of the signal. Each week of the section shows whether the signal rose in it, and a week of play counts towards a backlog item's acceptance only when the signal didn't rise in that week (REQ-6294). SPC-0190 states the rest of the backlog row.

The memo holds a checklist for her first week of play beside the rule against tying play to rewards or punishments outside the game (REQ-6242). In the MVP, the story book screen exports the story book as a PDF through the browser's print and a print stylesheet, with no PDF library on the server (REQ-6286).

### The 60-day acceptance run

Before acceptance, ADR-0190's simulation group runs 60 simulated days (REQ-6296). The run passes when it shows, in every adventure played with the free-text field on, at least 2 free-action points with one not tied to a trial, and at least 4 with 3 not tied to a trial on a completed 3-floor adventure, and, in every adventure, one scene without tasks and a known character in a scene order. It also shows systems opening on the days of the schedule, starters that only insert, no task, score or knowledge-model event in the free pen, and first scenes free of the listed return phrases. On synthetic data, the signal rises on the profile whose own words fall 40 % while its unchanged starters rise, and stays down on the others. No whitelisted sequence joins a do-not-use list.

## Failure paths

| Condition | What happens |
| --- | --- |
| A request reaches a route of a closed system | `404 system_closed`; the client draws no entry, and the server log records it. |
| B can differ from A in no floor and no order, as on a one-floor remainder | One route plays with no choice scene, and `route_offered` isn't written (`routes_identical`). |
| A teaser reply fails twice, or the gateway is off | Each door shows the library teaser of its route's first floor (`route_teaser_fallback`). |
| A plan leaves an older `player_action` fact unechoed after the retry | The fallback plan plays; the fact stays open for the next plan until it closes; the service logs `consequence_missed` and reports it to the owner once per adventure, and sends no report while the gateway is off. |
| The interlude's reply fails twice | A library interlude, dealt like the decks, plays (`interlude_fallback`). |
| The interlude's reply fails and the library holds no interlude | The plan goes on without the interlude, the adventure misses its scene without tasks, and the owner gets one report per adventure and a red simulation check (`interlude_missing`). |
| No member of the recurring cast has been met | The interlude plays without one, and the owner gets one report (`known_character_none`). |
| A first-scene reply holds a return phrase | The retry, then the library (`return_line_refused`). |
| A pool or library line of a first scene holds a return phrase | The build fails. |
| A reply refuses her action without a safety reason | The judge's checklist item fails it, and it takes the retry. |
| A regenerated scene still holds a listed sequence | It shows, and `text_freshness_scored` records it (`repeat_after_regeneration`). |
| A reply schema admits `choices` outside `route_choice` and `name_suggest`, or a ritual has a time or date field | The build fails. |
| The do-not-use rule would strike a line of the recurring cast or a familiar that the canon hasn't tagged `catchphrase` | The content test fails the build. |
| The client sends an `origin` with her text | The server ignores it and computes the origin from the scene's starters. |
| The soft-stop point passes, or the bucket can't pay the next turn, while the pen is open | A library scene closes the book with no extension, and both look the same to her (`pen_closed_soft_stop`, `pen_closed_budget`). After a soft-stop close each reopened pen closes after its first turn until an «Ещё один ряд» moves the point; after a budget close the pen stays closed while the bucket can't pay. |
| A pen reply fails its schema or checks twice | A library scene closes the book, `free_pen_ended` logs `reason: "reply_failed"`, and she can open the pen again. |
| The gateway is off | The pen shows a library line and stays closed; every other part plays on the library. |
| The gateway goes off while the pen is open | A library scene closes the book, and `free_pen_ended` logs `reason: "gateway_off"`. |
| She opens the pen while it can't open: the setting off, a bucket that can't pay a turn, the gateway off or a task window open | `409 pen_unavailable` with that reason; the client shows no pen button. |
| A turn reaches a pen session that has ended | `409 pen_closed`. |
| The parent switches the pen off while it is open | The pen closes with `reason: "parent_off"`. |
| A name breaks a limit | The line names the limit; her text and the suggestions stay (`name_refused`). |
| Fewer than 28 days of play | «мало данных» in place of the signal (`interest_too_little_data`). |
| The signal rises | One line at the top of the Interest section until the condition clears (`interest_signal`). |
| 50 cards wait unviewed | One line in the card panel (`share_cards_unviewed_high`). |
| A new week's sample finds 10 unread scenes in the queue | The oldest drop from the queue and stay in the dialogue book. |

## Choices this document makes

- The paths of the story log, card, pen, day-mark and card-panel routes in the Routes table. ADR-0330 names the routes and not their paths.
- Switching `freePen` off while the pen is open closes it with `reason: "parent_off"`, the value ADR-0330's `free_pen_ended` payload holds.
- The answers of the pen routes when the pen can't open or has ended, including `budget` when the bucket can't pay a turn: `409 pen_unavailable` with its reasons and `409 pen_closed`.
- A pen open when the gateway goes off closes with `reason: "gateway_off"`.

## Open review findings

- The reviewer asked for ADR-0330's reason beside thirteen rules. Rejected: a specification states what the system does and never why (S8), and the reasons stay in ADR-0330.
- The reviewer suggested "at the first contact of the game day" for the thread grant. Rejected: the text keeps REQ-6248's wording and already states that the first grant comes with the unlock.
- The reviewer suggested pointing the chest categories and the return-phrase list's approval to other documents. Rejected: REQ-6252 and REQ-6233 are in this document's `states:`, so it states both.
- The second reviewer suggested "all 4" in place of "at least 3 of them not tied to a trial". Rejected: the sentence states ADR-0330 part 5's bound as written.
