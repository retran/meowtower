---
id: RES-4319
artifact: research
status: approved
revised: 2026-11-08
elaborates: RES-0010
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An account per child under the parent's email and Postgres for all data cut across the Mac-only rule and ADR-0020, and the surface is small enough to move now

## Summary

The owner asked on 2026-11-08 for an account per child on the parent's email with parent access, and for a full Postgres for all data. The owner added that doing it now is better, because the surface is still small. Both requests cross approved records. A requirement from RES-0010 keeps all game data on the parent's Mac, and ADR-0020 rejected PostgreSQL for the event log. The owner's instruction outranks both, so the design step must amend them; this document does not decide.

The cost of Postgres is wide but mechanical: 16 source files import `better-sqlite3`, every write path is synchronous today and becomes asynchronous, and `VACUUM INTO` has no Postgres twin. Accounts need no particular store, but they do need a profile key on the events, the devices, the PIN, the lockouts and the budget, which are singletons today. A child under 16 must not hold a login of her own. The document covers the coupling, the account options, the legal frame and a build order. It does not cover the choice of mail provider, because that waits on the owner.

## The question

What does the game need so that one parent's email owns several children's games, and so that all data lives in Postgres? Constraints: the rule that all game data stays on the parent's Mac, the rule that other Mac programs read copies only, ADR-0010 (a named volume and `VACUUM INTO` snapshots), ADR-0020, and CLAUDE.md (no child details in tracked files).

Assumptions challenged:

- "Accounts" means a hosted multi-tenant service. Not shown. RES-0010 (line 153) says the game has one player and runs on the parent's Mac, and "per child" can mean several profiles on one household server.
- Postgres is needed for accounts. Not shown. Accounts need an identity and a profile key; the store does not decide either.
- One household is one database. Not shown. ADR-0340 already opens several SQLite files under one role scheme.
- Email login needs a mail service. True for a code or a link. A PIN with a label needs no mail.
- The privacy rules survive a hosted Postgres. They do not. The Mac-only rule and ADR-0010 keep the store on the Mac, and ADR-0100 names the parent's Mac as its security boundary. A Postgres service running on the Mac keeps them.

## Method

Read on 2026-11-08: the working tree (paths inline) and ADR-0010, ADR-0020, ADR-0100, ADR-0340, ADR-3280, RES-0010, RES-1800 and RES-2600. Searched: the source, tests, tools and migrations for SQLite-only constructs, and the record for Postgres, account and tenant. Official documentation for PostgreSQL 18, node-postgres, SQLite WAL, Kysely, GDPR and the UAVG, WebAuthn Level 3 and two mail prices.

Not run: no test, build or `paw` command, so every speed claim is unmeasured. Not obtained: the Autoriteit Persoonsgegevens guidance (HTTP 403 on two pages, 404 on a third), so the child-consent frame rests on the statutes alone; the Testcontainers and Drizzle documentation; whether a `.local` host can be a WebAuthn relying party ID.

## Findings

### The SQLite coupling is wide and sits on the write path

- 16 source files import `better-sqlite3`, with 87 `.prepare(` calls in 21 source files. Migrations run 0001 to 0013.
- 29 `STRICT` declarations: 14 in migrations, 14 in projections and 1 in `database.ts`.
- `sqlite_master` is read in five files (`append.ts`, `recompute.ts`, `registry.ts`, `database.ts`, `parent-room.ts`). The start-up guard matches trigger text there.
- `INSERT OR REPLACE` is used in `registry.ts` and `knowledge.ts`, `pragma_table_info` in `recompute.ts`, and `PRAGMA` (WAL, synchronous FULL, busy timeout) in `database.ts`.
- `VACUUM INTO` is used for snapshots (`snapshots.ts`) and export (`export.ts`). Restore copies a snapshot over the live file after deleting its `-wal` and `-shm` files.
- `appendEvents` validates, inserts and applies every projection inside one transaction (`append.ts`, `registry.ts`). The full recompute yields with `setImmediate` because better-sqlite3 is synchronous and swaps tables in one transaction with `DROP` and `ALTER TABLE RENAME` (`recompute.ts`). With `pg`, every caller of these becomes asynchronous.
- Tests make a temporary directory with one SQLite file per test (`tests/unit/database.test.ts`), and 53 test files open a database or use hooks. Five Playwright specs open the file read-only.
- Identity: no table carries an account column. Devices key on a token hash, `parent_pin` is a singleton (`CHECK (id = 1)`), `lockouts` is keyed by kind, `derived_meta` by projection name, `events.seq` is one global sequence, and `ParentSessions` lives in memory.

### What Postgres adds, and what it costs here

It adds concurrent writers from several processes, row-level tenancy and remote access. `pg_dump` gives a snapshot that does not block other operations (PostgreSQL 18 documentation, section 25.1). With row security on, a table with no policy denies by default, and table owners bypass policies unless `FORCE` is set. Today there is one server process and one player, so the concurrency gain is future value.

It costs an extra service, the asynchronous rewrite of every caller, and new snapshot, export and restore paths. `pg_dump` replaces `VACUUM INTO` as a consistent copy, which is documented but not built or tested here. It also ends the one-file copy that ADR-0340's sandbox uses, and test setup needs a server per run or a schema per test. The PGlite home page names no single-connection limit, so the test options stay unverified. ADR-0020 rejected PostgreSQL for the same reasons.

### Four account designs

- (a) Do nothing: one player, device pairing and a PIN. It adds no surface and keeps the Mac-only rule. It cannot serve a second child.
- (b) Local profiles: one server, one store per child, a household PIN, and the parent's email as a label with no mail sent. It serves several children with the design ADR-0340 already uses and gives no third party any data. It needs a profile key on devices and sessions, a registry and a per-profile opener. Against it: no mail login and no access off the home network.
- (c) Hosted accounts: a one-time code or magic link for the parent, with child profiles under it. It gives access from anywhere and one login across devices. It needs a hosted database, a mail sender and session code. Against it: it breaks the Mac-only rule, the host becomes a processor under a binding contract (GDPR Article 28(3)), and erasing a log fact is undecided (ADR-0020).
- (d) Passkeys (WebAuthn) for the parent. It resists phishing and needs no mail. It is a login method and sits inside (b) or (c). WebAuthn Level 3 is a W3C Recommendation dated 2026-08-25. Its relying party ID must match the origin; whether `https://<mac-name>.local` qualifies is unverified.

Mail, priced on 2026-11-08 and liable to change: Postmark's free plan gives 100 mails a month with no overage, and its Basic plan costs $15 a month for 10,000 plus $1.80 per 1,000 extra. Amazon SES charges $0.10 per 1,000 outbound mails, and its page gives no effective date. Sending from the Mac needs an SMTP account and its password on the Mac, as RES-1800 states.

### The legal frame for a child's account

GDPR Article 8(1): for a child under 16 offered an information society service on consent, processing is lawful only with the consent of the holder of parental responsibility, and a Member State may lower the age to 13. UAVG Article 5: under 16, the legal representative consents in place of the child (consolidated from 2026-09-01). The AP guidance could not be read, so this is unchecked against it.

### Interaction with the existing design

- `devices`, `parent_pin`, `parent_settings` and `lockouts` become per-profile rows or move into each profile's store. The PIN and its lockout stay per household, and a child's pairing code stays per device.
- The single-player log becomes profile 1. Copy it, compare each projection with `checkProjections` (`recompute.ts`), and keep the original.
- ADR-0340's sandbox opens a per-child copy read-only, as now. ADR-3280's studio is per parent and must not read another child's data.
- ADR-0100's $200 play cap is one key. Per-child spend counts from each profile's `llm_log`, and the total stays under the key limit.

### A build order that keeps the game working

1. A storage interface and a profile context in the route handlers, with one implementation over the current file. No change in behaviour.
2. The asynchronous boundary: every caller awaits the interface.
3. A Postgres implementation that passes the same tests, run beside SQLite.
4. A copy-and-compare run of the player's log from SQLite into Postgres as profile 1, with counts and projection checks.
5. The switch, with the SQLite file kept for rollback.
6. A profile registry, the device-to-profile link, the household PIN and a second profile.
7. Email login with a chosen sender, then passkeys.

Reverse the Postgres move if the 60-second full recompute (ADR-0020) or the 180-second snapshot of a 1 GB copy (ADR-0340) is missed, or if a consistent copy cannot be taken without locking.

## Conclusions

1. The rule that all game data stays on the parent's Mac must be amended before any child's data sits in a hosted store. A Postgres service on the same Mac needs no such amendment, only the amendment of ADR-0020's choice of SQLite.
2. A child profile must own the events, devices, PIN, lockouts, settings and budget. The singletons named above (`parent_pin`, `lockouts`, `derived_meta` and the global `events.seq`) must be keyed by profile before a second child exists.
3. A child under 16 must not hold a login of her own. Her data sits under the parent's login.
4. A hosted store needs a binding processor contract and a decided erasure path for log facts before any child's data goes to it.
5. A mail sender must be chosen, and its price checked on the day, before email login is built. A PIN with a label needs no mail.
6. Snapshot, export, restore and the sandbox copy each need a tested equivalent for Postgres before the switch, because Postgres has no `VACUUM INTO`.
7. Every storage caller must be asynchronous before the Postgres implementation is switched on, and the same test suite must pass on both stores during the move.
8. The per-child model spend must sum to no more than the $200 play-key limit.

Decision status: Postgres as the event store is decided against by ADR-0020 and is reopened by the owner's instruction of 2026-11-08, so the design step amends that record. Hosted accounts are deferred until the owner amends the Mac-only rule. Local profiles over the chosen store are left to the design step. Passkeys and email login are deferred, the first until the relying-party check is made and the second until a mail provider is chosen.

## Sources

- CLAUDE.md, revised 2026-09-26, read 2026-11-08.
- The repository working tree, read 2026-11-08: `src/server/database.ts`, `snapshots.ts`, `backups.ts`, `restore.ts`, `export.ts`, `devices.ts`, `pairing.ts`, `parent-access.ts`; `src/engine/events/append.ts`; `src/engine/projections/registry.ts`, `statements.ts`, `recompute.ts`; `migrations/0002`, `0003`, `0007`, `0013`; `compose.yaml`; `Dockerfile`; `tests/unit/database.test.ts`.
- ADR-0010, ADR-0020, ADR-0100, ADR-0340, ADR-3280, RES-0010 (line 153), RES-1800 and RES-2600, in `project/`, read 2026-11-08.
- [PostgreSQL 18 documentation: row security, isolation, backup and dump](https://www.postgresql.org/docs/18/), read 2026-11-08 - the tenancy and snapshot claims.
- [node-postgres pooling](https://node-postgres.com/features/pooling), read 2026-11-08 - the asynchronous pool.
- [SQLite write-ahead log](https://www.sqlite.org/wal.html), read 2026-11-08 - no WAL over a network filesystem.
- [PGlite](https://pglite.dev/), read 2026-11-08 - no single-connection limit found.
- [Kysely migrations](https://kysely.dev/docs/migrations), read 2026-11-08 - the migrator and its database lock.
- [GDPR Article 8](https://gdpr-info.eu/art-8-gdpr/) and [Article 28](https://gdpr-info.eu/art-28-gdpr/), read 2026-11-08.
- [UAVG Article 5](https://wetten.overheid.nl/BWBR0040940/), consolidated from 2026-09-01, read 2026-11-08.
- [Web Authentication Level 3](https://www.w3.org/TR/webauthn-3/), Recommendation of 2026-08-25, read 2026-11-08.
- [Postmark pricing](https://postmarkapp.com/pricing) and [Amazon SES pricing](https://aws.amazon.com/ses/pricing/), read 2026-11-08; the SES page gives no effective date.
- Not obtained: the Autoriteit Persoonsgegevens site (three URLs, HTTP 403 and 404, 2026-11-08).
