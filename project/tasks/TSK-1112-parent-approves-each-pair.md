---
id: TSK-1112
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7102, REQ-7122, REQ-7144]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent approves each pair, its marks and its cards, and the game shows only an approved pair

After this task, the Parent Room's screen «Письма: тексты» at `/parent/probe` lets the parent accept, reject or edit each candidate pair with its marks and cards and record whether a native speaker reviewed it, and the server serves a pair only while its current hash is approved.

## Acceptance criteria

1. Given a candidate on the screen, when the parent decides, then the screen shows the Russian and Dutch frames side by side each filled with one set of numbers, the marked words with their cards, the language check's notes and the template and node, and the box «проверено носителем языка» is set before the decision and recorded in `nativeReviewed` on `probe_text_approved` or `probe_text_declined` (REQ-7102). Closed by: a Playwright test.
2. Given the parent edits a mark or a card, when the parent saves, then steps 1 and 2 rerun at once and show in words what the edited text failed, the pair stays a candidate with `probe_edit_failed` on a failure, and it waits for steps 3 to 5 at the next run (REQ-7144). Closed by: a Playwright test and a pipeline test.
3. Given a pair in `content/probe/pairs.json` with no `probe_text_approved` for its current hash, or with a later `probe_text_removed`, when the server picks a text for a letter, then it never shows the pair, and editing an approved pair by hand in the file keeps it from play until a new approval holds the new hash (REQ-7122). Closed by: a show test over a fixture file and a fixture log.
4. Given a later tick of the box on an approved pair, when the parent saves, then a new `probe_text_approved` for the same hash carries `nativeReviewed: true` and the report reads the latest (REQ-7102). Closed by: a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the screen, the settings link and the events `probe_text_approved`, `probe_text_declined` and `probe_text_removed` with the payloads ADR-0430 gives, owned by ADR-0430 and added to ADR-0210's table of owners. Accepting writes the pair's full text and a hash over its frames, labels, marks and cards. The server writes the approved pairs to `data/exports/probe.pairs.json` after each change and the owner commits that copy to `content/probe/pairs.json`. Each pair carries a context from ADR-0410's list, which the parent confirms at approval and `probe_text_approved` records, as ADR-0460 settles. The parent is never needed in real time: the screen raises no notice.

## Depends on

- TSK-1111 (not blocking): the screen reads the candidates file that task writes, and runs on a fixture file until then.

The epic realising ADR-0020 supplies the event catalogue and the epic realising ADR-0410 the list of contexts; the task uses fixtures of both.

## Evidence

Not yet.

## Left alone

The family builder that takes an approved pair, which TSK-1113 builds, and native review itself, which needs a person who reads Dutch natively.
