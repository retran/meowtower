// Player-facing strings, from the server's per-language file (CLAUDE.md):
// the client holds no text of its own, so a second language needs no code.
let strings: Record<string, string> = {};

export async function loadStrings(lang: string): Promise<void> {
  const res = await fetch(`/i18n/${lang}.json`);
  strings = (await res.json()) as Record<string, string>;
}

export function t(key: string): string {
  const value = strings[key];
  if (value === undefined) {
    console.error(`string_missing: ${key}`);
    return key;
  }
  return value;
}
