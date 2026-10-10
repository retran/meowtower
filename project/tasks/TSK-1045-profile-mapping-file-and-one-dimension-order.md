---
id: TSK-1045
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6736, REQ-6738, REQ-6740, REQ-6766]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A versioned mapping file and a fixed order give every observation to one bar

After this task, `content/profile.dimensions.json` version 1 assigns each stream and template to at most one dimension, its validator fails a bad file, and one function gives each observation to the first bar whose source it meets, so a bar's change can't move another bar.

## Acceptance criteria

1. Given mapping version 1, when the validator runs, then it passes; given a fixture that assigns a stream twice, one that names an unknown dimension or template, and one that assigns a Keeper's puzzle event, when the validator runs on each, then each fails with `profile_mapping_invalid`, and the server refuses to start with the file (REQ-6766). Closed by: a group 1 validator test with the three fixtures and a start-up test.
2. Given an attempt carrying a `factId` that sits on node S6, a retention observation, an eligible first encounter and an attempt on S6 with no `factId`, when each is routed, then the first feeds basic facts alone, the second retention, the third transfer and the fourth finding patterns, and only an observation none of these claims takes the file's assignment (REQ-6740). Closed by: four fixture logs.
3. Given a Guardian problem whose `forms` names `surplus`, when it is routed, then it feeds conceptual understanding alone and gives no model building observation; given an observation that a step claims and the bar's filters reject, then it feeds no bar and doesn't fall through to a later step (REQ-6736, REQ-6740). Closed by: two fixture logs.
4. Given random logs from a seeded generator, when every observation is routed, then none feeds two bars, apart from the language and format bar's bare side, which also reads what computational accuracy reads (REQ-6736). Closed by: a property test over 1,000 seeds.
5. Given a computed profile, when `meta` is read, then it holds the mapping version, and changing the file's version changes `meta` (REQ-6738). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `content/profile.dimensions.json` at version 1 with `built` flags: `false` on transfer and retention, `true` on the other six. Assign every template with `format: "bare"` outside node S6 to computational accuracy and every T template's modelling phase to model building. Assign the streams `estimate`, `compose`, `surplus` and `missing` to conceptual understanding and `plan` to model building. Assign `grouping`, `bridge` and every other stream to no bar; `bridge` reaches only the context side of the language and format bar through that bar's own filter. I chose to leave `grouping` out of every bar because the addendum names it under no dimension. Inside the file a stream wins over a template. The file's schema has no way to name a puzzle event.

Write the validator as a group 1 check of ADR-0190's verify and call it from server start-up, as other content files are. Write the routing function in `src/parent/profile/route.ts` with the order of REQ-6740: code assigns by `factId`, retention, transfer and S6 first, then the file.

## Depends on

- TSK-1044 (blocking): `meta` and the model's bar identifiers come from it.

The epic realising ADR-0210 supplies the streams and `item_shown.forms`; this task's fixtures write them by hand.

## Evidence

Not yet.

## Left alone

What each bar counts as a success, which TSK-1049 to TSK-1053 build, and a stream's own right-or-wrong rule, which its decision owns.
