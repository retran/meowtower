---
id: TSK-0595
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2638]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Parent Room's page on what leaves the Mac states that outcome events coarsely reflect how well she does

After this task, the Parent Room holds a page from the content files that says what leaves the Mac, states that summary outcome events coarsely reflect how well she does in a domain, and a test compares the providers it names with the defaults in the code.

## Acceptance criteria

1. Given the Parent Room, when the page is opened, then it carries the sentence that summary outcome events coarsely reflect how well she does in a domain (REQ-2638). Closed by: an integration test reading the content key.
2. Given the page and the code's defaults, when the disclosure test runs, then every provider and company the page names matches the defaults for the tiers and the judge, and a fixture that changes one default fails the test. Closed by: the disclosure test and its failing fixture.
3. Given the page's Russian wording, when the parent reads it, then the parent judges that it states the remaining risk after cleaning in words a parent understands. Closed by: the parent's judgement, because only the parent can say it is clear.
4. Given voice input through Safari's speech recognition, when the page is read, then it says that audio goes from the iPad to Apple and never through the server. Closed by: the same integration test over its content key.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the page's text under keys in `content/i18n/ru.json`, built from the route table and `content/providers.json` when the page opens, so the page can't drift from the routes. The page names the four kinds of data the requirement lets out, the age among them, and lists each check on her text with where it runs, as ADR-0350 amends it.

## Depends on

- TSK-0583 (blocking): the disclosure test compares the page with that task's defaults.

The epic realising ADR-0180 draws the page in the Parent Room; this task puts the page on the stand-in Parent Room page.

## Evidence

Not yet.

## Left alone

The scoring screen, the cost line and the pick, which TSK-0593 and ADR-0180's epic own.
