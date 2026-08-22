import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";

// Lesson URLs come from the database, so this must be generated per request
// rather than baked in at build time (the build has no DB access).
export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  { path: "", priority: 1 },
  { path: "/lessons", priority: 0.9 },
  { path: "/about", priority: 0.6 },
  { path: "/faq", priority: 0.5 },
];

function languageAlternates(pathSuffix: string, siteUrl: string) {
  const entries = routing.locales.map((locale) => [
    locale,
    `${siteUrl}/${locale}${pathSuffix}`,
  ]);
  return {
    ...Object.fromEntries(entries),
    "x-default": `${siteUrl}/en${pathSuffix}`,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = STATIC_PATHS.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: languageAlternates(path, siteUrl) },
    })),
  );

  const lessons = await prisma.lesson
    .findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } })
    .catch(() => []);

  const lessonRoutes: MetadataRoute.Sitemap = lessons.flatMap((lesson) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}/lessons/${lesson.slug}`,
      lastModified: lesson.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: languageAlternates(`/lessons/${lesson.slug}`, siteUrl) },
    })),
  );

  return [...staticRoutes, ...lessonRoutes];
}
