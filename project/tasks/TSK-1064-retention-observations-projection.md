---
id: TSK-1064
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6826, REQ-6828, REQ-6830, REQ-6832, REQ-6834, REQ-6836, REQ-6874]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The projection `retention_observations` finds every attempt that tests a node after a gap

After this task, a projection lists each retention observation of every node with its gap computed from the log at read time and its verdict, so the report and the profile read one definition of "she still knows it".

## Acceptance criteria

1. Given first attempts shown 20 and 21 game days after a node's latest meeting, when the projection runs, then the 20-day attempt is no observation and the 21-day one is, provided it is graded, unassisted, not dropped, shows no new form and was shown for a block, probe, review, lesson recheck or retention check; and only `clean` is right, so a `partial` answer is a wrong observation (REQ-6826, REQ-6834). Closed by: a projection test.
2. Given a mental arithmetic task, a control fact, a Volley row and a second attempt on a node, when the latest meeting is found, then each counts as a meeting, and none of the four supplies an observation (REQ-6826, REQ-6828). Closed by: a projection test.
3. Given a `parent_tag_added` or a matching `facts_trained_marked` between the latest meeting and the show, and, in a second fixture, a `solution_shown`, `explanation_shown` or `hint_shown` on a direct prerequisite under the graph version active at the attempt, when the projection runs, then the attempt is no observation in either (REQ-6830, REQ-6832). Closed by: two projection tests.
4. Given a retention check on which she opened the hint ladder, when the projection runs, then the attempt is a wrong observation (REQ-6874). Closed by: a projection test.
5. Given an answer queued offline on another device that lands in the log after a show and changes the latest meeting, when the projection is recomputed, then the gap is the one the full log gives, and a strict-schema test refuses `daysSinceLastExposure` on `item_shown` (REQ-6836). Closed by: a recompute test and the schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection `retention_observations`. A meeting is any `item_shown` or `compose_shown` naming the node, whatever its subtype, purpose or form. The projection computes the gap whenever it runs, because a stored gap could disagree with the two logged dates it is made of; the audit RES-4220 asked for lives in the check's `why` field, which TSK-1066 writes. The profile's retention bar reads this projection (REQ-6826, REQ-6834 in ADR-0390).

## Depends on

Nothing in this epic.

The epic realising ADR-0060 supplies the drop rule, and the epic realising ADR-0180 supplies lesson marks and `facts_trained_marked`; fixtures stand in.

## Evidence

Not yet.

## Left alone

The planned check, the hold and the series, which TSK-1066 and later tasks build; natural observations exist without any of them.
