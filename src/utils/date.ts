const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function nowISOString(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + JST_OFFSET_MS);
  return jst.toISOString().replace('Z', '+09:00');
}

export function getDateString(date?: Date): string {
  const target = date ?? new Date();
  const jst = new Date(target.getTime() + JST_OFFSET_MS);
  return jst.toISOString().slice(0, 10);
}

export function formatDisplayDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const jst = new Date(date.getTime() + JST_OFFSET_MS);
    const y = jst.getUTCFullYear();
    const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
    const d = String(jst.getUTCDate()).padStart(2, '0');
    const hh = String(jst.getUTCHours()).padStart(2, '0');
    const mm = String(jst.getUTCMinutes()).padStart(2, '0');
    return `${y}/${m}/${d} ${hh}:${mm}`;
  } catch {
    return isoString;
  }
}
