---
id: ADR-0010
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-2500, REQ-2502, REQ-2504, REQ-2506, REQ-2508, REQ-2510, REQ-2512, REQ-2514, REQ-2516, REQ-2518, REQ-2520, REQ-2522, REQ-2524, REQ-2526, REQ-2528, REQ-2530, REQ-2532, REQ-2534, REQ-2536, REQ-2538, REQ-2540, REQ-2542, REQ-2544, REQ-2546]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0010. One TypeScript server in Docker on the family Mac serves the game as a web app to an iPad home-screen app and a desktop browser over HTTPS on the home network

## Decision

The game is one TypeScript web application. Its server runs in Docker on the parent's Mac and serves the iPad, installed as a home-screen web app, and a desktop browser over HTTPS on the home network. The reader of this record is evaluating the design, so the parts come first and the reasons after.

The parts are these:

- The server is Node 24, the Active LTS line on 2026-09-27, with Hono 4 (4.13.9 on npm that day) and TypeScript in strict mode with `noUncheckedIndexedAccess`, as RES-2500 proposes. It runs in the container `tower`, built from `node:24-slim`, as the unprivileged user `node`, with `cap_drop: [ALL]`, `no-new-privileges` and a read-only root file system apart from its data mounts (REQ-2512).
- The data lives on the Mac (REQ-2502). The live SQLite file sits in the Docker named volume `tower-db`, which no Mac program can open, and everything else sits in the bind-mounted folder `data/`: `blobs/`, `snapshots/`, `exports/` and `caddy/`. The server opens SQLite through `better-sqlite3` (13.0.3 on npm on 2026-09-27) in WAL mode with `synchronous=FULL`, so a committed transaction survives a power cut (REQ-2508). ADR-0020 decides what the database holds.
- The server stores each answer in a committed transaction before it replies (REQ-2508). ADR-0030 defines the answer request.
- Caddy 2 (2.11.4 was the latest release on 2026-09-27) runs in the container `proxy` as an unprivileged user. It listens on 8443 inside the container, and the Mac publishes that as port 443 on `<mac-name>.local`. Caddy terminates HTTPS with its own local certificate authority (`tls internal`), and the iPad trusts that authority through a profile installed once with `./tower ipad-setup` (REQ-2514).
- A second listener serves the Parent Room over plain HTTP on `127.0.0.1:8080`, published on the Mac's loopback address only. Only a program on the Mac can reach it, so it is the only place the export routes exist (REQ-2240, which ADR-0020 settles, uses it). Browsers treat `http://localhost` as a secure context, so this listener needs no certificate.
- No router port is forwarded to the Mac. Every request except pairing needs a device token, and `./tower up` refuses to start when the Mac's default gateway differs from the one recorded at setup, so a laptop on another network doesn't serve the game (REQ-2510).
- A device pairs by a 6-digit code that lives 5 minutes, from `./tower pair` or the Parent Room (REQ-2516). The server answers with a random 256-bit token in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie with no expiry date, and stores only the token's SHA-256 hash in the service table `devices` (REQ-2518). Revoking a device marks its row revoked, and every later request carrying that token gets `401 device_revoked` (REQ-2520). After 5 wrong pairing codes in a row, or 5 wrong PINs in a row, the server refuses that kind of attempt for 15 minutes; the two counters are separate and a correct entry resets its own (REQ-2522, numbers from RES-2500).
- The OpenRouter key lives only in `.env` on the Mac and in the `tower` process's environment. No response body, header or bundled file carries it, and a build check searches the client bundle for the key's prefix `sk-or-` (REQ-2504).
- No request path waits on the model service without a deadline. When OpenRouter fails or can't be reached, the server continues on the scene library and the fallback pools (REQ-2506). ADR-0100 sets the gateway and its timeouts, and ADR-0110 sets the pools.
- The server takes a snapshot with `VACUUM INTO data/snapshots/tower-<UTC timestamp>.sqlite` after each session ends (REQ-2526) and before any pending migration runs (REQ-2528). A worker thread with its own connection takes the snapshot, so play isn't blocked while it runs. After each snapshot it keeps the newest 30 and the first snapshot of every calendar month, and deletes the rest (REQ-2530). A backup copy is one snapshot plus the blob store: the snapshot holds the event log and the `blobs` table with every file's hash, and `data/blobs/` is write-once, so nothing in it is ever overwritten or deleted (REQ-2532). `./tower db-snapshot` takes one on demand, and every Mac program reads only such copies (REQ-2524).
- One client code base builds two full interfaces, tablet and computer (REQ-2534). On first start on a device the client picks the tablet interface when `(pointer: coarse)` matches and `(any-pointer: fine)` doesn't, and the computer interface otherwise (REQ-2536). The player can switch it in the settings, and the server stores the choice in that device's `devices` row, so the device itself keeps no game data (REQ-2538, REQ-2542). On the computer interface every screen works from the keyboard alone, with visible focus (REQ-2540). ADR-0150 designs the screens themselves.
- The device stores only the queue of unsent answers in IndexedDB and asks for `navigator.storage.persist()` on first launch (REQ-2542). A service worker caches code, pictures and sound, which are assets, not game data.
- The MVP sends no push. It has no VAPID keys, no subscription table and no outbound connection to `*.push.apple.com`, so REQ-2544 and REQ-2546 hold without a mechanism, as the owner decided on 2026-09-27 (RES-2500). After the MVP, a `push_subscriptions` table keys each subscription to a `devices` row, only the Parent Room can create one, and revoking the device deletes its subscriptions in the same transaction.
- `./tower` on the Mac is the one operator command: `up`, `down`, `status`, `pair`, `set-pin`, `ipad-setup`, `db-snapshot`, `restore`, `export` and `recompute`. `up` runs `docker compose up -d` and `caffeinate`, sets the container time zone to the Mac's, and prints the QR code for the iPad.

What works once this is accepted: `./tower up` starts the server, the iPad installs the home-screen app over trusted HTTPS, devices pair, get revoked and hit the lockout, the PIN guards a Parent Room page, snapshots run and are pruned, and both interfaces load an empty shell. What doesn't work yet: there is no game. The event log comes with ADR-0020, the play API with ADR-0030, tasks with ADR-0040, and the screens with ADR-0150.

## Why

RES-2500 records the owner's draft, and the requirements elaborate it, so the stack follows the draft wherever the draft is specific: TypeScript, Node, Hono, SQLite, Docker, Caddy with a local authority, pairing codes and `VACUUM INTO` snapshots. I changed three details the draft leaves loose, each for a reason a requirement names.

The live database moved from the bind mount to a named volume. RES-2500 says WAL inside the container and the Docker Desktop file system handle outside access badly, and SQLite's WAL mode needs shared memory that the SQLite documentation says doesn't work on network file systems. A bind mount on Docker Desktop is a shared file system between the Mac and a virtual machine, and I have no test showing WAL is safe there. A named volume lives on the virtual machine's own disk, so WAL behaves as on any Linux disk, and REQ-2524 becomes a fact of the layout: no Mac program can open the live file, because it isn't in the Mac's file tree.

The Parent Room export got a loopback listener, because a check on the client address can't work. Docker Desktop on macOS proxies every published-port connection through its virtual machine's gateway, so every client arrives with the same source address (Victor Da Luz, "How Docker Desktop hides every client behind 192.168.65.1", read 2026-09-27). Caddy inside the container therefore can't tell the Mac from the iPad. A port published on `127.0.0.1` is refused by the Mac's own network stack for any other machine, so it holds without that address.

The home-network rule rests on three things for the same reason: no port forward, a device token on every request, and the gateway check in `./tower up`. A `remote_ip` filter in Caddy would pass every client, because every client looks alike to it.

`synchronous=FULL` is the setting that makes REQ-2508 true. In WAL mode with the default `NORMAL`, SQLite may lose the last transactions on a power cut, and a lost answer is what REQ-2434 forbids.

Node 24 is the version because Node's release page on 2026-09-27 lists 24 as LTS and 26 as Current, and that page advises production use of LTS lines only. `better-sqlite3` beats the built-in `node:sqlite`, because the Node 26 documentation still marks `node:sqlite` stability 1.2, release candidate, and `better-sqlite3` 13 supports Node 22 and later.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: no server, the game waits | costs nothing and commits to nothing | no requirement holds, and REQ-2500 asks for a game served from the Mac |
| Native iPadOS app in Swift with on-device storage | plays with no Mac and no network, and uses the iPad's own keyboard and Pencil APIs | breaks REQ-2502 and REQ-2542, since data would live on the iPad; puts the OpenRouter key on the device against REQ-2504; needs a second client for the computer and an Apple developer account |
| Cloud host, such as a small virtual server, with the same code | reachable anywhere, with no Mac to keep awake and no local certificate to install | breaks REQ-2502 and REQ-2510, and puts the player's full history on a machine the family doesn't own, against the privacy line in RES-2600 |
| Node directly on macOS under `launchd`, no Docker | sees real client addresses, opens the database without a virtual machine in between, and needs no Docker Desktop | the draft plans Docker for the unattended development and the `tools` container with Playwright (RES-2900); running as an unprivileged user would need a separate macOS account set up by hand; this is the first reversal below |
| Offline-first client with sync, for example a local database and a merge on reconnect | keeps her playing through a Wi-Fi drop | breaks REQ-2542 and REQ-2400, because the client would hold game state and compute outcomes; ADR-0030 argues the same trade |

## What it costs

The parent pays most of it. The Mac has to be awake, on the home network and running Docker Desktop whenever she plays. Setup takes an evening once: installing Docker Desktop, running `./tower up`, installing and trusting the profile on the iPad in two separate Settings screens, adding the home-screen app, and pairing inside that app. Pairing has to happen inside the home-screen app, because iPadOS keeps its storage apart from Safari's, and a code entered in Safari pairs Safari only.

The strongest objection is that everything hangs on one Mac. If it sleeps, travels, is updated or fails, she can't play, and the snapshots on its disk are the only copy of her history unless Time Machine or another copy exists. A cloud host or a native app would both remove that dependency. I keep the Mac because REQ-2502 and REQ-2510 require it, and I record the loss of an off-Mac copy as unsettled below.

The named volume costs a second risk. `docker compose down -v` or a Docker Desktop reset deletes the live database, and the last snapshot is from the end of the last session, so a reset in the middle of a session loses that session's events. `./tower down` never passes `-v`, and `./tower restore` loads the newest snapshot.

Storage grows without an end, because REQ-2530 keeps monthly copies forever. My estimate, unmeasured, is about 1 MB of log a day, so a snapshot of a year's play is about 400 MB. Thirty rolling copies plus twelve monthly ones would then be about 17 GB after a year. The rolling 30 drain automatically; the monthly copies don't, because the requirement forbids it.

For a month with nobody attending: the rolling snapshots keep draining, the monthly ones add one file, and the only queue is the storage ceiling notice, which fires once.

## What would reverse it

- A stage-0 crash test, killing the `tower` container and the Docker virtual machine 100 times during answer writes, loses or corrupts any committed answer on the named volume. Then the server moves to Node under `launchd` on macOS, the fourth alternative.
- Docker Desktop fails to restart the containers after a Mac reboot on two occasions in the first month of play. Then the same move to `launchd` applies, because a server that needs a person to start it breaks REQ-2500 for the player.
- The family's play moves off the home network, for example to a holiday house, and the owner asks for play there. Then REQ-2510 has to change first, and a cloud host or a VPN becomes the question.
- `node:sqlite` reaches stability 2 in an LTS line and `better-sqlite3` stops publishing builds for the LTS in use. Then the driver changes, which touches only the storage module.

## Consequences

- The security boundary protects, in order of likely damage: the event log's integrity against the server's own bugs, which ADR-0020 guards with triggers; the Parent Room against the player herself, a curious child with a browser and developer tools on the computer, through the PIN, the lockout and a client that learns nothing about measurement (ADR-0030); the game against another device on the home Wi-Fi, through pairing tokens; a lost iPad, through revocation; the OpenRouter key against a compromised npm dependency, through the unprivileged container and the key never reaching a client; and the game against the internet, through no port forward. The key is the asset worth money, and RES-2700 caps it with a $60 monthly limit on the play key.
- These failure states, with one audience each, use the same names in every later decision:
  - `server_unreachable`: the player; the client shows the waiting scene (ADR-0030). A sleeping Mac, a stopped Docker and a Wi-Fi drop are deliberately indistinguishable to her, because she can fix none of them.
  - `device_revoked`: the parent; the device shows that it needs pairing from the Parent Room.
  - `pairing_locked` and `pin_locked`: the parent; the screen says the server takes no more attempts until a stated time.
  - `model_service_down`: the parent, as a line in the Parent Room; the player sees library texts and nothing else changes.
  - `backup_failed`: the parent, as a Parent Room notice and in `./tower status`, raised once per failure and cleared by the next good snapshot.
  - `storage_ceiling`: the parent, once, when `data/` passes 20 GB, a ceiling I chose; it fires again only at each further 10 GB.
  - `wrong_network`: the parent at the Mac; `./tower up` prints the recorded gateway and the current one and stops.
- Budgets: a snapshot must finish within 60 seconds for a 1 GB database, a budget I chose, measured by `./tower status`. The 6-digit code, 5 minutes, 5 attempts and 15 minutes are imposed by REQ-2516 and REQ-2522. The snapshot budget and the 20 GB storage ceiling stand in the Baselines table of ADR-0190, the repository's one list of budgets.
- Work created: the `compose.yaml` with the named volume, the unprivileged users and the loopback listener; the `Caddyfile`; the `./tower` script; the `devices` table; the pairing, PIN and lockout routes; the snapshot worker and pruner; the client shell with the interface choice.
- The ergonomic cost on the player is one: she needs a parent to pair a new device or re-pair one whose storage was wiped.
- Premortem, written as though it already happened: in the third week the Mac installed a macOS update overnight, Docker Desktop didn't start at login, and she met the waiting scene with nobody at home who knew why. The next week the parent ran `docker compose down -v` from an old note, and a whole session vanished, because the named volume went with it and the last snapshot was a day old. Neither failure hit the log's design; both hit the operator. So `./tower status` names the first case in one line, `./tower down` is the only documented way to stop, and the second reversal above covers a Docker Desktop that keeps failing to start.

## How I will know it was realised

1. `docker compose config` shows `tower` and `proxy` each with a non-root `user`, `cap_drop: [ALL]` and `no-new-privileges`, and `docker compose exec tower id -u` prints a number other than 0.
2. On the Mac, `ls data/` shows no `tower.sqlite`, and `docker volume inspect tower-db` shows the live file's volume.
3. A test kills the `tower` process right after the server sends an answer reply, restarts it, and finds that answer's events in the log, 100 times out of 100.
4. From a second machine on the home network, a request without a device token gets 401; with a revoked token it gets `401 device_revoked`; a pairing code older than 5 minutes is refused; and the sixth wrong code within 15 minutes is refused even when correct.
5. From a second machine on the home network, `http://<mac-name>.local:8080` refuses the connection, and on the Mac `http://localhost:8080` serves the Parent Room.
6. A real iPad, after `./tower ipad-setup` and nothing else, opens `https://<mac-name>.local` with no certificate warning and installs the home-screen app.
7. `grep -r "sk-or-" dist/client` finds nothing, and a Playwright test records every response the client receives in a full simulated day and finds no key.
8. With OpenRouter blocked at the network, a simulated adventure day plays to its finale on library and pool texts.
9. After 40 simulated sessions spread over three months, `data/snapshots/` holds 30 rolling snapshots plus the first of each month, and each snapshot opens in a SQLite client and lists its events.
10. Playwright at 1280x720 with no mouse reaches and operates every control on every screen by keyboard, with a visible focus ring; the parent judges both interfaces screen by screen for REQ-2534.
11. After a device plays a day, its IndexedDB holds at most the unsent-answer store, and its `localStorage` holds no game data.

## What this does not settle

- The event log, its tables and the export (ADR-0020).
- The play API, the lease between devices and the offline queue's behaviour (ADR-0030).
- The model gateway, its timeouts, keys per role and the budget (ADR-0100), and the fallback pools (ADR-0110).
- The UI framework and the screens of both interfaces (ADR-0150); this record only fixes that there are two, on one code base.
- The verify command, the `tools` container with Playwright and LanguageTool, and stage acceptance (ADR-0190).
- The Parent Room's content and the PIN session's timeout (ADR-0180 and ADR-0030).
- A copy of the data off the Mac. No decision in the design makes one; Time Machine covering `data/` is the parent's choice, and a disk failure without it loses everything. This needs the owner.
- Web push after the MVP beyond the table and cascade named above: the permission button, the service worker and VAPID keys come with that later item.

Amended by ADR-0340 and ADR-0350, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
