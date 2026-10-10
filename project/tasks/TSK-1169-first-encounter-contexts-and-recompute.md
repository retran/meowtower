---
id: TSK-1169
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-6946, REQ-6956, REQ-7512]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A first encounter is computed from the log at its recorded versions, and a side slot takes a context she has met

After this task, `firstExposure` is computed from the event log and the content files at the versions its events record, a row whose model file can't load reads `version_missing` first, each hold is released once, a library-frame top-up is no side slot, and every probe pair carries a context that the family's choice uses. This settles entries 69 to 76 of ADR-0460.

## Acceptance criteria

1. Given a log and the content files at the versions its events record, when `firstExposure` is computed twice, then the values are equal, and given corrected content at a new version, then the past values are computed again from the log under the versions it records, with the context taken from what the log recorded when the frame or pair was accepted (REQ-7512). Closed by: a recompute test over two content versions.
2. Given a row whose model file can't load, when eligibility is read, then it reads `version_missing` whatever conditions 1 to 9 give; given a show with no active model version, then `expected` is null with condition 8 or 9 as its reason (REQ-7512). Closed by: a unit test over the two cases.
3. Given a probe letter's show, when `first_exposures` is read, then the show marks its subtype, format and context used and its attempt gives no observation (REQ-6946, REQ-6956). Closed by: a projection test over one letter.
4. Given a node first fluent by a tested result, when its hold is read, then it is released once and never returns, even after the node drops below fluent or a context is added; given a block top-up that takes a library frame, then it is no side slot and its new context's show is eligible under REQ-6946's other conditions (REQ-6946). Closed by: a unit test over a release, a drop and a library-frame top-up.
5. Given a probe pair at approval, when the parent confirms it, then `probe_text_approved` records its context from ADR-0410's list; given a new family, then it takes among its template's approved pairs one whose context has been shown on the subtype when one exists, and then the reuse rule of ADR-0430 (REQ-6956). Closed by: a unit test over a template with 3 pairs and one shown context.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 69 to 76 as written. A context is a kind of setting, not a story, so the pair's story stays new to her. Add `context` to `probe_text_approved` and the context control to the probe review screen, with its Russian wording from ADR-0160. ADR-0460 reopens entry 69 with ADR-0430 if more than 1 in 4 families take a pair whose context she has never met on that subtype.

## Depends on

Nothing. The epic realising ADR-0410 owns first encounters, and the epic realising ADR-0430 owns the probe's approval; this task runs on fixture pairs and a fixture model file.

## Evidence

Not yet.

## Left alone

The probe's text approval and review screen beyond the context control, which the epic realising ADR-0430 builds; every rule here waits on the owner's amendment of `CLAUDE.md` to change anything she sees.
