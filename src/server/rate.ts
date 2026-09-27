// The per-device rate cap (SPC-0030): a device's 21st state-changing request
// within one second gets 429, and the next second lets it through again.
export const RATE_LIMIT = 20;
const WINDOW_MS = 1000;

export function createRateCap(
  now: () => number,
): (deviceId: string) => boolean {
  const recent = new Map<string, number[]>();
  /** True when the request may run; a refused request doesn't count. */
  return (deviceId) => {
    const at = now();
    const kept = (recent.get(deviceId) ?? []).filter((t) => at - t < WINDOW_MS);
    if (kept.length >= RATE_LIMIT) {
      recent.set(deviceId, kept);
      return false;
    }
    kept.push(at);
    recent.set(deviceId, kept);
    return true;
  };
}
