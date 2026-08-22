import { prisma } from "@/lib/prisma";
import { pickTranslation } from "@/lib/i18n-fallback";
import type { Locale, LessonLevel } from "@prisma/client";

export type ResolvedTag = {
  id: string;
  slug: string;
  name: string;
};

export type ResolvedLessonSummary = {
  id: string;
  slug: string;
  level: LessonLevel;
  duration: number;
  thumbnailUrl: string | null;
  order: number;
  title: string;
  shortDescription: string;
  /** Whether a lesson deck is attached — the card badges the format. */
  hasPdf: boolean;
  tags: ResolvedTag[];
};

export type ResolvedLesson = ResolvedLessonSummary & {
  videoUrl: string | null;
  pdfUrl: string | null;
  pdfPages: string[];
  isTrial: boolean;
  isPublished: boolean;
  description: string;
  content: string | null;
  learningOutcomes: string[];
  vocabulary: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  isFallback: boolean;
};

const lessonInclude = {
  translations: true,
  tags: { include: { tag: { include: { translations: true } } } },
} as const;

type LessonWithRelations = {
  id: string;
  slug: string;
  level: LessonLevel;
  duration: number;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
  pdfPages: string[];
  isTrial: boolean;
  isPublished: boolean;
  order: number;
  translations: {
    locale: Locale;
    slug: string | null;
    title: string;
    shortDescription: string;
    description: string;
    content: string | null;
    learningOutcomes: string[];
    vocabulary: string[];
    seoTitle: string | null;
    seoDescription: string | null;
  }[];
  tags: {
    tag: {
      id: string;
      slug: string;
      translations: { locale: Locale; slug: string | null; name: string }[];
    };
  }[];
};

function resolveTag(
  tag: LessonWithRelations["tags"][number]["tag"],
  locale: Locale,
): ResolvedTag {
  const picked = pickTranslation(tag.translations, locale);
  return {
    id: tag.id,
    slug: picked?.translation.slug ?? tag.slug,
    name: picked?.translation.name ?? tag.slug,
  };
}

function resolveLesson(
  lesson: LessonWithRelations,
  locale: Locale,
): ResolvedLesson | null {
  const picked = pickTranslation(lesson.translations, locale);
  if (!picked) return null;
  const t = picked.translation;

  return {
    id: lesson.id,
    slug: t.slug ?? lesson.slug,
    level: lesson.level,
    duration: lesson.duration,
    thumbnailUrl: lesson.thumbnailUrl,
    videoUrl: lesson.videoUrl,
    pdfUrl: lesson.pdfUrl,
    pdfPages: lesson.pdfPages,
    isTrial: lesson.isTrial,
    isPublished: lesson.isPublished,
    order: lesson.order,
    title: t.title,
    shortDescription: t.shortDescription,
    hasPdf: Boolean(lesson.pdfUrl),
    description: t.description,
    content: t.content,
    learningOutcomes: t.learningOutcomes,
    vocabulary: t.vocabulary,
    seoTitle: t.seoTitle,
    seoDescription: t.seoDescription,
    isFallback: picked.isFallback,
    tags: lesson.tags.map((lt) => resolveTag(lt.tag, locale)),
  };
}

export type LessonFilters = {
  level?: LessonLevel;
  tagSlug?: string;
  trialOnly?: boolean;
};

export async function getPublishedLessons(
  locale: Locale,
  filters: LessonFilters = {},
): Promise<ResolvedLesson[]> {
  const lessons = await prisma.lesson.findMany({
    where: {
      isPublished: true,
      ...(filters.level ? { level: filters.level } : {}),
      ...(filters.trialOnly ? { isTrial: true } : {}),
      ...(filters.tagSlug
        ? { tags: { some: { tag: { slug: filters.tagSlug } } } }
        : {}),
    },
    orderBy: { order: "asc" },
    include: lessonInclude,
  });

  return lessons
    .map((lesson) => resolveLesson(lesson, locale))
    .filter((lesson): lesson is ResolvedLesson => lesson !== null);
}

export async function getTrialLessons(
  locale: Locale,
  limit = 6,
): Promise<ResolvedLesson[]> {
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true, isTrial: true },
    orderBy: { order: "asc" },
    take: limit,
    include: lessonInclude,
  });

  return lessons
    .map((lesson) => resolveLesson(lesson, locale))
    .filter((lesson): lesson is ResolvedLesson => lesson !== null);
}

export async function getLessonBySlug(
  locale: Locale,
  slug: string,
): Promise<ResolvedLesson | null> {
  // 1. This locale has its own slug override pointing at this URL.
  const byOverride = await prisma.lesson.findFirst({
    where: { isPublished: true, translations: { some: { locale, slug } } },
    include: lessonInclude,
  });
  if (byOverride) return resolveLesson(byOverride, locale);

  // 2. Fall back to the canonical (locale-agnostic) slug.
  const byCanonical = await prisma.lesson.findFirst({
    where: { isPublished: true, slug },
    include: lessonInclude,
  });
  if (!byCanonical) return null;
  return resolveLesson(byCanonical, locale);
}

export type ResolvedFaq = {
  id: string;
  order: number;
  question: string;
  answer: string;
  isFallback: boolean;
};

export async function getFaqs(locale: Locale): Promise<ResolvedFaq[]> {
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  return faqs
    .map((faq) => {
      const picked = pickTranslation(faq.translations, locale);
      if (!picked) return null;
      return {
        id: faq.id,
        order: faq.order,
        question: picked.translation.question,
        answer: picked.translation.answer,
        isFallback: picked.isFallback,
      };
    })
    .filter((faq): faq is ResolvedFaq => faq !== null);
}

export async function getTags(locale: Locale): Promise<ResolvedTag[]> {
  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: "asc" },
    include: { translations: true },
  });

  return tags.map((tag) => resolveTag(tag, locale));
}

export type ResolvedTagPage = ResolvedTag & {
  description: string | null;
  isFallback: boolean;
};

export async function getTagBySlug(
  locale: Locale,
  slug: string,
): Promise<ResolvedTagPage | null> {
  const byOverride = await prisma.tag.findFirst({
    where: { translations: { some: { locale, slug } } },
    include: { translations: true },
  });
  const tag =
    byOverride ??
    (await prisma.tag.findFirst({
      where: { slug },
      include: { translations: true },
    }));
  if (!tag) return null;

  const picked = pickTranslation(tag.translations, locale);
  if (!picked) return null;

  return {
    id: tag.id,
    slug: picked.translation.slug ?? tag.slug,
    name: picked.translation.name,
    description: picked.translation.description,
    isFallback: picked.isFallback,
  };
}
