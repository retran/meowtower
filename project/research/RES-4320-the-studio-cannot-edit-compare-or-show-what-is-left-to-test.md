---
id: RES-4320
artifact: research
status: approved
revised: 2026-11-14
elaborates: RES-4315
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The studio page shows a graph and plays one encounter, but it cannot edit a node, compare a version or show what is left to test

## Summary

At commit dfa4177 the studio page creates a node from a title, opens nested graphs, approves a node and plays from an encounter. It has no body form, no version list, no comparison and no generator. The store and the sandbox routes already keep versions and play drafts, so most of the missing work is in the page and in three store rules. A graph shows the shape of branches but not the text a parent reviews, so a graph alone is the wrong main surface. Replacing a draft in place fails on the code as written, because the play path reads whatever version is newest. Not covered: how a real parent behaves, since no study exists, and Apple's touch-target figures.

## The question

Which interface behaviour lets one parent assemble and fully test an adventure for one child, by hand and with AI generation, in a sandbox, on a desktop browser and an iPad, with the least effort and the fewest errors? Which parts of the studio page must change? Two assumptions are challenged first: that a graph is the right main surface for a parent who mostly reviews output and edits a few fields, and that generated output replaces the draft in place.

## Method

I read, at commit dfa4177: `src/client/screens.ts` (studio code, lines 812-1356), `src/client/api.ts`, `src/client/style.ts`, `src/client/graph-layout.ts`, `src/server/studio/routes.ts` and `store.ts`, `src/server/sandbox/play.ts`, `src/server/gateway/` (`gateway.ts`, `routes.ts`), `src/story/writer.ts` and `scenario.ts`, `content/i18n/en.json`, and the requirements, decision and research record the question names. I searched `src/` and `tests/` for callers of `checkScenario`, `setStatus`, `startJob`, `reportJob` and `writeScenario`, and the repository for the $0.361 figure. I ran no test, opened no browser and made no model call. The web pages were read on 2026-11-14 through a fetch tool that summarises each page, so quoted wording is checked against that summary only. I did not use the LegendKeeper comparison that RES-4315 cites, because a rival's table is written to win.

Not obtained, so no finding rests on them: five Apple Human Interface Guidelines pages (titles only), the Nielsen Norman Group autosave article and its undo article (404), the Twine story and passage pages (404), the Yarn Spinner editor pages and the AI Dungeon scenario editor pages.

## Findings

### The page cannot edit a node's body or show its versions

The page creates a node from a title and sends an empty body (`src/client/api.ts` 509-521). It has no body form, version list, comparison or generator. The edit and version-read routes exist (`src/server/studio/routes.ts` 160-196), but no client function calls them.

### An edit becomes the current text at once

`editNode` writes version n+1 and makes it current in one transaction (`src/server/studio/store.ts` 165-205). Play and the Master read the highest-numbered version (`src/server/sandbox/play.ts` 96, 249), while graph links read the current one (`store.ts` 236). The two agree only while every version is current.

### An edit makes its node a draft and changes no other node

`editNode` sets the node to draft and updates no other row (`store.ts` 198-202). Editing an encounter leaves its adventure approved. The code's statuses are draft, approved, playing and played (`store.ts` 9). The `empty` and `review` statuses in RES-4315 do not exist.

### No code check runs on an edit

The edit route accepts any JSON body (`routes.ts` 77-83). `checkScenario` is called only from `src/story/writer.ts`, and no route imports the writer. Stored nodes do not assemble into the `Scenario` shape that `checkScenario` checks; `scenarioOf` builds a different object (`src/server/sandbox/play.ts` 241-264).

### Nothing restores a version and nothing deletes a node

No route restores an old version or deletes a story node. The only DELETE route removes a library use (`routes.ts` 266-271).

### A generation makes 4 to 17 model calls, and a refusal looks like a failed check

`writeScenario` plans, critiques, optionally replans, then drafts up to seven times, with a critic after each draft that passes the code check (`writer.ts` 87-180). A call refused for budget and a call that failed both return null, the same as a failed check, and the gateway's reason is dropped (`writer.ts` 113-124; `src/server/gateway/gateway.ts` 25-28). The loop reports no progress.

### A call's cost is known only after the call

The gateway reports `costUsd` per reply (`src/server/gateway/routes.ts` 80, 160). The one-run figure of $0.361 in RES-4315 and "about $0.4" in ADR-3280 appear in no log or test in the repository. Both are unverified.

### Jobs exist in the store, but nothing starts one or clears an interrupted one

`startJob` and `reportJob` (`store.ts` 460-512) are called only from tests. The states are queued, running, done and failed. No code turns a job left running into failed.

### Play from an encounter takes two clicks, and the sandbox needs Postgres

The parent presses "Play in the sandbox", then one "Play from: {title}" button per encounter (`screens.ts` 894-931). The sandbox routes answer 409 `sandbox_unavailable` on any other database (`routes.ts` 299-304). Routes for levers, force, turns and reached marks exist (`routes.ts` 338-521), so RES-4315's statement that no sandbox code exists is out of date.

### Refusals reach the parent as raw strings or codes

Client functions show `body.reason ?? body.error` inside "Not accepted: {reason}" (`api.ts` 520, 533; `content/i18n/en.json` 386). The text is English, and sometimes a code: "a playing node is not edited", "encounter_not_in_adventure", "adventure_unknown".

### Empty states offer no control

An empty graph shows "Nothing here yet." An adventure with no encounters shows "This adventure has no encounters yet." Neither has a button (`screens.ts` 900-902, 1198-1200; `en.json` 332, 339).

### Coverage marks what was reached, not what is left

Reached encounters get a "Reached" label and reached exits a heavier line (`screens.ts` 1228-1247). Nothing marks an encounter that was not reached. Reached data is read only at encounter level (`screens.ts` 1295-1303).

### Opening a node takes a double-click or an Open button

Double-clicking a node opens its inner graph (`screens.ts` 1269-1274). The panel's Open button does the same (`screens.ts` 1170-1173).

### Touch sizes in the code

Nodes are 168 by 64 px (`graph-layout.ts` 32-35). The tablet setting gives buttons and text inputs a 56 px minimum height, and the computer setting 50 px (`style.ts` 15, 130-132, 176-177). Apple's own figure was not read.

### External findings, read 2026-11-14

- The Nielsen Norman Group's ten heuristics (dated 1994-04-24, reviewed 2024-01-30): users "often perform actions by mistake", and error messages should use plain language with no error codes.
- Its article on user control (dated 2020-11-29): "Support undo and redo", support multiple undo for many actions in short succession, and keep undo visible, because a snackbar that vanishes after seconds is easy to miss.
- Its article on error messages (dated 2023-05-14): plain language, "offer some potential remedies", and placement close to the source.
- The Inky README (no date shown) describes "Play as you write" and as-you-type error highlighting, with an issue list that jumps to a line. It does not mention a graph view.
- AI Dungeon's story-card help (footer 2026 only): an import "will fully overwrite the previous set". The page mentions no preview.
- Dramatron (arXiv 2209.14958, sections 6.1.5 and 6.2): 4 participants mostly added and 8 mostly removed or curated, the plot outline was the least edited, and "more than half of respondents felt they did not own the result". RES-4315's figures trace to this text. The passage counts 12 participants and does not count the rest.
- Twine's reference introduction (no date) says nothing about saving, undo or testing. The Yarn Spinner pages reached do not describe its editor.

## Options compared

| Option                           | Advocate's case                                                                         | Case against                                                                                                         | Result                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| (a) Graph-first, form on demand  | The shape of branches is seen at a glance, which is why ADR-3280 rejects lists.         | A graph shows title, status and version, so the parent reads text elsewhere, and each field edit needs a select and an open. | Left to discretion                                             |
| (b) Form-first outline, small map | The parent edits and reads text in a form, and the map shows where branches go.         | A map beside a form can drift from the data, and branch shape is harder to see. The graph still has to open its inside. | Deferred: no parent has tested either layout                   |
| (c) AI-first review queue        | Each draft is kept, edited or discarded one by one, and the queue shows what waits.     | Unread drafts cannot play, so the queue can stop the child's game while the parent is away.                          | Deferred: the two-week test has not run                        |
| (d) Do nothing                   | No new surface to build or test.                                                        | Editing, versions, comparison and jobs stay unmet, and the writer stays unwired.                                     | Left to discretion                                             |

I lead with (b). Its case against is that ADR-3280 rejected lists without graphs because branch shape cannot be seen, so each level of (b) needs a map that opens the inside.

On the second assumption, the store and the play path both take the newest text as the one to use. An in-place replacement therefore plays before anyone reads it. The assumption fails on the code as written.

## Conclusions

Parts of the page that change: the node panel (a form, the version list, a comparison), the generator (an estimate, progress, a refusal text), the graph (reached and not-reached marks, controls in empty states), the play control (one step, current text) and the store (a pending version, a check on save, a restore, a job sweep).

1. A parent edits any field of a node in a form on the page, and each save writes one new version.
2. A save runs the code check for that node's level before it stores the version. A failed check names the field, the value it holds and what it must hold, in plain words.
3. Every version stays readable. A restore writes an old text as a new version, so one action reverses any change.
4. A generated version is pending. It is not current, and nothing plays it, until the parent keeps it. Discard removes it and keeps its record.
5. The comparison shows the current and the pending text side by side, with changes marked, and keep and discard sit beside it.
6. Before a generation starts, the page shows its call count, from 4 to 17, and the spend so far. A dollar estimate appears only once measured across runs, and is labelled as measured.
7. A generation shows its current step and draft number. A refusal names its cause: budget, provider failure or a failed check.
8. A job cut off by a restart shows as failed, with its last step, and never as running.
9. The graph marks each encounter and each exit as reached or not reached.
10. Play from an encounter is one control that starts from the encounter's current text. The sandbox and the child's game read the current version, never a pending one.
11. Each empty state names the next action in a control.
12. Each refusal states the problem in the parent's language, says what to do, and sits beside the control that caused it.
13. Every action has a visible control. Double-click may open a node as a shortcut, never as the only way.
14. Each touch control is at least 56 px tall, the code's tablet minimum, until Apple's figure is read and checked.
15. After a month away, every draft, version and pending comparison is still there, and no job or version blocks the child's game.
16. Opinion, with no finding behind it: a text field should keep unsaved text in the browser until a save succeeds.

## Sources

- The repository at commit dfa4177, read 2026-11-14: the files named under Method.
- [Nielsen Norman Group, Ten usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), read 2026-11-14 - mistakes, error codes and recognition.
- [Nielsen Norman Group, User control and freedom](https://www.nngroup.com/articles/user-control-and-freedom/), read 2026-11-14 - undo, redo and visible exits.
- [Nielsen Norman Group, Error message guidelines](https://www.nngroup.com/articles/error-message-guidelines/), read 2026-11-14 - plain language, remedies and placement.
- [Inky](https://github.com/inkle/inky), read 2026-11-14 - play as you write, error list.
- [ink](https://www.inklestudios.com/ink/), read 2026-11-14 - testing while writing.
- [AI Dungeon, story cards import and export](https://help.aidungeon.com/story-cards-import-and-export), read 2026-11-14 - an import overwrites the previous set.
- [Dramatron, arXiv 2209.14958](https://ar5iv.labs.arxiv.org/html/2209.14958), read 2026-11-14 - editing counts and ownership, sections 6.1.5 and 6.2.
