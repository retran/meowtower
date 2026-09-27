---
id: RES-1900
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes familiars as companions won by friendship, never by correct answers

## Summary

The draft proposes familiars: small companion creatures that hatch from knitted eggs, grow through friendship and evolve in stages. The canon roster holds 24 familiars, three for each of eight elements, plus three legendary familiars that come only through the story. The MVP (minimum viable product) keeps a small roster of six to nine with offline art a person approves, three of them starters. Friendship grows from shared adventures, and every planned friendship succeeds whatever the player answers. An element ring sets which element beats which, but it acts only in story battles and in how a strike on a Tangle looks, never on a task. Story battles, the element ring, AI-created creatures, legendaries and the full roster are deferred until after the MVP. This record covers the roster, how familiars appear, the element ring, battles, the team, evolution and the bestiary. Experience and levels are in RES-2000 and rewards and the economy in RES-2100; other records cover the canon itself, the story, dreamcore and the Director's limits on AI-created content.

## The question

How does the draft propose that the player gains, keeps and grows companion creatures, and what does the MVP keep of it? The draft assumes a collection of creatures motivates a child to come back daily without tying the collection to correct answers. That assumption holds only if friendship and evolution feel earned; if they arrive on a fixed schedule whatever the player does, the collection might read as a calendar and stop motivating.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), sections «Текущий объём (MVP)» (Current scope (MVP)) and «Фамильяры» (Familiars), on 2026-09-26. The draft is a draft, so every finding below is what the draft proposes, not what was decided.

The draft leaves these open:

- How friendship levels are earned: which scenes, rest stops and battles add how much friendship.
- How many friendship levels exist, and the evolution thresholds for familiars other than the starters, which it puts in `content/familiars.yaml`. The resolved finding on stages below chooses level 5 for their one MVP evolution.
- What happens to the one-a-week pace once the MVP roster of six to nine is complete, which at that pace takes about three to six weeks.
- What the canon names each evolution stage; the draft defers to the canon, section 6.
- How the Master's lines use the traits the player picks.
- What the hatching scene shows and what "the next scene" means when a friendship happens in the last scene of an adventure.

## Findings

### The draft defines familiars as original creatures that are born, grow and never die

The draft takes familiars from the canon, section 6. They are small creatures born from a knot untangled with kindness. They hatch from knitted eggs, grow from friendship and evolve in three stages. They don't die, don't fall seriously ill and don't disappear. Everything is original: no creatures, names, "capture balls" or terms from known franchises.

### The canon roster is 24 familiars, three for each of eight elements

Each familiar has a look, a character, a sample line, two moves and three evolution stages. The data lives in `content/familiars.yaml`, generated from the canon.

### The player picks one of three starters in Session 0 and names it

In Session 0 the player chooses «Пуговка» (Pugovka, "Little Button", element Spark), «Винтик» (Vintik, "Little Screw", element Stride) or «Безешка» (Bezeshka, "Little Meringue", element Crumb). The player gives the familiar a name and one or two traits. The two starters she didn't pick meet her later on their own floors.

### Three legendary familiars come only through the story

Legendaries are outside chests and come only through the story. They stand outside the element ring. Deferred until after the MVP by the draft.

| Legendary | When |
| --- | --- |
| «Муфта, Кошка Первой Петли» (Mufta, "Muff", the Cat of the First Loop) | hints in autumn, revealed in May, becomes a familiar in summer |
| «лисица Выворотка» (the fox Vyvorotka, "Inside-Out") | spring, the Underside arc |
| «Клубочек» (Klubochek, "Little Ball of Yarn") | the finale of the year |

### AI-created creatures join within the Director's limits

New creatures created by AI during the story may appear within the Director's limits, which another section of the draft sets («Предметы и существа, созданные на ходу», Items and creatures created on the fly). Each has one of the eight elements. Deferred until after the MVP by the draft.

### Friendship is a story act that always succeeds

Each floor has three familiars of its element. Making friends is a story act: treating the creature, helping it, solving its request or choosing an approach in free text. After the friendship, a Tangle or a creature leaves a knitted egg, and the familiar hatches from it in the next scene. A planned friendship with a roster familiar, about one a week, always succeeds and doesn't depend on whether tasks are correct. The player's choice affects only the familiar's traits and its first line.

### A success branch can open a rare encounter, and an alternative branch only postpones it

At a story point, the success branch of a room can open an extra encounter: a rare roster familiar earlier than planned, or an AI-created creature within limits. If the branch went to `alt`, the chance isn't lost: it comes back later in another scene. Legendaries come only through the story, and outcomes don't affect them.

### The draft paces new familiars at about one a week

In the MVP, about one new familiar from the MVP roster arrives each week until the roster is complete. Later, with the full roster, about one new familiar arrives each week, so the 21 remaining after the three starters last most of the year. Rare encounters from success branches change the order, never the total for the year. Legendaries arrive at checkpoints.

### Eight elements stand in a ring, each strong against the next

«Искра» (Spark) → «Крошка» (Crumb) → «Ход» (Stride) → «Мера» (Measure) → «Капля» (Drop) → «Грань» (Facet) → «Эхо» (Echo) → «Лад» (Harmony) → «Искра» (Spark).

| Element | Floor | Strong against | Weak to |
| --- | --- | --- | --- |
| Spark | «Архив» (Archive) | Crumb | Harmony |
| Crumb | «Кондитерская» (Confectionery) | Stride | Spark |
| Stride | «Завод» (Factory) | Measure | Crumb |
| Measure | «Дюны» (Dunes) | Drop | Stride |
| Drop | «Канал» (Canal) | Facet | Measure |
| Facet | «Сад» (Garden) | Echo | Drop |
| Echo | «Сортировочная» (Sorting Yard) | Harmony | Facet |
| Harmony | «Ярмарка» (Fair) | Spark | Echo |

The links are data in `content/familiars.yaml`.

### The element ring never touches tasks or their outcomes

The ring acts only in story battles between familiars and in how beautiful a strike on a Tangle looks. It never affects tasks or their outcomes.

### The draft chooses deterministic code over an LLM to settle familiar battles

Familiar battles are separate story scenes with no mathematics: against the rival «Мирра Шпилька» (Mirra Shpilka, "Mirra Hairpin"), Guardians in a playful mood and floor creatures. The outcome depends only on the player's tactical choice: which of her three to send out and which move to use, given the ring. Deterministic code settles the battle, not an LLM (large language model), so the result can't drift with a model's reply. A loss is funny and harmless: the rival leaves looking proud and nobody suffers. Correct answers don't affect battles. Deferred until after the MVP by the draft.

### Three familiars form the active team

Three active familiars appear in scenes and battles. The rest live in the heroine's room and in the Journal.

### Each familiar has two moves with story and cosmetic effects only

Moves come from the canon, two each: for example Vintik has «Завод» ("Wind-up") and «Колючий клубок» ("Prickly Ball"). Their effects are story and cosmetic.

### The player chooses traits, and the Master writes lines that use them

The player picks each familiar's traits herself. The Master writes the familiar's lines with those traits in mind.

### Friendship grows from shared adventures, never from correct answers

Friendship grows from scenes, rest stops and battles shared with the familiar.

### Evolution happens at friendship levels, in a scene of its own

Every familiar has three stages in the canon; stage names come from the canon, and the player can keep her own name for the familiar. Evolution happens at friendship levels and is a separate scene with light. In the MVP the three starters have 3 stages and the other MVP familiars 2. The MVP section gives the starters' thresholds as friendship levels 5 and 12, stored in `content/familiars.yaml`. Generating stages during play is deferred until after the MVP by the draft.

### The draft chooses offline art a person approves over art generated during play

The pictures of every stage are prepared offline from the picture of the previous stage, so the creature stays recognisable, and a person chooses them. Live art is deferred until after the MVP by the draft.

### The Journal holds a bestiary with silhouettes of creatures not yet met

The bestiary in the Journal has:

- a page for each creature met, and a completion percentage;
- silhouettes of roster creatures not yet met, so the player has something to look for;
- habitats by floor;
- marks for legendaries.

### The MVP keeps six required familiars in three elements and up to three more

| Stage | Content |
| --- | --- |
| MVP (0.3) | 6 required familiars in 3 elements with offline art: Pugovka and «Шуршик» (Shurshik, "Rustler") for Spark, Vintik and «Бубенец» (Bubenets, "Sleigh Bell") for Stride, Bezeshka and «Корица» (Koritsa, "Cinnamon") for Crumb; if the art is ready, up to 3 more: «Запятый» (Zapyaty, "Comma-ish") for Drop, «Грошик» (Groshik, "Little Penny") for Harmony, «Рулетик» (Ruletik, "Little Roll") for Measure; starter choice of 1 from 3; the team in scenes; traits; friendship; evolution with 3 stages for starters and 2 for the rest; a bestiary of the MVP roster |
| Later | all 24 roster familiars and 8 elements, encounters and friendship on every floor, the element ring, story battles, AI-created creatures, legendaries, the full bestiary; the order is chosen after watching the player play |

### Resolved: every familiar has three stages, and the MVP ships only the first two for familiars other than the starters

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft said both: the section opening says familiars «эволюционируют в три стадии» ("evolve in three stages") and the evolution section «Три стадии у каждого» ("three stages each"), while the same section and the MVP table give 3 stages to the starters and 2 to the other MVP familiars. CAN-0060 adds «пока» ("for now") to the two. Three options were weighed:

- Three stages for every familiar, in the MVP too. This matches the canon, which names three stages in all 24 evolution lines. It costs 3 to 6 more offline pictures a person has to approve, against a budget of about 40 MVP assets (RES-3000), and the third stage would rarely be reached: a familiar met in week two or later has little time to reach friendship level 12 during the two weeks of MVP acceptance play.
- Two stages for non-starters for good. This gives the starters a longer line and so marks them out, and Pokémon uses the same split: most first-partner lines have three stages, while other lines vary (PokéBase, read 2026-09-26). But the canon already names a third stage for all 21 non-starters, so this option deletes canon, and it leaves the far goal "the next evolution" (RES-2000) empty for most of the roster.
- Three stages in the canon, with the MVP shipping two for non-starters and the third added as content later. This keeps the canon whole and the MVP art budget small. The third stage arrives with a content update, not a code change, because the stage list and thresholds live in `content/familiars.yaml`. Pokémon added a third stage to an existing two-stage line in the same way: Crobat, the friendship evolution of Golbat, arrived in the second generation, after Zubat and Golbat (Wikipedia, "Crobat", read 2026-09-26).

The third option wins, because it keeps both the canon's 24 three-stage lines and the MVP's art budget, and it turns "for now" into a plan. I chose two defaults the draft doesn't give: a non-starter's one MVP evolution comes at friendship level 5, the starters' first threshold; and when its third stage ships, a familiar whose friendship already passed level 12 evolves in its own scene at the next rest stop, so no friendship earned before the update is lost.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The third evolution stages ship with the full-roster backlog item after the MVP, when the stage 0.3 review picks it (RES-3000). Both need the same offline art pass and approval by a person, so one pass and one week of acceptance play covers them, and both answer the same signal: whether the collection holds her interest. Until then a familiar past friendship level 12 waits for its third stage, as the default above says.

### Resolved: the player sees familiars as «узелки», and the canon's names stay placeholders that the prototype's «Искорка» and «Шелестун» fill

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft names the section «Фамильяры», and the owner's design calls the creatures «узелки» (little knots) on every screen. RES-3300 compares the options and holds the reason: every text the player sees says «узелок», and this record keeps "familiar" as the English term. The prototype's names match this record once the player's naming is read in. «Искорка» is the name the player gave «Пуговка», and «Шелестун» the name she gave the paper moth, whose placeholder here and in CAN-0060 is «Шуршик»; both are marked `named: true` in the prototype's data. Every other name, look, line, stage and move the prototype uses matches the canon, and its stage counts, three for the starter and two for the moth, match the resolved finding on stages above. RES-3500 records the check and a rule for name suggestions: the placeholder comes first, and no suggestion repeats a move's name or a name already in use.

## Conclusions

1. Correct or incorrect answers must not change whether a planned friendship succeeds, how friendship grows, or when a familiar evolves.
2. The element ring must not affect any task, its outcome or its measurement.
3. A familiar must never die, fall seriously ill or disappear, and a lost battle must cost the player nothing.
4. The player must choose one of Pugovka, Vintik and Bezeshka in Session 0, and give it a name and one or two traits.
5. The MVP roster must contain the six required familiars, with up to three more only where their art is ready and approved.
6. Every stage picture in the MVP must be prepared offline from the previous stage and chosen by a person before it ships.
7. In the MVP, starters must have three evolution stages and other familiars two, with thresholds read from `content/familiars.yaml`.
8. A rare-encounter chance missed on an alternative branch must return in a later scene.
9. The bestiary must show a page for each creature met, a completion percentage, silhouettes of roster creatures not yet met and habitats by floor.
10. Familiar names, creatures and terms must be original, with nothing taken from known franchises.
11. If familiar battles are built, deterministic code must settle them from the player's tactical choices alone.
12. Every roster familiar must have three evolution stages in the canon; in the MVP a non-starter must ship its first two, evolving once at friendship level 5, and its third stage must arrive later as content, with a familiar already past level 12 evolving at the next rest stop after it arrives.
13. Every text the player sees must call a familiar «узелок», and a familiar's canon name must stay a placeholder that the game offers first when it hatches and the player may replace.
14. The familiars' third evolution stages must ship with the full-roster backlog item after the MVP, when the stage 0.3 review picks it, as research decided on 2026-09-27 on the owner's instruction; until then a familiar past friendship level 12 must wait for its third stage.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Текущий объём (MVP)» and «Фамильяры», read 2026-09-26; not kept in the repository - every finding in this record.
- PokéBase, "Do starter Pokemon have to be a 3 evolution line?", https://pokemondb.net/pokebase/312939/do-starter-pokemon-have-to-be-a-3-evolution-line, read 2026-09-26 - that main-series first-partner lines mostly have three stages while other lines vary, with Eevee in the Let's Go games as a starter that evolves once.
- Wikipedia, "Crobat", https://en.wikipedia.org/wiki/Crobat, read 2026-09-26 - that the second generation added Crobat, reached through friendship, as a third stage to the first-generation Zubat line.
