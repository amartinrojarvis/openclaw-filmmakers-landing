export const SAVED_CASOS_KEY = 'iaf-casos-guardados';

export function parseSavedIds(raw: string | null, known: ReadonlySet<string>): string[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const ids: string[] = [];
  for (const item of parsed) {
    if (typeof item === 'string' && known.has(item) && !ids.includes(item)) ids.push(item);
  }
  return ids;
}
