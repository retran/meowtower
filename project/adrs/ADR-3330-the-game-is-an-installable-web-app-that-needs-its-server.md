---
id: ADR-3330
artifact: adr
status: done
pr: 98
revised: 2026-11-08
addresses: [REQ-6508, REQ-6510]
supersedes: []
concerns: [privacy]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3330. The game is an installable web app that needs its server, and a device with no connection says so

## Decision

The game is a progressive web app (PWA) that the browser installs to the home screen of an iPad or a computer and opens in a window of its own. The owner asked for this on 2026-11-08 and said it is an online app. It needs the server to show a task or to take an answer, and it plays nothing from a local copy.

The page already carries a manifest, an icon and the tags iOS reads, and a service worker keeps code, the language file and pictures. This record adds what a browser's install check still lacks and the screen that tells the truth when the server is unreachable.

- The manifest at `/manifest.webmanifest` names an `id` and a `scope` of `/`, and lists two icons, 192 and 512 pixels, so Chrome and Edge offer the install. The server draws both from the same function.
- When the first request of a start gets no reply, the client shows an offline screen in place of the pairing screen: a title, one sentence that the game needs a connection to the server, and a button that tries again. It tries again by itself when the browser reports the connection back. The screen shows no task and takes no answer, and the three languages carry its text.
- The service worker stays as REQ-6506 and SPC-0010 have it: it caches no `/api` reply, so no answer, packet or explanation ever sits in a cache.

What works once this is accepted: a browser offers to install the game, and a device with no connection shows the offline screen and no task. What doesn't: an offline start of a device that never loaded the page, which no web app can answer.

## Why

The record held no word on installing. The page's head was written for the iPad's home screen only (SPC-0010), and Chrome's install check wants 192 and 512 pixel icons and a manifest `id`. The pairing screen on a failed start was wrong, because it told a paired child to pair again when only the Wi-Fi was gone.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: the page already installs on iOS | No work | Other browsers do not offer the install, and an offline start shows a false pairing screen |
| An offline-first app that plays from a local copy | Plays on a train | The owner said online, and a local copy would hold game data on the device against REQ-6506 |
| A native wrapper | Store presence | An app store, a review and a build for each system, for a game one household plays |

## What it costs

Two small icons drawn by code, one screen in three languages, and a Playwright test that sets the browser offline. A play session cut by a lost connection still stops where it did, as the answer queue already handles.

## What would reverse it

- The owner decides the game should play with no connection: this record is superseded by one that defines what a device may hold, and REQ-6506 changes with it.

## Consequences

- SPC-0010 states both requirements. `src/server/shell.ts`, `src/client/api.ts`, `src/client/main.ts` and the three language files change.

## How I will know it was realised

1. A test reads the manifest and finds the `id`, the `scope` and icons of 192 and 512 pixels, and fetches both icons as PNG.
2. A Playwright test loads the page, sets the browser offline, reloads, and finds the offline screen with no task and no pairing field.
3. The same test sets the browser online again and finds the game start by itself.

## What this does not settle

- Offline play, and a store listing.
- Art for the icon, which ADR-0170's art replaces later.

## Plan

1. The 192 pixel icon and the manifest fields, with their test (REQ-6508).
2. The offline screen, its strings in three languages and the Playwright test (REQ-6510).
