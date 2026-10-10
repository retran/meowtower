---
id: EPC-0330
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0330
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The story stays hers through starters that insert, two routes, a schedule of new systems and a measured interest

Realises exactly ADR-0330: the two routes and the choice between them, the schedule that opens one new system a day, the unassisted days before guiding threads open, the starters that insert and never send, the origin of each send and the consequence that answers her own words, the scene without tasks and the known character, the return-phrase check on every first scene, the do-not-use list with its one regeneration, the decks, the opening similarity and the weekly sample, the refusal and name rules, the screens she owns, the free pen, the Interest section with its signal, and the 60-day acceptance run.

Until the epics realising ADR-0070, ADR-0090, ADR-0110, ADR-0140, ADR-0180, ADR-0210 and ADR-0230 exist, the tasks run on the stand-ins their text names: a fixture `planDay`, a stub Master and judge, a fixture bucket and soft-stop point and a stand-in Parent Room page. Each task names what it leaves to those epics. The specification SPC-0330 states the rules as ADR-0360 amended them, and the tasks follow it.

## Acceptance criteria

1. The 60-day simulation of ADR-0190's group 3 shows, in every adventure, at least 2 free-action points with one not tied to a trial, and at least 4 and 3 on a completed 3-floor adventure; one interlude; a known character in a scene order; systems opening on the days the schedule gives; starters that only insert; no task, score or knowledge-model event in the free pen; first scenes free of the listed return phrases; the signal rising on the profile whose own words fall 40 % while its unchanged starters rise and staying down on the others; and no whitelisted sequence in a do-not-use list. Evidence: the simulation group's report, from TSK-0963.
2. A route test over 90 simulated days finds both routes of every adventure keeping the three-day window and the overdue rule with equal planned graded slots, differing in a floor on every day a swap keeps the window, and «Дальше» taking route A on a tie. Evidence: the route test's report, from TSK-0950 and TSK-0951.
3. A replay test finds the display order of the doors varying with the seed, with route A on each side on between 40 % and 60 % of 100 days. Evidence: the replay test's report, from TSK-0951.
4. A packet test before day 2 of play finds no thread count, hint route or explanation offer and finds the short solution after `partial` and `alt`; a ledger test finds no `thread_granted` before the unlock for threads except a clean row's, and 3 threads on day 2. Evidence: the packet and ledger tests' reports, from TSK-0949.
5. A component test presses 1, 2 and 3 on an empty field and on a field with text and taps each chip; each insertion leaves the field unsent, and a key on a field with text types the digit. Evidence: the component test's report, from TSK-0952.
6. An origin test sends each starter unchanged, edited and replaced and finds `origin` and `ownWords` computed on the server, whatever the client sends. Evidence: the origin test's report, from TSK-0953.
7. A planner test gives a plan that leaves a `player_action` fact of the previous adventure unechoed, and the service rejects it, retries and logs `consequence_missed`. Evidence: the planner test's report, from TSK-0953.
8. A static check fails the build when a reply schema admits `choices` outside `route_choice` and `name_suggest`, when a ritual entry has a time or date field, or when a story log route imports the gateway. Evidence: the static checks' output, from TSK-0952 and TSK-0959.
9. A freshness test feeds 14 days of scenes that repeat a sequence 4 times; the sequence appears in the next order's list, a running joke and her names never do, a drafted scene that repeats it is regenerated once, and a free-text reply isn't. Evidence: the freshness test's report, from TSK-0956.
10. A pen test runs the pen across the soft-stop point and across an empty bucket; each closes through a library scene with no extension, and the pen can't spend below the reservation for an unfinished adventure. Evidence: the pen test's report, from TSK-0961.
11. The parent reads a week of the dialogue book with its sample scenes at the stage 0.3 acceptance and finds her own words answered in a later scene, one strange starter in each scene, refusals only for safety each with a way on, and no line that misses her; the parent also judges the memo's checklist. Evidence: the parent's judgement, from TSK-0952, TSK-0953, TSK-0958 and TSK-0960, because a program can't read whether a scene answers her.
12. A content test runs the do-not-use rule over every line of the canon's recurring cast and familiars as though each were used 4 times in 14 days and fails on any line it would strike that the canon hasn't tagged `catchphrase`. Evidence: the content test's report, from TSK-0956.
13. Every requirement ADR-0330 addresses lands in at least one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the share of days on which route B differs from A in order only, which verify counts from `route_offered` in TSK-0950 and which RES-4120 expects at about two days in three, and the share of free-action points she passes with «Дальше» and no send in the simulation of TSK-0963. ADR-0330 reverses the 10-minute story cap if the weeks in which the signal rose show a task-window share at least 5 points above the other weeks, and TSK-0962 is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0948 Systems open by days of play, and every route of a closed system answers 404
      closes: REQ-6244, REQ-6246, REQ-6252
      depends: none
- [ ] T-002 TSK-0949 Every attempt is unassisted until guiding threads open on day 2
      closes: REQ-6243, REQ-6245, REQ-6248, REQ-6250
      depends: TSK-0948 - it supplies `systems_open`, which the packet builder and the ledger read.
- [ ] T-003 [P] TSK-0950 `planDay` returns two routes that keep the three-day window and the planned graded slots
      closes: REQ-6236, REQ-6238
      depends: none
- [ ] T-004 TSK-0951 A story scene offers the two routes, and «Дальше» takes the route of higher total value
      closes: REQ-6234, REQ-6240
      depends: TSK-0950 - it returns the two routes the scene offers.; TSK-0952 - it fixes the reply schema so `choices` is admitted on `route_choice` only.
- [ ] T-005 [P] TSK-0952 Starters insert into the field and never send, and options that send exist only where the plot offers a choice
      closes: REQ-6210, REQ-6212, REQ-6214, REQ-6218
      depends: none
- [ ] T-006 TSK-0953 The server computes the origin of each send, stores it as a story fact, and the planner must answer her own words in a later scene
      closes: REQ-6202, REQ-6216
      depends: TSK-0952 - the scene record holds the stored starters the origin is computed against.
- [ ] T-007 [P] TSK-0954 Every adventure plays a scene without tasks and brings in a character she has met
      closes: REQ-6204, REQ-6266
      depends: none; TSK-0957 is not blocking, because the interlude's library can use its deal function once it lands.
- [ ] T-008 [P] TSK-0955 No line of an adventure's first scene misses her, waits for her or asks where she was
      closes: REQ-6232, REQ-6233
      depends: none
- [ ] T-009 [P] TSK-0956 A phrase the Master repeats joins a do-not-use list, and the whitelist keeps jokes, catchphrases and her names out of it
      closes: REQ-6254, REQ-6256, REQ-6264
      depends: none
- [ ] T-010 TSK-0957 Openings, finales and temperaments come from dealt decks, each opening is scored with no model call, and the parent reads a weekly sample
      closes: REQ-6258, REQ-6260, REQ-6262
      depends: TSK-0956 - it supplies the lemma table and the lemma counting the similarity score reads.
- [ ] T-011 [P] TSK-0958 The Master refuses a story action only for safety, keeps the trial with a "yes, and", and a refused name says which limit it broke
      closes: REQ-6278, REQ-6279, REQ-6280, REQ-6282
      depends: none
- [ ] T-012 [P] TSK-0959 She rereads any chapter, marks favourites and finds hidden details, and rituals follow game events only
      closes: REQ-6268, REQ-6270, REQ-6272, REQ-6274, REQ-6276
      depends: none
- [ ] T-013 TSK-0960 "Show" cards reach only the Parent Room, the story book prints, and the memo holds a first-week checklist
      closes: REQ-6242, REQ-6284, REQ-6286
      depends: TSK-0959 - the story book shows the favourites it marks, and a card is made from a scene in the story log.
- [ ] T-014 TSK-0961 «Свободное перо» writes with the Master outside the task window and spends only what the adventure's bucket left
      closes: REQ-6221, REQ-6222, REQ-6224, REQ-6226, REQ-6228, REQ-6230
      depends: TSK-0948 - the pen opens on day 8 of the schedule and answers 404 until then.
- [ ] T-015 TSK-0962 The report's summary shows an Interest section, the parent marks each day, and a signal says when the story is stopping being hers
      closes: REQ-6064, REQ-6206, REQ-6288, REQ-6290, REQ-6292, REQ-6294
      depends: TSK-0953 - `origin` and `ownWords` are the figures the section and the signal read.; TSK-0956 - `text_freshness_scored` carries the repetitiveness figure.; TSK-0957, TSK-0959, TSK-0960 and TSK-0961 are not blocking, because the section shows zero or no figure for what doesn't exist yet.
- [ ] T-016 TSK-0963 A 60-day simulation shows the story rules hold and the log holds the 14 event types
      closes: REQ-6296, REQ-6298
      depends: TSK-0948 to TSK-0962 - the run exercises every part, and a check on a part that doesn't exist yet fails.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0948, TSK-0950, TSK-0952, TSK-0954, TSK-0955, TSK-0956, TSK-0958 and TSK-0959.
- After TSK-0948: TSK-0949 and TSK-0961.
- After TSK-0950 and TSK-0952: TSK-0951.
- After TSK-0952: TSK-0953.
- After TSK-0956: TSK-0957.
- After TSK-0959: TSK-0960.
- After TSK-0953 and TSK-0956: TSK-0962.
- After TSK-0948 to TSK-0962: TSK-0963.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0948 | REQ-6244, REQ-6246, REQ-6252 |
| TSK-0949 | REQ-6243, REQ-6245, REQ-6248, REQ-6250 |
| TSK-0950 | REQ-6236, REQ-6238 |
| TSK-0951 | REQ-6234, REQ-6240 |
| TSK-0952 | REQ-6210, REQ-6212, REQ-6214, REQ-6218 |
| TSK-0953 | REQ-6202, REQ-6216 |
| TSK-0954 | REQ-6204, REQ-6266 |
| TSK-0955 | REQ-6232, REQ-6233 |
| TSK-0956 | REQ-6254, REQ-6256, REQ-6264 |
| TSK-0957 | REQ-6258, REQ-6260, REQ-6262 |
| TSK-0958 | REQ-6278, REQ-6279, REQ-6280, REQ-6282 |
| TSK-0959 | REQ-6268, REQ-6270, REQ-6272, REQ-6274, REQ-6276 |
| TSK-0960 | REQ-6242, REQ-6284, REQ-6286 |
| TSK-0961 | REQ-6221, REQ-6222, REQ-6224, REQ-6226, REQ-6228, REQ-6230 |
| TSK-0962 | REQ-6064, REQ-6206, REQ-6288, REQ-6290, REQ-6292, REQ-6294 |
| TSK-0963 | REQ-6296, REQ-6298 |

The smallest set of tasks that would test the decision is TSK-0952, TSK-0953, TSK-0956, TSK-0962 and TSK-0963. Together they show whether starters insert and the server computes her origin, whether the Master's repeats are counted and her jokes kept, whether the signal rises on the synthetic profile and whether the whole run holds, which are the three failures the decision's premortem names: a child who learned to press «Дальше», a familiar's greeting struck from the list, and routes that differ only in order.

## Not covered

No requirement ADR-0330 addresses is deferred. What this epic leaves to other records:

- REQ-6200, REQ-6208 and REQ-6220: superseded by REQ-6438, REQ-6436 and REQ-6434, which ADR-0360 addresses; the epic realising ADR-0360 closes them, and these tasks build the behaviour SPC-0330 already states for them.
- REQ-5268, the list of points where the free-text field opens: ADR-0230 owns it, and TSK-0952 opens the field on a stand-in list until that epic exists.
- The words of the starters, interludes, decks, return phrases, rituals, hidden details, the memo's checklist and the refusal lines, and the canon's `cast`, `catchphrase` and `hidden_detail` tags: the owner's content, which the parent judges, and until each exists its part plays nothing.
