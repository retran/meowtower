// The routes the shell calls. The device token travels as an HttpOnly cookie.
import type { Interface } from "./interface.js";

/** The paired device's interface, or null for a device not paired yet. */
export async function device(): Promise<{ kind: Interface } | null> {
  const res = await fetch("/api/device");
  // Read the body either way: an unread one stays open in the browser.
  const body = (await res.json()) as { kind: Interface };
  return res.status === 401 ? null : body;
}

export async function storeInterface(kind: Interface): Promise<boolean> {
  const res = await fetch("/api/device", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind }),
  });
  await res.json();
  return res.ok;
}

export async function pair(code: string, kind: Interface): Promise<boolean> {
  const res = await fetch("/api/pair", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code, kind }),
  });
  await res.json();
  return res.ok;
}
