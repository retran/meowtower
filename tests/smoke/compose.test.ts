// Verify group 9 (ADR-0190): the Docker smoke test's static checks.
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

interface Service {
  user?: string;
  cap_drop?: string[];
  security_opt?: string[];
  read_only?: boolean;
  ports?: { target: number; published: string; host_ip?: string }[];
  volumes?: { type: string; source: string; target: string }[];
}

const config = JSON.parse(
  execFileSync("docker", ["compose", "config", "--format", "json"], {
    encoding: "utf8",
    env: { ...process.env, TOWER_HOST: "meowtower.local", TZ: "UTC" },
  }),
) as { services: Record<string, Service>; volumes?: Record<string, unknown> };

const service = (name: string): Service => {
  const found = config.services[name];
  if (!found) throw new Error(`compose.yaml has no service ${name}`);
  return found;
};

describe("REQ-2512: every server process runs as an unprivileged user", () => {
  for (const name of ["meowtower", "proxy"]) {
    it(`${name} runs hardened and not as root`, () => {
      const s = service(name);
      expect(s.user, `${name} user`).toBeDefined();
      expect(s.user?.split(":")[0]).not.toMatch(/^(root|0)$/);
      expect(s.cap_drop).toContain("ALL");
      expect(s.security_opt).toContain("no-new-privileges:true");
      expect(s.read_only).toBe(true);
    });
  }
});

describe("REQ-2502: all game data is stored on the parent's Mac", () => {
  it("keeps the live database in the named volume meowtower-db", () => {
    expect(config.volumes).toHaveProperty("meowtower-db");
    const db = service("meowtower").volumes?.find(
      (v) => v.source === "meowtower-db",
    );
    expect(db?.type).toBe("volume");
    expect(db?.target).toBe("/var/lib/meowtower");
  });

  it("keeps every other file in data/ on the Mac", () => {
    const binds = (service("meowtower").volumes ?? [])
      .filter((v) => v.type === "bind")
      .map((v) => v.source.replace(/.*\/data\//, "data/"));
    expect(binds).toEqual(
      expect.arrayContaining(["data/blobs", "data/snapshots", "data/exports"]),
    );
    const caddy = (service("proxy").volumes ?? []).find(
      (v) => v.target === "/data",
    );
    expect(caddy?.source).toMatch(/\/data\/caddy$/);
  });

  it("publishes HTTPS on the Mac's port 443 only from proxy", () => {
    expect(service("proxy").ports?.[0]).toMatchObject({
      target: 8443,
      published: "443",
    });
    expect(service("meowtower").ports ?? []).toEqual([]);
  });
});
