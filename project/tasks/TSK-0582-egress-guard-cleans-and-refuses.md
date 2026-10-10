---
id: TSK-0582
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2608, REQ-2612, REQ-2632, REQ-2634]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The egress guard replaces names and contact details, refuses topic names and digits, and keeps her text out of picture prompts

After this task, a request with her material leaves the Mac only after the guard replaced the parent's names, school, street, city, phone numbers, addresses and e-mail addresses with neutral labels, and the guard refuses a story request that holds a digit, a node id or a topic name.

## Acceptance criteria

1. Given a `StoryRequest` whose free text holds the family name, the school, a street, a city, a phone number, a postal address and an e-mail address, when it is cleaned, then each comes out as a neutral label such as «[имя]» or «[город]», and a test set of Dutch and Russian phone numbers, Dutch postcodes and e-mail addresses passes (REQ-2612). Closed by: a unit test over the test set.
2. Given the heroine's real name from the Parent Room setting, when a request is cleaned, then she reaches the model only by her game name (REQ-2634). Closed by: a unit test with the real name in the free text, a story memory and a summary.
3. Given a `StoryRequest` whose dynamic parts hold a digit, a node id or a topic name from the skill graph file, when it is sent, then the guard refuses it and the caller falls back; digit runs in her free text come out as «[число]»; the cached canon block and the `readerAge` field are exempt, so a request with `readerAge` set passes the age and her real name arrives as «[имя]» (REQ-2608). Closed by: a unit test with each case and a simulated adventure recorded at the mocked service.
4. Given a picture request, when it is built, then it takes JSON card ids and never a string, and a fixture that passes her text fails (REQ-2632). Closed by: a type test and a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the guard before each send in the gateway of TSK-0580, with the patterns for phones, addresses and e-mail addresses that ADR-0100 left to the specification, tested on the set named in criterion 1. Read the parent's names from the Parent Room settings, and her real name from the setting of REQ-3710, as ADR-0100 states. The order names the creepiness level and the checkpoint by words, since a digit would be refused. A refusal logs `egress_blocked` once for each cause.

## Depends on

- TSK-0580 (blocking): the guard runs inside that gateway.

The epic realising ADR-0050 supplies the list of topic names the guard reads; until it exists the check reads a fixture list of ten names and leaves the real list to that epic. The epic realising ADR-0180 supplies the Parent Room's fields for the names; until then they are keys in the settings.

## Evidence

Not yet.

## Left alone

The wording of the neutral labels in her story, which ADR-0110's Master reads, and the picture pipeline, which ADR-0170 owns.
