import type { Lang } from "./i18n";

const LATN = { numberingSystem: "latn" as const };

export function formatPrice(amount: number, _lang: Lang = "en"): string {
  return new Intl.NumberFormat("en-JO", {
    ...LATN,
    style: "currency",
    currency: "JOD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
