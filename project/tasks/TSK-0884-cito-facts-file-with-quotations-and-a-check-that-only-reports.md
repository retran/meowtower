---
id: TSK-0884
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5800, REQ-5802, REQ-5806, REQ-5808]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Cito facts file holds each claim with its quotation, and the check only reports

After this task, `content/cito.rules.json` holds the twelve first claims about Cito, each tied to a page and a quotation or marked unconfirmed, and one function, run from the Parent Room or `./meowtower cito-check`, re-reads the pages and writes what it found to the log without touching the file or any rule.

## Acceptance criteria

1. Given `content/cito.rules.json`, when the schema loads it, then it holds 12 entries: ten `confirmed` ones with a URL, a verbatim quotation and the check date 2026-09-28, and two `unconfirmed` ones for the parent's access to the bare-versus-context split and Cito's multiplication sign; given a fixture entry marked `confirmed` that lacks the URL, the quotation or the date, then the schema refuses the file (REQ-5800, REQ-5808). Closed by: a schema test and a content test that counts the entries.
2. Given a fixture server with one page that still holds an entry's quotation and one page that no longer holds the other entry's, when the check runs, then `cito_rule_checked` records `quoteFound` true and false, and the `cito_rules` projection gives the second entry the mark «не подтверждено» and the first none (REQ-5802). Closed by: a check test against local fixture pages.
3. Given a page that times out after 10 s, when the check runs, then the event lists the page as not read, the marks of every entry on it stay as they were, and the run writes one event (REQ-5802, REQ-5806). Closed by: the same test with a page that never answers.
4. Given a run started from the Parent Room route and a run started with `./meowtower cito-check`, when each ends, then `content/cito.rules.json` is byte-identical to its state before the run, the gateway received no request, and each run wrote one `cito_rule_checked` event (REQ-5806). Closed by: a test that hashes the file and counts requests on a gateway in `replay` mode.
5. Given a run that ended 9 minutes ago or one in progress, when the parent presses the button, then the route answers that the check is not available and starts nothing (REQ-5806). Closed by: a route test with a mocked clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `content/cito.rules.json` with the schema of ADR-0290: `id`, `statement` in English, `url`, `quote`, `checkedOn`, `status` and `usedBy`. The ten confirmed entries and their quotations come from RES-4080; copy them as that record states them and add none of your own.

Add one function in `src/engine/cito/check.ts` that fetches each distinct URL with a plain GET, a timeout of 10 s, and no query, cookie or player data, normalises white space and searches each entry's quotation. It reads a PDF with `pdftotext -layout`; I chose this reader, because the school-snapshot parser of ADR-0310 comes after the MVP and must reuse the same tool, so the image installs poppler-utils in this task if it doesn't hold it yet. The function writes one `cito_rule_checked` event with, for each page, whether it was read and a SHA-256 hash of its text, and for each entry whether its quotation was found. It edits no file, rewrites no rule, renders or runs no page and passes no page text to a model.

Add the `cito_rules` projection, the route `POST /api/parent/cito/check`, `GET /api/parent/cito` with the entries, their marks and the pages whose hash changed since the previous check, and the CLI command. The button «Проверить сведения Cito» stays inactive while a run is in progress and for 10 minutes after it. A run must finish within 60 s for the twelve pages.

## Depends on

Nothing. The Parent Room's session and settings come from the epic realising ADR-0030, which is done; the page that carries the button is a minimal panel this task opens, and the epic realising ADR-0180 places it among the Parent Room's panels.

## Evidence

Not yet.

## Left alone

The mark beside report text, which TSK-0897 shows. Updating the file when a page changed: a person does it in a commit, because only a person judges whether a changed page changes a rule, and the running game can't write under `content/`.
