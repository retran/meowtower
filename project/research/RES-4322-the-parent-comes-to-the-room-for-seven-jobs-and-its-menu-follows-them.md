---
id: RES-4322
artifact: research
status: approved
revised: 2026-11-15
elaborates: RES-3500
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent comes to the room for seven jobs, so the room is one frame with a left-hand menu of those jobs, and the Mac's admin page moves into it

## Summary

The parent opens the Parent Room for seven jobs: to see how play went, to prepare the story, to test it, to check the content, to read the logs, to run the household's devices and settings, and to manage the account and its spending. Today the room is a set of separate pages, each one long column ending in a row of links, and two of the jobs live elsewhere: the logs and figures on a page on the Mac's loopback port, and the account on a page the menu doesn't reach. The owner's own mock-ups draw the room as one frame with a menu in a left-hand panel, and on 2026-11-15 the owner asked for that redesign, built from the parent's use, with the loopback page folded in. This record covers the room's structure and looks; it doesn't change what any screen computes.

## The question

How should the Parent Room be organised so that each thing the parent comes to do is one choice away? The assumption behind the question is that the parent comes for jobs and not for the system's parts. The current room follows the parts: the studio, the labs and the devices are each a page because each is a module of the code. The assumption holds for this parent, who uses the room in short visits with one aim each, as the owner's mock-ups show by naming sections after aims, such as «Проверка игры» (testing the game), and not after modules.

## Method

I read every parent screen in `src/client/screens.ts`, `src/client/style.ts` and `src/server/admin.ts` at revision `5d59f6d`, the routes in `src/server/parent.ts` and `src/server/parent-room.ts`, the owner's sheets 26 to 33 in `design/screens/` and the design tokens in `design/design-system/tokens.css`, and the records the search `paw find parent room` returned. I didn't run a study with the parent; the jobs come from the approved requirements and the owner's words on 2026-11-15.

## Findings

### The parent's visits fall into seven jobs

The approved decisions and specifications name what the parent does in the room, and it groups into seven jobs:

| Job | What the parent does | Records |
| --- | --- | --- |
| See how it went | The figures of play and spend, falls of rank or skill, notices such as a failed backup, finishing play for today | ADR-0180, ADR-3250, SPC-0010's notices |
| Prepare the story | Build the campaign's graph, generate and approve adventures | ADR-3280 |
| Test before she plays | Play in the sandbox, set its state, force the next check, see what is left to test | ADR-3280, ADR-3380 |
| Check the content | Open any task, prompt or child's screen in any language | ADR-3280 |
| Read the logs | Each task played, each model call in full with its cost, each played adventure's events | ADR-3100, ADR-3280 |
| Run the household | Pair and revoke devices, the language, the game's settings, the child's profile, resetting statistics | ADR-0180, SPC-0010 |
| Manage the account | Sign in, the children, pairing a child's device, spending and its limit | ADR-3320 |

### Today the room follows the code's modules, and each page ends in a row of links

The room is nine screens on hash routes: `/parent` (the PIN), `/parent/devices`, `/parent/settings`, `/account`, `/studio`, `/studio/tasks`, `/studio/prompts`, `/studio/screens` and `/studio/checklist`. Each is one `section` card of one column, and each ends in a `nav` row of links to some of the others, a different set on each page. The PIN opens `/parent/devices`, the account is reached only from the game's home screen, and nothing links back to the overview because there is none. The studio screen is one column holding the graph, the node's panel, the sandbox's levers, the forced outcome, the archive and the adventure logs, so its tools for testing sit under the graph of the story. The settings page holds the falls of rank and skill, which are a result of play and not a setting.

### The figures and the logs live on a second site on the Mac

`src/server/admin.ts` draws a page on `http://localhost:8080`, reachable only from the Mac, with the notices, six figures, the frame queue, the play audit and the model audit. The parent who reads the room on the iPad never sees them, and the parent on the Mac has two sites with two looks. The same listener carries the operator routes that `./meowtower` calls: pairing codes, the PIN, snapshots, recompute, export and model activation.

### The owner's mock-ups draw one frame with a left-hand menu

Sheets 27, 29 and 32 draw the room as one rounded frame: a left-hand panel headed «Комната родителя» with one line per section, the current one outlined, and «Выйти в игру» (back to the game) at the panel's foot, and on the right the section's screen in cards of the light room theme. Choices are segmented controls, such as «Уютно · Слегка · Загадочно», and each setting is a row with its label and a short help line on the left and its control on the right. Sheet 26 draws the PIN entry as its own screen without the menu, because nothing behind it is open yet.

### The design system holds the room's colours and shapes

`tokens.css` holds the light theme's surfaces `--surface-100` `#FFF1EE`, `--surface-200` `#FFFBF8` and `--surface-300` `#FBE1E0`, the ink `#5B3A36`, the stroke `#B07570`, the accent `#F6A5BA`, the pale blue `--magic` `#B7DDF5` the sheets use for a chosen segment, the radii from 12 to 34 px and the spacing scale from 4 to 64 px. The client's `style.ts` copies only part of the scale and its own colours, so the room's looks drift from the owner's.

### The owner asks for the shapes of current dashboards and visual editors

On 2026-11-15 the owner asked for the current approach to dashboards and visual editors. For the overview and the logs I take the dashboard's shape: a row of stat tiles at the top, each with a short label in sentence case and one value in a large proportional figure, as the stat tile contract in the data visualisation guide I read states, then cards and tables with a header row that stays in view. For the studio I take the visual editor's shape, which I chose: a toolbar across the top with the breadcrumb and the level's actions, the graph as a canvas filling the middle, and an inspector panel on the right that shows the selected node's fields and actions, so the graph stays in view while the parent edits a node. Today the node's panel sits under the graph, so editing a node scrolls the graph away.

### The owner wants the room in a widget library, apart from the game's look

Later on 2026-11-15 the owner said that the parent's admin need not share the game's style and asked for a good, attractive widget library. The client draws its screens with plain DOM calls and no framework, so a library that works by CSS classes fits it with no rewrite. Tabler (`@tabler/core`, MIT licence), read at version 1.7.3, is an admin interface kit on Bootstrap 5 whose stylesheet holds a vertical menu (`navbar-vertical`), page headers, cards, stat tiles, tables, tabs, form controls and grouped choices (`form-selectgroup`). Its compiled stylesheet `dist/css/tabler.min.css` is 686,009 bytes, imports nothing and loads no font or picture from the network, so the game's server can serve it on the home network.

### The iPad shows the room upright at 810 px

The tablet project of the end-to-end tests is an iPad (gen 7), 810 by 1080 px upright, and the computer is 1280 by 720. A left-hand panel of about 220 px leaves 590 px upright on the iPad, enough for a column of cards, and a window under 768 px, Bootstrap's `md` breakpoint, has room for a bar of sections above the screen and not beside it.

## Conclusions

1. The Parent Room must show every screen behind the PIN inside one frame with a menu of sections in a left-hand panel, marking the section shown, so every job is one choice away from every other.
2. The menu must follow the parent's jobs: an overview, the story, testing, the content lab, the logs, the household and the account, with a way back to the game at its foot.
3. The PIN entry must stand alone, without the menu, and after the PIN the room must open on the overview.
4. The overview must hold what the parent checks after play: the notices, the week's figures, the falls and the control that finishes play for today.
5. The logs of play, of model calls and of played adventures must be readable in the room behind the PIN, and the Mac's loopback listener must serve the operator's commands and no page.
6. The studio's testing tools must move from the story's screen to the testing screen, beside what is left to test, and the falls must move from the settings to the overview.
7. The room must draw its screens with a widget library for admin interfaces, served by the game's server, show a choice of a few values as a segmented control and a setting as a row of its name and its control.
8. Under 768 px the menu must become a bar above the screen.
9. The overview and the logs must open on a row of stat tiles, each a label and one value, above cards and tables whose header row stays in view.
10. The studio must work as a visual editor: a toolbar with the breadcrumb and the level's actions, the graph as the canvas, and an inspector beside it for the selected node, so the graph stays in view while a node is edited.

## Sources

- `src/client/screens.ts`, `src/client/style.ts`, `src/server/admin.ts`, `src/server/parent.ts` and `src/server/parent-room.ts` at revision `5d59f6d`, read 2026-11-15 - the current screens, their links, the loopback page and its routes.
- The owner's sheets `design/screens/26-parent-pin.png`, `27-parent-report.png`, `29-parent-lessons.png` and `32-parent-test-mode.png`, read 2026-11-15 - the frame, the menu, the segmented controls and the PIN screen. RES-3500 describes the full set.
- `design/design-system/tokens.css`, read 2026-11-15 - the colours, radii and spacing.
- `@tabler/core` 1.7.3 from the npm registry, its `package.json` and `dist/css/tabler.min.css`, read 2026-11-15 - the widgets, the licence, the size and that the sheet loads nothing from the network.
- `playwright.config.ts` at revision `5d59f6d`, read 2026-11-15 - the iPad and computer sizes.
- The stat tile contract in the data visualisation guide bundled with Claude Code, `references/marks-and-anatomy.md`, read 2026-11-15 - a tile's label, value and figures.
- The owner's messages of 2026-11-15: the room's UX is poor and needs a redesign with a left-hand menu, screens and a careful design; the design starts from the parent's use; the separate page on localhost is not needed and moves into the room; use the current approach to dashboards and visual editors; put everything in one interface like a current admin; the admin need not follow the game's style and should use a good, attractive widget library.
