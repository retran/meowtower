---
id: TSK-0974
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6354, REQ-6356]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A disabled template stays disabled after a restart and a rebuild, and every older parent event reads as before

After this task, `content_disabled` and `content_restored` fold into a projection `disabled_content` that the generator and the Director read, `item_excluded` has a version 2 with `source` and an upcaster, and the Parent Room's first screen shows «Отключено: N» with a restore button on each item.

## Acceptance criteria

1. Given a disabled template, when the server restarts and a full recompute runs, then the generator never offers the template; given its restore, then it is offered again (REQ-6354). Closed by: an integration test over 1,000 generated tasks.
2. Given the same for a puzzle, when the bank serves puzzles, then none that `disabled_content` lists is served (REQ-6354). Closed by: an integration test with a stand-in puzzle bank.
3. Given a log with version 1 `item_excluded` events, when it is folded after the upcaster exists, then every projection equals the one built before, each event reads with `source: "parent_room"` and the exclusion applies as it did (REQ-6356). Closed by: a replay test comparing per-projection hashes.
4. Given a task generated in the sandbox, when it is excluded, then `item_excluded` v2 carries `templateId`, `templateVersion` and `paramsHash` in place of `itemId`, and her attempts on that version and hash are excluded (REQ-6356). Closed by: an integration test.
5. Given one disabled item, when the Parent Room's first screen renders, then it shows «Отключено: 1» linking to the list with a restore button, and after the restore it shows no such line. Closed by: a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the payloads of `content_disabled` and `content_restored`, version 1: `kind` (`template` or `puzzle`), `id`, `source` (`parent_room` or `sandbox`) and `echo`. Add `item_excluded` version 2 with its upcaster. Add the projection `disabled_content` and make the generator's fallback list, the Director's reject predicate and the puzzle bank skip every item it lists. Add the line and the list on the Parent Room's first screen; the list is a page of its own and the line is its only alert, because a list the parent must hunt for is a list nobody opens. When a disable leaves a node with no enabled template, the generator treats the node as having no task and the Parent Room lists `node_all_disabled` once.

## Depends on

Nothing. The epics realising ADR-0020, ADR-0040, ADR-0070 and ADR-0180 supply the log catalogue, the generator, the reject predicate and the Parent Room's first screen; until they exist the projection and the upcaster land with a fixture log, and each of those epics adds the one-line read of `disabled_content` in its own module.

## Evidence

Not yet.

## Left alone

Writing the three events from a confirmed action, which TSK-0973 does.
