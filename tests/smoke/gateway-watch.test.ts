// TSK-0430: `up` refuses a gateway whose hardware address is unknown, and a
// launchd watch stops the containers when the gateway changes (REQ-2510,
// SPC-0010). The script runs from a copy in a scratch folder, with `route`,
// `ping`, `arp`, `docker` and `launchctl` stubbed on PATH, so nothing starts
// and no real job loads.
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const root = mkdtempSync(join(tmpdir(), "meowtower-gw-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));

interface Net {
  /** The gateway's IP address the stubbed `route` prints. */
  ip?: string;
  /** The hardware address `arp` finds, or null for no entry at all. */
  mac?: string | null;
  /** True when `ping` answers, so the ARP table then holds the entry. */
  pingAnswers?: boolean;
  /** True when the stubbed `docker compose ps` lists both containers. */
  running?: boolean;
}

let worlds = 0;
function world(net: Net = {}) {
  const dir = join(root, `w${++worlds}`);
  const bin = join(dir, "bin");
  const home = join(dir, "home");
  mkdirSync(bin, { recursive: true });
  mkdirSync(home, { recursive: true });
  copyFileSync("meowtower", join(dir, "meowtower"));
  chmodSync(join(dir, "meowtower"), 0o755);
  const stub = (name: string, body: string): void => {
    writeFileSync(join(bin, name), `#!/bin/sh\n${body}\n`);
    chmodSync(join(bin, name), 0o755);
  };
  const state = join(dir, "state");
  mkdirSync(state);
  const set = (n: Net): void => {
    writeFileSync(join(state, "ip"), n.ip ?? "192.168.1.1");
    writeFileSync(
      join(state, "mac"),
      n.mac === null ? "" : (n.mac ?? "aa:bb:cc:dd:ee:01"),
    );
    writeFileSync(join(state, "answers"), n.pingAnswers === false ? "0" : "1");
    writeFileSync(join(state, "running"), n.running ? "1" : "0");
  };
  set(net);
  stub("route", `echo "   gateway: $(cat ${state}/ip)"`);
  // The ARP table holds the entry once a ping has been answered, or from the
  // start when `mac` is set and `pingFirst` isn't asked for.
  stub(
    "ping",
    `echo ping >> ${state}/ping.log\n[ "$(cat ${state}/answers)" = 1 ] && touch ${state}/pinged\n[ "$(cat ${state}/answers)" = 1 ]`,
  );
  stub(
    "arp",
    `mac=$(cat ${state}/mac)\nif [ -n "$mac" ] && { [ ! -f ${state}/needs-ping ] || [ -f ${state}/pinged ]; }; then echo "? ($(cat ${state}/ip)) at $mac on en0 ifscope [ethernet]"; else echo "$(cat ${state}/ip) ($(cat ${state}/ip)) -- no entry"; fi`,
  );
  stub(
    "docker",
    `echo "$*" >> ${state}/docker.log\ncase "$*" in\n*"compose"*" ps "*) [ "$(cat ${state}/running)" = 1 ] && printf 'meowtower-meowtower-1\\nmeowtower-proxy-1\\n';;\nesac\nexit 0`,
  );
  stub(
    "launchctl",
    `echo "$*" >> ${state}/launchctl.log\ncase "$1" in\nload) shift; for a; do [ "$a" != -w ] && basename "$a" .plist >> ${state}/loaded; done;;\nunload) shift; for a; do [ "$a" != -w ] && grep -v "$(basename "$a" .plist)" ${state}/loaded > ${state}/loaded.new; mv ${state}/loaded.new ${state}/loaded; done;;\nlist) cat ${state}/loaded;;\nesac\nexit 0`,
  );
  writeFileSync(join(state, "loaded"), "");
  stub("caffeinate", "sleep 30");
  const run = (args: string[], env: Record<string, string> = {}) =>
    spawnSync(join(dir, "meowtower"), args, {
      encoding: "utf8",
      cwd: dir,
      env: {
        ...process.env,
        HOME: home,
        PATH: `${bin}:${process.env["PATH"] ?? ""}`,
        MEOWTOWER_PARENT_PORT: "18999",
        ...env,
      },
    });
  const read = (file: string): string =>
    existsSync(join(state, file))
      ? readFileSync(join(state, file), "utf8")
      : "";
  const recordedFile = join(dir, "data", "home-gateway");
  const record = (line: string): void => {
    mkdirSync(join(dir, "data"), { recursive: true });
    writeFileSync(recordedFile, `${line}\n`);
  };
  const startedStack = (): boolean =>
    /compose .*up -d/.test(read("docker.log"));
  return {
    dir,
    state,
    run,
    set,
    read,
    record,
    recordedFile,
    startedStack,
    launchAgent: join(
      home,
      "Library",
      "LaunchAgents",
      "local.meowtower.watch.plist",
    ),
    notices: join(dir, "data", "snapshots", "notices.json"),
    needPing: () => writeFileSync(join(state, "needs-ping"), ""),
  };
}

describe("REQ-2510: up refuses a gateway whose hardware address is unknown", () => {
  it("prints gateway_unverified and starts nothing when the ping brings no entry", () => {
    const w = world({ mac: null, pingAnswers: false });
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    const res = w.run(["up"]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain("gateway_unverified");
    expect(res.stdout).toContain("./meowtower set-home-network");
    expect(w.startedStack()).toBe(false);
  });

  it("prints gateway_unverified when the recorded hardware address is unknown", () => {
    const w = world();
    w.record("192.168.1.1 unknown");
    const res = w.run(["up"]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain("gateway_unverified");
    expect(w.startedStack()).toBe(false);
  });

  it("starts the stack when the first read misses and the read after the ping hits", () => {
    const w = world();
    w.needPing();
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    const res = w.run(["up"]);
    expect(res.stdout).not.toContain("gateway_unverified");
    expect(w.startedStack()).toBe(true);
    expect(w.read("ping.log")).toContain("ping");
  });
});

describe("REQ-2510: set-home-network pings, then records or keeps the old record", () => {
  it("records the hardware address once the gateway answers, and the next up starts", () => {
    const w = world({ mac: "aa:bb:cc:dd:ee:07" });
    w.needPing();
    w.record("192.168.1.1 unknown");
    const res = w.run(["set-home-network"]);
    expect(res.status).toBe(0);
    expect(readFileSync(w.recordedFile, "utf8").trim()).toBe(
      "192.168.1.1 aa:bb:cc:dd:ee:07",
    );
    w.run(["up"]);
    expect(w.startedStack()).toBe(true);
  });

  it("records nothing and prints gateway_unverified when the gateway doesn't answer", () => {
    const w = world({ mac: null, pingAnswers: false });
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    const res = w.run(["set-home-network"]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain("gateway_unverified");
    expect(readFileSync(w.recordedFile, "utf8").trim()).toBe(
      "192.168.1.1 aa:bb:cc:dd:ee:01",
    );
  });
});

describe("REQ-2510: up loads the network watch and down unloads it", () => {
  it("writes the agent with RunAtLoad into ~/Library/LaunchAgents and loads it", () => {
    const w = world();
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    const res = w.run(["up"]);
    expect(res.status).toBe(0);
    const plist = readFileSync(w.launchAgent, "utf8");
    expect(plist).toContain("local.meowtower.watch");
    expect(plist).toMatch(/<key>RunAtLoad<\/key>\s*<true\/>/);
    expect(plist).toContain("<string>watch</string>");
    expect(w.read("loaded")).toContain("local.meowtower.watch");
  });

  it("unloads the agent on down", () => {
    const w = world();
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    w.run(["up"]);
    expect(w.read("loaded")).toContain("local.meowtower.watch");
    const res = w.run(["down"]);
    expect(res.status).toBe(0);
    expect(w.read("loaded")).not.toContain("local.meowtower.watch");
    expect(existsSync(w.launchAgent)).toBe(false);
  });
});

describe("REQ-2510: the watch stops both containers when the gateway changes", () => {
  const stops = (w: ReturnType<typeof world>): number =>
    (w.read("docker.log").match(/compose .*stop/g) ?? []).length;

  it("stops both containers on a different IP address and writes wrong_network", () => {
    const w = world({
      ip: "10.0.0.1",
      mac: "aa:bb:cc:dd:ee:09",
      running: true,
    });
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    const res = w.run(["watch", "--once"]);
    expect(res.status).toBe(0);
    expect(stops(w)).toBe(1);
    const notice = JSON.parse(readFileSync(w.notices, "utf8")) as {
      wrong_network: { recorded: string; current: string };
    };
    expect(notice.wrong_network.recorded).toBe("192.168.1.1 aa:bb:cc:dd:ee:01");
    expect(notice.wrong_network.current).toBe("10.0.0.1 aa:bb:cc:dd:ee:09");
    const status = w.run(["status"]);
    expect(status.stdout).toContain("wrong_network");
    expect(status.stdout).toContain("192.168.1.1 aa:bb:cc:dd:ee:01");
    expect(status.stdout).toContain("10.0.0.1 aa:bb:cc:dd:ee:09");
  });

  it("stops both containers on the same IP address with another hardware address", () => {
    const w = world({ mac: "aa:bb:cc:dd:ee:99", running: true });
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    w.run(["watch", "--once"]);
    expect(stops(w)).toBe(1);
  });

  it("pings the gateway before it reads the hardware address", () => {
    const w = world({ running: true });
    w.needPing();
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    w.run(["watch", "--once"]);
    expect(w.read("ping.log")).toContain("ping");
    expect(stops(w)).toBe(0);
  });

  it("stops nothing while the gateway is the recorded one", () => {
    const w = world({ running: true });
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    w.run(["watch", "--once"]);
    expect(stops(w)).toBe(0);
    expect(existsSync(w.notices)).toBe(false);
  });

  it("stops nothing further while the containers are down, and keeps the notice", () => {
    const w = world({ ip: "10.0.0.1", running: false });
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    w.run(["watch", "--once"]);
    expect(stops(w)).toBe(0);
  });

  it("checks at once when it loads, and stops on an unverified gateway", () => {
    const w = world({ mac: null, pingAnswers: false, running: true });
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    // One tick, then the loop would sleep 60 seconds; the test ends it there.
    const res = w.run(["watch"], {
      MEOWTOWER_WATCH_TICKS: "1",
      MEOWTOWER_WATCH_SLEEP: "0",
    });
    expect(res.status).toBe(0);
    expect(stops(w)).toBe(1);
  });

  it("clears the notice when up starts on the home network again", () => {
    const w = world({
      ip: "10.0.0.1",
      mac: "aa:bb:cc:dd:ee:09",
      running: true,
    });
    w.record("192.168.1.1 aa:bb:cc:dd:ee:01");
    w.run(["watch", "--once"]);
    w.set({ ip: "192.168.1.1", mac: "aa:bb:cc:dd:ee:01", running: false });
    w.run(["up"]);
    expect(readFileSync(w.notices, "utf8")).not.toContain("wrong_network");
  });
});
