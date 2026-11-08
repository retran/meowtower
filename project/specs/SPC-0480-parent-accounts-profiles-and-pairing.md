---
id: SPC-0480
artifact: spec
status: live
revised: 2026-11-08
states: [REQ-8500, REQ-8502, REQ-8504, REQ-8508, REQ-8510, REQ-8512]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Parent accounts, profiles and the pairing of a child's device

## Scope

This document covers the parent's account, the profiles it owns, sign-in, and how a child's device opens a profile. SPC-0470 states the schemas that hold a profile's data, and SPC-0010 states the listeners and the PIN.

## Boundary

Two tables in the `public` schema: `accounts` and `profiles`. The routes sign a parent in with an email and a six-digit code, list her profiles, and open the Parent Room of one. A child's device holds a device cookie for one profile.

## Behaviour

Every child has a profile of her own, owned by one parent account (REQ-8500). An account is an email address the parent proved by entering a code sent to it (REQ-8502). A signed-in parent reaches the Parent Room of each profile her account owns and of no other (REQ-8504).

A child's device opens one profile through a pairing code that the profile's Parent Room issued (REQ-8508). A child holds no email, password or login (REQ-8512). The model spend of all profiles sums to no more than the play-key limit of the month, because the gateway reserves against the sum (REQ-8510).

## Failure paths

A wrong code counts, and after five wrong attempts at one address the server refuses it for 15 minutes. An expired code, a code for another address and a code used before are refused alike. A device cookie of one profile gets a 401 for the routes of another.

## Questions

### What the part is for

It lets one parent own several children's games and keeps each child's data apart.

### What it depends on

SPC-0470 for the schemas, SPC-0010 for the listeners, and SPC-0100 for the budget.

### What depends on it

The sign-in and profile screens, and the sandbox of SPC-0340, which opens one profile at a time.
