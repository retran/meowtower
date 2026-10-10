---
id: TSK-1005
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-5822, REQ-5844, REQ-5852, REQ-5854, REQ-5858, REQ-5864, REQ-5896, REQ-6424]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A Volley holds 8 facts at least, names the fact in every miss reply, and a node's priority reads its own Cito block

After this task, a Volley fills with automatic facts as far as they reach and then with facts in «вычисляет» and facts never shown, always holds at least 8 facts, names the fact in every reply to a miss, runs on at most 2 of any 3 consecutive maths floors, and a node's block priority reads the node's own `citoBlock`.

## Acceptance criteria

1. Given the first week of a simulated player, when each Volley is built, then it holds 8 to 10 facts, 3 that aren't automatic or every such fact when fewer than 3 exist, and more than 3 only when too few automatic facts exist to fill the other places (REQ-5844, REQ-6424). Closed by: a Volley test over a simulated first week.
2. Given blocks 1 and 2 with a fact that isn't automatic, when floors are planned, then a Volley takes the place of the mental arithmetic tasks on 2 floors in 3 before the M7 horizon, never on more than 2 of any 3 consecutive maths floors, and the count starts at the first floor on which a Volley could run (REQ-5858). Closed by: a simulation test over 60 floors.
3. Given a miss, when the reply is built, then it holds the fact's placeholder and any joke about the Tangle or the System follows the fact; a reply template without the placeholder fails the build, and the parent judges at the stage 0.3 review that replies speak about the fact and never about her (REQ-5854). Closed by: a content check and the parent's judgement.
4. Given two Volleys in one day that hit the same fact, when the day's count on target is computed, then the fact counts once, and the record never falls after a worse day or a wrong answer (REQ-5852). Closed by: a projection test over three days.
5. Given a node with templates of both formats, when any 30 days of scored tasks are read, then at least half are bare, and the item builder chooses among the subtypes that have a bare template while the bare count doesn't exceed the context count (REQ-5864). Closed by: a simulation test over 30 days.
6. Given a node with a `citoBlock`, when the Director's value is computed, then the block priority is the value of that block and 0 when it is ready or absent (REQ-5822). Closed by: a unit test over the three states.
7. Given the bridge switched off, when a task resumed from its stored view renders, then it shows no bridge word, bridge card or mixed task, keeps the same numbers, and its `item_shown.forms` still holds `bridge` (REQ-5896). Closed by: a resume test with the bridge on and then off.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 62, 65 to 71. The interval cap, REQ-6426's ladder, is another decision's and stays out.

## Depends on

Nothing in this epic. The epic realising ADR-0290 supplies the Volley, the fact states, the Cito blocks and the bridge; until it exists, the tests run on fixture fact states for 60 facts and a fixture node table, and the real blocks are left to that epic.

## Evidence

Not yet.

## Left alone

The Volley's button price, which TSK-1003 changes, and the interval ladder after a good answer, which ADR-0460 owns.
