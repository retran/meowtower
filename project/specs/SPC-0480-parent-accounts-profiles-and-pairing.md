---
id: SPC-0480
artifact: spec
status: live
revised: 2026-11-09
states: [REQ-8500, REQ-8502, REQ-8504, REQ-8508, REQ-8512, REQ-8514, REQ-8516, REQ-8518]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Parent accounts, profiles and the pairing of a child's device

## Scope

This document covers the parent's account, the profiles it owns, sign-in, and how a child's device opens a profile. SPC-0470 states the schemas that hold a profile's data, and SPC-0010 states the listeners and the PIN.

## Boundary

Four tables in the schema `acct`, apart from every profile's: `accounts`, `profiles`, `sign_in_codes` and `account_sessions`. The routes under `/api/account/` need no paired device. A parent asks for a code, signs in with it (a cookie holds the session, kept as a hash and valid while used within 30 days), lists her profiles and adds one, which creates a schema with the game's tables. A profile of another account answers 404. The routes sign a parent in with an email and a six-digit code, list her profiles, and open the Parent Room of one. A child's device holds a device cookie for one profile.

## Behaviour

Every child has a profile of her own, owned by one parent account (REQ-8500). An account is an email address the parent proved by entering a code sent to it (REQ-8502). A signed-in parent reaches the Parent Room of each profile her account owns and of no other (REQ-8504).

A child's device opens one profile through a pairing code that the profile's Parent Room issued (REQ-8508). A signed-in parent asks `POST /api/account/profiles/<id>/pair-code`, which issues the profile's own code and records in `device_codes` which profile it belongs to; the device that enters it receives the cookie `meowtower_device=<profile id>.<token>`, and the cookie of the first profile keeps its bare token. A request goes to the app of the profile its cookie names, so a device reaches that profile and no other, and a prefix naming another profile finds no such token. A child holds no email, password or login (REQ-8512). The model spend of the profiles of one account counts against a monthly budget of that account alone (REQ-8514): a profile's gateway adds to its own spend what the other profiles of its account logged since the start of the month and what their calls that are still running have reserved, and refuses a call whose worst case does not fit in the rest of the account's limit. The game records the spend of each account and of each of its profiles by month, in the `llm_log` of each profile, and `GET /api/account/spend` gives the signed-in account its total and the total of each profile (REQ-8516). The parent sets her account's monthly budget with `PUT /api/account/budget`, up to the limit of the play key (REQ-8518).

The first profile, the game played before accounts, belongs to no account until `./meowtower claim <email> [label]` gives it to one. The command runs on the Mac, so only a person at the Mac can take it; it makes the account where the address has none, leaves the address to be verified at the first sign-in, and refuses a profile that another address already holds. The claimed profile then appears in the list, takes pairing codes and counts in its account's budget, and its devices keep the app that already runs it.

The account screen at `/account` carries all of this: a form for the email and one for the code, the children of the account with a button that shows a pairing code for each, a field to add a child, the month's spend and a field for the budget, and sign-out; its text is in the three languages. Until a mail provider is set up, `./meowtower code` prints the newest message the game "sent", and `./meowtower profiles` lists the accounts and their children.

## Failure paths

A wrong code counts, and after five wrong attempts at one address the server refuses it for 15 minutes. An expired code, a code for another address and a code used before are refused alike. A device cookie of one profile gets a 401 for the routes of another.

## Questions

### What the part is for

It lets one parent own several children's games and keeps each child's data apart.

### What it depends on

SPC-0470 for the schemas, SPC-0010 for the listeners, and SPC-0100 for the budget.

### What depends on it

The sign-in and profile screens, and the sandbox of SPC-0340, which opens one profile at a time.
