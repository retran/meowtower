---
id: TSK-0020
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2500, REQ-2514]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The iPad trusts HTTPS through `./tower ipad-setup` and installs the home-screen app

After this task, a real iPad set up once with `./tower ipad-setup` opens `https://<mac-name>.local` with no certificate warning and installs the game as a home-screen web app, and a browser on the computer opens the same address.

## Acceptance criteria

1. Given a real iPad that has never opened the game, when the parent runs `./tower ipad-setup`, installs the profile and trusts it in Settings, then Safari opens `https://<mac-name>.local` with no certificate warning. Closed by: the parent's signed-off iPad checklist with a screenshot.
2. Given that iPad, when the parent adds the page to the home screen, then the icon opens the app in standalone mode over the same trusted connection. Closed by: the checklist and a screenshot.
3. Given a browser on the computer, when it opens `https://<mac-name>.local`, then the page loads from the server on the Mac. Closed by: a screenshot or Playwright's report.

## What to do

Add `./tower ipad-setup`, which serves the profile carrying Caddy's root certificate from `data/caddy/`, and the web app manifest and icon the home-screen install needs, as SPC-0010 states them. The setup is done once per iPad. The parent must pair inside the home-screen app after installing it, because iPadOS keeps the app's storage apart from Safari's; the checklist says so.

Criterion 1 needs a person with a real iPad, which is part of stage 0's acceptance in ADR-0190.

## Depends on

TSK-0010, because Caddy's authority and the served page must exist.

## Evidence

Not yet.

## Left alone

Pairing (TSK-0040) and the client's two interfaces (TSK-0100).
