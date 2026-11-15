---
id: RES-4321
artifact: research
status: draft
revised: 2026-11-15
elaborates: RES-4314
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A full RPG needs four loops, perks that are maths tools, rewards and pets that succeed or fail by how she solves, and a scenario writer that knows her bag and her team

## Summary

The owner asked on 2026-11-15 for a full RPG: equipment with bonuses or perks, the same for pets, pets she catches and develops as in Pokémon, and the story's arcs and scenarios generated with all of it in mind. The record already specifies most of an RPG economy in SPC-0140, and none of it runs: there is no `src/game/`, no `content/economy.json`, no `content/familiars.yaml` and no `content/gates.json`. Two approved rules forbid bonuses, that stats never affect tasks and that the first version offers no stats, because the game exists to find where her independent thinking stops. The sources point to one way through. A perk is a maths tool, such as a number line or an inverse check: it changes how she solves a task, which is what made a maths game teach in Habgood and Ainsworth (2011), and each use is logged as help, which the knowledge model already separates. The owner decided on 2026-11-15 that rewards, pets and the result of every action succeed or fail clearly by how she solves the tasks, so that solving pays and skipping doesn't, and that she is old enough to take a failure. So a pet is caught on a clean or partial check and escapes on a failed one, to be met again later, and a grant scales with the quality of the solution. Rewards contingent on performance undermined children's interest in a meta-analysis of 128 studies (Deci, Koestner and Ryan 1999), which is the case against this choice, and the record answers it with three guards: nothing pays for speed, a wrong answer and «Не знаю» earn the same nothing, and a failure never takes away what she holds. A sweep of the 2,132 approved requirements finds 119 that touch rewards, pets, outcomes, failure, loss or words, and about 20 of them contradict the decision. The scenario writer and the Master need typed facts about her bag, team and bestiary, and the scenario schema needs finds, locks, creatures and camps that code can check. This record doesn't cover pictures, battles' tactics, the Master's memory or any amount; the design step sets those.

## The question

What loops, equipment, perks, pets and generation rules make Meowtower a full RPG that still measures her maths, and what must the story pipeline know to write for them?

The assumption behind the question is that a bonus has to make play easier, since that is what a bonus does in most games. It can't here, because an easier task hides the skill the game measures. A bonus pays in story, choice and tools that are themselves maths. The record held a second assumption, that a child must be spared failure, and the owner overturned it: a failure is fine as long as it costs the chance of a gain and never what she already holds.

## Method

Read on 2026-11-15, in the repository at revision 010fad3: SPC-0140 in full; SPC-0460's sections on arcs, memory, the pipeline, the serial structure and the Master's memory; the vision's goal and "will not do"; RES-4314; RES-4318; ADR-3270; ADR-3220; ADR-0220; the requirements cited below; `src/story/scenario.ts`, `src/story/writer.ts`, `src/story/master-tools.ts`, `content/story/scenario.en.json`, `src/engine/projections/rewards.ts` and the event schema. Searched the record with `paw find` for forge, shop, familiar, inventory, quest, loop and rank, each search exhaustive.

Two researchers read outside sources on 2026-11-15. Read: the Serebii capture page, the PokeAPI v2 documentation, the PokemonDB type chart, the D&D System Reference Document 5.1 pages 2, 9, 12, 56 to 60, 104 and 206 to 211, the D&D Beyond SRD page, Prodigy's parents page, Fairplay's Prodigy page, the PubMed record of Deci, Koestner and Ryan (1999), the full text of Zendle and Cairns (2018) and the UK Information Commissioner's Office (ICO) Age Appropriate Design Code standard 13.

Not obtained: Nintendo's own pages on catching, experience, party and the Pokédex (Bulbapedia and pokemon.com refused, the official game sites state no mechanics); the full text of Ryan, Rigby and Przybylski (2006) and of Habgood and Ainsworth (2011), whose abstract was read through a summary; the Kansspelautoriteit 2018 loot box study; Prodigy's own rule for whether a battle depends on correct answers; and the 2021 complaint against Prodigy itself. No player tried anything.

## Findings

### The record specifies an RPG economy, and none of it is built

SPC-0140 states four currencies and their grants: buttons from first attempts and quests, star-steel shards from clean attempts and finished floors, star yarn from guardians and clean rows, and one material for each floor-world. It states chests of three rewards, a shop with a shelf of six that restocks by a daily hash and sells for buttons only, a forge whose recipes take shards, yarn and a material in four tiers with six named recipes, among them the "Lantern of Patient Light" and the "Glasses of the Second Look", six familiars with three stages each, friendship that ignores answers, and a bestiary with silhouettes and a percentage. Its element ring and battles are "if built".

In the code there is an `inventory` projection that stores reward grants, a stand-in chest and scene that grant a star, a thread or a feather, and the sheet of nine skills. No screen shows what she holds, and nothing writes `floor_entered`, `room_opened`, `combo`, `name_given` or `thread_granted`.

### Four approved rules forbid a bonus that touches a task

SPC-0140 says stats never affect tasks, that the first version offers no stats, that the element ring affects no task, outcome or measurement, and that a battle depends on tactical choices alone. The vision's goal is to find where her independent thinking stops, so an item that eased a task would make the log show a skill she lacks.

### The knowledge model already separates help from independence

ADR-0220 keeps a "with help" estimate with a share for each depth of hint beside the pooled one, and a second attempt is scored apart. A perk that does what a hint does is a case the model already handles, as long as the log says it happened.

### The record keeps a set of maths tools that could be items

The record's list of the first version's parts holds the hint ladder, the estimate with the inverse check, solution plan cards, rational grouping and composing a word problem. Each is a way to solve a task, so each could be carried as an item rather than shown to everyone at once.

### Tying the mechanic to the maths is what made a maths game work

Habgood and Ainsworth (2011) built one maths game for children aged 7 to 11, Zombie Division, in three versions. Under fixed time the children learned more from the version whose core mechanic was the maths, and with free choice they played that version about seven times longer. The evidence is one game in short classroom sessions, read through a summary of the abstract, so it says nothing yet about a daily collection layer.

### Rewards for being right undermine a child's interest

Deci, Koestner and Ryan (1999) pooled 128 studies. Rewards contingent on performance undermined free-choice interest (d = -0.28, read from an extraction of the abstract), tangible and expected rewards did too, and tangible rewards tended to harm children more than college students. Positive feedback raised interest. The measure is interest, not learning.

SPC-0140 already pays for quality in several places: a shard for each clean unassisted first attempt that isn't a rapid guess, finds and a sparkling chest on a success branch, a thread for a clean row, and nothing for a second attempt. It pays the same whatever she answered in others: a button for any first attempt, shards for any finished floor, yarn for any Guardian ending, the same friendship for right, wrong or «Не знаю», and quests met without a correct answer.

### A capture in Pokémon is a weighted chance, and Prodigy shows what to avoid

The Serebii capture page, a fan reference, gives a catch chance as factors that multiply: the target's remaining health, the species' rate, the ball and the target's status. PokeAPI names a species' `capture_rate`, `growth_rate` and `evolution_chain`, and PokemonDB's chart holds 18 types with multipliers of 0, 0.5, 1 and 2. So the series' catch is a random draw, weighted by weakening the creature first. Nintendo's own rules were not read.

Prodigy's parents page says its maths questions are free and that members unlock "extra-powerful" pets. Fairplay reports that its predecessor and 21 partners complained to the US Federal Trade Commission (FTC) in February 2021 that Prodigy pushes paid memberships at children. The complaint itself was not read. Meowtower sells nothing, but the pattern names the failure: pets that a child sees and can't have.

### Paid random drops go with problem gambling, and nudges must not exploit a child

Zendle and Cairns (2018) surveyed 7,422 adults and found loot box spending rose with problem-gambling severity (eta squared 0.054), a correlation they call not trivial and whose cause they can't fix. It covers paid boxes and adults only. The ICO's standard 13 forbids nudge techniques that exploit unconscious processes to lead a child to the designer's preferred path, and recommends nudges towards wellbeing such as pause-and-save tools.

### Tabletop rules bound bonuses by count, stacking and ceilings

The SRD 5.1 lets a creature be attuned to at most three magic items at a time, attuning takes a short rest, and a consumable "loses its magic" once used (pages 206 and 207). The same effect cast twice doesn't stack (page 104), inspiration can't be stockpiled (pages 59 and 60), and an ability score stops at 20 (page 56). A rarity sets an item's bonus, for example armour +1, +2 and +3 as rare, very rare and legendary (page 208). SRD 5.1 is published under the Open Gaming License 1.0a, and the D&D Beyond page says SRD 5.2.1 and later are under CC-BY-4.0.

### The day was a row of floors, and the adventure replaced it

The rule that ordered the recap, three floors and a finale is superseded, and ADR-3270 makes an adventure from an approved scenario the unit of play, which the game has played since 2026-11-15. Floors keep three jobs in the record: eight element worlds that hold materials and habitats, a ninth for the moon mote, and gates of seven kinds, and no gate may stand before a checkpoint or finale.

### The scenario writer and the Master know nothing of items or pets

An encounter in `src/story/scenario.ts` holds a place, a situation, a goal, people, a pressure, checks, an act, a beat, tension, a value turn, a line, subtext, exits, accepted skills and attached library entries. It holds no find, lock, creature or camp. The Master's tools change the world, record facts, signal, move between encounters, adapt and end a scene, and none grants a catalogue item or starts a catch. SPC-0460's pipeline has a showrunner, an arc writer, an episode writer and a beat writer, and its arc kinds include training and tournament, and a story request gets the player's skills only as typed facts with no numbers. None of them reads what she holds.

### The owner wants success and failure to follow the solution

On 2026-11-15 the owner read the conclusions that grew pets by play alone and paid grants for acts of play, and asked to reverse them: useful things must depend on the quality of the solution, so there is a reason to solve rather than skip. The owner added that the player is old enough to take a failure, and that rewards, pets and the result of an action must each succeed or fail clearly by how the tasks are solved.

### The approved rules split three ways on that decision

A sweep on 2026-11-15 took the rule sentence of each of the 2,132 approved requirements, kept 567 that name a reward, a pet, a quest, an outcome, a failure, a loss or a word, and read the 119 of those that untie a result from the answer or soften a failure. About 20 contradict the decision: those that pay or grow the same whatever she answered, a planned friendship that succeeds whatever she answered, quests met with no correct answer, the heroine who takes no damage, a Guardian never shown as beaten, a failed action told as a twist, badges that read "knot loosened" and "accepted", and the ban on a tick, a cross and the words for right and wrong. About 90 hold the measure or the dignity of play and fit the decision: nothing pays for speed, a rapid guess earns nothing, a second attempt earns nothing, a failure takes nothing she holds, no familiar dies or is lost, the story never ends on an answer, the Master tells an outcome as an event in the world, and no word judges her. The rest concern battles, which the owner has not ruled on.

### The owner rejected a decorative weapon

On 2026-11-15 the owner read a proposal of a weapon for each skill whose tier mirrors the skill's step and said it means nothing when the skills already show it. An item that repeats a number adds nothing, so every item needs an effect of its own.

## Options

### Where a perk may act

| Option | Better at | Case for and against |
| --- | --- | --- |
| Do nothing: items and pets are cosmetic | The measure stays untouched, and the record already says this | The owner asked for bonuses, and a cosmetic item is the decorative weapon again. |
| Perks on the economy and the story only | Can't reach the measure | Safe, but nothing helps at the moment of a task, so the item never feels like a tool. |
| Story perks, plus perks that are maths tools logged as help (leading) | The item is maths, which the integration study favours, and the model reads each use as help | It needs a `perk_used` event, a report split and a share of checks she takes alone. The case against: a child who always carries a tool leaves few independent attempts, and the parent's map thins exactly where it matters. |
| Perks that change a task: easier numbers, a skipped check | The strongest feeling of power | Dropped, because it destroys the measure, which is the game's purpose. |

### How a pet is caught

| Option | Better at | Case for and against |
| --- | --- | --- |
| Do nothing: the starter and planned friendships | Approved, and nothing can fail | She can't go and look for a creature, which is the owner's wish. |
| A scripted befriending in the scenario | Always succeeds, as SPC-0140 asks of a planned friendship | Nothing she does matters, so it is no hunt. |
| A catch scene she prepares, whose three outcomes all bring the same pet | No outcome pays for being right | The owner rejected it: the check would change nothing she gets, so there's no reason to solve it. |
| A catch scene she prepares, decided by the check (leading) | Her preparation and her solution decide the catch, which is what the owner asked | A clean check catches, a partial one catches at a cost, and a failed one lets the creature escape, to be met again in its habitat. The case against: a failed catch is a visible loss of a wanted pet, which the meta-analysis predicts can lower interest. |
| A weighted random catch that can fail, as in Pokémon | The tension of a roll | Dropped. A random draw that can give nothing is the lottery the vision forbids, and chance would hide what her solution did. |

### What a correct answer earns

| Option | Better at | Case for and against |
| --- | --- | --- |
| Keep SPC-0140's grants as they are | Already specified | Half its grants pay the same whatever she answered, so skipping costs her nothing there. |
| Grants from acts of play only | The meta-analysis's safest form | The owner rejected it, because nothing would pay for solving. |
| Grants scaled by the quality of the solution, with a wrong answer and «Не знаю» earning the same nothing (leading, the owner's decision) | Solving pays, and a guess earns no more than an honest «Не знаю», so the measure of avoidance stays readable | The meta-analysis found rewards contingent on performance undermine children's interest, more than adults'. The guards are that nothing pays for speed, a rapid guess earns nothing and no failure takes what she holds. |

The owner decided the second and third comparisons on 2026-11-15. The design step sets the amounts and amends the rules.

## Conclusions

1. The game runs on four nested loops. A turn is her action, the Master's answer, a check as a task, the engine's outcome and the narration. An adventure is a run of encounters from an approved scenario that ends with a result, the grants of the run and a shown growth. A day is the recap, the daily quests, an adventure and a stop at the camp, where the screens hold no tasks. The long loop is arcs, rank, gates, the bestiary and the nearest goal, and the nearest goal stays on the main screen so she knows what she is working towards.
2. No item, perk or pet changes which task is drawn, its numbers, how her answer is checked or the outcome the engine gives.
3. A perk is of one of two kinds. A story perk changes what she finds, opens or can choose, and the log records only the result. A tool perk is a maths tool she can use on a task, such as a free hint rung, a number line, the inverse check, a plan card or a second look, and each use is a `perk_used` event that the knowledge model reads as help.
4. The parent's report separates attempts made with a tool from attempts made without one, and the Director keeps a share of each adventure's checks on which no tool can be used, so independent evidence never runs out.
5. She wears at most four items, one of each kind: an outfit, an accessory, a focus and a curiosity. She changes them at the camp or in the room between adventures, so a choice holds for the adventure. A tool perk has a number of uses an adventure, which return at the camp, and an item used up stays in her collection.
6. Bonuses don't stack: where two sources give the same perk, one applies. Each item's quality sets the strength of its story perk or the uses of its tool perk, as a value in a content file that changes without code.
7. Nothing in the game is cursed, sold or lost, and no item, pet or perk is offered that she can see and can't reach by playing.
8. Keys are story items that open exits, gates and secrets. A lock always has another way on, so a missing key costs a detour and never the adventure, and a secret the three-day rule queued can be opened later with a key she finds.
9. A pet joins her team in three ways: the starter, a friendship the story plans, and a catch scene. In a catch scene she reads the bestiary's clue, chooses what she brings, an item, a pet or an approach, and takes a check. A clean outcome catches the pet with a higher first bond, a partial one catches it at a cost the story names, and a failed one lets it escape. An escaped creature stays in its habitat and can be met again in a later adventure, and no catch uses a random draw. A planned friendship also rests on a check, and a failed one is offered again later in the story.
10. A pet grows mostly by the checks it shares with her: a clean check it helped with raises its friendship most, a partial one less, and a failed one nothing, while scenes, rest stops and camp talks add a small amount. It evolves through three stages, and each stage opens one perk of the two kinds above. She keeps an active team of up to three, and a pet she has caught is never lost, ill or removed.
11. Every grant scales with the quality of the solution: a clean unassisted first attempt pays most, a partial one or one with help pays less, and a wrong answer and «Не знаю» pay the same nothing. Nothing pays for speed, a rapid guess pays as a wrong answer, a second attempt pays nothing, and a daily quest asks for solved tasks as well as acts of play.
12. The Tower's floors are the world map: they hold the elements' habitats, their materials and the gates, and the day belongs to the adventure.
13. The scenario writer, the arc writer and the Master read the player's state as typed facts with no numbers: the items she wears and their perks, her team and its stages, the keys and materials she holds, the bestiary's gaps by element and her nearest goal. An arc may aim at one of them, so a training arc helps a pet evolve and a mystery arc leads to a key.
14. An encounter may declare finds, which name catalogue items or a material kind, locks, which name a key or a perk and the other way on, a creature for a catch scene, and a camp. Code checks every declaration before she plays: a find or a creature exists in the content, a creature lives in the place's element, every lock has another way on, and an adventure holds no more catch scenes than the content allows.
15. The Master grants only the finds and creatures the scenario declares, through a tool that names them, and tells of her items and team from the facts it is given. It never invents a perk.
16. She sees what she holds: a bag with equipment, keys and materials, a team screen with each pet's stage and perks, the bestiary, and the sheet of nine skills with rank. Each screen works by touch on a tablet and by the keyboard on a computer.
17. The design step amends the approved rules that conclusions 3, 5, 9, 10, 11, 21, 22 and 23 contradict, among them the rules that stats never affect tasks, that the first version offers no stats, that a reward or friendship comes whatever she answered, that the heroine takes no damage, that a failure is told as a twist, and that a screen shows no mark or word of right and wrong. It states the replacement beside each and keeps the rules that guard the measure: no pay for speed, nothing for a rapid guess or a second attempt, and no loss of what she holds.
18. Content decides what ships. The six familiars with three stages, the shop's 20 items and the forge's six recipes need names, perks, pictures and the owner's approval before they load, so content and pictures sit on the critical path ahead of the screens.
19. Battles stay deferred until the roster and the pictures exist. Whether a battle's result follows her checks, as the owner's decision suggests, or tactics alone, as the record requires now, is the owner's to settle before then.
20. The design step reads the full texts of Habgood and Ainsworth (2011) and Ryan, Rigby and Przybylski (2006) before it cites them, because this record holds only an abstract of the first and nothing of the second.
21. The result of an action succeeds or fails clearly. A clean check succeeds, a partial one succeeds at a cost the story names, and a failed one fails: the door stays shut, the creature escapes, the heroine is hurt or the Guardian holds. The story always goes on from a failure by another way, so no answer ends an adventure.
22. A failure costs the gain the check offered and a recoverable state, such as health restored at the camp, and never what she holds: no item, pet, currency, friendship, page or rank falls after an answer.
23. The screens say plainly whether an answer was right, with a mark and a word of fact, and never with a word that judges her, such as calling her careless, slow or not clever.

## Sources

- `project/specs/SPC-0140-game-rules-outcomes-progression-rewards-familiars.md` at 010fad3, read 2026-11-15 - the economy, chests, shop, forge, roster, friendship, bestiary and nearest goal.
- `project/specs/SPC-0460-the-world-calendar-story-series-memory-ontology-and-pipeline.md` at 010fad3, read 2026-11-15 - arcs, the pipeline, the serial structure and the Master's memory.
- `project/vision.md`, `RES-4314`, `RES-4318`, `ADR-3270`, `ADR-3220` and `ADR-0220` at 010fad3, read 2026-11-15 - the goal, the turn loop, skills, rank and the estimate with help.
- `src/story/scenario.ts`, `src/story/writer.ts`, `src/story/master-tools.ts`, `content/story/scenario.en.json`, `src/engine/projections/rewards.ts`, `src/shared/events.ts` and a listing of `content/` at 010fad3, read 2026-11-15 - what the code holds.
- [Habgood and Ainsworth (2011), Journal of the Learning Sciences](https://doi.org/10.1080/10508406.2010.508029), abstract read through a summary 2026-11-15 - intrinsic integration.
- [Deci, Koestner and Ryan (1999), Psychological Bulletin](https://doi.org/10.1037/0033-2909.125.6.627), PubMed abstract read 2026-11-15 - rewards and interest.
- [Ryan, Rigby and Przybylski (2006), Motivation and Emotion](https://doi.org/10.1007/s11031-006-9051-8), metadata only, read 2026-11-15 - not used for any finding.
- [Zendle and Cairns (2018), PLOS ONE](https://doi.org/10.1371/journal.pone.0206767), full text read 2026-11-15 - loot boxes and problem gambling.
- [ICO Age Appropriate Design Code, standard 13](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/), read 2026-11-15, no date shown - nudges.
- [Serebii, capture mechanics](https://www.serebii.net/games/capture.shtml), read 2026-11-15, no date shown - the weighted catch.
- [PokeAPI v2 documentation](https://pokeapi.co/docs/v2), read 2026-11-15 - species fields.
- [PokemonDB type chart](https://pokemondb.net/type), read 2026-11-15 - 18 types and their multipliers.
- [D&D System Reference Document 5.1](https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf), pages 2, 9, 12, 56 to 60, 104 and 206 to 211, read 2026-11-15 - attunement, consumables, stacking, ceilings and the licence.
- [D&D Beyond, System Reference Document](https://www.dndbeyond.com/srd), read 2026-11-15, updated 2026-03-02 - the CC-BY-4.0 licence of SRD 5.2.1.
- [Prodigy, for parents](https://webflow.prodigygame.com/main-en/parents) and [Fairplay, Prodigy](https://fairplayforkids.org/pf/prodigy/), read 2026-11-15 - members' pets and the 2021 complaint as Fairplay reports it.
- The owner's messages of 2026-11-15 - a full RPG, equipment with bonuses and perks, the same for pets, pets to catch and develop as in Pokémon, generation that accounts for all of it, and the rejection of the decorative weapon.
