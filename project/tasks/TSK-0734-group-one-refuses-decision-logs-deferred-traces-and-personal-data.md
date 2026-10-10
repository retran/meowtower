---
id: TSK-0734
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2948]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Group 1 refuses a decision log outside the record, a deferred item's trace and the player's personal data

After this task, verify's group 1 fails when a log of decisions or questions exists outside `project/`, when a trace of an item deferred past the MVP appears in the tree, and when a tracked file holds a value from `personal/player.md` or a snapshot identifier.

## Acceptance criteria

1. Given `docs/decisions.md`, `docs/questions.md` or another tracked file outside `project/` named for a log of decisions or questions, when group 1 runs, then it fails and names the file (REQ-2948). Closed by: an integration test with each fixture file.
2. Given a Dutch locale string file `content/i18n/nl.json` or any `*.nl.*` file, a template with `curriculum: "nl"`, a `checkpoints` or `generated_entities` table in a migration, an Ascent route, a Free Walk route or a push subscription route, when group 1 runs, then it fails as `scope_guard_hit` and names the trace. Closed by: an integration test with one fixture for each trace.
3. Given the glossary's Dutch word as a field of `lexicon.ru.json` beside a Russian term, marked `bridge: true`, when group 1 runs, then the scope guard allows it. Closed by: an integration test.
4. Given `personal/player.md` exists, when a tracked file holds a value it holds, or a string matching `snap-[0-9A-HJKMNP-TV-Z]{26}`, then group 1 fails and names the file and not the value. Closed by: an integration test with a fixture `personal/player.md` and a fixture file.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three checks to group 1 and `verify/scope-guard.json`, which names each trace and the backlog item whose epic builds its part. The first task of that epic removes the trace, so the guard loses a trace only in the change that starts building its part. The Dutch locale trace and the probe's traces leave only after the owner amends the Russian-only rule in `CLAUDE.md`.

Choice this task makes: a log of decisions or questions is a tracked file outside `project/` whose name holds `decision` or `question`, in any case, because the decision lists two paths as examples and gives no rule for the rest. The personal-data check reports the file name and never prints the value, because agents read the report.

The traces of ADR-0190 are listed above; later decisions add their own entries to the file, and each of those epics wires its entry.

## Depends on

- TSK-0724 (blocking): the checks are checks of group 1 in the runner.

## Evidence

Not yet.

## Left alone

The scope list itself, which the owner judges at the stage 0.3 acceptance, and the string check that keeps the player's screens in Russian, which ADR-0160's epic owns. The requirements for what the first version holds and what it defers, REQ-5076 and REQ-5078, which the epic realising ADR-0210 closes.
