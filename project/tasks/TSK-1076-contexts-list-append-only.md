---
id: TSK-1076
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6902, REQ-6904]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The closed list of contexts only gains entries, and the server refuses a tag it doesn't hold

After this task, `content/contexts.yaml` holds the closed list of contexts, the build fails when a committed tag is removed or changed, and a tag added later never changes the context of a frame already accepted.

## Acceptance criteria

1. Given `content/contexts.yaml`, when the schema test loads it, then every entry has an `id` matching `^[a-z][a-z0-9_]*$`, a one-line English `describe` and a `since` list version, and an entry with an id of another shape or no `since` is refused. Closed by: the schema test.
2. Given a working tree in which an `id` of `git show HEAD:content/contexts.yaml` is missing or its `since` changed, when `contexts_append_only` runs, then it fails and names the id; given a tree that only adds an entry, then it passes (REQ-6902). Closed by: the check's fixture tests, one removal, one rename and one addition.
3. Given a log whose `frame_accepted` for frame F carries the context `motion_boat`, when an entry is added to the list and every projection is rebuilt, then F's context is still `motion_boat` and the log holds no second `frame_accepted` for F (REQ-6904). Closed by: a test over a fixture log.
4. Given a `frame_accepted` that names a tag the list doesn't hold, when the server starts, then it refuses to start with `context_unknown` and names the tag (REQ-6902). Closed by: a start-up test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `content/contexts.yaml` and its schema, drafted from the settings of the seven word-problem structures of RES-0700 and the floors of ADR-0130, each with a `describe` an author model can read, and add the Russian label of each id under `parent.contexts.<id>` in `content/i18n/ru.json`, as ADR-0160 keeps every string. Add `contexts_append_only` to group 1 of ADR-0190's verify command, comparing the working tree with `git show HEAD:content/contexts.yaml`. Add the start-up refusal `context_unknown`. A tag carries no language, so the file holds no per-language text.

The owner reads the drafted list once at the stage acceptance. That reading is a judgement the stage holds, and it closes none of this task's criteria.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The `context` field on `frame_accepted`, which TSK-1078 adds, and the `contexts` field on templates, which TSK-1077 adds. The warning `template_one_context` also waits for TSK-1077.
