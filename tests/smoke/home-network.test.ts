// REQ-2510: ./meowtower up starts nothing on a network other than the home one.
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const dir = mkdtempSync(join(tmpdir(), "meowtower-net-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const recorded = join(dir, "home-gateway");

function run(args: string[], gateway: string) {
  return spawnSync("./meowtower", args, {
    encoding: "utf8",
    env: {
      ...process.env,
      MEOWTOWER_HOME_GATEWAY_FILE: recorded,
      MEOWTOWER_GATEWAY_ID: gateway,
      // Make any docker call fail fast, so a test can't start real containers.
      DOCKER_HOST: "unix:///nonexistent.sock",
    },
  });
}

describe("REQ-2510: the server starts only on the home network", () => {
  it("records the home gateway on set-home-network", () => {
    const res = run(["set-home-network"], "192.168.1.1 aa:bb:cc:dd:ee:01");
    expect(res.status).toBe(0);
    expect(readFileSync(recorded, "utf8").trim()).toBe(
      "192.168.1.1 aa:bb:cc:dd:ee:01",
    );
  });

  it("refuses to start on another network, naming both gateways", () => {
    writeFileSync(recorded, "192.168.1.1 aa:bb:cc:dd:ee:01\n");
    const res = run(["up"], "192.168.1.1 aa:bb:cc:dd:ee:99");
    expect(res.status).toBe(1);
    expect(res.stdout).toContain("wrong_network");
    expect(res.stdout).toContain("aa:bb:cc:dd:ee:01");
    expect(res.stdout).toContain("aa:bb:cc:dd:ee:99");
  });

  it("passes the check on the home network", () => {
    writeFileSync(recorded, "192.168.1.1 aa:bb:cc:dd:ee:01\n");
    const res = run(["up"], "192.168.1.1 aa:bb:cc:dd:ee:01");
    // Past the network check, docker is unreachable in this test.
    expect(res.stdout).not.toContain("wrong_network");
    expect(res.stdout).toContain("docker_not_running");
  });
});

// BUG-0030: macOS 27 hides hardware addresses from the ARP table, so the stand-in tools below
// answer as it does, and the router's address comes from its IPv6 advertisement.
function withTools(summary: string) {
  const bin = mkdtempSync(join(dir, "bin-"));
  const tool = (name: string, body: string) => {
    const file = join(bin, name);
    writeFileSync(file, `#!/bin/sh\n${body}\n`);
    chmodSync(file, 0o755);
  };
  tool("route", 'printf "    gateway: 192.168.1.1\\n  interface: en0\\n"');
  tool("arp", 'echo "192.168.1.1 (192.168.1.1) -- no entry"');
  tool("ping", "exit 0");
  tool("ipconfig", `cat <<'OUT'\n${summary}\nOUT`);
  return spawnSync("./meowtower", ["set-home-network"], {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${bin}:${process.env["PATH"] ?? ""}`,
      MEOWTOWER_HOME_GATEWAY_FILE: recorded,
      MEOWTOWER_GATEWAY_ID: "",
      DOCKER_HOST: "unix:///nonexistent.sock",
    },
  });
}

describe("BUG-0030: the router's address when the ARP table hides it", () => {
  it("reads it from the EUI-64 source of the router's advertisement", () => {
    rmSync(recorded, { force: true });
    const res = withTools(
      "  RouterAdvertisement : from fe80::a255:1fff:fed5:ff36, length 120, hop limit 64",
    );
    expect(res.status).toBe(0);
    expect(readFileSync(recorded, "utf8").trim()).toBe(
      "192.168.1.1 a0:55:1f:d5:ff:36",
    );
  });

  it("records nothing when the advertisement's source carries no hardware address", () => {
    rmSync(recorded, { force: true });
    for (const summary of [
      "  RouterAdvertisement : from fe80::1, length 120",
      "  Router : 192.168.1.1",
    ]) {
      const res = withTools(summary);
      expect(res.status, summary).toBe(1);
      expect(res.stdout).toContain("gateway_unverified");
    }
  });
});
