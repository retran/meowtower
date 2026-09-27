---
id: RES-3000
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes building in four stages, from an iPad spike to an MVP played by the player, and lists nineteen settled points and nine open questions

## Summary

The draft proposes building the diagnostic core before the game shell, after a short technical spike on a real iPad, because the iPad is the main risk. It sets four stages, 0, 0.1, 0.2 and 0.3, each with its content, automatic checks and human acceptance; stage 0.3 is exactly the MVP scope, played by the player. Everything after 0.3 is a backlog, ordered by expected value once the family has watched her play, and each backlog item has a signal that says when it is due. The draft then lists nineteen points it calls settled and nine it calls open. The owner has since settled the adventure's length and the soft stop at 60 minutes, which overrides the 30-45 minutes that the stages and the settled list give. Research on 2026-09-26 resolves four of the open questions: the extension and the daily maximum (which the owner removed on 2026-09-27), the three-day rule, the alarm notification and «Jev» as far as the web can settle it. The owner decided on 2026-09-27 that Jev, TypeSafe AI's decision model, may take the safety check and similar judgements. Research then decided on 2026-09-27, on the owner's instruction to answer the open questions, that Jev runs through OpenRouter's zero-retention route, that the style check with the player is a prerequisite of stage 0.3, that the familiars' third stages ship with the full-roster backlog item, and that the Guardians keep fixed names. This record covers the stages, the settled list and the open questions. It leaves the detail of each settled topic to the records that own those topics.

## The question

In what order is the game built, how is each stage accepted, and what remains undecided? The draft assumes that watching one child play for two weeks gives enough signal to order the backlog. A challenge to that: two weeks of one player's play yields a small sample, and several backlog signals («если любит загадки», if she likes puzzles) depend on judgement more than on data.

## Method

Read the owner's draft «Хроники Башни — спецификация», sections «Этапы» (Stages) and «Решения и открытые вопросы» (Decisions and open questions), on 2026-09-26.

The draft leaves open the nine questions listed below. It doesn't say who judges whether a backlog signal has fired.

Research closed the remaining questions on 2026-09-27, on the owner's instruction to answer them: Jev's route and gate, the EU-only question for the player tier, the style check before art is generated in volume, and when the familiars' third stages ship. The resolved findings below hold each.

## Findings

### The draft builds the diagnostic core before the game shell, after an iPad spike

The diagnostic core is built and checked before the game shell. A short technical spike on a real iPad goes first, because the iPad is the main risk. Stage 0.3 is exactly the MVP scope with the player. Everything after it is a backlog: its order is chosen by expected value after watching how she plays.

### Each stage has content, an automatic check and a human acceptance

| Stage | Content | Automatic check | Human acceptance |
| --- | --- | --- | --- |
| 0 iPad spike and model bake-off | Docker + Caddy + CA (certificate authority), PWA (progressive web app), a custom keyboard with fractions, sound, dictation, a request to OpenRouter with a typing animation, an event written to the SQLite log; every model identifier checked against the OpenRouter catalogue; a model bake-off (12 prompts, candidates, automatic checks, a blind rating screen) | Docker smoke test; Playwright WebKit iPad: keyboard, fraction, answer recording; IndexedDB queue on a dropped connection; `bakeoff` runs on every available candidate within `BAKEOFF_BUDGET_USD`, LanguageTool responds, the report `bakeoff-report.html` is built | a checklist on a real iPad: CA profile installed, icon on the home screen, keyboard, fraction, sound, dictation; works after a Mac restart; Wi-Fi off for 30 seconds gives 0 lost answers; the parent rates the bake-off answers blind, and the choice of `MASTER_MODEL`, `PLANNER_MODEL`, `LIVE_GEN_MODEL` and `EXPLAIN_MODEL` is written as a decision record in `project/adrs/` for the owner to approve (the draft named `docs/decisions.md`; RES-2900 holds the reason) |
| 0.1 Core | Q, rng, the graph, templates N, A, F, T1-T2 with solution, hints, template explanation and parallel tasks; the event log and projections with full recomputation; knowledge model v1; task selection with spaced review, parent topics, the three-day window and the flow limit; the single mode (first attempt, review, second attempt); `minMs` and fast guesses; outcomes of tasks and rooms; the resume snapshot; a bare interface | property tests of templates (including parallelism and solutions); simulation with at least 90 % of nodes right on 6 profiles; a 30-day daily simulation; flow test; measurement-protection test; tests «Единый режим и журнал» (Single mode and log) (a), (d), (e), (f) at engine level; test «Исходы и ветки» (Outcomes and branches) (a) and (b) | the parent plays a bare session, leaves mid-task and continues on another device, reviews the log and the export |
| 0.2 All domains | all domains, including stretch; a library of at least 5 frames per structure; the science bank; the explanation pipeline (cache, checks, fallback); report v1; CSV and Parquet export | simulation on all domains; budget in a timed simulation (at least 28 scored first attempts at 1.0 × threshold, at least 25 at 1.5 × threshold, adventure 60 minutes; the draft said 30-45); test «Единый режим и журнал» (b); three-day window in the 30-day simulation | an adult plays an adventure in about 60 minutes (the draft said 30-45); report v1 is clear without explanation; explanations read well and agree with the scheme |
| 0.3 MVP with the player | prerequisite: the style check with the player, recorded before any art is generated in volume (see the resolved finding on the style check); exactly «Текущий объём (MVP)» (Current scope (MVP)): Session 0; System windows; battle with outcomes, clean rows, room branches and floor states; the single mode with review and second attempt; guiding threads, hints and explanations; resume from the same place on any device and the three-day rule; chests of 1 from 3; forge and shop; the queue of missed rewards; levels, experience, daily quests; 6-9 familiars with 2-3 evolution stages; Diary pages; names; free text at several points; light dreamcore with a creepiness level; eye exercises; soft stop and extensions; lesson marks; report v1 and export; about 40 offline assets in the canon's style; budgets; iPad and computer | the MVP Playwright matrix; no time elements on the child's screen; safety, creepiness and dreamcore at levels 0, 1 and 2; tests «Исходы и ветки» (a)-(d) and «Единый режим и журнал» (a)-(h); p95 of waiting for the Master at most 6 s in `verify --live` | two weeks of daily play; the player wants to come back, spends threads without fear and isn't upset by «другой путь» (the other path); the share of fast guesses below 15 %; the parent reads the story book, report v1 and the export; after that, a decision on what to take from the backlog |
| Later (backlog) | order by expected value, decided after watching play; the candidates and their signals are in the next finding | for each item, its own tests from the matching sections (parallelism test for anchor forms, anchors never appear in daily play, picture judge at least 7, i18n tests, the full Playwright matrix) | per item: a week of play with the new part and no loss of interest |

### Each backlog candidate has a signal that says it is due

Deferred until after the MVP by the draft, with the signal for each:

- Ascents and anchor forms: when comparable trends are needed, for example before school tests.
- The full roster and familiar battles with the ring of elements: if the collection and the familiars hold her interest. The familiars' third evolution stages ship with this item (see the resolved finding on third stages).
- The free mode: if she asks for «ещё истории» (more story).
- Diary ciphers: if she likes puzzles.
- Items and familiars from AI with live pictures: if she wants more of her own in the world.
- Characteristics, paths and ranks by the calendar.
- Room decor.
- Full dreamcore.
- The Dutch layer: the `nl` locale, templates with `curriculum: "nl"`, the graph overlay, a practice test.
- Refitting the knowledge model: after 4-6 weeks of data.

### The stages still size the adventure at 30-45 minutes, and the owner has settled on 60

Stage 0.2 checks «приключение 30–45 минут» (adventure 30-45 minutes) in simulation and accepts it when an adult plays an adventure in 30-45 minutes. The owner settled on 2026-09-26 that the adventure targets 60 minutes of active time, so the stage table above now checks and accepts a 60-minute adventure.

### The draft lists nineteen points as settled

The draft calls these «Решено» (Settled). They remain the draft's proposals until the owner approves them:

- The section «Текущий объём (MVP)» outranks the rest of the text; everything outside it comes later, after watching the player play.
- One adventure a day of about 60 minutes; a soft stop at 60 minutes of active time, extensions of 20 minutes that she can choose again each time the soft stop returns, and no daily maximum, as the owner decided on 2026-09-27 (the draft said 30-45 minutes, a soft stop at about 45, extensions of 15 and a maximum of 60; see the resolved findings below); leaving at any moment and resuming from the same place on any device; an unfinished adventure closes with a short ending after three adventure days (the draft said three days).
- The single mode: the first attempt measures and learning comes after it (the correct answer, a free short solution, a second attempt on a parallel task marked as assisted).
- Record everything, compute later: the event log is the single source of truth; knowledge model v1 is BKT (Bayesian knowledge tracing) with forgetting; refitting the parameters comes later from the stored data.
- Guiding threads are a generous game resource for hints and explanations; the LLM (large language model) writes explanations in the familiar's voice from the engine's steps, and code inserts the numbers.
- Diagnostics are continuous; Ascents with anchor forms A-D come later.
- The goal is the VWO track: coverage of 1F and 1S with a margin plus a probe of the ceiling (stretch).
- Everything is in Russian; the Dutch layer comes later.
- No timers or clocks on the child's screen; an eye exercise every 20 minutes. Eye exercises and rest stops count towards the soft stop, but not towards the 20-minute counter (the draft also counted them towards a daily maximum, which the owner removed on 2026-09-27).
- One storyteller, the Master; the Master doesn't see the maths and gets only summary outcome events (room branches, clean rows, floor states), without single-task outcomes.
- Motivation to solve correctly: a correct answer is a strong spell, bonuses and the success branch; a wrong answer and «Не знаю» (I don't know) are another path without loss; results shape the story through room branches and floor states «триумф» (triumph), «победа» (victory) and «хитрый обход» (clever detour), counted only from the first attempt. Correct answers show after the attempt; the parent teaches new topics outside the game.
- Flow: the Director keeps the success share at about 70-80 % through review of fluent nodes.
- Dreamcore and very light childlike creepiness; the parent sets the creepiness level 0, 1 or 2, with 1 as the default.
- Text models are chosen by a blind bake-off at stage 0; the model table holds defaults until then. The owner decided on 2026-09-27 that GLM is good enough for stories, so `z-ai/glm-5.3` is the default for the Master and the planner, and the bake-off confirms or overturns it against Claude Haiku, a Gemini Flash model and a small GPT model (RES-1600; the draft's defaults were `anthropic/claude-sonnet-5` and `anthropic/claude-opus-5.5`).
- Voicing tasks aloud isn't needed.
- The iPad and the computer are equal clients; storage is SQLite on the Mac.
- OpenRouter models sit in one table and change in `.env`. The owner decided on 2026-09-27 that the model is configurable: every role's model, and the provider lists, change by configuration with no code change and no rebuild, and research proposes that the parent may switch the Master's model in the Parent Room among the bake-off's approved models (RES-1600).
- The style is the owner's soft pastel patisserie anime style with a catgirl heroine, and everything is original (the draft said "in the spirit of Cookie Run"; see the resolved finding below).
- The world follows the bible `content/canon.ru.md`: 9 floors, 8 elements in a ring, a roster of 24 familiars plus 3 legendary ones, starters «Пуговка» (Button), «Винтик» (Little Screw) and «Безешка» (Little Meringue), four seasons, ranks by seasonal milestones (ranks and the full roster come later).

### The settled list conflicts with the MVP section on the soft stop and the extension

The settled list says «мягкая остановка около 45 минут, продления по 15 минут» (a soft stop at about 45 minutes, extensions of 15 minutes). The MVP section says the soft stop comes when the day's active time reaches 60 minutes and «Ещё один ряд» (One more row) adds 20 minutes. By the draft's own precedence rule, the MVP section wins. The settled list also keeps the daily maximum at 60 minutes, the same point as the MVP section's soft stop.

### Resolved: The soft stop comes at 60 minutes, an extension adds 20 minutes, and the daily maximum defaults to 100 minutes

The owner decided on 2026-09-26: the adventure lasts 60 minutes, and the soft stop comes at 60 minutes of active time. Research on the same day chose 20 minutes for «Ещё один ряд», the MVP section's figure, over the settled list's 15, because the 15 comes from the same sentence as the replaced 45-minute soft stop. It chose a default daily maximum of 100 minutes over 60, 80 and 120: 60 lets no extension run, 80 lets only one, and 120 would fill the whole 2-hour daily guideline for recreational screen time on its own. RES-0300 holds the comparison and the source. Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's decision of 2026-09-27 replaced the daily-maximum part of this finding: see «Resolved: the game has no daily maximum» below.

### Resolved: the game has no daily maximum

The owner decided on 2026-09-27: there is no daily maximum, no 100-minute default, no choice of 60, 80, 100 or 120 minutes and no parent setting for it. The soft stop still comes at 60 minutes of active time, and «Ещё один ряд» still adds 20 minutes and can be chosen again each time the soft stop returns. Play stays limited by the returning soft stop, the eye exercise every 20 minutes and one new adventure a day; nothing caps the day's total active time. RES-0300 holds the detail. Research decided on 2026-09-27, on the owner's instruction, the question this left for the owner: the Parent Room gets a «Закончить на сегодня» (Finish for today) control that brings the soft stop at the next boundary with no extension, the parent's report marks a day whose active time passed 120 minutes, and the screens after the finale count towards the eye exercises (RES-0300).

### Resolved: The scored first attempts and the cost estimates stay as the draft gives them

The owner decided on 2026-09-26: the session budget, the minimums of 28 and 25 scored first attempts and the cost estimates don't need recomputing for the one-hour adventure. The timed simulation keeps the minimums of 28 at 1.0 × threshold and 25 at 1.5 × threshold, now measured on a 60-minute adventure. A longer adventure makes both minimums easier to meet, so they stay a floor the Director must clear.

### Resolved: the owner's pastel patisserie anime style with a catgirl heroine replaces the style in the spirit of Cookie Run, and no prompt or game text names either reference

Proposed by research on 2026-09-26; the owner approves it with this record. The settled list named Cookie Run as the style; the owner's newer design files ask for a Nekopara-like pastel style at the player's request and build the tokens, components, screens and prototype on it. RES-3400 compares the options and gives the reason: the player chose the style, the owner's later work depends on it, and familiars, Tangles and Guardians stay round, which keeps what the chibi style did best. Both reference names stay with the adult developer.

### The draft leaves nine questions open

The draft calls these «Открыто» (Open):

1. A «чистое измерение» (pure measurement) mode. Does the parent need a switch that turns off bonuses for correctness and the display of answers for a while, for example if the share of fast guesses stays above 15 % for long, or a point without learning is needed before Ascents arrive? For now: only flags in the report and the Director's automatic reaction.
2. Hints before an answer. Could they become a habit that leaves few unassisted attempts? For now: a flag when the share is above 30 %; decide after two weeks of play.
3. The three-day rule. Is the limit right, or should an unfinished adventure close on the second day?
4. Model v1 parameters. The starting BKT values are expert guesses; when will there be enough data for the first refit (a guide of 4-6 weeks)? Resolved below: RES-0900 now gives the starting values, and the refit keeps the draft's guide.
5. Outcome thresholds. The starting thresholds (room 0.6; floor 0.55 and 0.8; chapter finale) sit in `content/thresholds.json`; after the first month the parent can adjust them if «триумф» seems too rare or too frequent. Resolved below: floor 0.5 in place of 0.55, and chapter 0.3 in triumph in place of a third.
6. Alarm notification. Is a notice in the Parent Room enough, or does it need a push to the phone or an SMS?
7. OpenRouter providers. An explicit allowlist of providers is needed on top of `data_collection: deny`.
8. «Jev». The parent mentioned a service «Jev»; what it is and how it relates to the game needs clarifying.
9. The starting names of familiars, Guardians and floors are placeholders from the canon; the player will rename them in the game.

Questions 3, 4, 5, 6, 7, 8 and 9 have resolved findings below. The owner answered question 8 on 2026-09-27: Jev is TypeSafe AI's decision model, and it may take the safety check and similar judgements; the resolved finding on Jev's checks below holds it.

### Resolved: The model v1 values and the outcome thresholds start from values research checked against published sources and a simulation, and the first-month review adjusts the chapter threshold first

Proposed by research on 2026-09-26; the owner approves it with this record.

Question 4: RES-0900 sets `pInit` by level and school group, `pLearnPractice` 0.05, `pLearnFeedback` 0.15 and a slip that grows with the steps, from the Dutch 1F and 1S attainment figures and the BKT literature. The refit waits for the draft's 4 to 6 weeks of data. The player's school group was a fact only the owner could give; the owner decided it on 2026-09-27 (the value is kept in `personal/player.md`), which replaced this finding's open point (see the finding on her school group below and RES-0900). Question 5: RES-1700 keeps room 0.6 and floor triumph 0.8, lowers the floor victory threshold from 0.55 to 0.5 and the chapter triumph share from a third to 0.3, because a simulation of the draft's own assumptions put cunning bypass above its 25 % limit and the triumph chapter well below half at the draft's values. The same simulation shows the chapter share swings from nearly none to nearly all chapters as her mean room share moves by 0.1, so the first-month review checks it first.

### Resolved: the player's school group is decided, and the game covers the full material to the end of group 8

The owner decided the player's current school group on 2026-09-27 (the value is kept in `personal/player.md`), and that she learns the full material including group 8. RES-0900 uses the values of `pInit` for that group as decided, not as an assumption, and the values for another group only through a new model version. RES-0800 and RES-0010 keep the scope to the end of group 8, level 1S, with the stretch nodes above it.

### Resolved: The three-day rule counts adventure days, the game days on which she played the open adventure

The draft says the rule fires when an adventure «began three or more days ago». Two readings fit. Counting calendar days is simpler, since the server needs only the start date, and it closes a stale story after a holiday or an illness. But a missed day then costs her the rest of the adventure's floors, and she meets the short ending the moment she returns, which breaks the draft's rule that a missed day takes nothing away (RES-2000). Counting adventure days, the game days ending at 04:00 on which she played the open adventure, bounds what the rule exists to bound: one adventure dragging over more than three sittings. The Director already recomputes its forecast before each floor from current estimates (RES-1000), so a gap leaves the plan less stale than the calendar count assumes. I chose adventure days. The default limit stays at three; the draft's question whether two is better waits for the two weeks of play in stage 0.3, and the parent can change the limit or switch the rule off. RES-0200 holds the rule. Proposed by research on 2026-09-26; the owner approves it with this record.

### Resolved: An alarm reaches the parent as a Parent Room notice and a web push to the parent's phone

A notice in the Parent Room alone reaches the parent only when they open it, which can be days after a serious signal. I compared four ways to reach a phone from a Mac at home with no cloud account:

| Option | What it needs | What it is better at | Why it loses or wins |
| --- | --- | --- | --- |
| Web push to the Parent Room installed on the parent's iPhone home screen | iOS 16.4 or later, the Parent Room as a home-screen web app with a manifest and a service worker, the Caddy certificate trusted on the phone, a permission granted by a tap | no extra app and no account; Apple's push service delivers it while the phone is away from home | chosen |
| ntfy, self-hosted on the Mac | the ntfy iOS app; for instant delivery, the server forwards a poll request to ntfy.sh | a general notification tool with an app | the phone must then fetch the message from the Mac, which only the home network reaches, so an alarm sent while the parent is out waits until they come home |
| ntfy.sh, the public server | the ntfy iOS app and a secret topic name | works anywhere with no setup on the Mac | the message text sits on a third party's server, and anyone who guesses the topic reads it |
| E-mail | an SMTP account at a mail provider | every parent already reads e-mail | needs a cloud account and its password on the Mac, and mail can wait unread for hours |

SMS needs a paid gateway account, so it fails the constraint outright. I chose web push. Apple's push service carries the message, but the Web Push standard encrypts the payload for the receiving browser, and the payload names no content anyway: a fixed line such as «В Башне есть сигнал для родителя» (There is a signal for the parent in the Tower). The details stay in the Parent Room, behind the PIN. The push goes only to a device the parent has paired and subscribed from the Parent Room, never to the child's devices, so the rule that the game sends the player no notifications (RES-2000) still holds. If no phone is subscribed or a push fails, the Parent Room notice is still there, and the game logs the failed delivery. RES-1800 holds the rule and RES-2500 the setup. Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's decision of 2026-09-27 replaced this finding: alarms go to the Parent Room only in the MVP, and the web push waits until after the MVP. The finding below on alarms holds it.

### Resolved: in the MVP an alarm reaches the parent as a Parent Room notice only, and the web push to the parent's iPhone comes after the MVP

The owner decided on 2026-09-27: alarms go to the Parent Room only, and the web push to the parent's iPhone is postponed until after the MVP. The comparison above stays as the plan for that later item, so web push remains the chosen way to reach a phone when it is built. In the MVP the parent sees an alarm when they open the Parent Room, which can be hours or days after the signal, as the finding above says. The Master still leaves its role and tells the child to find an adult at once (RES-1800), so the child's side of an alarm doesn't wait for the parent. RES-2500 moves the service worker, the manifest's push setup and the subscription table out of the MVP.

### Resolved: «Jev» is most likely TypeSafe AI's decision model, and only the owner can confirm what the parent meant

A web search on 2026-09-26 found no family, education or game service called «Jev». It found Jev, a decision model TypeSafe AI released on 2026-09-15. Jev answers a focused question with a choice, a score or a yes-or-no probability instead of writing text, in about 100 ms, for $0.042 a million input tokens with free output. It runs in TypeSafe's cloud in the western United States, and its public pages state no data-retention terms for ordinary accounts. It could serve the game as a fast classifier, for example for the safety check on free text now assigned to `SAFETY_MODEL` (RES-1600), or for sorting free-text choices into story branches. Two things count against it now: it would send the child's text to a second service outside OpenRouter, which RES-2600 limits, and its data handling is unpublished. This record doesn't adopt it. Open question for the owner: is this the «Jev» the parent meant, and if so, for what part of the game?

The owner's decision of 2026-09-27 replaced this finding: Jev may take the safety check and similar judgements. The next finding holds it.

### Resolved: Jev takes the decision-shaped checks, the safety check on free text and sorting free-text choices among them, and every text-writing role stays on OpenRouter

The owner decided on 2026-09-27: Jev can be used to evaluate safety and similar judgements, for example the safety check on free text and sorting free-text choices. Jev then receives the child's cleaned text at a service outside OpenRouter whose retention terms for ordinary accounts are unpublished.

Research on 2026-09-27 read TypeSafe's documentation and legal pages and checked the earlier facts. Jev 1.13 (`jev-1.13.0`) answers at `POST https://api.typesafe.ai/v1/systemone`. A request carries the application state as text or JSON and one or more typed questions: Noul (a yes-or-no probability), Choice (one of a list of options) or Score (a place on an ordered scale). It returns an answer with a probability and writes no text. Input costs $0.042 a million tokens and output is free; a request holds up to 64,000 tokens. English is its main training language, and TypeSafe says accuracy in other languages varies. TypeSafe's Privacy Policy says it won't train on inputs, the services are hosted in the United States, and it keeps personal data "as long as reasonably necessary". Its Data Processing Agreement gives no fixed retention period, and zero retention is offered to enterprise customers only. The Privacy Policy also says TypeSafe doesn't knowingly collect personal data from children under 18.

What Jev may take, what it may not, and how it fits the model table, the costs and the privacy tiers:

- It may take every check that asks a question with a fixed set of answers: the safety check on her cleaned free text and on the Master's replies, the shame and judging check, the creepiness level against the order's level, the level of a real-life signal (RES-1800), sorting her free text into the options a scene offers, and the safety step of the explanation and frame checks. RES-1600 holds the list.
- It may not take a role that writes text or computes an answer: the Master, the planner, live frames, explanations and the blind solves. It can't take `ART_JUDGE_MODEL` either, because it reads text only.
- The model table gains `JUDGE_MODEL`, pinned to `typesafe/jev-1.13` on OpenRouter's zero-retention route by the next finding (this bullet first said `jev-1.13.0` at TypeSafe), and `SAFETY_MODEL` stays on `google/gemini-3.8-flash` as its fallback (RES-1600).
- Jev is billed on the OpenRouter key inside its $60 limit, by the next finding (this bullet first said a TypeSafe key outside that limit); at about $0.005 an adventure it costs about $0.15 a month by research's estimate, logged in `llm_log` inside the adventure budget (RES-2700).
- Jev's requests carry cleaned text only, the least the question needs, and never maths results, and they join the player tier by the next finding (this bullet first made them a third tier) (RES-2600).

Research found one fact the decision didn't assume, and the next finding acts on it. On 2026-09-27 OpenRouter lists `typesafe/jev-1.13` in its catalogue and in its zero-retention endpoint list, through a Decisions API at an `alpha` path. That route would keep Jev inside the player tier under `zdr: true`, on one key and one limit. Three questions stay open for the owner. First, what TypeSafe keeps from a direct request, and for how long: its pages don't say, so only an enterprise contract or a question to TypeSafe settles it. Second, whether Jev should go through OpenRouter's zero-retention endpoint in place of the direct API, trading an alpha interface for zero retention. Third, whether TypeSafe accepts a child's cleaned text on a parent's account, given its statement about children under 18.

### Resolved: Jev runs through OpenRouter's zero-retention route, `typesafe/jev-1.13`, and reads her text in play once it matches the fallback safety model at the stage 0 bake-off

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record.

Jev runs through OpenRouter's zero-data-retention route (`typesafe/jev-1.13`), not TypeSafe's direct API. This answers the three questions above. TypeSafe keeps nothing from a request on the zero-retention route, so what it keeps from a direct request no longer matters. The route keeps Jev inside the player tier, on one key and one spending limit. Only cleaned text with no personal data reaches Jev, on the parent's account. The direct API is better at interface stability, and the OpenRouter route is better at retention, which is what the player tier guards; RES-2600 holds the comparison. The gate changes: Jev reads her text in play once it matches the fallback safety model, `SAFETY_MODEL`, on the Russian test set at the stage 0 bake-off through that route. Jev's cost then falls on the OpenRouter key and inside its $60 limit (RES-2700).

### Resolved: requests carrying the player's material go only to zero-retention endpoints at Google Vertex, Amazon Bedrock, Azure and xAI, and every other request to a named allowlist under `data_collection: "deny"`

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's open question 7 asked for an explicit allowlist of providers on top of `data_collection: "deny"`. OpenRouter's routing documentation, read 2026-09-26, shows that "deny" excludes providers that train on data but not every provider that retains it, while `zdr: true` routes only to endpoints that keep nothing. I compared "deny" alone, zero retention on every request, and two tiers by what a request carries. Two tiers win: the Master, the planner, the Explainer and their checks carry her free text, names or one answer, so they go only to zero-retention endpoints at Google Vertex, Amazon Bedrock, Azure or xAI, which cover every model the draft names for those roles. Offline art, the frame library and the bake-off carry no player material, so they may also use Anthropic, OpenAI, Google AI Studio and Seed under "deny"; this keeps `bytedance-seed/seedream-4.5`, whose only endpoint is not zero-retention. RES-2600 holds the table of options, the endpoint list and the sources. The draft of this finding left one point to the owner: whether the family wants the player tier kept to EU endpoints, which `google/gemini-3.8-flash` doesn't offer on 2026-09-26.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The player tier has no EU-only restriction and keeps zero-retention endpoints wherever they are, because zero retention protects her text better than a region does, and `google/gemini-3.8-flash` has only a global endpoint. This is a reversible choice. RES-2600 holds the reason, and it adds TypeSafe to the allowlist for Jev only.

### Resolved: the placeholders are the names of familiars, floors and Tangles, and the Guardians keep their names

Proposed by research on 2026-09-26; the owner approves it with this record.

Question 9 named familiars, Guardians and floors. RES-1600 compares three readings and holds the rule: familiars, floors and Tangles carry canon names as placeholders that the player replaces at the first meeting, keeping the canon name if she picks it among the suggestions; she also names the heroine, her room and every item she forges; every other name stays fixed, the Guardians included, because a Guardian introduces herself and the Master's memory and item names lean on her name for a year. The draft's line named the Guardians among the placeholders.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The Guardians keep fixed names, because each introduces itself by name in its arc (CAN-0040).

### Resolved: the familiars' third evolution stages ship with the full-roster backlog item after the MVP

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record.

RES-1900 ships two stages for non-starters in the MVP and adds the third later as content, and CAN-0060 left the timing to the owner. Two options were weighed. The third stages as a backlog item of their own could ship soon after the MVP, but they would need the same offline art pass, approval by a person and bestiary pages as the full roster, twice. Shipping them with the full-roster item runs one art pass and one week of acceptance play for both, and ties them to the same signal: whether the collection and the familiars hold her interest. The second option wins. The third stages ship with the full-roster backlog item after the MVP, when the stage 0.3 review picks that item. Until then a familiar past friendship level 12 waits for its third stage and evolves at the next rest stop after it arrives, as RES-1900 already says.

### Resolved: the style check with the player is a prerequisite of stage 0.3

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record.

Before any art is generated in volume, the family shows the player the key-art pictures and the four heroine sheets, and the parent records her choice (RES-3400). Stage 0.3 doesn't start until that choice is recorded, because stage 0.3 ships about 40 offline assets in the chosen style. RES-1500 compares the step with leaving the check as an open question.

## Conclusions

1. A spike on a real iPad must come before any other stage, and it must prove the keyboard with fractions, sound, dictation, the home-screen icon and 0 lost answers after 30 seconds without Wi-Fi.
2. The diagnostic core must be built and pass its checks before the game shell.
3. Every stage must have an automatic check and a human acceptance before the next begins.
4. Text models for the Master, the planner, live generation and the Explainer must be chosen by a blind bake-off within `BAKEOFF_BUDGET_USD`, and the choice must be written down.
5. The core must pass simulation with at least 90 % of nodes right on 6 profiles and a 30-day daily simulation.
6. The timed simulation must meet at least 28 scored first attempts at 1.0 × threshold and at least 25 at 1.5 × threshold, for an adventure of 60 minutes as the owner decided; the owner doesn't need the minimums recomputed for the longer adventure.
7. The MVP stage must contain exactly the MVP scope, and it must pass with no time elements on the child's screen and p95 of waiting for the Master at most 6 s.
8. The MVP must be accepted only after two weeks of daily play in which the player wants to return, spends threads without fear, isn't upset by the other path, and keeps fast guesses below 15 %.
9. Backlog items must be taken one at a time after the MVP, each accepted by a week of play without loss of interest.
10. The soft stop must come at 60 minutes of active time, as the owner decided, each extension must add 20 minutes, and the game must have no daily maximum, as the owner decided on 2026-09-27; the draft gave 45 or 60, 15 or 20, and a maximum of 60, and research had proposed a default of 100.
11. Each of the nine open questions must be answered or deferred on the record before the part it affects is built.
12. The OpenRouter configuration must name an explicit allowlist of providers on top of `data_collection: deny`: requests through OpenRouter carrying the player's material must set `zdr: true` and route only to Google Vertex, Amazon Bedrock, Azure or xAI, and the account must allow no provider beyond those four and Anthropic, OpenAI, Google AI Studio and Seed.
13. Stage 0.2 must check in simulation, and accept from an adult's play, an adventure of about 60 minutes in place of the draft's 30-45.
14. The three-day rule must count adventure days, the game days on which she played the open adventure, with a default limit of three that the parent can change or switch off.
15. In the MVP an alarm must reach the parent as a Parent Room notice only, as the owner decided on 2026-09-27; the web push to each phone the parent has subscribed, carrying a fixed line with no details of the signal, must wait until after the MVP. (The draft of this conclusion put the web push in the MVP.)
16. Jev, TypeSafe AI's decision model, may take only checks that ask a question with a fixed set of answers, as RES-1600 lists them, by the owner's decision of 2026-09-27; it must never take a role that writes text or computes an answer. (The draft of this conclusion asked the owner which service the parent meant.)
17. The model v1 values must start as RES-0900 sets them and the outcome thresholds as RES-1700 sets them, and the first-month review must check the share of triumph chapters before any other threshold.
18. The model must use the values of `pInit` for the player's current school group (kept in `personal/player.md`), because the owner decided that group on 2026-09-27; the scope must still cover everything to the end of group 8. (The draft of this conclusion asked the owner to state her group and assumed one until then.)
19. The game's art must follow the owner's pastel patisserie anime style as RES-3400 sets it, and no prompt or game text may name Nekopara or Cookie Run.
20. Only the names of familiars, floors and Tangles may be placeholders the player replaces, as RES-1600 sets out, and the Guardians' names must stay fixed.
21. Requests to Jev must carry only cleaned text and never maths results, as RES-2600 sets out, and must go through OpenRouter's zero-retention route to `typesafe/jev-1.13`; Jev must read her text in play only once it matches `SAFETY_MODEL` on the Russian test set at the stage 0 bake-off through that route, as research decided on 2026-09-27 on the owner's instruction. (The draft of this conclusion left TypeSafe's retention, the route and its stance on children to the owner before Jev read her text.)
22. The familiars' third evolution stages must ship with the full-roster backlog item after the MVP, when the stage 0.3 review picks it, as research decided on 2026-09-27 on the owner's instruction.
23. Stage 0.3 must not start until the family has shown the player the key-art pictures and the four heroine sheets and recorded her choice, as research decided on 2026-09-27 on the owner's instruction.
24. The player tier must keep zero-retention endpoints in any region, with no EU-only restriction, as a reversible choice research made on 2026-09-27 on the owner's instruction.
25. The Master and the planner must default to `z-ai/glm-5.3` through Mistral's zero-retention endpoint, by the owner's decision of 2026-09-27 that GLM is good enough for stories, and the stage 0 bake-off must confirm or overturn it on the blind Russian test against `anthropic/claude-haiku-4.5`, `google/gemini-3.8-flash` and `openai/gpt-6-luna`, as RES-1600 sets out. Whether Mistral may join the player tier stays open for the owner (RES-2600).
26. Every model role and both provider lists must be set by configuration and switch with no code change and no rebuild, by the owner's decision of 2026-09-27, and the parent must be able to switch the Master's model in the Parent Room among the bake-off's approved models only, as research proposed on 2026-09-27.

## Sources

- The owner's draft «Хроники Башни — спецификация», «Этапы» and «Решения и открытые вопросы», read 2026-09-26; not kept in the repository - the four stages and the backlog, their checks and acceptance, the settled list and the open questions.
- The owner's decisions of 2026-09-26, relayed that day: the adventure lasts 60 minutes, the soft stop comes at 60 minutes of active time, and the session budget, the scored-attempt minimums and the cost estimates need no recomputing.
- WebKit, «Web Push for Web Apps on iOS and iPadOS», https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/, read 2026-09-26 - iOS 16.4, a home-screen web app, a permission asked on a tap, no Apple Developer Program membership.
- IETF, RFC 8291 «Message Encryption for Web Push», https://www.rfc-editor.org/rfc/rfc8291, read 2026-09-26 - the payload is protected against inspection by the push service.
- ntfy documentation, «Configuration», https://docs.ntfy.sh/config/, read 2026-09-26 - a self-hosted server on iOS needs ntfy.sh as upstream, and the phone fetches the message from the self-hosted server.
- Flavio Copes, «A deep dive into Jev, TypeSafe's System One model», https://flaviocopes.com/jev/, read 2026-09-26 - Jev's maker, release date, price, latency, cloud region and data handling.
- The Rundown AI, «What Is Jev AI? A Beginner's Getting-Started Guide», https://app.therundown.ai/guides/what-is-jev-ai-getting-started, read 2026-09-26 - Jev as a decision model with choice, score and yes-or-no questions.
- The owner's decision of 2026-09-27, relayed that day: Jev can be used to evaluate safety and similar judgements, sending the child's cleaned text to a service outside OpenRouter.
- Flavio Copes, «A deep dive into Jev, TypeSafe's System One model», https://flaviocopes.com/jev/, read again 2026-09-27 - the endpoint `POST https://api.typesafe.ai/v1/systemone`, the question types, the model versions, the price, the rate limits and the US West Coast hosting.
- TypeSafe AI, «Models», https://docs.typesafe.ai/models, read 2026-09-27 - `jev-1.13.0` and its aliases, 64,000 tokens a request, text input only, English as the main language, no training on customer requests.
- TypeSafe AI, «Legal», https://docs.typesafe.ai/legal, read 2026-09-27 - zero data retention for enterprise customers only.
- TypeSafe AI, «Privacy Policy», https://typesafe.ai/legal/privacy-policy, read 2026-09-27 - no training on inputs, hosting in the United States, retention "as long as reasonably necessary", no knowing collection of data from children under 18.
- TypeSafe AI, «Data Processing Addendum», https://typesafe.ai/legal/data-processing, read 2026-09-27 - no fixed retention period, EU Standard Contractual Clauses for transfers, subprocessors listed at trust.typesafe.ai.
- OpenRouter API, `GET https://openrouter.ai/api/v1/endpoints/zdr` and `GET https://openrouter.ai/api/v1/models/typesafe/jev-1.13/endpoints`, read 2026-09-27 - `typesafe/jev-1.13` served by TypeSafe and listed as a zero-retention endpoint at $0.042 a million input tokens.
- OpenRouter, «Jev» guide, https://openrouter.ai/docs/guides/community/jev, read 2026-09-27 - Jev through OpenRouter at `POST https://openrouter.ai/api/alpha/decisions` or `POST https://openrouter.ai/api/v1/systemone`.
- OpenRouter, "Provider selection" (https://openrouter.ai/docs/guides/routing/provider-selection) and "Zero Data Retention" (https://openrouter.ai/docs/guides/features/zdr), read 2026-09-26 - `data_collection`, `zdr`, `only` and the account allowlist.
- OpenRouter API, `GET https://openrouter.ai/api/v1/endpoints/zdr`, read 2026-09-26 - the zero-retention endpoints of the named models.
- The owner's decisions of 2026-09-27, relayed that day: "GLM is good enough for stories"; the story candidates; "The model should be configurable". RES-1600, RES-2600 and RES-2700 hold what research read about the GLM models on 2026-09-27.
