---
id: ADR-3340
artifact: adr
status: done
pr: 109
revised: 2026-11-09
addresses: [REQ-8514, REQ-8516, REQ-8518]
supersedes: []
concerns: [cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3340. Each account has a monthly budget and a spend record of its own, and the gateway counts only the profiles of one account

## Decision

The owner decided on 2026-11-09 that every account has its own budget and its own record of what it spent. This record amends one clause of ADR-3320, which summed the month's spend of all profiles against one limit, and replaces it. ADR-3320 stays as it is for everything else.

- The table `accounts` gains `month_limit_usd`, a number or null. Null means the default of $200, the limit of the play key. A parent sets her own between $1 and the default (REQ-8518), so no account can set more than the key allows.
- A profile's gateway counts the month's spend of the profiles of its own account, and no others. `createLedger` groups the profiles by account; the first profile, which no account owns yet, forms a group of one with the default limit. The limit the gateway checks is the account's, read from `accounts`, and a call whose worst case does not fit in the rest of the account's month is refused as before.
- The spend record is the `llm_log` of each profile, which already holds every call in full. `GET /api/account/spend` reads it for the signed-in account: the month, the total, the limit, and the total of each of her profiles (REQ-8516). It reads no other account's profiles.
- `PUT /api/account/budget` sets the limit (REQ-8518).

What works once this is accepted: two accounts spend independently, a parent sees her own spend per profile, and one account cannot use up the other's month. What doesn't: the key's own limit at the provider still caps all accounts together, which this record does not change, and a screen that shows the spend, which the sign-in screens of ADR-3320 carry.

## Why

The owner chose a budget for each account, and a household of one parent per account is the model of ADR-3320. Counting by account keeps the figure the parent sees equal to the figure the gateway enforces.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: one sum over all profiles | Guards the key | One account could use up the month of another, against the owner's decision |
| A budget per profile | Finer | A parent with several children would split a month by hand, and the owner asked for the account |
| A limit set only by the owner | No parent can raise it | The parent pays the bill of her own account and must see and set it |

## What it costs

The key at the provider is shared, so several accounts together can still pass its limit; the provider then refuses calls, and the gateway reports `provider_failed`. A cap over all accounts needs a total the owner sets, which a later record can add.

## What would reverse it

- Accounts together pass the key's limit in a month: a cap over all accounts joins the per-account budgets.

## Consequences

- REQ-8510 is withdrawn. SPC-0480 states the new requirements. `src/server/gateway/household.ts` groups by account, and `src/server/accounts/` gains the two routes.

## How I will know it was realised

1. A test with two accounts finds a call refused for the account whose month is full while the other account's call is allowed.
2. A test finds the spend route giving the total of each of the signed-in account's profiles and nothing of another account's.
3. A test sets the limit, finds a value above the default refused, and finds the gateway using the new value.

## What this does not settle

- A cap over all accounts, and the screen that shows the spend.

## Plan

1. The `month_limit_usd` column, the ledger grouped by account with the account's limit, and the gateway reading it (REQ-8514).
2. The spend route and the budget route (REQ-8516, REQ-8518).
