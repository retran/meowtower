---
id: TSK-1170
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-6664, REQ-7110, REQ-7120, REQ-7122, REQ-7128, REQ-7150]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A probe template names its family, every Dutch text passes its checks and the player's word cards reach the source question

After this task, a template takes part in the probe only through `probeFamily`, the Cito word check covers the probe's schemas and logged values, the Dutch source question and labels pass the checks that apply to them before the parent's review, the player can tap a marked word in any Dutch presentation, and a template at its target gets no candidates. This settles entries 53, 77, 78, 80 and 82 of ADR-0460.

## Acceptance criteria

1. Given a template with a field named `probe` or a `probeFamily` that names no family, when the schema runs, then it refuses the template (REQ-6664). Closed by: two schema tests.
2. Given the schemas of the probe's events and the `probe` and `forms` values of `item_shown`, when the Cito word check runs in `src/shared/events.ts`, then it finds «Cito» in any case as a whole word and fails, and given `cito_rule_checked` and the other parent-only schemas, then it leaves them out (REQ-7110). Closed by: a fixture test over one probe schema and one parent-only schema.
3. Given a Dutch probe pair, when it is built, then its source question passes steps 2, 3 and 5 and enters the approval hash, its labels pass steps 3 and 5, and its text enters the parent's review only after the offline language-check role and the Dutch forbidden-word check have passed it (REQ-7120, REQ-7128). Closed by: a pipeline test over a passing pair and a pair with a forbidden Dutch word.
4. Given a Dutch text the parent hasn't approved, when a probe task is built, then the player is shown none of it (REQ-7122). Closed by: an integration test over an approved and an unapproved pair.
5. Given a Dutch presentation, `nl_source` included, when the player taps a marked word of the source question or of a label, then its word card opens, and marks stay within the pair's ceiling of 8 (REQ-7150). Closed by: a Playwright test over a source question word and a label word.
6. Given a template with 4 or more approved pairs, when the run fills candidates, then it fills none; given a shortfall of 3, then it fills up to the larger of 5 and one and a half times the shortfall rounded up, which is 5. Closed by: a unit test over both templates.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 53, 77, 78, 80 and 82 as written. The schema rule of entry 77 replaces ADR-0380's "template field `probe`" so one field states one fact. The Cito check leaves out the parent-only schemas, because the Cito panel's own events exist to name Cito to the parent. Every entry here stays conditional on the owner's amendment of `CLAUDE.md`, so nothing reaches her screen before it.

## Depends on

Nothing. The epic realising ADR-0430 owns the probe's pipeline and review screen, and the epic realising ADR-0290 owns the Cito check; this task runs on fixture pairs and templates.

## Evidence

Not yet.

## Left alone

The Dutch texts themselves and the keywords' approval, which the parent owns, and the schedule of letters, which TSK-1171 builds.
