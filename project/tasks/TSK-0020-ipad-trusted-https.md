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

Collected on 2026-09-27 on the Mac, with the names ADR-0200 sets. Criteria 1 and 2 rest on the owner's confirmation on a real iPad.

- Verbs: `meow-verbs run format lint check test build` exited 0; 4 test files, 14 tests passed.
- REQ-2514, the profile, checked first against a script without `ipad-setup`, where `tests/smoke/ipad-setup.test.ts` failed: it now passes. The profile is a `Configuration` profile with a `com.apple.security.root` payload holding exactly Caddy's root certificate, and a missing certificate prints `root_certificate_missing`. `plutil -lint` reported the served profile `OK`; `curl` of `https://code-swirl.local/setup/meowtower.mobileconfig` returned HTTP 200 as `application/x-apple-aspen-config`.
- REQ-2514, the trust chain: `curl --cacert data/caddy/caddy/pki/authorities/local/root.crt https://code-swirl.local/` returned HTTP 200 with `ssl_verify_result=0`; without the root it failed with `ssl_verify_result=20` (unknown issuer), which is what the profile fixes on the iPad.
- REQ-2500, the web app: `tests/unit/shell.test.ts` passes. `/` links `/manifest.webmanifest` and `/icon-512.png` and sets `apple-mobile-web-app-capable`; the manifest has `display: standalone` and the name «Мяубашня» from `content/i18n/ru.json`; the icon is a 512 by 512 PNG.
- Criterion 3: Playwright 1.63 WebKit on the Mac loaded `https://code-swirl.local/` and rendered «Башня просыпается…» from the server (screenshot taken; certificate checks skipped in this run, because the Mac doesn't trust Caddy's authority, and the trust chain is proven by `curl` above).
- Changed on the way: the profile is served by `proxy` from `data/setup/` over the existing HTTPS listener, because a separate HTTP server on the Mac met the macOS firewall; `./meowtower up` restarts `proxy` so a changed `Caddyfile` applies; the host variable is `MEOWTOWER_HOST`.
- Criteria 1 and 2: the owner ran `./meowtower ipad-setup` on a real iPad and confirmed on 2026-09-27 that it works: Safari opens `https://<mac-name>.local` with no certificate warning, and the home-screen icon opens the app. The confirmation was given in words; no screenshot was supplied.

## Left alone

Pairing (TSK-0040) and the client's two interfaces (TSK-0100).
