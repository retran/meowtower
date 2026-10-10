---
id: TSK-0430
artifact: task
status: done
revised: 2026-09-29
epic: EPC-0010
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `up` refuses an unverified gateway, and a network watch stops the containers when the gateway changes

After this task, `./meowtower up` starts nothing when the hardware address of the recorded or the current gateway is unknown, and a launchd agent in the parent's user session compares the gateway's IP address and hardware address every 60 seconds while the stack runs and stops both containers on a difference. It runs as the parent's user because `docker` needs that user's Docker Desktop context. ADR-0360 entry 2 amended ADR-0010 this way after TSK-0060 was done, so ADR-0010 as amended isn't realised until this task is done. It closes no requirement of its own: REQ-2510 stays closed by TSK-0060, and this task realises the amendment's stricter check of it.

## Acceptance criteria

1. Given a current gateway that still has no ARP entry after `up` pings it, when `./meowtower up` runs, then it prints `gateway_unverified` and starts no container; and given `data/home-gateway` recording `unknown` as the hardware address, the same happens. A first `arp` read that misses and a read after the ping that hits start the stack, because a router's entry often lapses after a reboot or a long sleep. Closed by: the `meowtower` script's test with stubbed `route`, `ping`, `arp` and `docker`, one case each.
2. Given `gateway_unverified`, when the parent runs the command it prints, `./meowtower set-home-network`, at home, then that command pings the gateway so the ARP table holds it, records its hardware address, and the next `up` starts the stack; when the gateway doesn't answer the ping, it records nothing, keeps the old record and prints `gateway_unverified`. Closed by: the script's test with a stubbed `ping`, one case for an answer and one for none, and a transcript from the owner's Mac, whose recorded gateway reads `unknown` today (TSK-0060 Evidence).
3. Given `./meowtower up` has started the stack, when `launchctl list` runs, then it shows the watch's job, whose plist sits in `~/Library/LaunchAgents` with `RunAtLoad`, so it loads again at the parent's login after a restart; and after `./meowtower down` it no longer does. Closed by: the script's test with a stubbed `launchctl`.
4. Given the containers came back by their `restart: unless-stopped` policy after a restart of the Mac or of Docker Desktop, with no `./meowtower up`, when the watch loads, then it checks the gateway at once, and on a changed or unverified gateway stops both containers. Closed by: the watch's test starting from running containers, and a transcript of a login on another network.
5. Given the stack running, when the watch sees a gateway whose IP address differs from the recorded one, or whose IP address matches and whose hardware address differs, then within 70 seconds both containers are stopped, the watch writes `wrong_network` with the recorded and the current gateway to `data/snapshots/notices.json`, and `./meowtower status` shows it. The watch keeps ticking, pinging the gateway before each `arp` read, and stops nothing further while the containers are down. The watch ticks every 60 seconds, and the remaining 10 seconds cover `docker stop`, the bound ADR-0360's verification states. Closed by: the watch's test with stubbed `route`, `arp` and `docker`, one case each, and a transcript from the Mac.

## What to do

Add the hardware address check to `up`, the ping and recording step to `set-home-network`, the watch script with its launchd agent plist that `up` loads and `down` unloads, and the `wrong_network` line in `status`, as SPC-0010 states them. `gateway_unverified` names `./meowtower set-home-network` as the way out, because the parent reading the refusal at home needs the one command that clears it.

## Depends on

TSK-0060, because it records the gateway at setup and checks it at `up`.

## Evidence

Collected on 2026-10-10 on the Mac, at commit 507a341 of the branch `tsk-0430-gateway-verified-and-watch`; the pull request is not opened yet. Every criterion is met by the script's tests, and the transcripts the criteria also ask for are named below as resting on the owner.

- Verbs: `meow-verbs` isn't installed on this Mac, so each command of `.meowpaw/profile.toml` ran by itself and exited 0: `npx prettier --check .`, `npm run lint`, `npx tsc --noEmit`, `npm test` (49 Vitest files with 446 tests, and 43 Playwright tests passed, 1 skipped; the two `✘` lines are the response recorder's `test.fail()` self-tests) and `npm run build && docker compose build`.
- Criterion 1: `tests/smoke/gateway-watch.test.ts` runs the script with `route`, `ping`, `arp`, `docker` and `launchctl` stubbed. With no ARP entry after the ping, and with a recorded hardware address `unknown`, `up` prints `gateway_unverified`, names `./meowtower set-home-network` and runs no `compose up`; a first read that misses and a read after the ping that hits start the stack.
- Criterion 2: `set-home-network` pings, records the hardware address and the next `up` starts; with no answer it records nothing, keeps the old record and prints `gateway_unverified`.
- Criterion 3: `up` writes `local.meowtower.watch.plist` with `RunAtLoad` into `~/Library/LaunchAgents` and loads it; `down` unloads it and removes the file.
- Criterion 4: the watch ticks before it sleeps, and on an unverified gateway with running containers it stops both.
- Criterion 5: a different IP address, and the same IP address with another hardware address, each stop both containers once and write `wrong_network` with both gateways to `data/snapshots/notices.json`, which `./meowtower status` prints; the watch pings before each read, stops nothing while the containers are down or the gateway is the recorded one, and `up` on the home network clears the notice.

Resting on the owner, because no program here can change the router: the transcripts criteria 2, 4 and 5 ask for from the Mac, that is `set-home-network` run at home against the gateway that reads `unknown` today, a login on another network, and a gateway change with the stack running. The 70-second bound is the 60-second tick plus `docker stop`, as ADR-0360 states, and no test times it.

Choices made here, because the approved records left them open:

- The watch is the subcommand `./meowtower watch`, which the agent runs with `KeepAlive`; `--once` ends after one tick, and `MEOWTOWER_WATCH_TICKS` and `MEOWTOWER_WATCH_SLEEP` bound the loop for tests.
- The agent loads with `launchctl load -w` and unloads with `launchctl unload -w`, so `launchctl list` shows its label.
- A gateway whose IP address differs reads `wrong_network` even when a hardware address is unknown; `gateway_unverified` is for the same IP address with an unknown hardware address on either side.
- The watch stops on an unverified gateway as well as on a changed one, as criterion 4 asks.

## Left alone

The local judges' launchd daemons and the dedicated account that runs them, which ADR-0350 and ADR-0360 entry 1 define and the epic realising ADR-0350 builds.
