// REQ-3800, REQ-2202: every event carries the full envelope.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  appendEvents,
  LogWriteFailed,
  type NewEvent,
} from "../../src/engine/events/append.js";
import { openDatabase, type Db } from "../../src/server/database.js";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
function db(): Db {
  const dir = mkdtempSync(join(tmpdir(), "meowtower-append-"));
  dirs.push(dir);
  return openDatabase(join(dir, "meowtower.sqlite"));
}

interface Row {
  seq: number;
  id: string;
  ts: string;
  client_ms: number;
  device_id: string;
  session_id: string | null;
  adventure_id: string | null;
  type: string;
  v: number;
  payload: string;
  idem_key: string | null;
}
const all = (d: Db): Row[] =>
  d.prepare("SELECT * FROM events ORDER BY seq").all() as Row[];

const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const fromDevice = (i: number): NewEvent => ({
  type: "attempt_submitted",
  v: 0,
  payload: { raw: String(i) },
  origin: { deviceId: "ipad-1", clientMs: 1_790_000_000_000 + i },
  sessionId: "s1",
  adventureId: "a1",
});

describe("REQ-3800, REQ-2202: the event envelope", () => {
  it("gives 1,000 events appended in batches a unique ULID, one increasing seq and every envelope field", () => {
    const d = db();
    const returned = [];
    for (let b = 0; b < 10; b++)
      returned.push(
        ...appendEvents(
          d,
          Array.from({ length: 100 }, (_, i) => fromDevice(b * 100 + i)),
        ),
      );
    const events = all(d);
    expect(events).toHaveLength(1000);
    expect(returned).toEqual(events.map((e) => ({ seq: e.seq, id: e.id })));
    expect(new Set(events.map((e) => e.id)).size).toBe(1000);
    events.forEach((e, i) => {
      expect(e.seq).toBe(i + 1);
      expect(e.id).toMatch(ULID);
      expect(e.type).toBe("attempt_submitted");
      expect(e.v).toBe(0);
      expect(e.ts).toMatch(UTC);
      expect(e.client_ms).toBe(1_790_000_000_000 + i);
      expect(e.device_id).toBe("ipad-1");
      expect(e.session_id).toBe("s1");
      expect(e.adventure_id).toBe("a1");
      expect(JSON.parse(e.payload)).toEqual({ raw: String(i) });
    });
    d.close();
  });

  it("marks an event the server writes on its own with device 'server' and the server time", () => {
    const d = db();
    appendEvents(d, [
      {
        type: "attempt_submitted",
        v: 0,
        payload: { raw: "" },
        origin: "server",
      },
    ]);
    const [e] = all(d);
    expect(e?.device_id).toBe("server");
    expect(e?.client_ms).toBe(Date.parse(e?.ts ?? ""));
    expect(e?.session_id).toBeNull();
    expect(e?.adventure_id).toBeNull();
    d.close();
  });

  it("keeps idem_key unique where present", () => {
    const d = db();
    appendEvents(d, [{ ...fromDevice(0), idemKey: "k" }, fromDevice(1)]);
    appendEvents(d, [fromDevice(2)]);
    expect(() => appendEvents(d, [{ ...fromDevice(3), idemKey: "k" }])).toThrow(
      LogWriteFailed,
    );
    expect(all(d)).toHaveLength(3);
    d.close();
  });

  it("writes nothing of a batch when one insert fails", () => {
    const d = db();
    expect(() =>
      appendEvents(d, [
        { ...fromDevice(0), idemKey: "k" },
        { ...fromDevice(1), idemKey: "k" },
      ]),
    ).toThrow(LogWriteFailed);
    expect(all(d)).toHaveLength(0);
    d.close();
  });
});
