---
id: TSK-0596
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1600, REQ-1602, REQ-1608, REQ-1612]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director emits story events with no free strings, and the Master can import neither the maths nor the task engine

After this task, the Director's story events hold only ids and enum values, an import rule keeps `src/server/master/` away from the knowledge model, the selection code and the task engine, the same rule keeps the Director away from the Master's text, and the Director applies only effects from a closed set.

## Acceptance criteria

1. Given the Director's event schemas, when the lint verb runs, then none holds a free string field, and a fixture that adds one fails the rule (REQ-1602). Closed by: the lint verb's output and the rule's fixture test.
2. Given `src/server/master/`, when it imports the knowledge model, the selection code or the task engine, then the import rule reports it, and the same rule reports a Director module that imports the Master's text (REQ-1600, REQ-1602). Closed by: the lint verb's output and a fixture for each direction.
3. Given a Master reply with an effect outside `remember`, `relation`, `running_joke`, `diary_page`, `reward_hint` and `title`, when the Director applies effects, then it applies none of that reply's effects (REQ-1608). Closed by: a unit test.
4. Given the Master's reply schema, when its fields are listed, then none can carry a task statement, and task text comes only from the frames of ADR-0130 (REQ-1612). Closed by: a schema test with a fixture reply that adds a `task` field.
5. Given the code and the content files, when a reviewing agent reads them against REQ-1600, then every decision on what happens, from tasks and outcomes to rest stops and rewards, comes from the Director (REQ-1600). Closed by: a reviewing agent's judgement, because the requirement says what the code decides and no rule lists every decision.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two import rules and the no-free-strings rule beside the existing lint rules, and the closed set of effects with a limit of one `title` a session, a limit I chose because the draft gave no number. The Master service of this epic turns the Director's events into scene orders and applies the effects of each checked reply.

## Depends on

Nothing in this epic. The epics realising ADR-0070, ADR-0090 and ADR-0140 build the Director's events; this task writes the rule over the schemas that exist and the stand-in events of `src/server/standin.ts`.

## Evidence

Not yet.

## Left alone

The order and reply schemas, which TSK-0597 adds, and the checks on a reply, which TSK-0599 adds.
