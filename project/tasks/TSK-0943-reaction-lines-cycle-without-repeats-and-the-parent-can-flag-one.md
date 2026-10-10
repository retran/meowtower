---
id: TSK-0943
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6154]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# No reaction line repeats in an adventure while the bank holds an unshown one, and the parent can flag a line out

After this task, the `reaction` category plays as a shuffled cycle across sessions and adventures with the lines already shown pushed to the end of a new shuffle, the parent can flag a line out of the cycle, and the Parent Room shows one notice when the bank falls below 60.

## Acceptance criteria

1. Given 200 free texts over 20 simulated adventures and a bank of 60 lines, when each adventure's lines are read, then no line shows twice in an adventure while the bank holds a line not yet shown in it, and none shows twice in a session (REQ-6154). Closed by: a simulation test over the log.
2. Given a cycle that ends, when the new shuffle is built, then the lines already shown in the current session or adventure sit at its end, and once every line has shown in the adventure a line may repeat so the 2-second budget holds (REQ-6154). Closed by: a unit test of the shuffle.
3. Given a flag on a line in the dialogue book, when the log is read, then one `reaction_line_flagged` holds `lineId`, and the line comes back in no later cycle (ADR-0320). Closed by: a Parent Room test and a cycle test.
4. Given a bank of 60 after stage 0.3 and two flags, when the Parent Room's notices are listed, then it holds one `reaction_bank_low` that stays until approvals bring the bank back to 60, the server keeps cycling the 58 lines it has, and a second flag raises no second notice (ADR-0320). Closed by: a notice test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Use the shuffled cycle ADR-0110 gives every pool category, with the carry-over rule for lines shown in the current session or adventure, and add `reaction_line_flagged` and the flag in the dialogue book. The notice list of ADR-0180 gains `reaction_bank_low`, which fires once each time the bank falls below 60 after stage 0.3, the parent's whole interruption budget for this decision.

## Depends on

- TSK-0942 (blocking): the path that shows the line and logs `reaction_line_shown`, which the cycle reads.

## Evidence

Not yet.

## Left alone

Growing the bank, which the parent does by approving lines through ADR-0110's candidate queue with its 100-pending ceiling and 30-day expiry.
