---
id: EPC-0010
artifact: epic
status: approved
revised: 2026-09-27
realises: ADR-0010
checked-at:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The home server on the Mac serves the game shell to a paired iPad and computer over HTTPS

This epic realises ADR-0010: the server in Docker on the Mac, the `./tower` command, trusted HTTPS on the iPad, pairing, the PIN lockout, revocation, the home-network boundary, durable writes, snapshots and the client shell with two interfaces. SPC-0010 states what the finished part does. The epic is complete when every criterion below holds with its evidence.

## Acceptance criteria

1. `docker compose config` shows `tower` and `proxy` each with a non-root `user`, `cap_drop: [ALL]` and `no-new-privileges`, and `docker compose exec tower id -u` prints a number other than 0. Evidence: both commands' output, from TSK-0010.
2. On the Mac, `ls data/` shows no `tower.sqlite`, and `docker volume inspect tower-db` shows the live file's volume. Evidence: both commands' output, from TSK-0010.
3. A test kills the `tower` process right after the server sends an answer reply, restarts it, and finds that answer's events in the log, 100 times out of 100. Evidence: the crash test's report, from TSK-0030, run against the answer request once the epic realising ADR-0030 provides it.
4. From a second machine on the home network, a request without a device token gets 401; with a revoked token it gets `401 device_revoked`; a pairing code older than 5 minutes is refused; and the sixth wrong code within 15 minutes is refused even when correct. Evidence: the transcript of those four requests from a second machine, from TSK-0040 and TSK-0050.
5. From a second machine on the home network, `http://<mac-name>.local:8080` refuses the connection, and on the Mac `http://localhost:8080` serves the Parent Room. Evidence: both requests' output, from TSK-0060.
6. A real iPad, after `./tower ipad-setup` and nothing else, opens `https://<mac-name>.local` with no certificate warning and installs the home-screen app. Evidence: the parent's signed-off iPad checklist with screenshots, from TSK-0020.
7. `grep -r "sk-or-" dist/client` finds nothing, and a Playwright test records every response the client receives in a full simulated day and finds no key. Evidence: the grep's exit status and the Playwright report, from TSK-0090.
8. With OpenRouter blocked at the network, a simulated adventure day plays to its finale on library and pool texts. Evidence: the simulation's report, from TSK-0130.
9. After 40 simulated sessions spread over three months, `data/snapshots/` holds 30 rolling snapshots plus the first of each month, and each snapshot opens in a SQLite client and lists its events. Evidence: the retention test's report, from TSK-0080.
10. Playwright at 1280x720 with no mouse reaches and operates every control on every screen by keyboard, with a visible focus ring; the parent judges both interfaces screen by screen for REQ-2534. Evidence: the Playwright report and the parent's screen-by-screen judgement, from TSK-0100.
11. After a device plays a day, its IndexedDB holds at most the unsent-answer store, and its `localStorage` holds no game data. Evidence: the storage inspection test's report, from TSK-0110.
12. Every requirement ADR-0010 addresses lands in exactly one closed task. Evidence: `meow-method check coverage` with no finding.

The epic can measure two things before it is finished. The crash test of TSK-0030 reports how many of 100 kills lose a committed write, and ADR-0010 reverses to Node under `launchd` if that number is above 0. `./tower status` reports how long a snapshot of a 1 GB database takes, against the 60-second budget in ADR-0190's Baselines table.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass.

## Tasks

- [x] T-001 TSK-0010 The containers and `./tower up`, `down` and `status` serve a health page on the Mac (`compose.yaml`, `Caddyfile`, `tower`, `src/server/`)
      evidence: meow-verbs run format lint check test build exit 0, 7 tests; ./meowtower up serves /health HTTP 200 (TSK-0010 Evidence)
      closes: REQ-2502, REQ-2512
      depends: none
- [x] T-002 TSK-0020 The iPad trusts HTTPS through `./tower ipad-setup` and installs the home-screen app
      evidence: owner confirmed on a real iPad 2026-09-27: trusted HTTPS, standalone app; profile and chain tests pass (TSK-0020 Evidence)
      closes: REQ-2500, REQ-2514
      depends: TSK-0010 - Caddy's authority and the served page must exist
- [x] T-003 TSK-0030 The server commits each write before it replies, proven by the crash test
      evidence: crash test 100 of 100 writes and 100 of 100 answers kept (TSK-0030 Evidence)
      closes: REQ-2508
      depends: TSK-0010 - the database lives in the volume `tower-db` it creates
- [x] T-004 TSK-0040 A device pairs by a 6-digit code and keeps its access
      evidence: meow-verbs exit 0, 243 tests; 6-digit code pairs within 5 min; 401 without token (TSK-0040 Evidence)
      closes: REQ-2516, REQ-2518
      depends: TSK-0030 - the `devices` table lives in the database it opens
- [ ] T-005 TSK-0050 The PIN guards the Parent Room, both lockouts hold, and the parent revokes a device
      closes: REQ-2520, REQ-2522
      depends: TSK-0040 - revocation and the pairing lockout act on pairing; TSK-0100 - the devices page is a client screen in both interfaces
- [x] T-006 TSK-0060 The server answers only on the home network, and the Parent Room listener only on the Mac
      evidence: wrong_network test passes; Parent Room on loopback only; owner confirmed from a second machine 2026-09-27 (TSK-0060 Evidence)
      closes: REQ-2510
      depends: TSK-0010 - the listeners and `./tower up` must exist
- [x] T-007 TSK-0070 Snapshots on demand and before migrations, and `./tower restore`
      evidence: meow-verbs exit 0, 262 tests; 1 GB snapshot 1,798 ms; restore works; blobs read-only (TSK-0070 Evidence)
      closes: REQ-2524, REQ-2528, REQ-2532
      depends: TSK-0030 - a snapshot copies the database it opens
- [ ] T-008 TSK-0080 A snapshot after each session, retention, and the backup and storage notices
      closes: REQ-2526, REQ-2530
      depends: TSK-0070 - it reuses the snapshot worker; TSK-0050 - the notices show in the Parent Room
- [>] T-009 TSK-0090 The OpenRouter key never reaches a client
      closes: REQ-2504
      depends: TSK-0010 - the key's `.env` and the client bundle must exist
- [ ] T-010 TSK-0100 One client shell with a tablet and a computer interface, chosen by the device and switchable
      closes: REQ-2534, REQ-2536, REQ-2538, REQ-2540
      depends: TSK-0040 - the choice is stored in the device's `devices` row
- [ ] T-011 TSK-0110 A device keeps no game data except unsent answers
      closes: REQ-2542
      depends: TSK-0100 - the storage it restricts belongs to the client shell
- [x] T-012 TSK-0120 The server sends no push in the MVP, and a check keeps it so
      evidence: meow-verbs run format lint check test build exit 0; push_code check passes here and fails 4 fixtures (TSK-0120 Evidence)
      closes: REQ-2544, REQ-2546
      depends: TSK-0010 - the check runs over the code base it starts
- [ ] T-013 TSK-0130 The adventure plays on without the model service
      closes: REQ-2506
      depends: TSK-0050 - the `model_service_down` line shows in the Parent Room; outside this epic, a simulated adventure day, which needs the epics realising ADR-0030, ADR-0040, ADR-0100 and ADR-0110

These tasks can run in parallel once their dependencies are done:

- After TSK-0010: TSK-0020, TSK-0030, TSK-0060, TSK-0090 and TSK-0120.
- After TSK-0030: TSK-0040 and TSK-0070.
- After TSK-0040: TSK-0100, beside TSK-0070 if that is still running.
- After TSK-0100: TSK-0050 and TSK-0110.
- After TSK-0050: TSK-0080, once TSK-0070 is also done, and TSK-0130, once its outside dependencies exist.

## Coverage

Every one of the 24 requirements ADR-0010 addresses lands in exactly one task above, and none is deferred.

| Task | Requirements |
| --- | --- |
| TSK-0010 | REQ-2502, REQ-2512 |
| TSK-0020 | REQ-2500, REQ-2514 |
| TSK-0030 | REQ-2508 |
| TSK-0040 | REQ-2516, REQ-2518 |
| TSK-0050 | REQ-2520, REQ-2522 |
| TSK-0060 | REQ-2510 |
| TSK-0070 | REQ-2524, REQ-2528, REQ-2532 |
| TSK-0080 | REQ-2526, REQ-2530 |
| TSK-0090 | REQ-2504 |
| TSK-0100 | REQ-2534, REQ-2536, REQ-2538, REQ-2540 |
| TSK-0110 | REQ-2542 |
| TSK-0120 | REQ-2544, REQ-2546 |
| TSK-0130 | REQ-2506 |

The smallest set of tasks that would test the decision is TSK-0010, TSK-0020 and TSK-0030. Together they show whether Docker on the Mac holds the unprivileged containers, whether a real iPad trusts the local authority, and whether a committed write survives 100 kills on the named volume, which is the first condition in ADR-0010 that would reverse it.

## Not covered

- A copy of the data off the Mac, because no decision makes one; ADR-0010 leaves it to the owner.
- Web push after the MVP: the `push_subscriptions` table, the permission button, the service worker's push handler and VAPID keys, because ADR-0010 places them in a later item and REQ-2544 allows no push in the MVP.
- The event log's tables, the migrations' content, the export and the recompute behind `./tower export` and `./tower recompute`, because ADR-0020 defines them and its own epic realises them.
- The answer request, the lease, the parent session's expiry and the offline queue's behaviour, because ADR-0030 defines them.
- The model gateway, its timeouts and the fallback pools, because ADR-0100 and ADR-0110 define them; TSK-0130 only proves the game plays without the service.
- The screens of both interfaces beyond the shell and the Parent Room's content, because ADR-0150 and ADR-0180 define them.
