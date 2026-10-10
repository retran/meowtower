---
id: TSK-0765
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5036, REQ-5038, REQ-5040, REQ-5042, REQ-5044, REQ-5058]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A parse request carries only a masked riddle, five kinds of data leave the Mac, and the school's goal list never does

After this task, the gateway's `ParseRequest` class holds the masked text, the token list and the schema version and nothing else, the egress guard refuses a request whose text still holds a digit or a numeral word as `mask_incomplete`, the Parent Room's page names the five kinds that leave the Mac, and no request class has a field for the school's goal list.

## Acceptance criteria

1. Given a `ParseRequest` with a target field, a node id and the unmasked word «полтора» (one and a half), when each is sent, then the gateway refuses all three before any network call (REQ-5036, REQ-5038). Closed by: a gateway test with three fixture requests.
2. Given a text with a digit run, a decimal, a fraction and a Russian numeral word such as «пять» (five), when it reaches the guard unmasked, then the guard refuses it as `mask_incomplete` and the riddle turns into a card riddle for the same target; given the same text with each number replaced by a token, then it passes (REQ-5036). Closed by: the egress guard's test set of spelled, decimal and fractional numbers.
3. Given recorded parse calls, when the request's options are read, then each carries `zdr: true`, and a start-up check refuses a `PARSE_MODEL` whose provider keeps requests (REQ-5040). Closed by: a recorded test and the start-up check's test.
4. Given the five kinds of data REQ-5042 lets out, when the Parent Room's page is compared with the code's defaults, then it names all five item for item, the masked riddles among them (REQ-5042, REQ-5044). Closed by: ADR-0100's disclosure test, extended to five kinds.
5. Given the schemas of every request class and every role, when they are searched for a field that can hold the school's goal list, then none is found, and no role is named for goals (REQ-5058). Closed by: a schema test over the classes.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the strict `ParseRequest` schema to the gateway: the fixed prompt's hash, the masked text, the token list `n1` to `nm` in text order and the schema version. An unknown field is refused. A number is a digit run, a decimal, a slash fraction or a mixed number in digits, each one token, or a word of the numeral list in `content/numerals.ru.json`, masked as `n1` to `nm`; fraction words and ordinals are masked as `d1` to `dk`, as ADR-0440 orders them. The list includes fractional words such as «полтора». The map from tokens to numbers stays on the Mac in the attempt's own record, and no field of any request class carries it.

Add the guard rule that refuses a `ParseRequest` whose text holds a digit or a numeral word after masking, as `mask_incomplete`, turns that riddle into a card riddle for the same target, as ADR-0360 amends ADR-0210, and reports it once per cause. Extend ADR-0100's disclosure test so the Parent Room's page names five kinds of data.

The masker that produces the masked text, and the paraphrase and the riddle flow, belong to ADR-0230's epic. This task tests the guard with hand-masked fixtures.

## Depends on

- TSK-0764 (blocking): the `PARSE_MODEL` role and the request class table the schema joins.

The epic realising ADR-0290 supplies the goal list and the catalogue that maps goals to nodes on the Mac; this task adds only the guarantee that no request class can carry it.

## Evidence

Not yet.

## Left alone

The masker, the parser's prompt and the riddle flow, which ADR-0230 owns, and the confirmation of a goal link, which ADR-0290 owns.
