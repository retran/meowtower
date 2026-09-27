---
id: RES-3900
artifact: research
status: approved
revised: 2026-09-27
---

# Seven conflicts in the approved research resolve to one side each, and two apparent conflicts are separate obligations

## Summary

The approved research contradicts itself in seven places, and this record picks one side of each. Mental arithmetic gives 2 tasks a floor and stretch nodes get at most 2 tasks a day, because the session budget in RES-1000 counts those figures. The skill graph has nine domains, of which eight have a floor, so the three-day window counts eight. A warm-up follows a pause longer than 5 minutes, not every pause. The simulation must classify at least 90 % of nodes correctly. The explanation request carries the list RES-0600 gives, and the provider lists in RES-2600 replace the older list in RES-3000. Two further pairs only look like conflicts: the «Закончить на сегодня» (Finish for today) control carries two separate obligations, and a 64 px maths key meets the 56 px minimum touch zone. The owner delegated such decisions to research on 2026-09-27. This record covers only these nine pairs, and changes no approved record, since approved research is frozen.

## The question

Where two approved research records, or two conclusions of one record, state different values for one obligation, which value holds? Requirements elaborate the conclusions, so an unresolved pair yields two requirements that can't both pass. The question assumes each pair is a true conflict. Two of the nine aren't: in each, both statements can hold at once, and the finding says so and keeps both.

## Method

I read the `## Conclusions` section of RES-0100, RES-0200, RES-0300, RES-0600, RES-0800, RES-1000, RES-1600, RES-2400, RES-2500, RES-2600, RES-2900, RES-3000 and RES-3100 on 2026-09-27, with the body findings each conflict rests on: the domain table and the stretch budget in RES-0800, the session budget table in RES-1000, the warm-up finding in RES-0100 and RES-0200, the lifecycle table in RES-2400, and the resolved finding on Mistral in RES-2600. I searched `project/research/` for "85 %" and "85%" and found no conclusion giving 85 % for node classification. Where the task that commissioned this record gave a detail the records contradict, the finding says so.

## Findings

### Mental arithmetic gives 2 tasks a floor, because the session budget counts 2

RES-0100 conclusion 3 sets each floor's order as "entry scene, unscored warm-up, 2 mental arithmetic tasks, rooms ...", and RES-1000 conclusion 8 says each floor opens with "an ungraded warm-up and 2 mental arithmetic tasks". RES-0800 conclusion 14 says "Each floor opens with a chain of 3 independent mental arithmetic tasks". The session budget table in RES-1000 counts "Mental arithmetic: 2 x 3 floors | 6", and its body says "Mental arithmetic gives 2 tasks a floor in the MVP". Three tasks a floor would add 3 or 4 tasks a day to a budget the owner decided needn't be recomputed (RES-1000 conclusion 12), and those tasks would come out of the rooms. Two tasks a floor holds. The independence RES-0800 conclusion 14 asks for, each task from its own template and seed, still holds for the two. The owner delegated such decisions to research on 2026-09-27.

### Stretch nodes get at most 2 tasks a day, because the session budget counts at most 2

RES-1000 conclusion 2 says the Director must "give stretch nodes no more than 2 tasks a day". RES-0800 conclusion 11 says "The game gives stretch nodes at most 4 tasks a day and completes a stretch block within 7 days". The RES-1000 budget table gives "Stretch | 0-2", and its value formula notes "at most 2 tasks a day". A cap of 4 would take tasks from the frontier budget of 9-14 tasks a day that RES-1000 already calls tight. The cap of 2 holds, and the 7-day block window of RES-0800 conclusion 11 stands unchanged. The owner delegated such decisions to research on 2026-09-27.

### The graph has nine domains, eight of them with a floor, so the three-day window counts eight

RES-0800 conclusion 1 says the graph holds "79 mathematical nodes in nine domains". RES-1000 conclusion 7 says the route must give "each of the 8 maths domains its floor at least once in any 3 consecutive adventure days". Both hold. The domain table in RES-0800 gives a floor to eight domains, N, A, F, D, P, M, G and S, and gives word problems (T) «Стражи математических этажей» (the Guardians of the maths floors) in the floor column. So T has no floor of its own: its tasks reach play through the Guardian on the other floors, whose step ladder RES-1000 conclusion 9 sets. The task that commissioned this record said T reaches play "through Guardians and rooms"; neither RES-0800 nor RES-1000 puts T tasks in rooms, so this record names the Guardians only. The three-day window counts the eight domains with a floor. The owner delegated such decisions to research on 2026-09-27.

### A warm-up follows a pause longer than 5 minutes, not every pause

RES-0100 conclusion 9 says "The first task after a floor's entry scene or any pause must be an unscored warm-up", and its body counts eyes, a rest stop and a return from the background as pauses. RES-0200 conclusion 9 says "After a break longer than 5 minutes, an unscored warm-up must precede the next new task, while an open task stays first". A warm-up after every short pause, such as a 30-40 second eye exercise, costs a task slot each time and breaks the flow of a room. Five minutes is also the figure the rest of the research uses for a real break: RES-2400 conclusion 4 pauses the adventure after 5 minutes idle with a task open, and RES-0300 conclusion 4 resets the eye counter after a pause longer than 5 minutes. The warm-up after a floor's entry scene stays. After a pause, the warm-up comes only when the pause lasted longer than 5 minutes. The owner delegated such decisions to research on 2026-09-27.

### «Закончить на сегодня» carries two separate obligations, so both stand

RES-0300 conclusion 20 says the Parent Room control «Закончить на сегодня» "brings the soft stop at the next boundary and offers no extension". RES-2400 conclusion 26 says `POST /api/parent/finish-today` "must make the server send `stop_offer` with `canExtend: false` at the next boundary and offer no extension for the rest of that game day". These aren't in conflict: one obligation is the soft stop at the next boundary without an extension, and the other is that no extension comes for the rest of the game day. RES-2400 adds the second without denying the first. Both stand as separate obligations. The owner delegated such decisions to research on 2026-09-27.

### The simulation must classify at least 90 % of nodes correctly

RES-2900 conclusion 3 says "A simulation of synthetic student profiles must identify at least 90 % of nodes correctly on every profile", and RES-3000 conclusion 5 says "at least 90 % of nodes right on 6 profiles". RES-1000 conclusion 16 asks for accuracy over 30 days to stay "above the thresholds" without a value. No research record gives 85 %: a search of `project/research/` finds 85 % only as a System window opacity in RES-3100. The threshold is 90 %, for the 30-day simulation under the reduced frontier budget too. The owner delegated such decisions to research on 2026-09-27.

### The explanation request carries the list RES-0600 gives, because none of it is personal data

RES-0600 conclusion 2 says the request "must carry the task text as shown, the computation graph and answer, the player's answer, any matched trap with its engine calculation, the error class and the familiar's species, name, traits and sample lines". RES-2600 conclusion 2 says it "must hold only the task text, the engine's solution steps, her answer, the matched misconception and her familiar's kind and name", which leaves out the error class and the familiar's traits and sample lines. None of the three items RES-2600 leaves out is personal data: the error class describes the one task, and the familiar's traits and lines are game content. RES-0600 conclusion 3 and RES-2600 conclusion 3 still keep out every node identifier, estimate, history, time and personal detail. The explanation needs the error class to address the error, and the traits and lines to speak in the familiar's voice (RES-0600 conclusion 1). The RES-0600 list holds, and the RES-2600 list widens to match it. The owner delegated such decisions to research on 2026-09-27.

### The provider lists in RES-2600 replace the older list in RES-3000

RES-3000 conclusion 12 routes the player's material "only to Google Vertex, Amazon Bedrock, Azure or xAI" and lets the account allow "no provider beyond those four and Anthropic, OpenAI, Google AI Studio and Seed". RES-2600 conclusions 13 and 14 add Mistral for GLM requests and TypeSafe for Jev requests only, and RES-2600 records that "The owner decided on 2026-09-27: add Mistral to the player tier". RES-3000 conclusion 12 predates both. RES-3000 conclusion 25 ends "Whether Mistral may join the player tier stays open for the owner (RES-2600)", and RES-1600 lists the GLM route at Mistral as open; the owner's decision closed both. The RES-2600 lists hold. The owner delegated such decisions to research on 2026-09-27.

### A 64 px maths key meets the 56 px minimum touch zone

RES-3100 conclusion 15 says "Every touch target must be at least 56px and every maths key 64px", and RES-3100 conclusion 26 and RES-2500 conclusion 20 set a touch zone of at least 56 px on the tablet. RES-2500 conclusion 14 asks for maths keyboard "buttons at least 56 pt". A 64 px key exceeds the 56 minimum, so both hold. The owner delegated such decisions to research on 2026-09-27.

## Conclusions

1. Each floor must open, after its warm-up, with 2 mental arithmetic tasks, each from its own template and seed, and never 3.
2. The Director must give stretch nodes no more than 2 tasks a day.
3. The skill graph must hold nine domains, of which eight, N, A, F, D, P, M, G and S, have a floor, and word problems (T) must reach play through the Guardians; the three-day window must count the eight domains with a floor.
4. After a pause longer than 5 minutes, an unscored warm-up must precede the next new task; a shorter pause must bring no warm-up.
5. «Закончить на сегодня» must bring the soft stop at the next boundary with no extension offered, and, as a separate obligation, no extension may be offered for the rest of that game day.
6. The simulation must classify at least 90 % of nodes correctly, including the 30-day simulation under the reduced frontier budget.
7. The explanation request may carry the task text as shown, the engine's solution steps and answer, the player's answer, a matched misconception with its engine calculation, the error class and the familiar's kind, name, traits and sample lines, and nothing else.
8. The provider lists must be those RES-2600 sets, with Mistral for GLM requests and TypeSafe for Jev requests, and the list in RES-3000 conclusion 12 no longer holds.
9. Every maths key must be 64 px, and every touch zone on the tablet at least 56 px in both directions.

## Sources

- RES-0100, read 2026-09-27 - conclusions 3 and 9 and the warm-up finding.
- RES-0200, read 2026-09-27 - conclusion 9.
- RES-0300, read 2026-09-27 - conclusions 4 and 20.
- RES-0600, read 2026-09-27 - conclusions 1, 2 and 3.
- RES-0800, read 2026-09-27 - conclusions 1, 11 and 14, the domain table and the stretch budget.
- RES-1000, read 2026-09-27 - conclusions 2, 7, 8, 9, 12 and 16, and the session budget table.
- RES-1600, read 2026-09-27 - the open question on the GLM route at Mistral.
- RES-2400, read 2026-09-27 - conclusions 4 and 26.
- RES-2500, read 2026-09-27 - conclusions 14 and 20.
- RES-2600, read 2026-09-27 - conclusions 2, 3, 13 and 14, and the resolved finding on Mistral.
- RES-2900, read 2026-09-27 - conclusion 3.
- RES-3000, read 2026-09-27 - conclusions 5, 12 and 25.
- RES-3100, read 2026-09-27 - conclusions 15 and 26.
