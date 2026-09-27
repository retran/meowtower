// Player-facing strings, from the server's per-language file (CLAUDE.md):
// the client holds no text of its own, so a second language needs no code.
let strings: Record<string, string> = {};

export async function loadStrings(lang: string): Promise<void> {
  const res = await fetch(`/i18n/${lang}.json`);
  strings = (await res.json()) as Record<string, string>;
}

/** The string for `key`, with each `{name}` replaced from `vars`. */
export function t(key: string, vars: Record<string, string> = {}): string {
  const value = strings[key];
  if (value === undefined) {
    console.error(`string_missing: ${key}`);
    return key;
  }
  return value.replace(
    /\{(\w+)\}/g,
    (whole, name: string) => vars[name] ?? whole,
  );
}

/** A time of day as the player's language writes it, such as 14:32. */
export function clock(at: Date): string {
  return at.toLocaleTimeString(document.documentElement.lang || "ru", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
