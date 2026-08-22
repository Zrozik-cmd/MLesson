import { prisma } from "@/lib/prisma";
import { pickTranslation } from "@/lib/i18n-fallback";
import type { Locale } from "@prisma/client";

export type AuthorMetric = {
  label: string;
  value: string;
};

export type ResolvedSiteSettings = {
  authorName: string;
  authorPhotoUrl: string | null;
  telegramUrl: string;
  siteName: string;

  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  authorBio: string;
  authorShortBio: string;
  authorExperience: string;
  authorMetrics: AuthorMetric[];
  siteDescription: string;

  /** True when the requested locale had no translation and we fell back. */
  isFallback: boolean;
};

const DEFAULT_BASE = {
  authorName: "Anna Marchenko",
  authorPhotoUrl: null as string | null,
  telegramUrl: "https://t.me/mlesson_placeholder",
  siteName: "M Lesson",
};

const DEFAULT_TRANSLATION = {
  heroEyebrow: "ENGLISH / M LESSON",
  heroHeadline: "English that becomes part of your everyday life.",
  heroDescription:
    "A boutique approach to learning English — built around real conversation, careful structure, and steady progress you can actually feel.",
  heroCtaText: "Watch the trial lessons",
  heroSecondaryCtaText: "Continue in Telegram",
  authorBio:
    "I've spent the last several years helping adults build real, usable English — not textbook English. My students come to me tired of memorizing rules that never turn into conversation. We work differently: less grammar theory, more language you'll actually reach for.",
  authorShortBio:
    "I teach English the way I wish it had been taught to me — practical, structured, and free of unnecessary complexity.",
  authorExperience:
    "Certified English teacher (CELTA) with a background in linguistics, working with adult learners across levels — from confident beginners to advanced speakers refining nuance.",
  authorMetrics: [
    { label: "Years teaching", value: "5+" },
    { label: "Students guided", value: "1,000+" },
    { label: "Hours of practice", value: "10,000+" },
  ] satisfies AuthorMetric[],
  siteDescription:
    "A premium, personal approach to learning English — trial lessons, real conversation practice, and a path to fluency without unnecessary complexity.",
};

/**
 * Fallback content used before the database has been seeded, or if the
 * database is temporarily unreachable. Keeps the site renderable at all times.
 */
export const DEFAULT_SITE_SETTINGS: ResolvedSiteSettings = {
  ...DEFAULT_BASE,
  ...DEFAULT_TRANSLATION,
  isFallback: false,
};

let cachedWarning = false;

export function getAuthorMetrics(metrics: unknown): AuthorMetric[] {
  if (Array.isArray(metrics)) {
    return metrics as AuthorMetric[];
  }
  return DEFAULT_TRANSLATION.authorMetrics;
}

export async function getSiteSettings(
  locale: Locale,
): Promise<ResolvedSiteSettings> {
  try {
    const settings = await prisma.siteSettings.findFirst({
      include: { translations: true },
    });
    if (!settings) return DEFAULT_SITE_SETTINGS;

    const picked = pickTranslation(settings.translations, locale);
    const translation = picked?.translation ?? DEFAULT_TRANSLATION;

    return {
      authorName: settings.authorName,
      authorPhotoUrl: settings.authorPhotoUrl,
      telegramUrl: settings.telegramUrl,
      siteName: settings.siteName,
      heroEyebrow: translation.heroEyebrow,
      heroHeadline: translation.heroHeadline,
      heroDescription: translation.heroDescription,
      heroCtaText: translation.heroCtaText,
      heroSecondaryCtaText: translation.heroSecondaryCtaText,
      authorBio: translation.authorBio,
      authorShortBio: translation.authorShortBio,
      authorExperience: translation.authorExperience,
      authorMetrics: getAuthorMetrics(translation.authorMetrics),
      siteDescription: translation.siteDescription,
      isFallback: picked?.isFallback ?? false,
    };
  } catch (error) {
    if (!cachedWarning) {
      console.warn(
        "[settings] Falling back to default site settings — database unavailable:",
        error instanceof Error ? error.message : error,
      );
      cachedWarning = true;
    }
    return DEFAULT_SITE_SETTINGS;
  }
}
