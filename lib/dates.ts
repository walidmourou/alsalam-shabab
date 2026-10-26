import type { Locale } from "./i18n";

/** Calculates the age in full years from an ISO date (`YYYY-MM-DD`). */
export function ageFrom(birthDate: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDate);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const now = new Date();
  let age = now.getFullYear() - year;
  const monthDiff = now.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < day)) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

export function formatDate(value: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  return locale === "de" ? `${day}.${month}.${year}` : `${year}/${month}/${day}`;
}

export function formatDateTime(value: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(value);
  if (!match) return value;
  const [, year, month, day, hour, minute] = match;
  return locale === "de"
    ? `${day}.${month}.${year} ${hour}:${minute}`
    : `${year}/${month}/${day} ${hour}:${minute}`;
}
