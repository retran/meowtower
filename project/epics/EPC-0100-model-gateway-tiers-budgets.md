---
id: EPC-0100
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0100
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every model call goes through one server gateway with per-role models, two privacy tiers, budgets reserved before each call and a full log

Realises exactly ADR-0100: the one gateway module and its roles, the request classes, the egress guard, the two privacy tiers, the start-up check, the reservations and the six budgets, the full log, the judge's route and fallback, the Master's fallback model and the parent's pick, the bake-off tool, and the Parent Room's page on what leaves the Mac.

Until the epics realising ADR-0110, ADR-0120 and ADR-0180 exist, the tasks test the gateway with fixture callers and a mocked OpenRouter, and the Parent Room lines sit on its stand-in page. Each task names what it leaves to those epics.

## Acceptance criteria

1. A test sends each request class with an extra field and with each field REQ-1604, REQ-2604 and the judge's class forbid, and the gateway refuses every one before any network call. Evidence: the schema tests' reports, from TSK-0580, TSK-0581 and TSK-0582.
2. A test with a mocked OpenRouter records every request body of a full simulated adventure; every player-tier request has `zdr: true` and the player list, every request has `data_collection: "deny"`, and none of the dynamic parts holds a digit, a node id, a topic name or a name the parent set. Evidence: the recorded run's report, from TSK-0583 and TSK-0582.
3. A test starts the server with a missing model and with a player-tier model that lacks a zero-retention endpoint, and it refuses both times and names the role; with the catalogue unreachable, it starts with live calls off. Evidence: the start-up test's report, from TSK-0584.
4. A test fires 20 concurrent Master calls at a nearly spent adventure bucket and the settled spend stays at or under $1.5. Evidence: the concurrency test's report, from TSK-0585.
5. A test replays a month of calls past $60 and a mocked HTTP 402, and the gateway refuses every later call, appends one `budget_month_spent` event and the game plays on fallbacks. Evidence: the month test's report, from TSK-0587 and TSK-0590.
6. A test sends an `ExplainRequest` without a matching `thread_spent` event and the gateway refuses it. Evidence: the unit test's report, from TSK-0581.
7. In the first week of play, each day's sum of `llm_log` costs is within 5 % of the usage the play key reports. Evidence: the owner's comparison recorded in TSK-0589's evidence, a judgement because the key's usage lives in the account.
8. A test times out the mocked judge and the same question with the same text reaches `SAFETY_MODEL`. Evidence: the judge test's report, from TSK-0591.
9. A test in `replay` mode plays a simulated adventure with the network blocked, opens no connection, and fails one request whose recording was deleted as `recording_missing`. Evidence: the replay test's report, from TSK-0580 and TSK-0590.
10. A test in `verify` mode records every call's key and finds the offline key on all of them and the play key on none, and the `tower` service refuses to start in any mode but `play`. Evidence: the key test's report, from TSK-0588 and TSK-0580.
11. A test sends a `StoryRequest` with `readerAge` set and her real name in the free text; the age passes, the name arrives as «[имя]», and a digit anywhere else is refused. Evidence: the guard test's report, from TSK-0582.
12. Every requirement ADR-0100 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the settled spend of the 20 concurrent calls against $1.5, which TSK-0585's test reports, and the share of reservations that refuse a call its settled cost would have let through, which ADR-0100 reverses on above 5 %, from the first month's `llm_log` once TSK-0589 writes it.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0580 One gateway module opens every model connection and takes each role's model from `.env`
      closes: REQ-1642
      depends: none
- [ ] T-002 [P] TSK-0581 An explanation request leaves only after a spent thread and holds only the fields the requirement lists
      closes: REQ-2602, REQ-2604, REQ-2606
      depends: TSK-0580 - the schemas are classes of that gateway.
- [ ] T-003 [P] TSK-0582 The egress guard replaces names and contact details, refuses topic names and digits, and keeps her text out of picture prompts
      closes: REQ-2608, REQ-2612, REQ-2632, REQ-2634
      depends: TSK-0580 - the guard runs inside that gateway.
- [ ] T-004 [P] TSK-0583 Each request goes under a privacy tier its role fixes, to a provider list the owner can change without a rebuild
      closes: REQ-2614, REQ-2616, REQ-2618, REQ-2620, REQ-2622, REQ-2624, REQ-2626, REQ-2644
      depends: TSK-0580 - the tier is a fixed attribute of that gateway's roles.
- [ ] T-005 TSK-0584 The server refuses to start when a configured model is missing or a player-tier model has no zero-retention endpoint
      closes: REQ-1644, REQ-1646, REQ-2628
      depends: TSK-0580 - it reads that gateway's roles.; TSK-0583 - it reads the player-tier list.
- [ ] T-006 [P] TSK-0589 Every call to a model service is recorded with its cost
      closes: REQ-2700
      depends: TSK-0580 - every call goes through that gateway.
- [ ] T-007 TSK-0585 Each call reserves its worst-case cost first, and an adventure's spend stops at $1.5
      closes: REQ-2702
      depends: TSK-0580 - the reservation sits in that gateway.; TSK-0589 - settlement writes the cost to its log.
- [ ] T-008 [P] TSK-0586 Live explanations stop at $0.3 and 20 a game day, and a spent thread still gets one from the cache or a template
      closes: REQ-2704, REQ-2706, REQ-2716
      depends: TSK-0585 - the bucket uses its reservation.; TSK-0581 - it counts that task's request class.
- [ ] T-009 [P] TSK-0587 The play key's month stops at $60, every later session uses the fallbacks, and the parent sees a notice
      closes: REQ-2718, REQ-2720, REQ-2722
      depends: TSK-0585 - the month's count is a bucket of that engine.; TSK-0589 - the count reads its log.
- [ ] T-010 [P] TSK-0588 Offline runs spend from their own key and stop at their own budgets
      closes: REQ-2708, REQ-2710, REQ-2712, REQ-2728
      depends: TSK-0585 - the buckets use its reservation.
- [ ] T-011 [P] TSK-0590 When a budget runs out or the service is down, the game plays checked library text at its usual pace
      closes: REQ-2714, REQ-2726
      depends: TSK-0585 - the typed result comes from its refusal.
- [ ] T-012 [P] TSK-0591 The judge model takes only checks with fixed answers, only after a passing test-set record, and falls back to the safety model
      closes: REQ-1686, REQ-1688, REQ-1690
      depends: TSK-0580 - the route is one of that gateway's roles.; TSK-0589 - the fall back logs both calls.
- [ ] T-013 [P] TSK-0592 A Master order that fails goes to the fallback model before the scene falls back to the library
      closes: REQ-1692
      depends: TSK-0580 - the list belongs to that gateway's roles.
- [ ] T-014 TSK-0593 The parent switches the Master's model among approved models, and the pick applies at the next adventure
      closes: REQ-1694, REQ-1696, REQ-2630
      depends: TSK-0592 - the pick chooses the first model of its list.; TSK-0584 - the re-validation uses its catalogue reads.
- [ ] T-015 TSK-0594 The bake-off sends every candidate through the play route, scores answers blind and excludes a model with a safety failure
      closes: REQ-1648, REQ-1650, REQ-1652, REQ-1654, REQ-1656
      depends: TSK-0583 - it uses the tiers and provider lists.; TSK-0588 - it runs on the offline key and bucket.
- [ ] T-016 [P] TSK-0595 The Parent Room's page on what leaves the Mac states that outcome events coarsely reflect how well she does
      closes: REQ-2638
      depends: TSK-0583 - the disclosure test compares the page with its defaults.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0580.
- After TSK-0580: TSK-0581, TSK-0582, TSK-0583, TSK-0589, TSK-0592.
- After TSK-0580 and TSK-0583: TSK-0584, and after TSK-0583 alone TSK-0595.
- After TSK-0580 and TSK-0589: TSK-0585, TSK-0591.
- After TSK-0585: TSK-0588, TSK-0590, and with TSK-0581 TSK-0586, and with TSK-0589 TSK-0587.
- After TSK-0592 and TSK-0584: TSK-0593.
- After TSK-0583 and TSK-0588: TSK-0594.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0580 | REQ-1642 |
| TSK-0581 | REQ-2602, REQ-2604, REQ-2606 |
| TSK-0582 | REQ-2608, REQ-2612, REQ-2632, REQ-2634 |
| TSK-0583 | REQ-2614, REQ-2616, REQ-2618, REQ-2620, REQ-2622, REQ-2624, REQ-2626, REQ-2644 |
| TSK-0584 | REQ-1644, REQ-1646, REQ-2628 |
| TSK-0585 | REQ-2702 |
| TSK-0586 | REQ-2704, REQ-2706, REQ-2716 |
| TSK-0587 | REQ-2718, REQ-2720, REQ-2722 |
| TSK-0588 | REQ-2708, REQ-2710, REQ-2712, REQ-2728 |
| TSK-0589 | REQ-2700 |
| TSK-0590 | REQ-2714, REQ-2726 |
| TSK-0591 | REQ-1686, REQ-1688, REQ-1690 |
| TSK-0592 | REQ-1692 |
| TSK-0593 | REQ-1694, REQ-1696, REQ-2630 |
| TSK-0594 | REQ-1648, REQ-1650, REQ-1652, REQ-1654, REQ-1656 |
| TSK-0595 | REQ-2638 |

The smallest set of tasks that would test the decision is TSK-0580, TSK-0582, TSK-0583, TSK-0584 and TSK-0585. Together they show whether one module holds every model connection, whether her material is cleaned and tiered before it leaves, and whether a reservation keeps concurrent calls inside a limit, which are the three failures the decision's premortem and its second threat name.

## Not covered

- REQ-2506 isn't one ADR-0100 addresses: ADR-0010 does, and EPC-0010 keeps it under Not covered. TSK-0590's third criterion is the simulated day through this gateway that EPC-0010 dropped as TSK-0130 on 2026-10-10, and its evidence is what closes REQ-2506 there.
- The owner's hand work in the OpenRouter account, the allowlist and the privacy switches of REQ-2614's second half, the key limit of REQ-2718 and the offline key's limit before each run: they are settings in a third party's account, so this epic ships the checks and the criteria that read them and leaves the setting to the owner.
- REQ-2636, REQ-2640, REQ-2642, REQ-2646, REQ-2724 and REQ-2730: ADR-0100 no longer addresses them, because each was superseded, and the epics realising ADR-0210, ADR-0230, ADR-0350, ADR-0360 and ADR-0460 carry their replacements.
