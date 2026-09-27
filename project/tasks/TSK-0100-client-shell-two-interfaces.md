---
id: TSK-0100
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2534, REQ-2536, REQ-2538, REQ-2540]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One client shell with a tablet and a computer interface, chosen by the device and switchable

After this task, one client code base builds a tablet and a computer interface, the device picks one on first start, the player switches it in the settings, and every screen of the computer interface works from the keyboard alone.

## Acceptance criteria

1. Given a device where `(pointer: coarse)` matches and `(any-pointer: fine)` doesn't, when the client starts for the first time, then it shows the tablet interface; on any other device it shows the computer interface. Closed by: Playwright in WebKit emulating an iPad and in Chromium at 1280x720.
2. Given the player switches the interface in the settings, when the device reloads, then the chosen interface shows and the device's `devices` row holds the choice. Closed by: an integration test and a query of `devices`.
3. Given Playwright at 1280x720 with no mouse, when it walks every route the client registers, then it reaches and operates every control by keyboard with a visible focus ring. Closed by: the Playwright report.
4. Given both interfaces, when the parent judges them screen by screen, then each covers every screen present. Closed by: the parent's written judgement.

## What to do

Build the client shell with both interfaces, the first-start choice, the settings switch and the keyboard test, as SPC-0010 states them. Player-facing strings live in per-language files, as CLAUDE.md requires. The keyboard test enumerates the client's registered routes, so it covers each screen that ADR-0150 later adds.

## Depends on

TSK-0040, because the choice is stored in the device's `devices` row.

## Evidence

Collected on 2026-09-27 on the Mac. Criteria 1 to 3 hold; criterion 4 waits for the parent's written judgement.

- Verbs: `meow-verbs run format lint check test build` exited 0; 33 test files, 318 Vitest tests and 9 Playwright tests passed, now in two projects: `ipad` in WebKit and `computer` in Chromium at 1280x720. `meow-verbs evidence` doesn't exist in meow-verbs 0.3.0, so the trees are cited from `git write-tree`: `src` `9b6372942bd31cf33870a270265539f5b1c7fbc2`, `tests` `2766c7e02e51434aa01bbf922b8ff0fff4653c7c`, `content` `bf20a392aea1a8a888e9cd4fae11c3e89b8d9c79`. The built image holds `dist/client` (7 modules), and `grep -rl "sk-or-" dist/client` in it exits 1.
- Seen failing first, each by breaking one mechanism and restoring it: with detection always answering `computer`, the `ipad` first-start test failed; with the switch never written to `devices`, the REQ-2538 test failed in both projects and 2 of the 5 Vitest cases failed; with the focus ring removed, the keyboard test failed; with buttons ignoring activation, the keyboard test and both REQ-2538 tests failed.
- Criterion 1, REQ-2536: `tests/e2e/interface.spec.ts` starts the client on a fresh device and reads `data-interface` on the root: `tablet` for the iPad in WebKit, `computer` for Chromium at 1280x720.
- Criterion 2, REQ-2538: in both projects the test pairs the device with a code from the parent listener, switches to the other interface in the settings, finds the browser's storage empty and reloads, and the other interface shows; the newest `devices` row holds it. `tests/unit/device-interface.test.ts` reads the paired interface from `GET /api/device`, stores a switch with `PUT /api/device` and finds it in the row, and refuses an unknown interface (`400`) and an unpaired device (`401`).
- Criterion 3, REQ-2540: with no mouse, the keyboard test reads the routes the client registers (`/`, `/settings`, `/pair`), tabs through each until focus returns, finds a focus ring of at least 2 px on every control, and operates each by Enter, arrow key or typing: `keyboard: 8 controls on 3 routes`.
- Criterion 4, REQ-2534: not yet closed. The parent's first look found the spacing wrong; the shell's spacing now follows the design system's scale (`--space-*`, one card a screen, blocks 24 px apart, form rows 12 px), and the screenshots were taken again. Screenshots of the three screens in both interfaces were given to the parent for the written judgement, which is recorded here when it comes.
- The response recorder, which runs with every end-to-end test, waited forever in Chromium on a `401` body the client never read; the client now reads every response body, and the recorder skips an empty JSON body.

Choices this task made, where SPC-0010 left a gap:

- The `devices` row's `kind` column holds the interface: the pairing request sets it from the device, and the settings switch it, so no migration adds a second column saying the same thing. The kind the device detected at pairing isn't kept once she switches, because nothing reads it.
- An unpaired device keeps its switch in memory until pairing sends it with the pairing request, because the server has no row for it yet and SPC-0010 keeps game data out of `localStorage` (REQ-2542); a reload before pairing picks from the device again. The REQ-2538 test checks the browser's storage is empty.
- The client is plain TypeScript compiled by `tsc` into `dist/client` and served at `/client/<name>.js`, because ADR-0150 chooses the UI framework; its strings come from `/i18n/ru.json`, which serves only the `ui.` keys, since the file also holds task texts and short solutions; `tests/unit/device-interface.test.ts` checks every key served starts with `ui.`.
- Every control carries `data-action` and records it on activation, and the root lists the registered routes in `data-routes`, so the keyboard test covers each screen ADR-0150 adds without being told about it. That holds only if every screen is a route: a dialog, an overlay or a state inside a route is unseen by the test, so each screen ADR-0150 adds must register a route in `SCREENS`.

### Open review findings

An agent reviewed this record; these findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- REQ-2534 asks for every screen of the game and the Parent Room in both interfaces, and this task's shell has three screens, so the parent's judgement of them can't show REQ-2534 holds. Not changed: `closes:` and criterion 4 are frozen. The judgement recorded here covers the shell; REQ-2534 holds only once ADR-0150's epic, which adds the screens, has the parent judge them.
- REQ-2536 names the device's input and screen size, and SPC-0010, which this task follows, names only the pointer media queries. Not changed here: the gap is SPC-0010's, and closing it is an amendment of its own.
- REQ-2538 holds only for a paired device: a switch made before pairing lives in memory and a reload loses it, and pairing again writes a new `devices` row with the kind the device detects, so a switch doesn't survive a revoke and a re-pair. Not changed here: where an unpaired device may keep the choice, given that `localStorage` holds no game data, is SPC-0010's to settle in an amendment.
- The keyboard test finds screens only through `SCREENS`, so the rule that every screen registers a route binds ADR-0150's epic, and What to do's claim that the test covers each later screen holds only with it. Not changed here: the rule belongs in SPC-0010's client section, with the `kind` column's new meaning and the `ui.`-only strings route, in the same amendment.

## Left alone

The screens themselves and the UI framework, which ADR-0150 defines.
