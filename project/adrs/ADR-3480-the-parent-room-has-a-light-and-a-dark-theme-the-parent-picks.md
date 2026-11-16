---
id: ADR-3480
artifact: adr
status: approved
revised: 2026-11-16
addresses: [REQ-7692]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3480. The Parent Room has a light and a dark theme, the device's until the parent picks one

## Decision

The Parent Room shows Tabler's light or dark theme by setting `data-bs-theme` on the root element while a room screen shows, and removes it on a game screen, so the game keeps its own look. A new parent setting `roomTheme` holds `auto`, `light` or `dark`, `auto` by default, and travels as a `settings_changed` event like the other settings. With `auto` the room follows the device's `prefers-color-scheme` and changes with it at once.

The parent picks the theme in two places. The menu's foot holds a switch above «Выйти в игру» (back to the game): a moon and «Тёмная тема» (dark theme) in the light theme, a sun and «Светлая тема» (light theme) in the dark one. A press turns the room to the other theme and saves it. The settings screen holds a row «Тема Комнаты родителя» (Parent Room theme) with «Как на устройстве» (as on the device), «Светлая» (light) and «Тёмная» (dark), which also brings `auto` back. The client reads the choice once a parent session can read the settings, so the PIN screen shows the device's theme.

Once this is accepted, the parent reads the room in either theme on the iPad and the computer. What still doesn't work: the game's own screens keep their themes, which the player's settings choose.

## Why

The owner asked for a dark and a light theme on 2026-11-16, and ADR-3470 left the room's dark theme unsettled. Tabler draws both from the same classes, so the room needs only the attribute and the choice.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Follow the device only | No setting and no switch | The parent can't read the room in the other theme without changing the whole device. |
| Keep the choice in the browser | No server change | The game keeps no data in the browser's storage (REQ-2542), and a choice there stays on one device. |
| A parent setting on the server, `auto` by default (this) | One choice for every device, the device's theme until then | A request for the settings each time the room opens on a fresh page. |

## What it costs

The room reads the parent settings when it first opens on a page, which is one request the overview's screen would not otherwise make. The strongest objection: the PIN screen can't know the parent's choice, so a parent who picked dark sees the PIN in the device's theme. The answer is that the PIN screen is one card, and the choice applies the moment the session opens.

## What would reverse it

- A wish to theme the game's screens from the room too, which would call for one setting for both.

## Consequences

The parent settings gain `roomTheme`, and the strings gain the switch's and the row's labels in three languages. SPC-0150's section on the room's frame names the theme.

## How I will know it was realised

1. With `auto` the room follows the device's light and dark setting, the menu's switch turns it to the other theme, the choice survives a reload, and a game screen carries no theme attribute, in an end-to-end test on the computer and the iPad.
2. The settings route keeps `light` and `dark`, starts at `auto` and refuses any other value, in an integration test.

## What this does not settle

- Themes for the game's own screens.

## Plan

1. The setting, the switch, the row and the painting of the root (REQ-7692). It touches `src/server/parent-room.ts`, `src/client/room.ts`, `src/client/room-icons.ts`, `src/client/screens.ts`, `src/client/api.ts` and the string files.
