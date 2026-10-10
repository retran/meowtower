---
id: TSK-1077
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6910, REQ-6912, REQ-6918, REQ-6920, REQ-6922]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The template schema takes `contexts`, refuses `formats` and any third format, and warns on one context

After this task, the template schema gives a context template a non-empty list of listed contexts, refuses a list of formats or a third format, and the build warns on a template with one context and fails a source task filed under a maths node.

## Acceptance criteria

1. Given a template with `format: "context"`, when the schema validates it, then a missing or empty `contexts` and an id the list doesn't hold are each refused (REQ-6910). Closed by: the schema test, one fixture each.
2. Given a template with a field `formats`, or with a `format` other than `bare` or `context` such as `inverse` or `source`, when the schema validates it, then it is refused, so an inverse problem has to be a subtype or node of its own in the graph (REQ-6918, REQ-6920). Closed by: the schema test, one fixture each.
3. Given a context template that lists exactly one context, when verify runs, then `template_one_context` warns, the build passes and `./meowtower status` shows the count of such templates (REQ-6912). Closed by: the check's fixture test and the status command's output.
4. Given a template with `inputClass: "source"` whose subtype belongs to a maths node, when verify runs, then `source_in_track` fails and names the template; given a maths word problem that quotes one number from a small table and has another `inputClass`, then the check passes (REQ-6922). Closed by: the check's fixture tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend the template schema of ADR-0040 with `contexts` on a template of the context format, and make it refuse `formats` and any `format` value besides `bare` and `context`, so ADR-0290's single `format` stays the one declaration of that fact. Add `template_one_context` and `source_in_track` to group 1 of ADR-0190's verify command. The warning is a count in `./meowtower status` and never fails the build, because some structures admit one honest setting. Give the fixture templates of ADR-0040's epic a `contexts` list so the schema runs on them.

## Depends on

- TSK-1076 (blocking): the schema checks each id against the list.

The epic realising ADR-0040 supplies the template schema and the fixture templates this task extends. The epic realising ADR-0050 supplies the graph, so `source_in_track` runs on fixture nodes until it exists.

## Evidence

Not yet.

## Left alone

Which inverse subtypes the graph holds, which is the graph's content under ADR-0050. This task only closes the way in: an inverse problem can't enter as a format.
