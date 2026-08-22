import type { Locale } from "@prisma/client";
import type { AppLocale } from "@/i18n/routing";

/**
 * Fallback chain per spec §45: uk -> ru -> en, ru -> en, en -> en.
 * Never silently falls further than the ultimate EN row.
 */
const FALLBACK_CHAINS: Record<Locale, Locale[]> = {
  EN: ["EN"],
  RU: ["RU", "EN"],
  UK: ["UK", "RU", "EN"],
};

export function toDbLocale(locale: AppLocale): Locale {
  return locale.toUpperCase() as Locale;
}

export function toAppLocale(locale: Locale): AppLocale {
  return locale.toLowerCase() as AppLocale;
}

export type WithLocale = { locale: Locale };

/**
 * Picks the best-matching translation for `locale`, falling back through the
 * chain above. Returns the row plus whether it's an exact match (so callers
 * can surface a "not fully translated yet" notice per spec §45).
 */
export function pickTranslation<T extends WithLocale>(
  translations: T[],
  locale: Locale,
): { translation: T; isFallback: boolean } | null {
  const chain = FALLBACK_CHAINS[locale];

  for (let i = 0; i < chain.length; i++) {
    const match = translations.find((t) => t.locale === chain[i]);
    if (match) {
      return { translation: match, isFallback: i > 0 };
    }
  }

  return null;
}
