---
id: BUG-0030
artifact: bug
status: done
severity: major
violates: REQ-2510
enters: implement
found: 2026-11-15
revised: 2026-11-15
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# macOS 27 hides the router's hardware address, so `./meowtower up` never starts the server

On macOS 27 the ARP table holds no entry for the router, so `arp_mac` in `meowtower` always answers `unknown`, `set-home-network` records nothing and `up` stops at `gateway_unverified` on the home network too.

## Reproduction

Seen at revision `4d59699` of `main`, on 2026-11-15, on a Mac with macOS 27.0 at home, from the owner's terminal and from Claude Code:

1. Run `./meowtower set-home-network`.
2. It prints `gateway_unverified: the router's hardware address can't be read from here, so nothing was recorded.`
3. `ping -c 1 192.168.178.1` answers, and `arp -n 192.168.178.1` still prints `-- no entry`.

It happens every time. `arp -an` prints nothing at all, `ndp -an` shows every neighbour's address as `2:0:0:0:0:0`, and `ipconfig getsummary en0` shows the BSSID as `<redacted>`, so the system hides hardware addresses from every table.

## What the system does

`./meowtower up` prints `gateway_unverified: the router's hardware address is unknown (recorded gateway 192.168.178.1 unknown, current 192.168.178.1 unknown)` and starts nothing.

## What it should do, and why

REQ-2510 asks that the server accept connections only from the home network, and the script tells the home router by its hardware address. `ipconfig getsummary` still shows the link-local source of the router's IPv6 advertisement, `fe80::a255:1fff:fed5:ff36`, and an address in EUI-64 form carries the hardware address, `a0:55:1f:d5:ff:36`. Where the ARP table has no entry, `arp_mac` reads that address instead, and it answers `unknown` as before when the router sends no advertisement or uses another form.

## Triage

It enters at implement, because REQ-2510 already requires the check and the cause is known. Severity major: the server can't start at all on macOS 27. The fallback reads the router that advertises IPv6, which at home is the IPv4 gateway too; a network where the two differ would be told by the wrong router's address, and I chose to accept that.

## Closed by

The two BUG-0030 tests in `tests/smoke/home-network.test.ts`, which stay as regression checks: with an empty ARP table the script records the address an EUI-64 advertisement carries, and records nothing when the advertisement carries none. On the owner's Mac, `./meowtower set-home-network` recorded `192.168.178.1 a0:55:1f:d5:ff:36` and `./meowtower up` started the server.
