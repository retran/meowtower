---
id: TSK-0926
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6050, REQ-6052, REQ-6054, REQ-6056, REQ-6092]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent maps each school goal to nodes through a catalogue or by hand, and only a confirmed link counts

After this task, `content/school-goal-catalogue.json` ships empty, the mapping panel lists each goal without a confirmed link with a proposal if the catalogue has one and a node picker, and a link changes nothing in any report until the parent confirms it.

## Acceptance criteria

1. Given the shipped catalogue with `source: null` and no entries, when the mapping panel is built for a snapshot with goals, then it proposes no node for any goal (REQ-6050, REQ-6092). Closed by: a panel test.
2. Given a fixture catalogue with an entry for one goal code, when the panel is built, then it shows that proposal for the goal and none for the others, the proposal is computed on each request and logged nowhere, and no report changes until the parent confirms (REQ-6050, REQ-6056). Closed by: a panel test and a test that reads the log and the reports.
3. Given a goal the catalogue lacks, when the parent picks 1 to 5 nodes from the picker grouped by domain and confirms, then `school_snapshot_goal_linked` is appended with `proposedBy: parent`; given 6 nodes or a node the graph lacks, then the route answers `422` and appends nothing (REQ-6052, REQ-6056). Closed by: a route test.
4. Given a confirmed link and a later snapshot that reads the same goal key, when the panel and the reports are built, then the link carries over, and an unlink appends `school_snapshot_goal_unlinked` and returns the goal to the panel (REQ-6056). Closed by: a projection test over two snapshots.
5. Given a goal the parent entered, when it is mapped, then it goes through the same catalogue file, the same key function and the same panel, no model is called, and its confirmation appends `school_goal_mapped` carrying its `goalKey` (REQ-6054). Closed by: a panel test with a fixture entered goal and a gateway that fails on any call.
6. Given a linked goal that the next snapshot rewords, when the panel is built, then its head shows the count of 1 for that subdomain (ADR-0310). Closed by: a panel test with a reworded fixture goal.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `content/school-goal-catalogue.json` with `version`, `source`, the approving record and `entries` from goal code or goal key to one to five nodes, shipped empty because no public catalogue was found (RES-4100). A person approves each version, recorded in the file as `content/thresholds.lock` does for ADR-0180. Add the panel `GET /api/parent/school/goals`, the link route and the unlink route on the loopback listener.

The panel heads its list, for each subdomain, with the number of goal keys that had a confirmed link in the previous snapshot by document date and are absent from the latest, because a reworded goal gets a new key and would otherwise lose its link without a signal. I chose two event types for the two sources, as ADR-0310 did, because a snapshot link must never reach the Director and an entered goal's link must.

## Depends on

- TSK-0916 (blocking): the goal key and the link events.
- TSK-0922 (blocking): `school_values`, which holds the goals the panel lists.

The event `school_goal_mapped` is owned by ADR-0290, and its term in the Director's value belongs to the epic realising that decision. This task adds the event's schema, because it is the change that first writes the event, as ADR-0210's rule on owners requires. The import of the goal list the parent enters, with its event `school_goals_imported`, waits for a task that the epic realising ADR-0290 adds for the stage after the MVP; until then the tests here write fixture entered goals.

## Evidence

Not yet.

## Left alone

The Director's term for an entered goal, which the epic realising ADR-0290 builds. The Cito categories' own mapping file, which ADR-0420 adds to the same panel.
