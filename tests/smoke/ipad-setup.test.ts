// REQ-2514: the profile ./meowtower ipad-setup serves carries Caddy's root
// certificate, so the iPad trusts the server after a one-time setup.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const dir = mkdtempSync(join(tmpdir(), "meowtower-ca-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

const cert = join(dir, "root.crt");
execFileSync(
  "openssl",
  [
    "req",
    "-x509",
    "-newkey",
    "ec",
    "-pkeyopt",
    "ec_paramgen_curve:P-256",
    "-nodes",
    "-keyout",
    join(dir, "root.key"),
    "-out",
    cert,
    "-days",
    "1",
    "-subj",
    "/CN=Test Local Authority",
  ],
  { stdio: "ignore" },
);

const profile = execFileSync("./meowtower", ["ipad-setup", "--print-profile"], {
  encoding: "utf8",
  env: { ...process.env, MEOWTOWER_ROOT_CERT: cert },
});

describe("REQ-2514: a one-time profile makes the iPad trust the server", () => {
  it("is a configuration profile installing a trusted root", () => {
    expect(profile).toContain(
      "<key>PayloadType</key>\n\t<string>Configuration</string>",
    );
    expect(profile).toContain("<string>com.apple.security.root</string>");
  });

  it("carries exactly Caddy's root certificate", () => {
    const der = execFileSync("openssl", [
      "x509",
      "-in",
      cert,
      "-outform",
      "DER",
    ]);
    const embedded = /<data>\s*([A-Za-z0-9+/=\s]+?)\s*<\/data>/.exec(
      profile,
    )?.[1];
    expect(embedded).toBeDefined();
    expect(Buffer.from((embedded ?? "").replace(/\s/g, ""), "base64")).toEqual(
      der,
    );
  });

  it("fails with a named error when Caddy has no root certificate yet", () => {
    let out = "";
    try {
      execFileSync("./meowtower", ["ipad-setup", "--print-profile"], {
        encoding: "utf8",
        env: { ...process.env, MEOWTOWER_ROOT_CERT: join(dir, "missing.crt") },
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (e) {
      out = String((e as { stdout: string }).stdout);
    }
    expect(out).toContain("root_certificate_missing");
  });
});
