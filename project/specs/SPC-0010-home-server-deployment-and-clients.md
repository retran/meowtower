---
id: SPC-0010
artifact: spec
status: live
revised: 2026-09-27
checked-at:
states: [REQ-2500, REQ-2502, REQ-2504, REQ-2506, REQ-2508, REQ-2510, REQ-2512, REQ-2514, REQ-2516, REQ-2518, REQ-2520, REQ-2522, REQ-2524, REQ-2526, REQ-2528, REQ-2530, REQ-2532, REQ-2534, REQ-2536, REQ-2538, REQ-2540, REQ-2542, REQ-2544, REQ-2546]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The home server on the Mac, its deployment, its clients and its network boundary

## Scope

This document covers the server that runs in Docker on the parent's Mac, the `./tower` command that operates it, the two listeners it offers, the device pairing, PIN lockout and revocation, the database file's durability, the snapshots, and the client shell on the iPad and the computer. It is written at the deployment level: containers, listeners, files, commands and the requests every route shares. A reader who needs one route's contents or one screen needs another document.

It leaves out what other decisions define. The event log, its tables, the migrations' content and the export belong to ADR-0020. The play API, the lease, the parent session and the offline queue's behaviour belong to ADR-0030. The model gateway and its timeouts belong to ADR-0100, the fallback pools to ADR-0110, the screens of both interfaces to ADR-0150, and the Parent Room's content to ADR-0180. A copy of the data off the Mac is not part of the system.

## Boundary

The system consists of two containers and one command. The container `tower` runs the server: Node 24, Hono 4 and TypeScript in strict mode with `noUncheckedIndexedAccess`, built from `node:24-slim`. The container `proxy` runs Caddy 2. The script `./tower` on the Mac is the one operator command.

| Surface | What it is |
| --- | --- |
| `https://<mac-name>.local` | Caddy in `proxy`, listening on 8443 inside the container and published by the Mac as port 443. It terminates HTTPS with its own local certificate authority (`tls internal`) and forwards to `tower`. |
| `http://localhost:8080` | The Parent Room over plain HTTP, published on `127.0.0.1` only. It is the only listener that carries the export routes ADR-0020 defines. |
| `./tower up` | Checks the network, runs `docker compose up -d` and `caffeinate`, sets the containers' time zone to the Mac's, and prints the QR code for the iPad. |
| `./tower down` | Stops the containers. It never passes `-v`, so the volume `tower-db` survives. |
| `./tower status` | Reports in one line each whether Docker and both containers run, the last snapshot and how long it took, and any open `backup_failed` or `storage_ceiling` notice. |
| `./tower pair` | Prints a new 6-digit pairing code. |
| `./tower set-pin` | Sets the Parent Room PIN. |
| `./tower ipad-setup` | Serves the profile that installs Caddy's root certificate on the iPad. |
| `./tower db-snapshot` | Takes one snapshot on demand. |
| `./tower restore` | Loads the newest snapshot as the live database. |
| `./tower export` and `./tower recompute` | Run the export and the recompute ADR-0020 defines, inside `tower`. |
| Docker volume `tower-db` | Holds the live SQLite database. No Mac program can open it. |
| `data/blobs/` | The blob store, write-once. |
| `data/snapshots/tower-<UTC timestamp>.sqlite` | Snapshots. |
| `data/exports/` | Exports, written by ADR-0020's export. |
| `data/caddy/` | Caddy's certificate authority and state. |
| `.env` | Holds the OpenRouter key on the Mac. |
| Device cookie | A random 256-bit token in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie with no expiry date. |
| Table `devices` | One row per paired device: the token's SHA-256 hash, whether it is revoked, and the device's interface choice. |
| Errors | `401` for a request with no device token; `401 device_revoked`; `pairing_locked`; `pin_locked`; `wrong_network`; `backup_failed`; `storage_ceiling`; `model_service_down`; `server_unreachable`. |

### What this part requires from other parts

- ADR-0020 supplies the database's tables, including `events` and `blobs`, and runs its migrations through a runner that asks this part for a snapshot before a pending migration runs. Its export routes mount only on the loopback listener, and `./tower export` and `./tower recompute` call its code.
- ADR-0030 supplies the answer request, which commits the answer's transaction before it replies, and the session end on which this part takes a snapshot. It also supplies the parent session opened by the PIN and the waiting scene shown for `server_unreachable`.
- ADR-0100 gives every call to the model service a deadline, and ADR-0110 supplies the texts the game continues on when the service fails.
- ADR-0150 supplies the screens of both interfaces, and ADR-0180 the Parent Room's pages.
- ADR-0190 holds the budgets this part names, in its Baselines table.

The permitted dependencies run one way. `proxy` depends on `tower`, the client depends only on the routes `tower` serves, and no part depends on the client. Only `tower` opens the live database.

## Behaviour

### Where it runs and where the data lives

The game runs in a browser on the iPad, installed as a home-screen web app, and in a browser on the computer, served by `tower` on the Mac over the home network (REQ-2500). All game data lives on the Mac: the live database in the volume `tower-db` and every other file under `data/` (REQ-2502). `tower` opens SQLite through `better-sqlite3` in WAL mode with `synchronous=FULL`.

`tower` runs as the user `node` and Caddy as an unprivileged user. Both containers run with `cap_drop: [ALL]`, `no-new-privileges` and a read-only root file system apart from their data mounts (REQ-2512).

### Durable writes

When `tower` receives an answer, it commits the transaction that stores it before it replies to the client (REQ-2508).

### Network boundary and trust

The Mac forwards no router port, and every request except pairing needs a device token (REQ-2510). `./tower up` compares the Mac's default gateway with the one recorded at setup and starts nothing when they differ (REQ-2510). The loopback listener refuses every connection that doesn't come from the Mac itself (REQ-2510).

The iPad trusts Caddy's certificate authority through the profile `./tower ipad-setup` installs, done once per iPad, so `https://<mac-name>.local` opens with no certificate warning (REQ-2514).

### Devices, PIN and lockout

A device pairs with a 6-digit code that `./tower pair` or the Parent Room issues and that expires 5 minutes after it is issued (REQ-2516). On a correct code `tower` sets the device cookie and stores only the token's SHA-256 hash in `devices` (REQ-2516). The device keeps its access, with no expiry, until the parent revokes it (REQ-2518).

When the parent revokes a device in the Parent Room, `tower` marks its row revoked and answers every later request carrying that token with `401 device_revoked` (REQ-2520).

`tower` counts wrong pairing codes in a row and wrong PINs in a row separately. After the fifth wrong entry of one kind, it refuses every attempt of that kind for 15 minutes, a correct entry included, and a correct entry outside a lockout resets that kind's count (REQ-2522).

### The model key

The OpenRouter key lives only in `.env` and in the environment of the `tower` process. No response body, header or bundled file carries it (REQ-2504).

### The model service

No request path waits on the model service without a deadline. When OpenRouter fails or can't be reached, `tower` continues the adventure on the scene library and the fallback pools (REQ-2506).

### Snapshots

A snapshot is `VACUUM INTO data/snapshots/tower-<UTC timestamp>.sqlite`, taken by a worker thread with its own connection so play goes on while it runs. `tower` takes one when a session ends (REQ-2526), one before any pending migration runs (REQ-2528), and one on `./tower db-snapshot`. A program on the Mac other than `tower` reads game data only from a snapshot or an export, because the live database sits in `tower-db` outside the Mac's file tree (REQ-2524).

After each snapshot `tower` keeps the newest 30 and the first snapshot of every calendar month, and deletes the rest (REQ-2530). Monthly snapshots have no end date.

A backup copy is one snapshot plus `data/blobs/`. The snapshot holds the event log and the `blobs` table with every file's hash, and `tower` never overwrites or deletes a file in `data/blobs/` (REQ-2532).

`./tower restore` loads the newest snapshot as the live database.

### The client

One client code base builds a tablet interface and a computer interface, each covering every screen of the game and the Parent Room (REQ-2534). On its first start on a device the client picks the tablet interface when `(pointer: coarse)` matches and `(any-pointer: fine)` doesn't, and the computer interface otherwise (REQ-2536). The player switches the interface in the settings; `tower` stores the choice in that device's `devices` row, and the choice holds on that device until she changes it (REQ-2538).

On the computer interface every control on every screen works from the keyboard alone, with a visible focus ring (REQ-2540).

The device stores in IndexedDB only the queue of answers it hasn't sent, and asks for `navigator.storage.persist()` on first launch. Its service worker caches code, pictures and sound, and `localStorage` holds no game data (REQ-2542).

### Push

`tower` sends no push. It holds no VAPID keys and no push subscription table, and opens no connection to `*.push.apple.com` (REQ-2544). Revoking a device therefore leaves no push subscription behind (REQ-2546).

## Failure paths

| Condition | What happens |
| --- | --- |
| The Mac sleeps, Docker is stopped or the Wi-Fi drops | The client can't reach `tower` and shows the player the waiting scene, `server_unreachable`. The three causes look the same to her. |
| Docker Desktop or a container isn't running | `./tower status` names it in one line. |
| A request carries no device token | `tower` answers `401`. |
| A request carries a revoked token | `tower` answers `401 device_revoked`, and the device shows that it needs pairing from the Parent Room. |
| A pairing code is older than 5 minutes | `tower` refuses it. |
| The fifth wrong pairing code or PIN in a row | `tower` refuses attempts of that kind for 15 minutes with `pairing_locked` or `pin_locked`, and the screen says when it takes attempts again. |
| The Mac's default gateway differs from the recorded one | `./tower up` prints `wrong_network` with the recorded gateway and the current one, and starts nothing. |
| Another machine connects to port 8080 | The Mac refuses the connection. |
| OpenRouter fails or can't be reached | The adventure continues on library and pool texts, and the Parent Room shows `model_service_down` as a line for the parent. |
| A snapshot fails | `tower` raises `backup_failed` once per failure, as a Parent Room notice and in `./tower status`, and the next good snapshot clears it. |
| `data/` passes 20 GB | `tower` raises `storage_ceiling` once, and again at each further 10 GB. |
| A snapshot of a 1 GB database takes longer than 60 seconds | `./tower status` shows the time against the budget in ADR-0190's Baselines table. |
| The volume `tower-db` is deleted, for example by `docker compose down -v` or a Docker Desktop reset | The live database is gone; `./tower restore` loads the newest snapshot, and events after it are lost. |
| A device's storage is wiped | The device loses its token and needs pairing again; no game data is lost, because the server holds it all. |
