---
id: TSK-0010
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2502, REQ-2512]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The containers and `./tower up`, `down` and `status` serve a health page on the Mac

After this task, `./tower up` on the Mac starts the unprivileged containers `tower` and `proxy`, keeps the live database in the Docker volume `tower-db` and every other file under `data/`, and serves a health page. It is the first slice of EPC-0010 and every other task builds on it.

## Acceptance criteria

1. Given a clean checkout on the Mac, when the parent runs `./tower up`, then `https://<mac-name>.local` serves the health page through Caddy, and `./tower status` reports both containers running. Closed by: the output of both commands.
2. Given the containers run, when `docker compose config` is read, then `tower` and `proxy` each show a non-root `user`, `cap_drop: [ALL]`, `no-new-privileges` and a read-only root file system apart from their data mounts; and `docker compose exec tower id -u` prints a number other than 0. Closed by: both commands' output.
3. Given the containers run, when `ls data/` runs on the Mac, then it lists `blobs/`, `snapshots/`, `exports/` and `caddy/` and no `tower.sqlite`, and `docker volume inspect tower-db` shows the volume holding the live file. Closed by: both commands' output.
4. Given the containers run, when the parent runs `./tower down`, then both containers stop and `tower-db` still exists. Closed by: `docker volume ls` after `./tower down`.
5. Given Docker Desktop isn't running, when the parent runs `./tower status`, then one line names that. Closed by: the command's output.

## What to do

Build `compose.yaml`, the `Caddyfile`, the `tower` image and the `./tower` script's `up`, `down` and `status` subcommands, as SPC-0010 states them. Bind these versions: Node 24 on `node:24-slim`, Hono 4, TypeScript strict with `noUncheckedIndexedAccess`, Caddy 2 with `tls internal`, listening on 8443 in `proxy` and published as port 443. `tower` runs as `node`; Caddy runs as an unprivileged user. The live SQLite file sits in the named volume `tower-db`; `data/` is bind-mounted with `blobs/`, `snapshots/`, `exports/` and `caddy/`. `./tower up` runs `docker compose up -d` and `caffeinate`, sets the containers' time zone to the Mac's, and prints the QR code for the iPad. `./tower down` never passes `-v`.

This task adds the Docker smoke test's first checks to group 9 of ADR-0190's verify command.

## Depends on

Nothing.

## Evidence

Collected on 2026-09-27 on the Mac, with the names ADR-0200 sets (`./meowtower`, the service `meowtower`, the volume `meowtower-db`).

- Verbs: `meow-verbs run format lint check test build` exited 0: format, lint, check, test and build passed; 2 test files, 7 tests passed.
- REQ-2512, checked first against a `compose.yaml` without hardening, where 2 of the checks failed: `tests/smoke/compose.test.ts` now passes for both services. `docker compose config` shows `meowtower` with `user: node` and `proxy` with `user: 1000:1000`, each with `cap_drop: [ALL]`, `no-new-privileges:true` and `read_only: true`; `docker compose exec meowtower id -u` printed `1000`, and so did `proxy`.
- REQ-2502: `tests/smoke/compose.test.ts` passes. After `./meowtower up`, `ls data/` printed `blobs caddy exports snapshots` and no database file; `docker volume inspect meowtower_meowtower-db` showed the volume, and `/var/lib/meowtower` inside `meowtower` held `meowtower.sqlite`.
- Criterion 1: `./meowtower status` printed `Docker: running`, `meowtower: running`, `proxy: running`; `curl -k https://code-swirl.local/health` returned HTTP 200 `{"status":"ok","database":"ok"}`.
- Criterion 4: after `./meowtower down`, no container ran, `meowtower_meowtower-db` was still listed and `caffeinate` had stopped.
- Criterion 5: with `DOCKER_HOST` pointed at a socket that doesn't exist, `./meowtower status` printed `Docker Desktop is not running.` and exited 1. Docker Desktop itself wasn't quit, so this simulates the condition.
- The health route's failure path: `tests/unit/health.test.ts` checks that a closed database gives HTTP 503.
- Fixed on the way: Caddy's image gives its binary a file capability that the hardening forbids, so `proxy/Dockerfile` strips it; `./meowtower up` detaches `caffeinate`, which had kept the script from returning.

## Left alone

The trusted certificate on the iPad (TSK-0020), the database's durability settings (TSK-0030), the gateway check in `./tower up` and the loopback listener (TSK-0060), and the other `./tower` subcommands, which the tasks that need them add.
