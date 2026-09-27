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

Not yet.

## Left alone

The screens themselves and the UI framework, which ADR-0150 defines.
