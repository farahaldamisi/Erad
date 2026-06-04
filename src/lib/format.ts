import type { Lang } from "./i18n";

/** Always use Western digits (0–9), even in Arabic UI. */
const LATN = { numberingSystem: "latn" as const };

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", { ...LATN, ...options }).format(value);
}

export function formatDateTime(value: string | Date | number, lang: Lang = "en"): string {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-JO" : "en-GB", {
    ...LATN,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDateOnly(value: string | Date | number, lang: Lang = "en"): string {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-JO" : "en-GB", {
    ...LATN,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDayName(value: string | Date | number, lang: Lang = "en"): string {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-JO" : "en-GB", {
    ...LATN,
    weekday: "long",
  }).format(new Date(value));
}
