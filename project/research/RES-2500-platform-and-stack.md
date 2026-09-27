---
id: RES-2500
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes a TypeScript web game served from Docker on the parent's Mac to an iPad and a computer over the home network

## Summary

The owner's draft proposes a TypeScript web application. A server in Docker on
the parent's Mac keeps everything in SQLite and serves the game to browsers on
an iPad and a computer over the home network. Caddy terminates HTTPS with its
own local certificate authority, so the iPad can install the game as a home
screen web app. Devices pair with a six-digit code and keep a long-lived token,
and the Parent Room sits behind a PIN. The host never opens the live database:
it takes snapshots with `VACUUM INTO`, and the event log in each snapshot is
enough to rebuild everything else. The iPad and the computer get two full
interfaces on one code base, with separate fluency thresholds per device type.
This record covers the stack, Docker and running, pairing and security, SQLite
and backups, the two clients and the repository layout. The data model,
privacy, daily cost, graphics and autonomous development each have their own
record.

## The question

What does the game run on, where does it run, and how do the player's devices
reach it safely? The draft assumes a Mac that stays on at home and a home
network the family trusts. That assumption ties the game to one machine and
one network: when the Mac sleeps, moves or fails, the game stops, and the
backups on that Mac are the only copy of the player's history unless Time
Machine or another copy exists.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles -
specification), the opening paragraph and the section «Техническая реализация»
(technical implementation) with its subsections «Стек» (stack), «Docker и
запуск» (Docker and running), «Сопряжение и безопасность» (pairing and
security), «SQLite и резервные копии» (SQLite and backups), «Клиенты: iPad и
компьютер» (clients: iPad and computer) and «Структура репозитория»
(repository layout), on 2026-09-26. I translated the comments in the code
blocks into English and left the code itself as the draft gives it. No
alternatives were compared, because the record carries the owner's proposal
for later requirements to cite.

The draft leaves these open:

- Whether `erikvl87/languagetool` is the right LanguageTool image: the draft
  checks it at stage 0 and names `hunspell-ru` in `tools` as the fallback.
- Whether to use `better-sqlite3` or the built-in `node:sqlite`.
- What happens when Docker Desktop doesn't start with the system, since the
  automatic restart after a Mac reboot depends on it.
- How many older snapshots count as "one per month", and for how long.

## Findings

### The draft proposes a TypeScript web application served from the parent's Mac

The game is a web application in TypeScript. A server in Docker on the
parent's Mac stores everything in SQLite and serves the game to browsers on an
iPad and a computer over the home network. The draft states that the internet
is always available, because the Master, live frames and pictures come through
OpenRouter. If the API fails, the game doesn't stop: it takes texts from the
library and the fallback pools. Since the owner's decision of 2026-09-27, Jev
also takes checks with a fixed set of answers, and falls back to
`SAFETY_MODEL` when it fails (RES-1600). Research decided the same day, on
the owner's instruction, that Jev runs through OpenRouter's zero-retention
route, `typesafe/jev-1.13`, so it needs no key beside the OpenRouter key
(RES-2600). An earlier text had Jev at TypeSafe, outside OpenRouter.

### The draft names the stack component by component

- TypeScript in strict mode (`strict`, `noUncheckedIndexedAccess`), built with
  Vite.
- User interface: Preact and CSS animations for screens and System windows;
  PixiJS for scenes, backgrounds, sprites and effects. Maths pictures are SVG
  generated from code.
- Server: Node 22 or later, Hono. The server serves the game, runs the
  Director, writes each answer to the database at once, holds the OpenRouter
  key and prepares scenes and frames in advance. The key never reaches the
  browser. Scene events travel over SSE (server-sent events).
- Storage: SQLite in the file `data/tower.sqlite`, WAL (write-ahead logging)
  mode, through `better-sqlite3` or the built-in `node:sqlite`. Migrations are
  numbered SQL files. The event log is the table `events`, and projections are
  rebuilt from it. Export to Parquet uses DuckDB (`@duckdb/node-api`).
- Schemas: zod in `src/shared/`, shared by client and server.
- Server-side images: sharp, for chroma key, WebP and previews.
- Tests: Vitest, fast-check, Playwright.

### The draft gives a Compose file with four services

The draft's `compose.yaml`, with comments translated:

```yaml
# compose.yaml
services:
  tower:
    build: .                       # multi-stage: Vite build -> node:22-slim (+ sharp)
    expose: ["4173"]
    env_file: .env                 # OPENROUTER_API_KEY, models, budgets
    volumes:
      - ./data:/app/data           # tower.sqlite, snapshots, exports - on the Mac's disk
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "dist/server/health.js"]

  proxy:                           # HTTPS for the iPad on the home network
    image: caddy:2
    ports: ["443:443"]             # https://<mac-name>.local
    volumes:
      - ./deploy/Caddyfile:/etc/caddy/Caddyfile
      - ./data/caddy:/data         # Caddy's local CA (tls internal)
    depends_on: [tower]
    restart: unless-stopped

  languagetool:                    # Russian spelling and grammar for the bake-off and text checks
    image: erikvl87/languagetool   # image checked at stage 0; fallback - hunspell-ru in tools
    profiles: ["tools"]
    expose: ["8010"]

  tools:                           # content generation and tests, on demand
    build: { context: ., target: tools }   # + Playwright
    profiles: ["tools"]
    env_file: .env
    volumes:
      - ./content:/app/content
      - ./public/art:/app/public/art
      - ./data:/app/data
      - ./artifacts:/app/artifacts
```

The draft's `Caddyfile`, with the comment translated:

```text
# deploy/Caddyfile
{$MAC_HOST}.local, localhost {
  tls internal
  reverse_proxy tower:4173 {
    flush_interval -1              # SSE without buffering
  }
}
```

### The draft runs the game with one script, `./tower`

- Start: `./tower up` runs `docker compose up -d`, runs `caffeinate` so the Mac
  doesn't sleep during play, and shows a QR code with the address for the
  iPad. With `restart: unless-stopped` the server comes back after the Mac
  reboots, if Docker Desktop starts with the system.
- Content and tests: `docker compose run --rm tools <command>`, with the
  commands `frames:generate`, `art:generate`, `bakeoff` and `verify`.
- Development: `compose.dev.yaml` mounts the sources and runs Vite with hot
  reload.

### The draft pairs devices with a short-lived code and a long-lived token

- `./tower pair` on the Mac, or «Добавить устройство» (Add device) in the
  Parent Room, shows a 6-digit code that lives 5 minutes. The device enters
  the code and gets a long-lived token.
- After 5 wrong attempts at a code or at the PIN, the server locks for 15
  minutes.
- The parent revokes tokens in the Parent Room, which lists devices with the
  date of their last sign-in.
- The Parent Room sits behind a PIN, in a separate session with a timeout.
- The server is reachable only from the home network, and no port is forwarded
  to the outside. Containers run as an unprivileged user, and `.env` is in
  `.gitignore`.

### Resolved: The server sends alarms as web push to the parent's phone, with keys kept on the Mac

RES-1800 compares the ways to tell the parent of a serious signal and chooses web push to the Parent Room, installed as a home-screen web app on the parent's iPhone, over ntfy, e-mail and SMS. The setup fits this stack without a cloud account:

- The parent pairs the phone like any device, trusts the Caddy certificate with the same profile as the iPad, adds the Parent Room to the home screen and taps a button there to allow notifications. WebKit requires iOS 16.4 or later, a manifest, a service worker and a permission asked on a tap, and no Apple Developer Program membership.
- The server keeps its VAPID (Voluntary Application Server Identification) key pair in `data/` and stores each phone's push subscription with the device's token, so revoking the device also drops its subscription.
- The server sends each push outwards to Apple's push service at `*.push.apple.com`, so the rule that no port is forwarded to the outside still holds. The payload is encrypted for the phone and names no details.
- Only the Parent Room asks for the permission, so the child's devices never subscribe.

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's decision of 2026-09-27 replaced this finding for the MVP: alarms go to the Parent Room only, and the web push waits until after the MVP. The next finding holds it.

### Resolved: the MVP server shows alarms in the Parent Room only, and the web push setup comes after the MVP

The owner decided on 2026-09-27: alarms go to the Parent Room only, and the web push to the parent's iPhone is postponed until after the MVP. The MVP server therefore needs no VAPID keys, no push subscription table, no service worker for push and no outbound connection to `*.push.apple.com`. The server still records each alarm and serves it at `GET /api/parent/alerts` (RES-2400). The setup above stays as the plan for the later item, so building it then adds the keys, the table and the permission button without changing the alarm record.

### The draft keeps the host away from the live database

The host never opens the live database directly, because WAL inside the
container and the Docker Desktop file system handle outside access badly.

- `./tower db-snapshot` runs `VACUUM INTO data/snapshots/tower-<date>.sqlite`.
  Any SQL client can open a snapshot.
- A snapshot is taken automatically after each completed session and before
  each migration. The last 30 are kept, plus one per month.
- The backup is the folders `data/snapshots/` and `data/blobs/`, Time Machine
  included. The part of a snapshot that matters is the `events` log, because
  everything else is rebuilt from it.

### The draft builds two full interfaces on one code base

The tablet interface serves the iPad in Safari with touch and Apple Pencil. The
computer interface serves Chrome, Safari and Firefox with keyboard, mouse and
trackpad. The game picks the interface from the input device (`pointer:
coarse` or `fine`) and the screen size, and the player can switch it in the
settings. Progress, collection and history are shared.

### The draft specifies the iPad client

- Home screen web app: a manifest with `display: standalone`, an icon, a
  splash screen, safe areas and no accidental zoom.
- Orientation: landscape only. In portrait a CSS overlay says «Поверни iPad»
  (Turn the iPad), because Safari can't lock orientation.
- Root certificate, installed once: open the profile address from the QR code
  of `./tower ipad-setup` in Safari, download the `.mobileconfig`, go to
  Settings > General > VPN & Device Management and install the profile, then
  go to Settings > General > About > Certificate Trust Settings and turn on
  trust for the Caddy CA.
- Storage: `navigator.storage.persist()` on first launch. IndexedDB holds only
  the queue of unsent answers, and progress lives on the server. A service
  worker caches code, graphics and sound.
- Own on-screen keyboard for maths: buttons at least 56 pt, on the right under
  the thumb. The system keyboard never appears in tasks. A physical keyboard
  also works.
- System keyboard and dictation in the story fields and when choosing names;
  dictation in Russian.
- Scratchpad: a canvas for finger and Apple Pencil (Pointer Events; the palm
  is ignored while drawing with the pencil). A thumbnail is saved.
- Gestures: tap on a point, tap on cells, drag to reorder; touch zones with a
  margin.
- Time is measured on the device with `performance.now()` and sent with the
  answer. Going to the background (`visibilitychange`) pauses it.
- Sound starts on the first touch and respects silent mode; music and effects
  are separate.
- Performance: 60 frames a second on older iPad generations; WebP, atlases,
  lazy loading of floors.

### Resolved: every touch target on the tablet is at least 56 px, and 44 px controls are allowed only with a pointer

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft asks for keypad buttons of at least 56 pt, and the owner's design
token `touch-min` is 56px, «минимальная зона касания любой кнопки» (the
minimum touch zone of any button). Safari on the iPad draws one CSS pixel per
point, so 56 px and 56 pt are one size. The design's own components break
the rule in three places (RES-3200): the top bar's «Привал» (Rest stop) and
«Сохранить и уйти» (Save and leave) buttons at the 44px `sm` size on every
device, the story suggestion chips at 44px and the colour swatches at 44px.
Two options were weighed:

- Accept the 44 px exceptions. 44 by 44 CSS px is the WCAG 2.2 target size
  at level AAA (success criterion 2.5.5), so the controls would still pass
  the strictest published web rule, and the top bar stays 44 px high.
- Hold 56 px on the tablet. The draft and the design both chose 56 for one
  child on a tablet, a stricter figure than WCAG's on purpose. A miss on
  «Сохранить и уйти» or «Привал» takes her out of the task or into a rest
  stop, and the chips are one of the two ways she acts in the story, so these
  are the controls where a miss costs most. The cost is 12 px of height for
  the top bar on an 820 px screen.

The 56 px rule wins on the tablet, because the design's own token defines it
as the minimum for any button and the exceptions sit on high-use controls.
The rule counts the touch zone, not the drawing: a control may look smaller
if its hit area reaches 56 px without overlapping a neighbour's, as `TermHint`
already does by widening its hit area. With a pointer (`pointer: fine`), 44 px
`sm` buttons stay allowed, as `Button/README.md` says. RES-3200 records the
proposed changes to the design.

### The draft specifies the computer client

- Layout from 1280x720 to 4K. The scene scales and keeps its proportions; full
  screen is available.
- Physical keyboard input: digits, «,» and «.»; «/» or the down arrow moves to
  the denominator and the up arrow moves back; Tab moves to the next field;
  «:» enters a time; Enter is «Готово» (Done); Esc clears; «?» is «Не знаю»
  (I don't know). The on-screen keyboard is there too.
- Choices by keys 1 to 4 or by click; point tasks with highlight and snap to
  the grid; cells with the arrow keys and the space bar.
- Scratchpad: a squared text field, handy for column arithmetic, plus a
  canvas. The log records which kind of scratchpad was used.
- Story and names: Enter sends, Shift+Enter starts a new line, 1 to 3 pick a
  ready-made option.
- Keyboard navigation on every screen, with visible focus.
- Parent Room on a wide screen: a full-width map and sortable tables.

### The draft keeps timing comparable only within one device type

- Every task records the device and the input method (`inputMethod`).
- Fluency thresholds and calibration are kept separately for the iPad and the
  computer. Time trends are compared only within one device type.
- The Ascent runs on the default device, which the parent sets; the default
  is the iPad. The Ascent is deferred until after the MVP by the draft. The
  adventure of the day can continue on any device, and time is compared only
  within one device type.

### The draft lays out the repository in three source trees and a data folder

The draft's layout, with comments translated:

```text
src/
  shared/        # zod API schemas, types
  engine/        # graph, knowledge model, task selection, states - no UI
    events/      # log writing, event schemas, immutability check
    projections/ # log projections: estimates, report, game, resume snapshot; full recompute
  explain/       # explanations: request, checks, placeholders, cache, fallback
  math/          # Q (rationals on bigint), rng, number formatting
  templates/     # one file per node: A5.ts, F6.ts ...
  render/        # SVG: number line, fractions, grid, clock, charts, scales
  i18n/          # ru.ts (strings, declensions); nl.ts - later
  game/          # scenes, battle, familiars, Diary, progression, rewards
  master/        # scene orders, prompts, validation, fallback pools
  parent/        # report, map, trends, tags, review queues
  server/        # Hono: API, SSE, Director, LLM client, art queue
content/
  canon.ru.md  art-style.md  graph.yaml  anchors.json  thresholds.json
  frames.ru.json  science.ru.json  lexicon.ru.json  lexicon.nl.json
  lines.ru.json  safety.ru.json  familiars.yaml  art.yaml
  shaming.ru.json  branches.ru.json  bakeoff/prompts.ru.json
  model.v1.json  recipes.ru.json  shop.ru.json
tools/
  frames-generate.ts  lines-generate.ts  art-generate.ts  bakeoff.ts
  explain-generate.ts  fit-model.ts  export.ts
data/                # tower.sqlite, blobs/, snapshots/, exports/, caddy/ - in .gitignore
```

The Dutch string file `nl.ts` is deferred until after the MVP by the draft.

## Conclusions

1. The game must run as a web application whose server keeps all data in
   SQLite on the parent's Mac and serves the iPad and the computer over the
   home network.
2. The OpenRouter key must stay on the server and never reach a browser.
3. When the OpenRouter API fails, the game must keep running on texts from the
   library and the fallback pools.
4. The server must write each answer to the database as soon as it arrives.
5. The server must be reachable only from the home network, with no port
   forwarded to the outside, and its containers must run as an unprivileged
   user.
6. The iPad must reach the game over HTTPS, trusted through a local
   certificate authority it installs once.
7. A device must pair with a 6-digit code that expires after 5 minutes and
   then hold a long-lived token the parent can revoke from the Parent Room.
8. After 5 wrong attempts at a pairing code or the PIN, the server must refuse
   further attempts for 15 minutes.
9. The Parent Room must require the PIN and run in a separate session with a
   timeout.
10. The host must never open the live database directly, and must read data
    only from snapshots taken with `VACUUM INTO`.
11. A snapshot must be taken after each completed session and before each
    migration, keeping the last 30 and one per month.
12. The backup must hold the event log and the blobs, because every other
    table is rebuilt from the event log.
13. The game must offer a full tablet interface and a full computer interface
    on one code base, chosen by input device and screen size and switchable in
    the settings, with shared progress.
14. On the iPad, tasks must use the game's own maths keyboard, with buttons at
    least 56 pt, and the system keyboard must never appear in a task.
15. The game must measure answer time on the device, pause it while the game is
    in the background, and send it with the answer.
16. Every task must record the device and the input method, and fluency
    thresholds and time trends must be kept per device type.
17. On the computer, every screen must be usable from the keyboard with
    visible focus.
18. The iPad must hold only unsent answers locally, and progress must live on
    the server.
19. After the MVP, the server must send alarm pushes only to push
    subscriptions made from the Parent Room on a paired device, keep its
    VAPID keys on the Mac, and drop a device's subscription when the parent
    revokes the device. In the MVP the server sends no pushes and shows
    alarms in the Parent Room only, as the owner decided on 2026-09-27.
20. On the iPad, every touch target must have a touch zone of at least
    56 px in both directions, drawn or extended without overlapping a
    neighbour's, and controls of 44 px are allowed only on the computer
    interface.
21. The server must reach Jev through the OpenRouter play key, at
    `typesafe/jev-1.13` on OpenRouter's zero-retention route, and hold no
    separate TypeSafe key, as research decided on 2026-09-27 on the owner's
    instruction; when a Jev call fails, each check must fall back to
    `SAFETY_MODEL`. (The draft of this conclusion held a TypeSafe key beside
    the OpenRouter key.)

## Sources

- The owner's draft «Хроники Башни — спецификация», the opening paragraph and the section «Техническая реализация» with its subsections «Стек», «Docker и запуск», «Сопряжение и безопасность», «SQLite и резервные копии», «Клиенты: iPad и компьютер» and «Структура репозитория», read 2026-09-26; not kept in the repository - supports every finding above.
- WebKit, «Web Push for Web Apps on iOS and iPadOS», https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/, read 2026-09-26 - the requirements for web push to a home-screen web app, and the push service domain `*.push.apple.com`.
- W3C, «Understanding Success Criterion 2.5.5: Target Size (Enhanced)», WCAG 2.2, https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html, read 2026-09-26 - a pointer target of at least 44 by 44 CSS pixels at level AAA, the figure the 44 px exceptions would meet.
- The owner's decision of 2026-09-27, relayed that day: Jev can be used to evaluate safety and similar judgements - conclusion 21.
