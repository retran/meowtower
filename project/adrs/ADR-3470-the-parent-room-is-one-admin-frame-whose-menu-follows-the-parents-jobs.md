---
id: ADR-3470
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-7672, REQ-7674, REQ-7676, REQ-7678, REQ-7682, REQ-7684, REQ-7686, REQ-7688]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3470. The Parent Room is one admin frame whose menu follows the parent's jobs, and the Mac's admin page moves into it

## Decision

Every screen of the Parent Room behind the PIN renders inside one frame, laid out as a current admin interface and drawn with Tabler, an MIT-licensed admin kit on Bootstrap 5 (`@tabler/core` 1.7.3). The server serves its stylesheet at `/vendor/tabler.min.css` from its own packages, so the room needs no connection beyond the home network. The client switches the game's sheet off and Tabler's on while a room screen shows, and back on a game screen, so neither look leaks into the other. A small function dresses the screens' plain buttons, fields and radio groups in Tabler's classes as they appear, so a screen's code builds its controls as before. A left-hand panel 240 px wide holds the title «Комната родителя» (Parent Room) and the menu, grouped by the parent's jobs:

| Group | Item | Route |
| --- | --- | --- |
| | «Обзор» (overview) | `/parent/home` |
| «Игра» (the game) | «Сюжет» (story) | `/studio` |
| | «Проверка» (testing) | `/studio/checklist` |
| «Лаборатория» (lab) | «Шаблоны» (templates) | `/studio/tasks` |
| | «Промпты» (prompts) | `/studio/prompts` |
| | «Экраны» (screens) | `/studio/screens` |
| | «Журналы» (logs) | `/parent/logs` |
| «Семья» (household) | «Устройства» (devices) | `/parent/devices` |
| | «Настройки» (settings) | `/parent/settings` |
| | «Аккаунт» (account) | `/account` |

«Выйти в игру» (back to the game) sits at the panel's foot. The menu marks the screen shown with `aria-current="page"` and a filled row. The screen to the right opens with a header row, its title on the left and its main actions on the right, and its content sits in cards on the room's light surface. The links each screen ended with go away, because the menu carries them.

The PIN entry at `/parent` stands alone, a card in the middle of the page, and a correct PIN opens `/parent/home`.

The overview `/parent/home` opens with a row of stat tiles: tasks shown, the correct share, live frames, model calls and failed calls, all counted over the whole log, and the month's spend in dollars. Under them sit the parent's notices, the falls of rank and skill, moved from the settings, and the «Закончить на сегодня» (finish for today) control. A new route `GET /api/parent/overview` behind the parent session returns the figures and the notices that the loopback page drew.

The logs screen `/parent/logs` has three tabs: «Ход игры» (play), model calls and played adventures. Tasks and calls are tables whose header row stays in view, and a call opens its request and reply in full. New routes `GET /api/parent/audit/play` and `GET /api/parent/audit/llm` behind the parent session return the rows. The loopback listener's page at `/` and its routes `/audit/llm` and `/audit/play` go away, and it keeps the routes `./meowtower` calls.

The studio works as a visual editor. A toolbar carries the breadcrumb on the left and the level's actions on the right: adding a node and showing the archive. The graph fills the canvas, and an inspector 380 px wide on its right shows the selected node: its title and status, its versions and form, play from it, generation, approval and archiving. Under 1100 px the inspector moves below the canvas. The sandbox's levers and its forced outcome move to the testing screen, beside the checklist, and the played adventures' logs move to the logs screen.

A setting is a row with its name on the left and its control on the right, and a choice among radio values is a segmented control, the chosen segment filled with Tabler's primary colour; boxes that each switch on stay apart as pills. The input lies over its label, so a press anywhere on a segment presses the input. On the tablet every control keeps the game's touch height of 56 px (REQ-8624). Under 768 px the left-hand panel becomes a bar of sections above the screen that scrolls sideways.

Once this is accepted, the parent finds every job in one menu, on the iPad and the computer, and reads the figures and logs that only the Mac showed. What still doesn't work: the front page of rules ADR-3250 decided is not built, so the overview shows figures and falls and no rule-based advice, and the skill map and lesson marks of the owner's sheets 27 and 29 wait for their own decisions.

## Why

The owner found the room's interface poor on 2026-11-15 and asked for a redesign in the shape of current admin interfaces, built from the parent's use, with the loopback page folded in (RES-4322). The research found that the parent comes for seven jobs, that today's pages follow the code's modules and link to different few, and that the owner's own sheets already draw a frame with a left-hand menu.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Restyle each page and keep its links | The smallest change | Each job stays two or three links away, and the logs stay on the Mac. |
| A menu that follows the code's modules: studio, labs, devices, settings | Matches the routes as they are | The parent comes for a job, and testing tools would stay under the story's graph. |
| One frame with a menu of the parent's jobs, in the owner's game tokens | One look across the game and the room | The owner asked for a widget library apart from the game's style. |
| One frame with a menu of the parent's jobs, in Tabler (this) | Every job one choice away, a current admin look | Every parent screen and its tests change at once, and the image carries a 686 KB stylesheet. |

## What it costs

Every parent screen changes its layout, so every end-to-end test of the room follows the new links in the menu. The loopback page leaves, so a parent who bookmarked `http://localhost:8080` finds no page there and reads the same figures in the room.

The strongest objection: the model audit carries every request and reply in full, and it now crosses the home network to the iPad, where before only the Mac read it. The answer is that the Parent Room already shows the sandbox's model calls in full behind the same PIN (REQ-8292), the network is the home one only (REQ-2510), and the replies hold no key (REQ-2504).

## What would reverse it

- The parent missing a job in the menu more than once, which would call for a different grouping.
- A screen that needs more width than the frame leaves on the upright iPad, which would call for collapsing the panel there too.

## Consequences

SPC-0010 changes its line on `http://localhost:8080`, which now serves the operator's routes alone. SPC-0150 gains a section on the Parent Room's frame. The dependencies gain `@tabler/core`, and the client gains the outline path data of eleven Tabler Icons (MIT) for the menu. The strings gain the menu's labels, the overview's and the logs' labels in three languages. `src/server/admin.ts` goes away, and its figures and rows are served as data.

## How I will know it was realised

1. Every parent screen behind the PIN shows the menu with its own item marked, and the PIN screen shows none, in an end-to-end test on the computer and the iPad.
2. A correct PIN opens the overview, which shows the six tiles and the finish-for-today control, in an end-to-end test.
3. The logs screen shows a played task and a model call in full, and the loopback listener answers 404 at `/`, in tests.
4. On the computer the studio's inspector sits beside the graph, and the levers sit on the testing screen, in an end-to-end test.
5. Under 768 px the menu is a bar above the screen, in an end-to-end test.

## What this does not settle

- The front page of rules of ADR-3250.
- The skill map, the node card and the lesson marks of the owner's sheets 27 to 30.
- A dark theme for the room.

## Plan

1. The frame, the menu and the room's looks (REQ-7672, REQ-7674, REQ-7676, REQ-7688). It adds `src/client/room.ts`, `src/client/room-icons.ts` and the stylesheet's route in `src/server/shell.ts`, and touches `src/client/main.ts`, `src/client/screens.ts`, `package.json` and the string files.
2. The overview and the logs, with their routes, and the loopback page's removal (REQ-7678, REQ-7682, REQ-7684). It touches `src/server/parent-room.ts`, `src/server/parent.ts`, `src/server/audit.ts` and `src/client/api.ts`, and removes `src/server/admin.ts`.
3. The studio as a visual editor, and the testing screen's tools (REQ-7686). It touches `src/client/screens.ts`.
