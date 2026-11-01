---
id: RES-4314
artifact: research
status: approved
revised: 2026-11-01
elaborates: RES-4312
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The game can play as a tabletop RPG with an AI Master, where a maths task is the dice roll and code decides its outcome

## Summary

The owner decided on 2026-11-01 that the game is D&D with an AI Master, closer to D&D than to AI Dungeon: each adventure's scenario is prepared in detail beforehand, with branches and variants, and the Master leads her through it as a Dungeon Master runs a module. She says what she does in her own words, a maths task stands in for the dice, the world answers at once, and her decisions pick the branches and can change the whole plot. Adventures then fit into arcs and the overall plot. Three rules keep this workable. Code decides success: the engine's verdict is the roll, and the Master narrates it and can't change it, because a study of models playing D&D paired them with a rules engine as a guardrail against hallucination. The Director picks which task, and the Master fits it to what she tried, so she can't steer round weak topics. A failed check moves the story on with a cost, so no check is a dead end. Her freedom stays inside the scenario: the Master maps her words to its options or improvises within the scene, and steers her back. I estimate about $1.7 an adventure against the $5 limit. The largest risk is safety: far more of a child's free text goes to a model, and AI Dungeon's history shows both unsafe generated text and filters that block innocent words. No source tests a maths task as a skill check, so that core idea is untested.

## The question

How does a turn work, what does the Master control and what stays with code, how do her decisions change the plot, and how does measurement survive?

The assumption to challenge is the fixed spine of RES-4312. The owner wants decisions to be able to affect the whole plot, so fixed checkpoints and endings can't stand.

## Method

Read on 2026-11-01: RES-4312, ADR-3240, ADR-0110, ADR-0330 and SPC-0070 by outline, and the search summaries below. External sources carry labels: Read means the page or abstract itself, and Snippet means a search summary. Costs are assumed token counts on `src/server/gateway/prices.ts`. Nothing was run.

## Findings

### Context must be budgeted in layers

[Read] AI Dungeon sends instructions, plot essentials, story cards, a story summary, a memory bank, history, an author's note, the last action and front memory, in that order, and trims required parts past 70 % of the context, with the author's note first to go. [Snippet] Story cards load on keywords. [Inference] This matches the memory levels of RES-4312, and two parts are new here: ontology records loaded when the scene names them, and a short note from the Director that steers each turn.

### A tool must hold the rules

[Read] Zeng and colleagues paired models with a D&D rules engine, which supplied maps and resources and acted as a guardrail against hallucination, over 27 combat scenarios. Claude 3.5 Haiku was the most reliable. Models played as players and monsters, not as game masters, so this supports the engine and says little of a Master. [Read] Gongora and colleagues propose three test categories for game-master models, and the abstract reports no results. [Snippet] A forum report describes a model GM letting a player win every challenge, and that is an anecdote. [Inference] The Master must not decide outcomes. It calls tools, and the engine answers.

### Failure must move the story

[Read, RES-4311] Mistakes reproached by ability harm persistence. [Read, RES-0010] The game already holds no dead ends, and a wrong answer takes the other branch. [Inference] A failed check gives a cost or twist, and the story goes on. [Snippet] Tabletop guides describe failing forward as failure that still moves the story on, and Powered by the Apocalypse games popularised it; players argue whether success at a cost is the same idea, and I use both on separate rungs.

### A prepared module with branches fits the owner's D&D

[Read] Short defines a storylet as content with prerequisites and effects on the world state, simple, atomic and recombinable, and warns that branching that never recombines explodes combinatorially, so it works best as small segments. So a scenario's branches should rejoin. [Inference] Each scene of a scenario can work this way, with conditions and variants, so a branch can be rewritten or reused. The scenario is a unit code can check before play, which free generation can't offer, and the parent reads what happened afterwards.

### Free text raises the safety stakes

[Read] Incident 402 records players manipulating AI Dungeon into sexual stories involving children. [Read] The Register reports that the filter blocked innocent text, such as four watermelons and a superhero rescuing a child, and that flaws exposed 188,000 private adventures. [Snippet] Some users reported the model producing such content unprompted, which the incident page doesn't state. So her text must stay in the Mac's own database and behind the PIN. [Inference] Pre-checks on her text stay mandatory, and each reply passes code checks; the owner chose guardrails in the system prompt and a full audit over a model check on every reply. A blocked turn must read as story, not refusal. The parent reads everything, which the audit already allows, and only the parent.

### The turn loop

[Proposal]

1. The Master describes the scene and offers three starters, and she can type, speak or pick one.
2. Her text goes to the Master, which tells play from her real state.
3. The Master maps her action to the scene's options, and it answers at once or calls `request_check` with what she tried and why it is hard. An action outside the scene gets an improvised answer in the setting, and the scene's hook leads her back in the end.
4. The Director takes the next task from its queue, and prefers one whose domain's verb fits.
5. The frame author sets that task in what she tried, and the task shows as today.
6. The engine's verdict is the roll: clean succeeds, partial succeeds at a cost, alt fails forward with a twist.
7. The Master narrates that outcome and calls `change_world` to record what changed in the ontology.
8. The reply passes the forbidden-word list, and every other check reports to the audit.

A check is needed only when the attempt can fail and failing is interesting. If too many turns pass with no check, the Director's note tells the Master that the next obstacle is a check, so an adventure still holds its 28 graded attempts. A level sets difficulty as now. Abilities also let her do things with no check: at level 3 of Turning the Works she simply runs the lift, which gives levels a felt power and adds to gates. Guiding threads are the inspiration a player spends for help.

### How decisions change the plot

[Proposal] Before each adventure, the pipeline of RES-4312 writes a detailed scenario: a graph of 15 to 30 scenes with read-aloud text, options, checks, what each outcome leads to, people and their aims, variants, and at least two endings that feed the arc. The code checks that every path ends and fits the Director's plan. Fixed: the world's truths, its people, the Tower's secret, the safety rules, the calendar. Open: who lives, who trusts her, what she finds and in what order, which Guardians side with her, and how it all ends. CAN-0080's checkpoints become pressures: events that will happen unless she changes them. The four endings stay as the far points, and the showrunner may reach any or a new one in keeping with the canon. After each adventure and at a major event, the showrunner replans open arcs from the ontology. A major decision is marked in the ontology, and the world remembers it for good.

### Cost and pace

[Proposal] A turn: Master on Sonnet at 6,000 tokens in and 400 out costs $0.016. At 80 turns that is about $1.35, plus 30 task stories at $0.18 and planning near $0.2, so about $1.7, and up to $2.5 on long days. [Inference] A reply should begin within about 3 seconds, so replies stream behind the check of finished sentences, or wait behind the existing loader. Which one is a design choice for the build.

### Typing is a limit for a young player

[Inference] A young child types slowly, and spring oral reading norms in English run at about 112 words a minute at grade 3 and 133 at grade 4 ([Snippet] Hasbrouck and Tindal), so a story costs real time. Task time therefore holds reading time, and thresholds change by data if they prove wrong. Starters, speech input from ADR-0150 and short answers keep the turn quick, and a long free input is never required.

## Conclusions

1. The game plays in turns: a scene, her free action, an immediate answer.
2. A maths task stands in for the dice whenever an action can fail and failing matters.
3. Code decides each outcome from the engine's verdict, and the Master can't change it.
4. The Director chooses the task, and the frame author sets it in what she tried.
5. Each adventure keeps its graded attempts, because the Director can make the next obstacle a check.
6. A clean answer succeeds, a partial one succeeds at a cost, and a failed one moves the story on with a twist.
7. The Master changes the world only through tools that write the ontology.
8. Her decisions can change the plot and its ending, and only the world's truths stay fixed.
9. Each adventure's scenario is prepared in detail beforehand as a graph of scenes with branches and variants, and the Master leads her through it.
10. The Master keeps her inside the scenario, and an action outside it gets a short answer that leads back.
11. The ending of each adventure feeds its arc, and arcs feed the overall plot, so the showrunner replans from what she did.
12. Ability levels let her do some things with no check.
13. Every reply passes the code's forbidden-word check, and a blocked turn reads as story. Safety rests on the model's own safeguards, the prompt's guardrails and the parent's full audit, as the owner decided.
14. Starters and speech keep a turn possible with no typing.
15. The judge scores whether a check's story follows what she tried.
16. The Master may improvise details, minor people and side moments, recorded in the ontology, and can't contradict the canon or the scenario, change an outcome or skip the way forward.
17. Scenario branches rejoin, so a scenario stays within 15 to 30 scenes.
18. Spend per adventure is measured, with an expected figure near $1.7.

## Sources

Read: the repository files under Method, and RES-4311 for Mueller and Dweck. Read 2026-11-01.

- [AI Dungeon, what goes into the context](https://help.aidungeon.com/faq/what-goes-into-the-context-sent-to-the-ai) - context layers. Read 2026-11-01.
- [Zeng and colleagues 2025, through EurekAlert](https://www.eurekalert.org/news-releases/1113076) - a rules engine as guardrail. Read 2026-11-01.
- [Gongora and colleagues, Skill Check](https://arxiv.org/abs/2309.13702) - abstract. Read 2026-11-01.
- [Short, Storylets: You Want Them](https://emshort.blog/2019/11/29/storylets-you-want-them/) - storylets and their limits. Read 2026-11-01.
- [Incident 402](https://incidentdatabase.ai/cite/402) - the incident. Read 2026-11-01.
- [The Register on AI Dungeon's filter](https://www.theregister.com/2021/04/30/ai_dungeon_filter_vulnerabilities/) - filter and leak. Read 2026-11-01.

Snippet:

- [AI Dungeon, Author's Note](https://help.aidungeon.io/faq/what-is-the-authors-note) - steering text. Read 2026-11-01.
- [Forum report on LLMs as a GM](https://www.enworld.org/threads/llms-as-a-gm.714126/) - anecdote. Read 2026-11-01.
- [Quality-Based Narrative](https://videlais.github.io/simple-qbn/qbn) - origin. Read 2026-11-01.
- [Gnome Stew on failing forward](https://gnomestew.com/failing-forward-how-to-make-failure-interesting-in-rpgs/) - the idea. Read 2026-11-01.
- [Reading fluency norms](https://read180.msad54.org/sites/default/files/Reading-Fluency-Rates.pdf) - oral norms. Read 2026-11-01.
- [Vice](https://vice.com/en/article/text-adventure-game-community-in-chaos-over-moderators-reading-their-erotica) and [AI Dungeon's filter FAQ](https://help.aidungeon.io/faq/openai-and-filters) - safety and filters. Read 2026-11-01.

### Could not obtain

Blades in the Dark, Burning Wheel, the Dungeon Master's Guide, silent reading norms by group, and any study of a maths task as a skill check, or of LLM guardrails for children's interactive fiction, were searched and not found. Tried 2026-11-01.
