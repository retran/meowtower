---
id: ADR-3360
artifact: adr
status: approved
revised: 2026-11-14
addresses: [REQ-8306, REQ-8308, REQ-8600, REQ-8602, REQ-8604, REQ-8606, REQ-8608, REQ-8610, REQ-8612, REQ-8614, REQ-8616, REQ-8618, REQ-8620, REQ-8622, REQ-8624, REQ-8626, REQ-8628]
supersedes: []
concerns: [cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3360. The parent assembles an adventure in forms beside the graph, and a generated version waits until she keeps it

## Decision

The studio keeps its graph as the map of a level and adds a form for the selected node beside it. The form edits the node's body field by field, and each save writes one new version through the existing `PUT /nodes/:id`. A save runs the code check for the node's level before it stores anything, and a failed check says in the parent's language which field failed, what it holds and what it must hold. An encounter's exits are chosen from its sibling encounters, each with a condition, so the graph's edges come from the form and not from a request written by hand.

Every version stays readable, and a restore writes an old text as a new version. A version a generator writes is stored as pending: the node's current version does not change, the sandbox and the child's game read the current version only, and nothing plays the pending one until the parent keeps it. The form shows the current and pending texts side by side with changes marked, with keep and discard beside them. A discarded version stays in the node's history. A node holds at most one pending version, and a new generation asks the parent to keep or discard the waiting one first.

A generator button with a prompt box sits on each node. It shows the number of model calls and the spend so far before it starts, and no dollar figure until the spend has been measured across runs. It runs as a background job that shows its current step and draft number, and a refusal names its cause: budget, provider failure or a failed code check. At start-up the server marks a job it finds running as failed, with its last step. The generator is the loop of ADR-3270, `writeScenario`, and its result lands as a pending version of the adventure and of each of its encounters.

The graph marks each encounter and exit that no test has reached, beside the marks for those it has. Play from an encounter is one button on the encounter's own panel and starts from its current text. Each empty state offers the action that fills it, each refusal says what to do next beside its control, every action has a visible control, and a touch control is at least 56 px tall on the tablet.

Once this is accepted, a parent can write an adventure by hand, generate one, compare, keep, restore and play it from any encounter, and see what is left to test. What still doesn't work: the Master's facts and retrieval, the simulated player and prompt lab, picture generation, approval of a whole campaign, and a measured dollar estimate.

## Why

RES-4320 found that the page cannot edit a body, show versions or compare, and that the store makes an edit current at once, so a generated version that replaces a draft plays before anyone reads it. A graph shows the shape of branches but not the text a parent reviews, so the form carries the text and the graph stays the map. Forms follow what the research read of the Nielsen Norman Group: plain-language errors with a remedy beside the cause, and undo that stays visible. The pending version follows from the play path reading the newest version, and from Dramatron's report that more than half of its writers felt they did not own the result: the parent keeps what she reads.

I chose a ceiling of one pending version a node because a pile of unread drafts grows until nobody reads it, and each generation spends money. That is a choice, and RES-4320 holds no evidence for the number.

## Alternatives

| Option                       | Better at                                                | Why it lost                                                                                                                |
| ---------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Do nothing                   | Nothing new to build or test                             | Editing, versions, comparison and jobs stay unmet, and the writer stays unwired, so no adventure can be assembled.         |
| Graph-first, form on demand  | Shows the shape of branches at a glance                  | The parent reads text elsewhere, and each field edit needs a select and an open.                                           |
| AI-first review queue        | Keeps, edits or discards each draft in turn              | Unread drafts cannot play, so a queue can stop the child's game while the parent is away. Deferred until a month has run. |
| Form beside the graph (this) | Edits and reads text in place, with the map for branches | A map beside a form can drift from the data, so both read the same stored node.                                            |

## What it costs

The page grows by a form for each of four levels and a comparison view, and every string in it has a Russian, an English and a Dutch version that a parent must read. A pending version adds a state to the store, and the sandbox, the Master and the child's game must each read the current version, so a test per reader guards it. Each generation spends the household's budget, and with one pending version a node, a parent who generates twice without reading waits on herself.

The strongest objection: a parent who never opens the pending versions gets no generated story at all, so the feature saves her no effort. The answer is the ceiling and the rule that nothing plays unread, and the price is that the child plays only what the parent has kept.

## What would reverse it

- A month of use in which the parent keeps fewer than one pending version in five without edits, which would show that the comparison is read as a chore and that generated text should be kept by default.
- A measured run of `writeScenario` whose result the code check rejects more than half the time, which would move the work to the writer before any button.

## Consequences

The store gains a pending state beside `draft`, `approved`, `playing` and `played`, and the code check of `checkScenario` must run over stored nodes, which today do not assemble into its `Scenario` shape. New requirement topics reach the studio's keys in three languages, and the checklist page gains an entry for each new screen and route.

## How I will know it was realised

1. A parent edits an encounter's place, situation, goal and exits in the form, restores an earlier version, and plays from that encounter in the sandbox at the restored text, in a browser test on the computer project.
2. A generated version of an adventure stays pending, and a sandbox play and a child's game session started while it waits both read the current version, in an integration test.
3. The graph marks an encounter no test reached, in a browser test.
4. A job left running when the server stops shows as failed after the next start, in an integration test.
5. With the generator off and the parent absent for a simulated month, the child's game plays an approved adventure unchanged, in an integration test.

## What this does not settle

- Whether the form or the AI review queue should lead after a month of use.
- A dollar estimate for a generation, which waits for measured runs.
- The simulated player, the prompt lab and the Master's facts, which stay in ADR-3280.
- Approval of a whole campaign and the fallback with no approved scenario, which stay in ADR-3280.

## Plan

1. A node's body is edited in a form on the studio page, with the code check on save, plain error wording beside the field, a control for every action, empty states that offer their action, and touch controls of at least 56 px (REQ-8306, REQ-8600, REQ-8618, REQ-8620, REQ-8622, REQ-8624). It touches `src/client/screens.ts`, `src/client/api.ts`, `src/server/studio/routes.ts`, `content/i18n/ru.json`, `en.json` and `nl.json`, and `content/checklist.json`.
2. A node shows its versions, and a restore writes an old text as a new version (REQ-8602). It touches `src/server/studio/store.ts`, its routes and the page.
3. A generated version is stored pending and nothing plays it until the parent keeps it, and a discarded one stays in the history (REQ-8604, REQ-8606). It touches the store, `src/server/sandbox/play.ts` and the child's play path.
4. The form shows the current and pending text side by side with changes marked, and play from an encounter is one button on its panel (REQ-8308, REQ-8616). It touches the page and `src/server/studio/routes.ts`.
5. The graph marks each encounter and exit no test has reached (REQ-8614). It touches `src/client/screens.ts` and the reached route.
6. A generator button with a prompt box wires `writeScenario` to pending versions, shows the number of calls and the spend so far, runs as a job with a visible step, and names a refusal's cause (REQ-8608, REQ-8610). It touches `src/story/writer.ts`, the studio routes and the page.
7. The server marks a job found running at start-up as failed, and a test shows that a month with no parent loses nothing and blocks no game (REQ-8612, REQ-8626, REQ-8628). It touches `src/server/studio/store.ts` and `src/server/main.ts`.
