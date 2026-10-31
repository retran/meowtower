---
id: RES-4312
artifact: research
status: approved
revised: 2026-10-31
elaborates: RES-4311
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The game can run as an anime series of generated arcs over a fixed spine, with abilities as keys to the Tower's hatches, a world calendar in played days and a story ontology the agents write through

## Summary

This record is the game's design document for the RPG system, progression through the world and the story. The game keeps one progression value, the ability level on each of 79 nodes. Abilities open 36 gates on hatches, passages and secrets, in the manner of a metroidvania, while every floor stays open as CAN-0030 demands, so the story never waits for a skill and the gates lock less than a true metroidvania does. The story runs as an anime series: one fixed overall plot, many generated arcs of seven kinds, and episodes inside them, where one episode is one adventure and one day or night of world time on a world calendar that counts played days. A story ontology of typed records holds characters, relations, threads, setups and payoffs, and rebuilds from the event log. An agentic pipeline plans an arc, outlines each episode, writes beats, critiques them against craft rules as checks and revises, and I estimate about $0.6 an adventure against the limit of $5. Three approved designs conflict with this and must change: ADR-0110's single-session planner, CAN-0080's calendar in real months and CAN-0030's "every night". The graph holds 11 broken prerequisite edges and rank D rests on 2 nodes, and both need fixing first. Everything numeric about gates, arcs and costs is my proposal; no source I read tests a metroidvania structure in a learning game, and the storytelling evidence comes from long-story generation in general, not from a child's daily game. The owner decided on 2026-10-31 that the design isn't reduced for size, because the project is experimental, so the order at the end is a build sequence and no feature is cut by it.

## The question

How should the RPG system, the player's progression through the game world and the story arcs work, so that ability levels open new possibilities and models can write the story well?

These are the owner's decisions of 2026-10-31 and they are constraints: a node is an ability with a level that comes from its estimate and may fall; the rank comes from those levels and reaches her through a story event; no experience accumulates; a level opens possibilities that stay open after a fall; a fall takes no item, title, floor, currency, friendship or page. The story has one overall plot, many arcs and episodes inside arcs, in the structure of an anime series. Arcs are generated as the plot and her actions develop. One adventure is one day or night in the world, and the world has its own calendar. Summaries are saved so later generation remembers events and characters. A story ontology lets agents write scripts by the canons of screenwriting. Word problems are part of the skill, and the Tower being alive is a secret that stays out of task text.

Two assumptions needed a challenge. The first is that a metroidvania fits: the genre locks map areas, and CAN-0030 opens all floors on the first day. The second is that more planning makes a better story for a child: the evidence shows plans improve coherence in long texts, and says nothing about delight.

## Method

Repository read on 2026-10-31 on the working tree over revision 3394f32: `content/graph.yaml`; ADR-3220, RES-4311, ADR-0110, ADR-0330; SPC-0110 (story memory, campaign), SPC-0130 (prompt slots), SPC-0140; CAN-0010 to CAN-0130. A research agent read the canon and proposed the first draft of the gate, arc and calendar sections. I corrected them, and I added memory, ontology, pipeline and cost.

Counted from `content/graph.yaml` with a throwaway script: 79 nodes, 130 edges, typical groups and the broken edges. Costs use the price table in `src/server/gateway/prices.ts` and token counts I assumed, because no such pipeline has run.

External sources carry three labels in Sources. Read means I read the text or abstract page. Snippet means I saw only a search result's summary, so a claim from it is weaker. Tags in the findings mark [Count], [Read], [Snippet], [Proposal] and [Inference]. Screenwriting books were not read at first hand. What I state of Harmon, Snyder, Truby and McKee is general knowledge of them, marked [Unread], and each is encoded as a proposal for the owner to judge.

No test ran with the player, and no generated arc has been produced.

## Findings

### 1. The RPG system holds one progression value

| Part | Now | Design |
| --- | --- | --- |
| Abilities | 79 nodes, levels 1 to 5, 395 states [Count] | The only progression value |
| Rank | E to S from levels, given in a story event | Kept, with the rule fixed in section 3 |
| Floor mastery | Doesn't exist | A read-out: the mean level of a floor's abilities, shown on the Tower's map |
| Characteristics | 5 in CAN-0070, none in the MVP [Read] | Replaced: without experience nothing grants points. The five names return as a derived read-out only if the owner wants it |
| Paths | 5 at rank C [Read] | Kept as a story choice at rank C after the MVP, with no effect on a trial |
| Familiars | 24 starters, 3 legendary [Read] | Kept as companions and cast. Friendship is a counter of shared play. It accumulates, unlike experience, because it records relationship and not skill |
| Items, buttons, shards, yarn, guiding threads | [Read] | Kept. None carries progression |

[Proposal] So one value feeds three read-outs: the sheet, the rank and the map. The player sees numbers, as the owner requires of an RPG, and every number comes from the graph.

### 2. Abilities map to floors after three overlaps are settled

[Count] Domains and floors of CAN-0040:

| Floor | Domain | Nodes | Fit |
| --- | --- | --- | --- |
| 1 Archive, numbers | N | 8 | Good |
| 2 Works, operations | A | 17 | A15 and A16 are equations, which no floor names |
| 3 Confectionery, fractions | F | 8 | Good |
| 4 Canal, decimals | D | 7 | D4 and D5 are multiplication and division of decimals, which fit |
| 5 Fair, proportion | P | 7 | Good |
| 6 Dunes, measure | M | 14 | M4 to M7 are areas and volumes, which CAN-0040 gives to floor 7 |
| 7 Garden, shapes | G | 7 | Good |
| 8 Sorting Office, data | S | 7 | Good |
| 9 Observatory | none | 0 | Science, outside the graph |
| No floor | T | 4 | Word problems, CAN-0040's open question |

[Proposal] D stays on the Canal, because the decimal is what the task trains. A15 and A16 stay on the Works, which gains a wing for the equations. M4 to M7 move to the Garden's map while staying in domain M, so the map and the domain differ for four nodes. T1 to T4 become the Guardians' trials on every floor, which is where SPC-0070 already places them.

### 3. Rank D needs another rule

[Count] Groups 1 to 8 hold 3, 1, 6, 2, 19, 22, 14 and 12 nodes. So E holds 10 nodes, D 2 (M2 and T2), C 19, B 22 and A 26. [Inference] Rank D moves on a single node, which contradicts the promise that a rank is a rare landmark. [Proposal] A rank's range becomes cumulative: rank D counts groups 1 to 4, C groups 1 to 5, B groups 1 to 6 and A groups 1 to 8. This also says what a rank means in plain words: she holds everything up to that group. ADR-3220 and the requirement that maps ranks to groups change accordingly. A rank then becomes much harder at D to B for a child in an upper group, who starts with low evidence on old nodes, so the cold-start probes of ADR-0070 matter here. The inference rule that a fluent node passes "fluent (inferred)" to ancestors can't help, because levels read the estimate and not the states. So a level must take inference too, or an old node stays at level 1 until tested. This is a defect in the current design, and the design step must settle it.

### 4. The graph has 11 broken edges

[Count] 11 of 130 prerequisite edges name a subtype the prerequisite doesn't have: F3 on F1.same-den and N5.line; P1 on F1.half-tenth and D6.decimal; M1 on N3.whole and D3.decimal; M3 on A5.whole and D2.cents; M5 on A3.grid and A7.formula; M12 on M9.ha. These are all of the graph's subtype edges. A gate or a prerequisite check that reads them finds nothing. Each needs a real subtype or a node-level edge before a gate relies on it.

### 5. The Tower works as a metroidvania of hatches, not of floors

[Read] Wikipedia defines the genre by non-linear exploration with areas closed until she gains abilities, abilities that also reveal shortcuts and secrets, and repeated traversal. [Snippet] Mark Brown describes Hollow Knight as a critical path of upgrades under an open-looking map; an essay holds that nearly every zone has several approaches; the developers call it lock-and-key that they try to submerge in a natural world; a guide warns against soft-locks. [Snippet] A Zombie Division study reports that children learned more when the maths was the game's core action, and played 7 times longer by choice.

[Inference] Three findings shape the design. A key should be a verb she can use, because a level number that merely unlocks a door is the sugar coating the Zombie Division study warns against. Several gates per area give her a choice of route, which also serves an uneven player. A fixed critical path must exist and be free of skill gates, because the owner wants the story never to wait.

[Proposal] Each domain gives her a world verb in the setting, which she gains at level 2 and which grows at levels 3 to 5:

| Domain | Verb in the setting | What it does in the Tower |
| --- | --- | --- |
| N | Reading the Numbers | Reads the Archive's marks, opens catalogue drawers |
| A | Turning the Works | Runs mechanisms, moves lifts and shutters |
| F | Dividing the Sweet | Cuts seals and shares, splits what blocks a way |
| D | Reading the Tide | Sets the Canal's locks and levels |
| P | Balancing the Scales | Trades at the Fair, balances counterweights |
| M | Pacing the Dunes | Measures paths, finds what is buried at a distance |
| G | Growing the Shape | Fits and folds shapes, unfolds hidden rooms |
| S | Sorting the Post | Finds patterns, routes letters, reads what the data hides |
| T | Telling the Riddle | Talks to Guardians, reads problems as stories and solves their trials |

Gate kinds, with real nodes:

1. Level gate: one ability at a level. A passage in the Works opens at level 3 of A4, the division table.
2. Combination gate: two abilities from two floors, which is what makes backtracking worth it. A hatch in the Canal opens with D4 and A7 at level 3, and the player must go up to the Works and come back.
3. Stretch gate: the graph's `stretchGate`. N8's route opens at level 4 of N6 and N7. [Count] 10 stretch nodes carry 23 gate references, so this kind already exists in the data.
4. Word-problem gate: a sealed door opens at level 3 of T3, the three-step problem.
5. Rank gate: rank C opens the path choice, and rank B the entry to the Underside (CAN-0070).
6. Secret gate: a floor's secret place, which CAN-0070 ties to rank D.
7. Shortcut gate: a passage between two floors that saves story time and rewards a strong ability, which is the genre's second use of keys.

[Proposal] 36 gates: 9 secret gates, one per floor, 10 stretch gates, 5 rank gates and 12 level, combination or word-problem gates. That is about one gate for two nodes. Each opening leads to a thing she can do again: a shop, a shortcut, a Guardian's trial, a companion, a room or an arc. No gate leads to a task bonus, because task difficulty follows the node alone.

Gates stay outside the critical path, and a content test walks every checkpoint with every gate closed. [Inference] This is the design's strongest objection: if a gate never blocks anything needed, a child may feel no pull towards it. The arcs answer that: a generated arc can put a want behind a gate, such as a familiar stuck beyond a hatch, and the Tower's map shows closed gates she has seen. She chooses which ability to grow next, which gives autonomy, the need [Snippet] Ryan, Rigby and Przybylski tie to enjoyment of games.

An uneven player: strong in A, weak in F. Her Works gates are open and her Confectionery secret isn't. The arc generator reads her levels and offers arcs on her strong floors, with a want on a weak one, so she sees a reason to go there. Task selection still follows the Director, so the story adds motivation and doesn't tilt measurement.

A fall, played through. Her A4 estimate drops after a month away from it. After a second observation below the line, the Works' foreman says a belt is slipping on the boiler line, and the Master writes this into the next scene. On the third, the level falls from 4 to 3, the sheet shows it, and a thread event says the line needs mending, with a side trial on A4 tasks. The passage she opened at level 3 stays open. If the rank's share then stays below its line for 14 days, the next arc opens with the fall of rank as a story event: the Tower's windows dim on one floor and a Guardian asks her to help. Nothing is taken, and the story says nothing about her.

### 6. The story is an anime series with a fixed spine

[Read] Kishotenketsu has four parts: introduction, development, twist and conclusion. [Read] Filler in anime exists because the show outruns the manga. [Snippet] An arc is a run of episodes that answers one impetus; tournament arcs end or begin a section of the plot and can be short, about six episodes; training arcs give characters time to grow; a well-known show held about 40 % filler. [Inference] Filler here has a purpose unlike the industry's: it rests the story, deepens the cast, and gives room for a day with low stakes.

[Proposal] Three layers:

- The spine, fixed and written by the owner in the canon: who knitted the Tower, the four seasons, the ten checkpoints, the four endings and the Tower's secret. CAN-0080 holds nearly all of it.
- Arcs, generated, inside the spine: each has a kind, a beginning, a climax and an exit state.
- Episodes, generated, one per adventure.

Arc kinds and examples:

| Kind | Episodes | What it does | Example |
| --- | --- | --- | --- |
| Guardian | 5 to 9 | One Guardian's problem, from CAN-0040's season arcs | Arkady's catalogue error turns out to hide a drawer that isn't on any list |
| Tangle | 3 to 5 | A recurring Tangle across days | A Tangle that keeps tying the Canal's boats together |
| Rival | 4 to 7 | A race or duel of wits with Mirra | Mirra reaches a hatch first and needs her help to get out |
| Training | 3 to 6 | A Guardian trains her towards a gate | The foreman trains her for the boiler line, towards N8's route |
| Mystery | 4 to 8 | One running clue through the Diary | A page that changes when no one reads it |
| Tournament or fair | 4 to 8 | A public contest in town, with teams of familiars and townsfolk | The Fair's Great Scale |
| Filler | 1 to 3 | A day in town, a familiar's story, a festival | Bakery day, the fog's timetable goes wrong |
| Season finale | 2 to 3 | The checkpoint arcs the spine fixes | Feast of the Last Row |

[Proposal] About 24 to 36 arcs a year, if a player plays daily, at an average of 6 to 8 episodes with filler between them. A generated arc also keeps open threads across arcs, which is what makes a long series feel planned.

An episode runs as one adventure:

| Anime part | In the adventure |
| --- | --- |
| Cold open | The first scene, with no recap, a small hook |
| Previously | «В прошлый раз…», from the last summary |
| Ki | The first floor or town scene sets today's want |
| Sho | Rooms and trials, with beats between them |
| Ten | The twist, at a floor result, a gate or a Guardian's trial |
| Ketsu | The ending, with a next-episode hook |
| Next episode | One line at the end of the row |

The Director still decides every slot and its task. The episode outline must fit the plan of the day, so the story bends to the tasks and the tasks never bend to the story. The prompt's `arc`, `adventure` and `situation` slots then wrap each task in the moment of the episode, once the owner moves the task-text author to the player tier, as SPC-0130 requires.

Two sample arcs of the shape generation must produce:

Training arc, «Котельная линия» (the boiler line), six episodes, Works, autumn:

1. Night. The conveyor carries clockwork beetles in the wrong direction. The foreman Spindle asks for a hand. Hook: a beetle carries a tag with her name on it.
2. Day. In town the baker's oven runs cold, and the cause leads back to the Tower. Filler in tone, with the thread planted: the boiler's fuel comes from the town.
3. Night. Training starts. Spindle sets trials on A4 and A5. A Tangle, the Backwards Cog, appears.
4. Night. Twist: the Tangle isn't breaking the line, it is hiding from something in the boiler. A gate opens if A4 is at level 3, or the story goes round through the coal chute, and both routes reach the same scene.
5. Day. Mirra arrives with her own explanation and it is wrong, which gives a scene of rivalry and a joke.
6. Night. Climax: the Guardian's trial, with T nodes. A resolved Tangle joins the Bestiary. Hook: what was in the boiler has gone upstairs.

Rival arc, «Гонка за люком» (the race for the hatch), four episodes, Archive:

1. Day. Mirra bets that she can reach a hatch first. A rule of the bet plants a setup: only someone who can read the marks may enter.
2. Night. The race through the stacks. The player uses Reading the Numbers.
3. Night. Twist: Mirra is stuck beyond the hatch and too proud to say so.
4. Day. The player gets her out, whether or not the gate is open, because a second way runs through the Archivist. Mirra gives the payoff of the bet, and if the player qualified, this is where the rank scene plays.

### 7. Rank events sit inside arcs

[Read] ADR-3220 has the levels qualify her, and a story event gives the rank. [Proposal] When `rank.v1` qualifies her, the Director writes `rank_pending`. The arc planner puts the scene at its nearest fitting beat, within at most 3 adventures, because a rank that waits long stops feeling earned; if no beat fits by then, a short library scene plays at the end of a row. The scene never interrupts a trial. A rise is a solemn scene in which the Guardians congratulate her in their own styles. The `rank_changed` event is written by the scene and names the qualifying rule, so a shown rank always matches a computed one.

### 8. The world runs on a calendar of played days

[Snippet] Persona's calendar splits days into day and night and drives story and play on a school year. [Read] CAN-0030 re-knits rows every night; CAN-0080 and SPC-0110 run seasons on real months from the parent's start date.

[Proposal] The world counts played days, because arcs must not advance without her. One adventure is one world day, either a day episode or a night episode:

- Night is the Tower: floors, Tangles, Guardians. Day is the town: school, bakery, ferry, the Fair, CAN-0020's people, and sometimes the Tower by daylight. Arcs alternate them on purpose, so a child gets both a world and a dungeon.
- A night in the world always follows an adventure. The Tower is re-knitted once between adventures, so the morning note keeps its rule and "every night" reads as every night she lived through. A skipped real day passes nothing, and the recap never asks where she was.
- The year: 4 seasons of 3 months each, with 28 world days in a month and 7 in a week, so 336 world days. Each month gets a name from the setting, such as the Month of Loose Threads and the Month of Fog, for the owner to write. Festivals sit on fixed world dates: the three in the canon plus one for each season.
- The Tower's board shows the world date as words, with no digits, because CAN-0110 keeps numbers out of story text; the sheet can show it in a counter field.
- The parent keeps the real calendar: days played and the start date.

Since seasons now count played days, a season no longer matches the real one. The owner accepted the idea of a game calendar. Real-world seasons can still colour a scene, because the Master gets the date as a fact.

### 9. Story memory has five levels and rebuilds from the log

[Read] SPC-0110 sends the last 7 session summaries, one summary per earlier chapter and at most 200 facts, in about 3,000 tokens, and the planner writes a session summary and 5 to 7 beats after each session. Every fact stays in the event log. [Snippet] SCORE tracks item states per episode and flags continuity errors; ConWriter separates static memory from dynamic memory of events, entity states, timelines and open constraints; DREAM links events by time and cause, because isolated memories fragment a plot.

[Proposal] Memory levels, each an append-only event projected into a table:

| Level | Written | Holds | Size |
| --- | --- | --- | --- |
| Spine | By the owner, in the canon | The overall plot and the checkpoints | Filtered canon |
| Season | At a season's end | What the season changed | 300 words |
| Arc | At the arc's start and end | Premise, want, stakes, exit state, summary | 200 words |
| Episode | After each adventure | What happened, what changed, hooks | 120 words |
| Situation | Live, from the Director | Floor, today's want, the task's place | Typed fields |

Beside these sits the ontology of section 10, which holds the facts, so a summary never is the only record of a fact.

The request gets a fixed budget, about 6,000 tokens for a planner and 3,000 for a scene: the spine's relevant part, the current season and arc, the last 3 episodes, and the ontology records the outline names. Older episodes compress into their arc, and old arcs into their season, by a summariser role, and each compression is logged. The owner's decision to keep everything holds, because the log keeps every original.

A summary is checked before it is stored: an ontology diff must agree with it, each named entity must exist, and the checker compares it against the episode's events. Since `planDay`, the Director and verdicts are in the log and summaries are logged events, a replay rebuilds memory without calling a model, so a replay is cheap and deterministic.

Privacy: the summaries will carry her free text and the names she gives. These roles belong to the player tier, the egress guard replaces real names before a request leaves, and task-text prompts receive only `arc`, `adventure` and `situation` from checked summaries. A model never receives any estimate, verdict history or anything about her as a pupil, because the ontology holds story facts only: "the ability is at level 3" enters as a world fact, such as the belt that slips.

### 10. The story ontology is a typed graph of the story

[Read] Propp's 31 functions in fixed order and 7 roles describe folktales as structure, and roles can merge or split across characters. [Read, secondary] Façade's drama manager arranged authored beats towards tension and resolution. [Snippet] Its beats are small interactive scenes chosen by preconditions, following a tension curve. [Read, abstract, from the first draft] Riedl and Young's planner produces causally sound plots and models characters' intentions. [Snippet] A Neo4j talk describes a narrative graph with continuity checks as queries for a very long LitRPG series. This is practitioner evidence, not a study.

[Proposal] Entities, each with an id, a level of permanence (canon or generated) and its source event:

| Entity | Fields |
| --- | --- |
| Character | Role (Propp's seven), want, need, flaw, voice, secrets known, state, location, arc role |
| Relation | Two characters, kind, strength, trust, history events |
| Place | Floor, town place, state, who is there, opened gates |
| Thread | Question the audience holds, status (planted, developing, paid), planted in, due by |
| Setup and payoff | A planted object or line, and the episode that pays it |
| Conflict | Who wants what against whom, stakes, status |
| Secret | What, who knows, when it may be revealed, and a hard flag for the Tower's secret |
| Beat | Purpose, value before and after, characters, place, tension 1 to 5 |
| Episode | Kind (day or night), world date, beats, thread changes |
| Arc | Kind, premise, want, exit state, episodes, spine anchors |
| Spine anchor | A checkpoint an arc must not contradict |
| Player choice | What she chose, whom it touched, must be echoed by |

Relations between them: `wants`, `knows`, `loves`, `fears`, `blocks`, `reveals`, `plants`, `pays`, `causes`, `happens-at`, `belongs-to`. Canon records come from `canon/` as read-only ontology records, generated ones are event-sourced, and the code rejects a write that changes a canon field. Scale is no difficulty: SQLite tables are enough for a graph of thousands of rows.

Continuity then is a query. Examples: a character can't speak of a secret they don't know; a thread planted more than 12 episodes ago with no development is flagged; a dead-end setup is flagged; a character can't appear in two places on one day; a player choice with no echo in 7 episodes is due.

### 11. An agentic pipeline writes the story through the ontology

[Read] Re3 plans first, drafts with plan and state injected, reranks continuations and edits for consistency, and readers rated its plots coherent 14 % more often than the plain model's. [Snippet] DOC's detailed outlines and controller add a further gain of 22.5 % against Re3, and later work targets pacing. [Read] Dramatron uses hierarchical prompt chaining, from logline to dialogue, tested with 15 professionals. [Inference] All the evidence agrees that planning at several levels beats writing straight through, and all of it measures coherence, with interest less well covered.

[Proposal] Agents and steps, with tools that read and write the ontology:

| Step | Agent | Model | Tools | Check |
| --- | --- | --- | --- | --- |
| 1. Choose | Showrunner: arc kind and premise from open threads, her levels, her choices and the season | Opus | Query threads, levels as world facts, recent kinds | Variety rule, spine anchors |
| 2. Plan the arc | Arc writer | Opus | Query cast, canon | Structure rules, exit state |
| 3. Outline the episode | Episode writer, given the Director's plan | Sonnet | Query arc, threads | Fits slots, beats 7 to 12 |
| 4. Write beats | Beat writer | Sonnet | Query characters | Value change on each beat |
| 5. Critique | Script doctor, a separate agent with the craft rules | Sonnet | Query ontology | Scored list of faults |
| 6. Revise | Beat writer again | Sonnet | | At most 2 rounds |
| 7. Check | Code | none | Continuity queries, forbidden lists, canon entities, secrets | Hard failures |
| 8. Scenes | The Master, as now, one scene at a time | Sonnet | Beat and character cards | ADR-0110's reply checks |
| 9. After | Story editor: summary and ontology diff | Sonnet, Haiku check | Write ontology | Diff agrees with events |

Arcs are planned ahead, and episodes when she starts the day, because her actions shift the next one. The showrunner plans only as far as the next exit state and keeps a list of possible futures, so an arc can change when she does something unexpected. If any step fails twice, the last accepted plan runs, then a library arc: at least 3 authored arcs per floor stay behind the generator. A failure shows her an ordinary episode and reports once to the owner.

The parent's advance preparation of SPC-0110 still works: an episode prepared ahead is checked and waits for approval.

Conflicts with approved records, which change by decision:

- ADR-0110: the Master narrates only from the Director's events. The arc plan becomes a typed Director input. The Master still writes only inside checked scene orders.
- ADR-0110 and SPC-0110: the planner writes one session. It becomes several roles planning arcs.
- ADR-0330: floors come from `planDay`. An arc asks for floors and the Director decides, so an arc can't force a route.
- A generated arc isn't canon. It lives in the ontology, and the canon's read-only rule stays.

### 12. Craft canons become checks

[Read] Propp's order and roles; kishotenketsu. [Snippet] Harmon's circle has eight steps, beginning with a character in a comfort zone who wants something. [Unread] Snyder's beat sheet, Truby's 22 steps with want, need and moral argument, McKee's rule that a scene turns a value, Chekhov's gun and Dramatica's story points are stated from general knowledge of them.

[Proposal] Each canon becomes a machine-checkable rule or a critic's rubric:

| Canon | Rule the pipeline applies | Applied by |
| --- | --- | --- |
| McKee: a scene turns a value | Every beat has a value before and after, and they differ | Code on fields |
| Harmon's circle | An arc passes through want, unfamiliar, adapt, get, price, return, changed | Critic, against the arc record |
| Truby: want and need | The lead character of an arc has both; the climax makes the need visible | Critic |
| Chekhov's gun | Every setup has a payoff by a stated episode, and each payoff has a setup | Code query |
| Kishotenketsu | An episode can run with no conflict, on a twist alone | Selected for filler |
| Snyder's beats | The midpoint and the low point exist in long arcs | Critic |
| Propp's roles | Each arc fills donor, helper, opponent and dispatcher | Code on fields |
| Tension curve, as in Façade | Tension across an arc rises to a climax, with a target shape per kind | Code on beat tension |
| Variety | No two arcs of one kind in a row, cast rotates, jokes aren't repeated | Code query |

The target is one reader: the critic's rubric also scores whether a child would laugh, wonder or want the next episode, and it knows CAN-0010's tone, the creepiness level and the gender setting. A judge prompt is a guess about that reader, so the parent's feedback must train it: a thumbs mark on an episode in the Parent Room joins the rubric as examples.

### 13. Cost fits the limit by a wide margin

[Count] Prices per million tokens: Sonnet 5.5 $2 in, $10 out; Haiku 5.5 $0.1 and $0.5; Opus 5.5 $4 and $20. [Proposal] Assumed tokens, not measured:

| Step | Model | In and out, thousands | Cost |
| --- | --- | --- | --- |
| Arc choice and plan, per arc (7 episodes) | Opus | 12 and 5, twice | $0.296, so $0.04 an episode |
| Outline | Sonnet | 6 and 1.5 | $0.027 |
| Beats, critique and 2 revisions | Sonnet | 6 and 2, four times | $0.128 |
| 12 scenes | Sonnet | 4 and 0.5 each | $0.156 |
| Summary and ontology diff | Sonnet | 8 and 1 | $0.026 |
| Task stories, 30 tasks, measured at $0.006 | Sonnet, Haiku | | $0.18 |
| An adventure | | | about $0.56 |

Daily play for 31 days costs about $17. The limits of ADR-3200 are $5 an adventure and $200 a month, so the full pipeline fits with a wide margin, and the model choices could rise. Older records name $1.5 and $60, which ADR-3200 replaced.

### 14. The build goes by a sequence, and nothing is cut

[Proposal] An order that keeps a working game at each step, with no feature removed: fix the graph and rank rule; turn on the model and levels (ADR-3220); the calendar and day and night; gates on the Tower's map; the ontology and memory, filled by the current Master; the single-episode pipeline; arc generation; the craft critic; dynamic futures and parent feedback.

### 15. What isn't known

No source tests ability gates in a learning game for a child of this age, and none tests a falling level inside a gate design. The long-story research measures coherence with adult readers. A very long generated series may drift or repeat in ways no check foresees, and that is the design's main risk. An experiment is the point of the project, so this is what to watch and not a reason to shrink it.

## Conclusions

1. Every floor stays open, and gates sit on hatches, passages, secrets, shortcuts and trials. A content test walks every checkpoint with every gate closed.
2. Each domain gives the player a world verb that grows with ability levels, and a gate opens to something she can do again.
3. The Tower holds about 36 gates of 7 kinds, and combination gates send her between floors.
4. The 11 broken prerequisite edges are fixed before a gate reads them.
5. A rank counts all groups up to its own, so rank D rests on more than 2 nodes.
6. Ability levels take an inferred level from ancestors' evidence or from another rule, so old nodes don't stay at level 1.
7. The story has a fixed spine written in the canon, generated arcs of stated kinds and one episode per adventure.
8. An episode follows the anime structure of cold open, recap, four-part story and next-episode hook.
9. Each adventure is one day or night, and the world calendar counts played days, so skipped days pass nothing.
10. A rank scene plays inside an arc within 3 adventures of qualifying and writes `rank_changed` itself.
11. Story memory holds spine, season, arc, episode and situation levels, rebuilds from the log and stays within stated budgets.
12. A story ontology holds characters, relations, places, threads, setups, secrets, beats, episodes and arcs, and canon records are read-only.
13. No model receives skill estimates, verdict history or pupil data as such; levels reach the story only as world facts.
14. A multi-agent pipeline plans the arc, outlines the episode, writes beats, critiques them, revises at most twice, checks by code and writes summaries.
15. Craft rules are encoded as code checks where a field can prove them, and otherwise as a critic's rubric.
16. Every generated layer has a fallback that ends in authored library arcs, and a failure never shows as an error to the player.
17. The pipeline's spend is measured against $5 an adventure and $200 a month, with an expected cost near $0.6 an adventure.
18. The parent can mark episodes, and those marks feed the critic.
19. Characteristics are replaced by derived read-outs or removed; paths stay a story choice.

## Sources

Read in text or on the abstract page:

- [Yang, Tian, Peng and Klein 2022, Re3, arXiv 2210.06774](https://arxiv.org/abs/2210.06774) - plan, draft, rerank, edit; 14 % and 20 % gains. Read 2026-10-31.
- [Mirowski, Mathewson, Pittman and Evans 2022, Dramatron, arXiv 2209.14958](https://arxiv.org/abs/2209.14958) - hierarchical generation, 15 professionals. Read 2026-10-31.
- [Morphology of the Folktale, Wikipedia](https://en.wikipedia.org/wiki/Morphology_of_the_Folktale) - secondary, Propp's functions and roles. Read 2026-10-31.
- [Metroidvania, Wikipedia](https://en.wikipedia.org/wiki/Metroidvania) - secondary, definition. Read 2026-10-31.
- [Filler (media), Wikipedia](https://en.wikipedia.org/wiki/Filler_(media)) - secondary, why filler exists. Read 2026-10-31.
- [Façade (video game), Wikipedia](https://en.wikipedia.org/wiki/Fa%C3%A7ade_(video_game)) - secondary, drama manager. Read 2026-10-31.
- Riedl and Young 2010, Narrative Planning, JAIR 39 - abstract, read by the research agent. Read 2026-10-31.
- Park and colleagues 2023, Generative Agents, arXiv 2304.03442 - abstract, read by the research agent, not used in a conclusion. Read 2026-10-31.
- Kishotenketsu, Wikipedia - secondary, read by the research agent. Read 2026-10-31.

Seen only through a search result's summary:

- [Yang, Klein, Peng and Tian 2023, DOC](https://arxiv.org/html/2212.10077v3) - detailed outlines, 22.5 % and 28.2 % gains. Read 2026-10-31.
- [SCORE 2025](https://arxiv.org/html/2503.23512v1) - item states and episode summaries. Read 2026-10-31.
- [ConWriter](https://arxiv.org/pdf/2608.05169) - static and dynamic memory. Read 2026-10-31.
- [DREAM](https://arxiv.org/pdf/2608.05170) - event memory graph. Read 2026-10-31.
- [Neo4j talk on storyworld graphs](https://neo4j.com/videos/nodes-ai-2026-graph-powered-storyworlds-using-neo4j-to-keep-1m-word-litrpg-epics-coherent-w-ai/) - practitioner account. Read 2026-10-31.
- [Brown, The World Design of Hollow Knight, transcript listing](https://amara.org/v/C3BED) - critical path. Read 2026-10-31.
- [GamesRadar on Hollow Knight's lock and key](https://www.gamesradar.com/games/action/hollow-knight-devs-highlight-a-big-difference-between-their-sequel-and-most-metroidvanias-the-players-choice-about-where-to-go-in-silksong-is-not-dictated-by-what-power-ups-you-currently-have) - developers' words. Read 2026-10-31.
- [Entertainium on Hollow Knight](https://entertainium.co/?p=6580) - several approaches to a zone. Read 2026-10-31.
- [Metroidvania Analysis, HSLU](https://blog.hslu.ch/games/files/2021/11/Metroidvania_Analysis.pdf) - ability gating. Read 2026-10-31.
- [A Godot skill guide on metroidvanias](https://skills.cat/skills/thedivergentai/gd-agentic-skills/godot-genre-metroidvania) - soft-locks. Read 2026-10-31.
- [Habgood and Ainsworth 2011, repository entry](https://nottingham-repository.worktribe.com/output/23577510) - intrinsic integration, 7 times longer. Read 2026-10-31.
- [Ryan, Rigby and Przybylski 2006, Motivation and Emotion 30(4)](https://pure.ewha.ac.kr/en/publications/the-motivational-pull-of-video-games-a-self-determination-theory-/) - autonomy and competence in games. Read 2026-10-31.
- [Persona 4 Golden calendar, Megami Tensei Wiki](https://megatenwiki.com/wiki/Calendar_in_Persona_4_Golden) - calendar, fan wiki. Read 2026-10-31.
- [Grand Text Auto on Façade](https://grandtextauto.soe.ucsc.edu/2008/03/17/ep-85-facade) - tension curve; [IDSwiki on Façade](https://tecfalabs.unige.ch/mediawiki-narrative/index.php/Facade) - beats. Read 2026-10-31.
- [Story circle guide](https://www.thebookdesigner.com/the-dan-harmon-story-circle/) - Harmon's eight steps, sources differ on its origin. Read 2026-10-31.
- [Tournament Arc, Tropedia](https://tropedia.fandom.com/wiki/Tournament_Arc), [CBR on tournament arcs](https://www.cbr.com/what-makes-tournament-arcs-special/), [TV Tropes on arcs](https://www.tvtropes.org/pmwiki/pmwiki.php/Main/ARc) and [Soap Central on training arcs](https://usa.soapcentral.com/anime/10-best-anime-training-arcs-ranked) - arcs in shonen, fan and press writing. Read 2026-10-31.
- [Prima on Skyrim's skills](https://primagames.com/eguides/elder-scrolls-v-skyrim-eguide/essentials/training/skills-and-perks) - use-based growth, not used in a conclusion. Read 2026-10-31.

Repository, working tree over revision 3394f32: the files under Method. The research agent's reads of Duolingo's 2016 post appear in RES-4311.

### Could not obtain

- Fetches of [the Façade paper's CMU PDF] and of the Game Developer and GDC pages guessed by the agent failed or returned another page. Tried 2026-10-31.
- Habgood and Ainsworth's full text: refused. Tried 2026-10-31.

Not read at first hand: McKee, Truby, Snyder, Harmon's own writing, Propp's book, Dramatica, Scheherazade, Boss Keys beyond the listing, DragonBox and Prodigy on gating, and any study of cours or filler as design. Each is stated above with that limit. Tried 2026-10-31.
