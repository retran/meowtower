---
id: TSK-1109
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-6664, REQ-7104]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A template joins the probe only by naming its family

After this task, an ordinary template tied to a node takes part in the probe when it carries `probeFamily`, the schema refuses any other way in, and a maths template with the field has to render a bare form.

## Acceptance criteria

1. Given a template with `probeFamily`, when the schema validates it, then it is accepted only when it names a family key and is tied to a node of the skill graph or of the Sources track; given a template with a field named `probe` or a `probeFamily` that names no family, then it is refused (REQ-6664, REQ-7104). Closed by: the schema test, three fixtures.
2. Given a template with `probeFamily` on a maths track that can't render a bare form, when verify runs, then a build check fails and names the template (REQ-7104). Closed by: the check's fixture test.
3. Given the family builder, when it looks for a family's template, then it takes only an ordinary template of a node and never a template made for the probe (REQ-7104). Closed by: a unit test over the fixture templates.
4. Given the fixture templates, then 1 to 2 templates of each of T1 to T4, P, F, M and the Sources track carry `probeFamily`, and the owner approves the list at the stage acceptance (REQ-6664). Closed by: the schema test on the fixtures for the count, and the owner's judgement at the stage acceptance for the choice of constructions, because the choice is the owner's question to answer.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `probeFamily` to ADR-0040's template schema, as ADR-0380 reserved it, and make the schema refuse a field named `probe`, so one field states one fact. Add the build check that a maths template with `probeFamily` renders a bare form, because every maths family needs its `bare` presentation. The building agent sets `probeFamily` on 1 to 2 templates of each group the addendum names, and the owner approves the list.

## Depends on

Nothing within this epic. The epic realising ADR-0040 supplies the template schema and the epic realising ADR-0300 the Sources track's nodes; the task runs on fixtures of both.

## Evidence

Not yet.

## Left alone

The family builder and its presentations, which TSK-1113 builds, and the owner's approval itself, which is a judgement at the stage acceptance.
