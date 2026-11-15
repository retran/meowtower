---
id: ADR-3440
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-1956, REQ-1958, REQ-1960, REQ-1962, REQ-1964, REQ-1966, REQ-1968, REQ-1970, REQ-7284, REQ-7286, REQ-7288, REQ-7290, REQ-7292, REQ-7294, REQ-7296, REQ-7298, REQ-7376, REQ-7378, REQ-7380, REQ-7922, REQ-7924, REQ-8436, REQ-8438, REQ-8440, REQ-8442, REQ-8444, REQ-8446, REQ-8700, REQ-8702, REQ-8704, REQ-8706, REQ-8708, REQ-8710, REQ-8712, REQ-8714, REQ-8716, REQ-8718, REQ-8720, REQ-8722, REQ-8724]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3440. Rewards, pets and results succeed or fail by how she solves, and equipment and pets give perks that are maths tools or story

## Decision

Every useful thing in the game follows the quality of her solution. A first attempt pays 2 buttons when it is clean and unassisted, 1 when it is clean with help or partial, and nothing when it is wrong, «Не знаю» or a rapid guess. A finished adventure and a Guardian pay by how they went, and each daily quest counts solved tasks. A clean answer makes the action succeed, a partial one succeeds at a cost the story names, and a wrong one or «Не знаю» makes it fail, with the story going on by another way. A failed check in a fight or a danger costs one of the heroine's five points of health. At none she withdraws to the camp, which restores her, and she never dies. The task window marks each answer with a tick and «Верно» or a cross and «Неверно». The badges read «Не получилось» and «Пропущено». A Guardian is shown beaten on a success. The forbidden list keeps the words that judge her and drops those that only state a result.

She catches a pet in a catch scene: she reads the bestiary's clue, chooses what she brings and takes a check. A clean or partial check catches it, and a failed one lets it escape, to be met again in its habitat later, with no random draw. A pet's friendship grows by 3 for a clean check it shared, 1 for a partial one and 1 for each shared scene, rest stop or camp talk. A planned friendship is decided by a check too, and a failed one waits for a later scene. She keeps a team of three, and each of a pet's three stages opens one perk.

She wears one outfit, one accessory, one focus and one curiosity, and changes them only between adventures. A perk is a story perk, which changes what she finds, opens or chooses, or a tool perk, a maths tool such as a free hint rung, a number line, the inverse check, a plan card or a second look. Each use of a tool perk is a `perk_used` event that the knowledge model reads as help. The report shows those attempts apart, and the Director keeps a third of each adventure's checks free of tools. No bonus changes a task, its numbers, its checking or its outcome. The same perk doesn't stack, perks' values live in content, and nothing is cursed, sold or out of her reach. Keys open exits, gates and queued secrets, and every lock has another way on.

The scenario writer, the arc writer and the Master read her bag, her team, her keys, the bestiary's gaps and her nearest goal as facts with no numbers. An encounter declares finds, locks, a creature and a camp, code refuses a scenario whose declarations the content doesn't hold, and the Master grants only what the scenario declares. The floors of the Tower are the world map, holding habitats, materials and gates, and the day belongs to the adventure.

Once this is accepted, the game pays for solving and lets her fail plainly, and its economy, pets and equipment can be built as one system that the story writes for. What still doesn't work: nothing of it is built yet; battles stay deferred, and whether their result follows her checks or tactics alone, as the record says now, is the owner's to settle before they come.

## Why

The owner decided on 2026-11-15 that rewards, pets and results must succeed or fail clearly by how she solves, so that there is a reason to solve rather than skip, and that she is old enough to take a failure (RES-4321). The research found that the record already pays for quality in some places and the same whatever she answered in others, and that a perk can be a maths tool, which ties the mechanic to the maths, if the log records it as help.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Keep the record's rules as they are | No change, and no reward undermines her interest | Half the grants and every pet pay the same whatever she answers, so skipping costs her nothing, which the owner rejected. |
| Grants from acts of play only, pets that never fail | The form the meta-analysis in RES-4321 finds safest | The owner rejected it, because nothing would pay for solving. |
| Quality decides grants, pets and results, with guards (this) | Solving pays, and a failure is plain | Rewards contingent on performance can lower a child's interest, which the guards answer. |

## What it costs

A wrong answer now shows a cross and «Неверно», and a catch can fail, so a bad day shows as one, and the game has to keep the next try close: an escaped creature returns, a failed friendship waits, and the camp restores her health. A guess now earns as much as an honest «Не знаю», which is nothing, so the guards against gaming stay essential: nothing pays for speed and a rapid guess pays as a wrong answer.

The strongest objection: the meta-analysis of 128 studies in RES-4321 found that rewards contingent on performance undermined children's interest more than adults'. The answer is that the owner knows the player and chose this, and that the guards keep her from losing what she holds, so a failure costs a chance and never her progress. The rules that stats never affect tasks and that the first version offers no stats stay, because a perk is not a stat and a tool perk changes no task.

## What would reverse it

- «Не знаю» falling to near zero while wrong answers rise, which would mean she guesses to avoid the cost, and would call for paying an honest «Не знаю» something.
- The parent seeing her avoid the game after failed catches, which would call for a softer failure.

## Consequences

The record withdraws REQ-0110, REQ-0126, REQ-1506, REQ-1760, REQ-1762, REQ-1900, REQ-1902, REQ-2006, REQ-2138, REQ-2142, REQ-3200, REQ-3312, REQ-3314, REQ-6414 and REQ-8180, each replaced by a requirement this decision addresses. The vision's line on grading changes to match. SPC-0140's grants, outcome badges and friendship and the voice's forbidden list change in the specifications. The content gains `economy.json`, `familiars.yaml`, `gates.json` and an items catalogue with perks. The scenario schema gains finds, locks, a creature and a camp, and the Master gains a tool to grant them.

## How I will know it was realised

1. A first attempt pays 2, 1 or 0 buttons by its quality, and a rapid guess pays 0, in an integration test.
2. A catch scene catches on a clean or partial check and lets the creature escape on a failed one, and the creature is offered again later, in an integration test.
3. A tool perk's use is a `perk_used` event, the model reads the attempt as assisted and the report shows it apart, in tests.
4. A scenario that names an unknown find or creature, or a lock with no other way on, is refused, in a unit test.
5. The task window shows a tick and «Верно» or a cross and «Неверно», on the computer and the iPad, in an end-to-end test.

## What this does not settle

- Whether a battle's result follows her checks.
- The full catalogue of items and perks, the roster's perks and the pictures, which the owner approves as content.
- How much an honest «Не знаю» should pay, if the guesses rise.

## Plan

1. The outcome rules: the ladder, the badges, the task window's marks and the forbidden list, with `content/shaming.*.json` cut to the words that judge (REQ-8438, REQ-7290, REQ-7292, REQ-7294, REQ-7922, REQ-7924). It touches `src/story/check.ts`, `src/client/play.ts`, `src/shared/voice/` and the string files.
2. The grants by quality and the daily quests (REQ-7284, REQ-7286, REQ-7288, REQ-8436). It adds `src/game/` with `content/economy.json`.
3. The heroine's health and the camp (REQ-7296, REQ-7298, REQ-7376, REQ-7378).
4. Equipment, perks and keys, with the bag screen (REQ-8700 to REQ-8724). It adds an items catalogue, the `perk_used` event and the report's split.
5. Pets: catch scenes, friendship by checks, the team and the stage perks, with the team screen (REQ-1956 to REQ-1970). It adds `content/familiars.yaml`.
6. The story writes for it: facts about her bag and team in every story request, the encounter's declarations, their check and the Master's grant tool (REQ-8440 to REQ-8446). It touches `src/story/scenario.ts`, `src/story/writer.ts`, `src/story/master-tools.ts` and the prompt files.
7. The floors as the world map (REQ-7380), with `content/gates.json`.
