---
id: TSK-0568
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0126, REQ-0128]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The battle model holds no health for the heroine, and an agent reads every Tangle line

After this task, no field, event or line can damage the heroine whatever she answers, and a check lists every battle line and scene where a Tangle acts so an agent can judge that none attacks or mocks her.

## Acceptance criteria

1. Given the event schemas, the battle model's types and the reward projection, when they are searched, then no field, event type or line key holds health, damage or a hit on the heroine, and a fixture that adds one makes the check fail (REQ-0126). Closed by: a static check test with its failing fixture.
2. Given 1,000 simulated rooms with every answer sequence a test generates, when the battle model runs, then the heroine's state is identical before and after (REQ-0126). Closed by: a property test.
3. Given the content library, when the check runs, then it lists every battle line and every scene where a Tangle acts, with a count, and the verify step fails when a line is missing from the list (REQ-0128). Closed by: the check's output and a test with a line left out.
4. Given the listed lines, when an agent reads each one, then none attacks or mocks the heroine (REQ-0128). Closed by: an agent's judgement, because the words of a line can't be told from an attack by a string search; the agent's verdict for each line is attached to the pull request.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the static check over the types and schemas, the property test over the battle model's state, and the listing check over the content library, under `npm run verify`. The battle model of this task is the state a battle scene reads; where it doesn't exist yet, the check covers the stand-in scene's types and the content keys that start with the Tangle prefix, and the agent judges the lines the library holds at that time.

## Depends on

The epic realising ADR-0110 supplies the frames that check a Tangle's lines, and the epic realising ADR-0160 supplies the forbidden-word list. The listing and the agent's judgement run without either, on the lines in the library.

## Evidence

Not yet.

## Left alone

The wording of the Tangle's lines, which the Master's frames and the language file's list check, and the battle's spells and rewards, which ADR-0140 owns.
