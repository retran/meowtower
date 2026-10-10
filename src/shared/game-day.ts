// The game day (SPC-0030, SPC-0090): it runs from 04:00 to 04:00 in the time
// zone of the device she plays on. `gameDayOf` is the one function that turns
// a time into a game day index; ADR-0090's epic takes it over.
const DAY_MS = 24 * 60 * 60 * 1000;
const BOUNDARY_MS = 4 * 60 * 60 * 1000;

const formats = new Map<string, Intl.DateTimeFormat>();

/** True when `zone` is an IANA time zone name this runtime knows. */
export function isZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** The wall clock of `ms` in `zone`, as milliseconds since 1970 read as UTC. */
function wallClock(ms: number, zone: string): number {
  let format = formats.get(zone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    formats.set(zone, format);
  }
  const part = (type: string): number =>
    Number(format.formatToParts(ms).find((p) => p.type === type)?.value);
  return Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    part("hour"),
    part("minute"),
    part("second"),
  );
}

/**
 * The index of the game day `ms` falls on in `zone`: whole days since
 * 1970-01-01 04:00 on that zone's wall clock, so the index turns at 04:00.
 */
export function gameDayOf(ms: number, zone: string): number {
  return Math.floor((wallClock(ms, zone) - BOUNDARY_MS) / DAY_MS);
}
