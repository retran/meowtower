---
id: EPC-0210
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0210
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The game day stays an unseen 04:00 boundary, new forms get streams of their own, only a masked riddle joins what leaves the Mac, and a fact stage lets the player play before the MVP

Realises exactly ADR-0210: the game day and its daily jobs, one adventure a game day, the screens without tasks, the streams of new forms, the four model roles with checked output, the masked parse request and the five kinds of data that leave the Mac, the play key's buckets and the sandbox's bucket on the offline key, the owner of every event type, the one new version of three event types, the scope guard and the Dutch bridge, and the fact stage.

Until the epics realising ADR-0080, ADR-0090, ADR-0100, ADR-0110, ADR-0160, ADR-0180, ADR-0220, ADR-0230, ADR-0280, ADR-0290, ADR-0330 and ADR-0340 exist, the tasks run on fixtures and stand-ins: a fixture line pool, fixture words, fixture fact templates, stand-in callers of the gateway's roles and stand-in screens. Each task names what it leaves to those epics.

## Acceptance criteria

1. A day test replays synthetic logs across 04:00 in two time zones and finds that each of the ten jobs REQ-5008 lists runs once for each game day, and that a zone change takes effect at the next 04:00 of the old zone. Evidence: the day test's report, from TSK-0756.
2. The lint rule on hours fails on a fixture that calls `getHours` in engine code outside `src/engine/day/`, passes on a Parent Room fixture that formats an hour, and passes on the tree. Evidence: the lint verb's output and the rule's fixture test, from TSK-0756.
3. A test asks for a second adventure on a game day that already has one, Session 0 included, and the server refuses to log `adventure_planned`. Evidence: the integration test's report, from TSK-0757.
4. A Playwright test during an adventure, with the task window closed, reaches each of the seven screens REQ-5012 names, finds none of their entries while a task is open, and sees a puzzle offer only after `adventure_completed`. Evidence: the Playwright report, from TSK-0759.
5. A time-projection test finds that time on a screen without tasks counts in the eye count, during an adventure and after the finale, and that a soft stop due there plays at her return to the adventure. Evidence: the projection test's report, from TSK-0760.
6. The screen check passes on a timetable task and a clock-reading task and fails on the same text outside `data-task-content`. Evidence: the Playwright report, from TSK-0760.
7. A search of every player-facing string file finds no hour of the day's end, and in a 60-day simulation the first scene of each new game day but the first opens with `story.day_turn`, gaps included. Evidence: the string check's output and the simulation's report, from TSK-0758.
8. A 60-day simulation finds daily quests on every game day with play after they first appear, and the route choice beside them and never in their place. Evidence: the simulation's report, from TSK-0757.
9. A model test feeds attempts with non-empty `forms` and finds the "on her own" estimate identical to one computed without them, with each stream's projection holding them. Evidence: the model test's report, from TSK-0762.
10. A gateway test sends a `ParseRequest` with a target field, a node id and an unmasked «полтора», and the gateway refuses all three before any network call; a recorded test finds `zdr: true` on every parse request. Evidence: the gateway test's report, from TSK-0765.
11. A schema test finds no request class with a field that can hold the school's goal list and no role named for goals. Evidence: the schema test's report, from TSK-0765. The report's treatment of an unconfirmed goal link is under Not covered.
12. The budget-sum check fails when a fixture adds a $0.1 daily bucket to the play key and passes on the real baselines at $58.90. Evidence: the check's report, from TSK-0766.
13. A test in play mode makes sandbox calls and finds the offline key on all of them and no row in the main `llm_log`; at $20 of sandbox spend it finds one `sandbox_budget_spent` notice and fallbacks. Evidence: the gateway test's report, from TSK-0767.
14. The owner check fails on a schema with no owner and on one owned by a draft decision, and the vendor-name search fails on a fixture that names the vendor. Evidence: the checks' fixture tests, from TSK-0763.
15. A replay of stored events through the new upcasters of `attempt_submitted`, `item_shown` and `verdict` gives the same projections as before, and a schema search finds no `estimate_submitted` type. Evidence: the replay test's report and the schema test's report, from TSK-0761.
16. The scope guard fails on `content/i18n/nl.json` and on a `school_snapshot_*` schema, and passes with 30 to 50 `bridge: true` entries in `lexicon.ru.json`; it fails at 51. Evidence: the guard's fixture tests, from TSK-0769 and TSK-0770.
17. A Playwright test finds no bridge word before its `glossary_entry_approved`. Evidence: the Playwright report, from TSK-0770. The share of tasks that carry keywords is REQ-6416's, which ADR-0360's epic measures.
18. With `COMPOSE_FREE` on and no passing run in `verify/parser-eval.json`, text riddles are off, sentence cards play and `./meowtower status` shows `compose_flag_off`. Evidence: the start-up test's report, from TSK-0766. ADR-0210's own wording is "refuses to start"; ADR-0360 amends it to this.
19. A gateway test gives `FRAMING_MODEL`, `PUZZLE_MODEL` and `FREE_PEN_MODEL` an output that fails its schema and the caller gets the plain rung, the bank's text and a closing library scene; a play-mode call to `FRAMING_MODEL` and `PUZZLE_MODEL` is refused on the play key. Evidence: the gateway test's report, from TSK-0764.
20. A simulated day runs «Свободное перо» until the current adventure's bucket is spent, finds its calls charged to that bucket and the book closed by a library scene, and finds no bucket of its own in `verify/baselines.json`. Evidence: the simulated-day test's report, from TSK-0766.
21. ADR-0100's disclosure test finds the five kinds of REQ-5042 named on the Parent Room's page. Evidence: the disclosure test's report, from TSK-0765.
22. A test calls a sandbox model route with no PIN set and again with the gateway off, and gets `409 sandbox_models_unavailable` both times; from the iPad, the sandbox's loopback address refuses the connection while no PIN is set. Evidence: the integration test's report and the person's judgement at stage acceptance, from TSK-0768.
23. A fact-stage test asks for a second set on the same game day and gets none, and a first set on the next game day. Evidence: the fact-stage test's report, from TSK-0771.
24. Every requirement ADR-0210 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the sum of the play key's daily buckets against $60 over 31 days, which TSK-0766's check reports as $58.90, and the count of event types with no owner, which TSK-0763's check reports and which must stay at zero.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0756 One module turns a time into a game day, a lint rule bars hour reads elsewhere, and every daily job runs once per game day
      closes: REQ-5000, REQ-5008, REQ-5010
      depends: none
- [ ] T-002 [P] TSK-0757 The server plans one adventure a game day, and daily quests and rewards come on every game day she plays
      closes: REQ-5004, REQ-5018, REQ-5020
      depends: TSK-0756 - it supplies `gameDayOf` and the daily job runner.
- [ ] T-003 [P] TSK-0758 The story tells the change of day as the Tower re-knitting itself, and no string she can reach names the hour
      closes: REQ-5002, REQ-5006
      depends: TSK-0756 - it supplies the game-day index that decides the first adventure of a day.
- [ ] T-004 [P] TSK-0759 The seven screens without tasks open whenever the task window is closed, and a new puzzle appears only after the finale
      closes: REQ-5012, REQ-5014
      depends: TSK-0756 - the guard on `puzzle_offered` compares game days.
- [ ] T-005 [P] TSK-0760 Time on the screens without tasks counts for the eyes, and the clock check skips a task's own content
      closes: REQ-5016, REQ-5022
      depends: none
- [ ] T-006 [P] TSK-0761 `item_shown`, `attempt_submitted` and `verdict` each get one new version for the whole addendum, and each fact has one record
      closes: REQ-5066, REQ-5072
      depends: none
- [ ] T-007 [P] TSK-0762 Every new form writes a stream of its own, and no stream enters "on her own" until a model version admits it
      closes: REQ-5024, REQ-5026, REQ-5028
      depends: TSK-0761 - it supplies the `forms` field.
- [ ] T-008 [P] TSK-0763 Every event schema names an approved owner, no code names the school's vendor, and the parent's acts have owned types
      closes: REQ-5062, REQ-5064, REQ-5074
      depends: none
- [ ] T-009 [P] TSK-0764 `PARSE_MODEL`, `FRAMING_MODEL`, `PUZZLE_MODEL` and `FREE_PEN_MODEL` run as roles of their own, and the gateway checks each output before the game uses it
      closes: REQ-5030, REQ-5032, REQ-5034
      depends: none
- [ ] T-010 [P] TSK-0765 A parse request carries only a masked riddle, five kinds of data leave the Mac, and the school's goal list never does
      closes: REQ-5036, REQ-5038, REQ-5040, REQ-5042, REQ-5044, REQ-5058
      depends: TSK-0764 - it supplies the `PARSE_MODEL` role and the request class table.
- [ ] T-011 [P] TSK-0766 The play key's daily buckets sum below $60, the parse bucket falls back to sentence cards, and «Свободное перо» spends from the adventure's bucket
      closes: REQ-5046, REQ-5048, REQ-5054, REQ-5056, REQ-5096
      depends: TSK-0764 - it supplies the roles whose calls the buckets charge.
- [ ] T-012 [P] TSK-0767 A sandbox call charges the offline key under a $20 monthly bucket, and never the play key
      closes: REQ-5050, REQ-5052
      depends: TSK-0764 - it supplies the gateway's role table and the offline key's rules.
- [ ] T-013 [P] TSK-0768 The sandbox's model routes answer 409 until the gateway and the PIN exist, and its pages are served only on the loopback listener until then
      closes: REQ-5094, REQ-5098
      depends: none
- [ ] T-014 [P] TSK-0769 The scope guard fails on deferred items and Dutch files, and the string check lets in only the Dutch the parent approved
      closes: REQ-5078, REQ-5080
      depends: TSK-0760 - it supplies the `data-task-content` mark the string check reads.
- [ ] T-015 [P] TSK-0770 The Dutch word bridge holds 30 to 50 keywords, and a word shows only after the parent approves it
      closes: REQ-5082, REQ-5086
      depends: TSK-0762 - it supplies the `bridge` stream; TSK-0763 - it supplies the owner field every new schema declares.
- [ ] T-016 [P] TSK-0771 The fact stage offers one set of fact tasks a game day on the stage 0.1 templates, with no model call
      closes: REQ-5088
      depends: TSK-0756 - it supplies the game-day index that limits the set.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0756, TSK-0760, TSK-0761, TSK-0763, TSK-0764 and TSK-0768.
- After TSK-0756: TSK-0757, TSK-0758, TSK-0759 and TSK-0771.
- After TSK-0761: TSK-0762.
- After TSK-0764: TSK-0765, TSK-0766 and TSK-0767.
- After TSK-0760: TSK-0769.
- After TSK-0762 and TSK-0763: TSK-0770.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0756 | REQ-5000, REQ-5008, REQ-5010 |
| TSK-0757 | REQ-5004, REQ-5018, REQ-5020 |
| TSK-0758 | REQ-5002, REQ-5006 |
| TSK-0759 | REQ-5012, REQ-5014 |
| TSK-0760 | REQ-5016, REQ-5022 |
| TSK-0761 | REQ-5066, REQ-5072 |
| TSK-0762 | REQ-5024, REQ-5026, REQ-5028 |
| TSK-0763 | REQ-5062, REQ-5064, REQ-5074 |
| TSK-0764 | REQ-5030, REQ-5032, REQ-5034 |
| TSK-0765 | REQ-5036, REQ-5038, REQ-5040, REQ-5042, REQ-5044, REQ-5058 |
| TSK-0766 | REQ-5046, REQ-5048, REQ-5054, REQ-5056, REQ-5096 |
| TSK-0767 | REQ-5050, REQ-5052 |
| TSK-0768 | REQ-5094, REQ-5098 |
| TSK-0769 | REQ-5078, REQ-5080 |
| TSK-0770 | REQ-5082, REQ-5086 |
| TSK-0771 | REQ-5088 |

The smallest set of tasks that would test the decision is TSK-0756, TSK-0761, TSK-0765 and TSK-0766. Together they show whether the day turns on a count and never on an hour, whether the new versions replay the old log unchanged, whether a riddle can leave the Mac only with every number masked, and whether the play key's buckets stay below its limit, which are the failures the decision's premortem names.

## Not covered

- REQ-5060: a link between a school goal and a node taking effect only after the parent confirms it, because the catalogue of links, the confirmation and `school_goal_mapped` belong to ADR-0290, whose epic builds them; TSK-0765 guarantees that no request class can carry the goal list, and the epic realising ADR-0290 adds the test that an unconfirmed link changes nothing the game or the report shows.
- REQ-5068 and REQ-5070: what `hint_shown` and `thread_spent` record under the hint ladder, because ADR-0220 defines both payloads' new versions and the ladder that writes them; the ledger task of the epic realising ADR-0220 holds the tests that show both, and no task closes them because ADR-0220 doesn't address them, so a closing task there would be a coverage finding; they stay open in the requirements until a record that addresses them is closed.
- REQ-5076: the first version holding every part of the MVP contents list, because it is a judgement the owner makes at the stage 0.3 acceptance, after every item is built, which no task of this epic can bring about; TSK-0769 gives the scope guard the new list's traces.
- REQ-5090: the build taking the addendum's items in the order of the decision, because the owner judges the order at each stage's acceptance and the order is the plan's order of epics, not a change to the code.
- REQ-5092: the parent's sandbox being available from stage 0.1 with the first templates, because the sandbox itself is ADR-0340's and the owner judges it at the stage 0.1 acceptance; TSK-0767 and TSK-0768 give it its key, its cap and its guard.
- ADR-0210's criterion 21, the sandbox test that finds `sandbox_action_applied` only in the sandbox's own file with one main-log event carrying `source: "sandbox"` for each confirmed action: the sandbox's actions belong to ADR-0340, whose epic runs that test; TSK-0761 holds the schema half.
