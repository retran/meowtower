---
id: TSK-0853
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5660, REQ-5662]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each card's wording sits in `content/plans.ru.json`, written by the template author, with no model call

After this task, `content/plans.ru.json` holds one wording per step of each valid graph and per decoy quantity a template can offer, keyed `<templateId>.<quantityId>`, with placeholders filled by the frame's filler, and no model call at build or play time writes or picks a card.

## Acceptance criteria

1. Given a template, when a card wording or a quantity id is removed in turn, then the build fails each time with `plan_template_incomplete` (REQ-5662). Closed by: a mutation test.
2. Given the file, when ADR-0160's key parity check, `textGate` and the Cyrillic grep run, then they read it like the other content files and pass. Closed by: the three checks' output.
3. Given a `stated` decoy, when its text is read, then it names its quantity without the given's number, and no decoy's text holds a given's number from the problem. Closed by: a property test over 10,000 seeds.
4. Given the module that builds cards, when its imports are read, then it imports no model gateway, and the existing `no-restricted-imports` rule covers `plan.ts` (REQ-5660). Closed by: the lint verb's output.
5. Given a card, when it renders for a problem, then it names the item and the character the problem text names, filled by the filler of ADR-0130. Closed by: a unit test over 100 seeds.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the file, its schema and the card step in the plan builder. I read REQ-5660's "language model" as a model call from the game or its tools, as ADR-0270 does, because the building agent writes every template string and a reading that barred it would bar all template text. A `stated` decoy's wording names its quantity without the given's number, because a card that printed a number from the text would mark itself as a decoy.

## Depends on

- TSK-0852 (blocking): the wordings are keyed by that task's quantity ids.

The epics realising ADR-0130 and ADR-0160 supply the filler, the key parity check and `textGate`; fixture wordings stand in until the real templates exist.

## Evidence

Not yet.

## Left alone

The real templates' wordings, which the epic realising ADR-0040's templates writes with each node.
