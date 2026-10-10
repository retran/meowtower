---
id: TSK-0890
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5838, REQ-5840, REQ-5842]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent changes the fact threshold as a new version, and facts keep their own minimum time and repeat exemption

After this task, a change to the fact threshold from the Cito panel is a `fact_threshold_set` event that becomes a new threshold version and replays every fact, a fact's minimum time is the motor correction plus 600 ms, and a fact or a control fact can come back inside the repeat window of other tasks.

## Acceptance criteria

1. Given a value of 4 s sent to `PUT /api/parent/fact-threshold`, when the route handles it, then one `fact_threshold_set` event holds the value in ms and the new threshold version, and the `fact_states` rows are recomputed under it; given 1.4 s or 6.1 s, then the reply is `fact_threshold_refused` naming the range 1.5 s to 6 s and nothing is written (REQ-5838). Closed by: a route test and a recompute test.
2. Given the same event and a restart, when the server starts, then the threshold version equals the content file's version joined with the `seq` of the latest `fact_threshold_set` (REQ-5838). Closed by: a start-up test.
3. Given the threshold changed, when a node's fluency is read, then it is unchanged, because node fluency reads the catalogue thresholds (ADR-0290). Closed by: a test that compares a node's fluency before and after.
4. Given the fact `mul:7x100` and a device with a motor correction of 400 ms, when an answer arrives 1 ms faster than 1,000 ms, then it is a rapid guess, and 1 ms slower, then it isn't; the same holds for a control fact (REQ-5840). Closed by: a rapid-guess test with both values.
5. Given a generated task that is not a fact, when the same template and parameters would come again within 30 days or within the next shows of its subtype that number 20 % of the subtype's parameter space, then the item builder refuses it; given a fact or a control fact, then it comes back and logs no `repeat_forced` (REQ-5842). Closed by: a repeat-window test over a 60-day fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `PUT /api/parent/fact-threshold` with `{ ms }` on the Cito panel, the event `fact_threshold_set` with the new value in ms and the threshold version, and the entry in the `thresholds` projection. The fact threshold is a threshold of its own and node fluency keeps reading the catalogue thresholds. I chose the range 1.5 s to 6 s, as ADR-0290 did: below 1.5 s the value nears the fact's minimum time, and above 6 s it would call a counted fact automatic.

Set the minimum time of every fact in `content/facts.yaml` and of every control fact to the motor correction plus 600 ms, because the general floor would give multiplying by 10, 100 or 1000 half the 3 s threshold and call a quick real answer a rapid guess. Exempt every item with a `factId` and every control fact from the repeat window; every other generated task keeps it.

## Depends on

- TSK-0889 (blocking): the facts, their states and the default threshold that a change replaces.

## Evidence

Not yet.

## Left alone

The review schedule, which TSK-0889 builds. The window itself and its numbers, which the epic realising ADR-0070 owns.
