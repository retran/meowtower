---
id: TSK-0390
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-0234, REQ-2440]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent session expires after 30 minutes, and the parent sets the three-day limit

After this task, the PIN opens a parent session with its own cookie that expires 30 minutes after its last request, and the parent reads and changes `threeDayLimit`, or switches the rule off, through `/api/parent/settings`.

## Acceptance criteria

1. Given a parent session, when a parent request arrives 31 minutes after the last one, then it gets `401 parent_session_expired`, and the client shows the PIN screen with the page kept; a request at 29 minutes succeeds and restarts the 30 minutes (REQ-2440). Closed by: an integration test with a fake clock and a Playwright test.
2. Given a parent session cookie on an unpaired device, when it calls a parent route, then it gets `401`. Closed by: an integration test.
3. Given the default settings, when the parent reads them, then `threeDayLimit` is 3; when the parent sets it to 5 or off, then `settings_changed` is logged and the next read returns the new value (REQ-0234). Closed by: an integration test and a Playwright test on the stand-in settings page.

## What to do

Add `POST /api/parent/login`, the parent session cookie apart from the device token, the 30-minute expiry, and `GET` and `PUT /api/parent/settings` with `threeDayLimit`, as SPC-0030 states them. A stand-in settings page in the Parent Room holds the one control until ADR-0180's epic builds the pages. ADR-0190's definition of done applies.

## Depends on

TSK-0050, because the PIN check and its lockout open the session. TSK-0220, because `settings_changed` needs its schema.

## Evidence

Collected on 2026-09-29 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0 at tree `d88f35be5553`; 39 test files and 356 Vitest tests passed, 15 Playwright tests passed in the `ipad` and `computer` projects, and the build made both images. `meow-verbs evidence --keep` kept the records: format `114718fc1a09`, lint `025a2f92eac4`, check `fc05d3aafb4b`, test `d16c328ccbf9`, build `9d36bf577cbb`, under `project/evidence/`.
- Seen failing first: the new integration and Playwright tests, copied into a worktree of HEAD `4f12bcd`, failed there: the REQ-2440 test with `expected 200 to be 401`, because nothing expired a session, and the REQ-0234 tests because `/api/parent/settings` didn't exist. The criterion 2 test passed at HEAD, because TSK-0050's device check already refused those requests. With the `/api` device check skipped for parent routes it still passed, since `parent()` checks the device again and the session is bound to its device. With all three guards removed it failed with `no device GET /api/parent/devices: expected 200 to be 401`. The guards were then restored, and the file passed again.
- Criterion 1, REQ-2440: `tests/integration/parent-room.test.ts` opens a session on the fake clock, gets 200 from `GET /api/parent/devices` at 29 minutes and again 29 minutes later, 58 after the login, so each request restarted the 30 minutes. 31 minutes after that it gets `401 {"error":"parent_session_expired"}`, then `parent_session_missing`, because the expired session is forgotten; a new PIN entry opens another. That new session holds at 29:59.999 and expires at 30:00 exactly, the boundary SPC-0030's failure table names; with the comparison `>` in place of `>=` that check failed, `expected { devices: … } to deeply equal { error: 'parent_session_expired' }`. `ParentSessions.hold` in `src/server/parent-access.ts` holds the rule. `tests/e2e/parent.spec.ts` answers the settings page's save with that 401 and sees the PIN form open on `/parent/settings` itself. The status line reads «Прошло 30 минут…», the chosen «5 дней» stays checked, and after the PIN the save runs again and reads «Сохранено.». The devices page opens the PIN form in the same way (`asParent` in `src/client/screens.ts`).
- Criterion 2: the same file logs in on one device, then sends that session's cookie with no device cookie and with an unknown device token to `GET /api/parent/devices`, `GET` and `PUT /api/parent/settings` and `POST /api/parent/pair-code`. All eight requests get 401, and no `settings_changed` is logged. A second paired device that didn't open the session gets 401 `parent_session_missing` too: TSK-0050's devices-page test in the same file sends the session's cookie from another paired device.
- Criterion 3, REQ-0234: a fresh database reads `{"threeDayLimit":3}`. `PUT` with 5 and then with null each return 200, the next read returns 5 and then null, and the log holds exactly two `settings_changed` events, `{key:"threeDayLimit", value:5}` and `{…, value:null}`. 0, 8, 2.5 and `"5"` get `400 settings_invalid` and log nothing. The Playwright test sets 5 and then «не закрывать» on the stand-in page `/parent/settings` and finds each checked after a reload. The `parent_settings` projection (`src/engine/projections/settings.ts`) folds the events, and a missing table is rebuilt from the log at start-up like every registered projection.
- Also: the keyboard test walks 6 routes and 15 controls, the settings page included. Its radio check now accepts any radio group, not only the interface switch.

Choices this task made, where SPC-0030 left a gap:

- The limit is a whole number of adventure days from 1 to 7, or null for off, because the page offers those eight choices and a longer limit keeps an adventure open past a week. A value outside them gets `400 settings_invalid`.
- The 30 minutes count from the last parent request of any kind, reading included, because every request the Parent Room sends today comes from the parent opening a page or pressing a control, so each one shows the parent is there. A request the client sends by itself, a poll or an SSE stream, must not restart the 30 minutes, or an open page would keep the session alive forever; no parent page sends one yet, and the page that adds one owns that rule. A request past the 30 minutes removes the session, so a stolen cookie stops working once it has expired, and later requests read `parent_session_missing`.
- A setting with no event holds its default, which the route supplies. `parent_settings` keeps only the values the parent chose, so a later change of the default reaches every parent who never set it.
- A choice on the settings page saves at once and says «Сохранено.», as the device settings do.

### Review findings, settled

An agent reviewed this record twice. On 2026-09-29 the owner asked for every finding to be fixed, and each is now settled in the specification it belongs to. This section sits under Evidence because the frozen check lets an approved task change only this section.

- SPC-0030 now states the contracts the choices above made. For the limit: the range 1 to 7, `null` for off, `400 settings_invalid`, and the route supplying the default. For the session: which requests count as activity, the rule that a poll or SSE request doesn't restart the 30 minutes, and the forgotten session that later reads `parent_session_missing`. With the cap stated in the specification, TSK-0400 sees it too.
- SPC-0340's two lines now match SPC-0010 and SPC-0030. `parent_session_missing` answers a request with no session and one from another device. `parent_session_expired` answers the first request after 30 idle minutes.

## Left alone

The PIN's storage and lockout (TSK-0050), the rule itself (TSK-0400), and the other settings, which ADR-0180 defines.
