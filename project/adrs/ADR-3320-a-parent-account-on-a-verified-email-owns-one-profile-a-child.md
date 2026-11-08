---
id: ADR-3320
artifact: adr
status: approved
revised: 2026-11-08
addresses: [REQ-8500, REQ-8502, REQ-8504, REQ-8508, REQ-8510, REQ-8512]
supersedes: []
concerns: [privacy, cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3320. A parent account on a verified email owns one profile a child, and a child's device opens a profile through a pairing and holds no login

## Decision

A parent account is an email address that its holder proved with a one-time code. An account owns one or more profiles, one a child, and a profile is the schema of ADR-3310 with a label the parent chooses. The owner asked on 2026-11-08 for an account per child on the parent's email with parent access; RES-4319 found that a child under 16 may not hold a login, so the login belongs to the parent and the child holds a profile.

- Two tables in the `public` schema: `accounts` (`id`, `email`, `verified_at`, `created_at`) and `profiles` (`id`, `account_id`, `label`, `schema_name`, `created_at`). The label is the parent's word for the child and is never a name the repository tracks.
- Sign-in has two steps. The parent enters an email; the server sends a six-digit code that lives 10 minutes and is stored as a hash. A wrong code counts, and after 5 wrong attempts at one address the server refuses that address for 15 minutes, as it does for the PIN. A right code verifies the address (the first time it creates the account) and opens an account session, a random token in an `httpOnly` `Secure` `SameSite=Strict` cookie, stored as a hash, valid for 30 days of use and revocable.
- Mail goes through an interface `Mailer` with `send(to, subject, text)`. Two implementations ship. `log` writes the code to the server log and to the `./meowtower code` command, so the game works with no mail account. `smtp` reads a connection URL from the environment and sends through it. The parent chooses a provider and sets the URL; no provider is built in and the repository holds no credential (RES-4319).
- A signed-in parent sees her profiles and opens the Parent Room of each, without the PIN. No account session reaches a profile that another account owns (REQ-8504).
- A child's device pairs as it does now: the Parent Room of a profile issues a pairing code, and the device that enters it receives a device cookie that is tied to that profile and to no other. The device holds no email, password or login (REQ-8508, REQ-8512). The PIN stays so that a parent can open the Parent Room of the profile on that child's device, as REQ-2518 and the lockouts of REQ-2522 have it. The PIN and the lockouts are rows in the profile's schema.
- The existing game becomes the first profile of the first account. The first sign-in on a server that already holds a profile with no owner claims it: the server shows the claim only on the loopback listener `http://localhost:8080`, so only a person at the Mac can take it.
- The model budget stays one key. Each profile's spend is counted from its `llm_log`, the month's total is the sum over all profiles, and the gateway reserves against that sum, so no combination of profiles passes the play-key limit (REQ-8510).
- The player's tier keeps its rule that her free text goes to the model under the player's privacy tier. An account's email is never put in a model request or a log line, only the profile id.

What works once this is accepted: a parent signs in by email, adds a second child, pairs that child's tablet, and reads each child's report apart from the other. What doesn't work yet: email delivery from a hosted provider, which waits on the owner's choice, and sign-in with a passkey.

## Why

RES-4319 shows that the legal frame (GDPR Article 8(1) and UAVG Article 5) puts consent for a child under 16 with the parent, which gives a login to the parent and a profile to the child. The owner's wording, an account on the parent's email, fits that: one email, many children. A one-time code needs no password to leak and no password reset flow, and the `log` mailer keeps the game usable at home with no mail account, where SMTP needs a provider the owner has not chosen.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: device pairing and a PIN, one player | No new surface | It cannot hold a second child, and the owner asked for accounts |
| A login per child on the parent's email address | Matches the words "an account per child" | A child under 16 may not hold a login of her own, and two logins on one address have no clear owner |
| Email and password for the parent | Familiar | A password to store, reset and leak, for a household of one parent |
| Passkeys only | Resists phishing, no mail | It needs a relying-party origin that a `.local` host may not satisfy, which RES-4319 could not verify |

## What it costs

A parent without a mail account reads codes from the server log or the Mac command, which is clumsy but works. Mail through a provider costs money and puts a credential on the Mac, and a provider's price changes. The claim of the first profile at the Mac trusts the loopback listener. A second profile doubles the schema work of every migration and every backup.

## What would reverse it

- The parent cannot sign in with the `log` mailer within one try in ten attempts because the codes expire before she finds them: the code lifetime or the delivery changes.
- The owner decides that children may sign in themselves: the legal frame in RES-4319 is reread before any child login exists.

## Consequences

- ADR-0030's pairing and ADR-0180's PIN gain a profile: the device and the PIN belong to a profile's schema. The sandbox of ADR-0340 and the studio of ADR-3280 open a profile and cannot read another account's.
- `./meowtower` gains `code` (print the pending sign-in codes) and `profiles`. The client gains a sign-in screen and a profile list.
- A later record chooses a mail provider and, when asked, passkeys.

## How I will know it was realised

1. A test signs in with a code, creates an account, adds a second profile, and finds the first profile's events unreadable through the second.
2. A test enters five wrong codes and finds the sixth try refused for 15 minutes, then accepted after it.
3. A test finds that a device paired to one profile gets a 401 for any route of another profile, and that no route accepts an email or password from a device.
4. A test finds the monthly budget refusing a call once the sum over two profiles reaches the limit, though each profile alone is under it.
5. A test finds no email address in any model request, log line or event.
6. A test claims the first profile on the loopback listener and finds the claim refused on any other listener.

## What this does not settle

- Which mail provider sends the codes, and its price.
- Sign-in with a passkey.
- Deleting an account and the erasure of its log, which the append-only rule forbids today.
- A second parent on one account.

## Plan

1. The `accounts` and `profiles` tables, the `Mailer` interface with the `log` implementation, and the code issue and check with their lockout (REQ-8502).
2. The account session, the sign-in routes and the profile list, with the profile resolved from the session on each request (REQ-8500, REQ-8504).
3. Device pairing and the PIN tied to a profile, and the refusal of another profile's routes (REQ-8508, REQ-8512).
4. The claim of the first profile on the loopback listener (REQ-8500).
5. The sum of the budget over profiles in the gateway (REQ-8510).
6. The sign-in and profile screens in three languages, `./meowtower code` and `./meowtower profiles`.
7. The `smtp` mailer, behind the environment setting, once the owner has chosen a provider.
