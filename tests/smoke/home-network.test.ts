// REQ-2510: ./meowtower up starts nothing on a network other than the home one.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
