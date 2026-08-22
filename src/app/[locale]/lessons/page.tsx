import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LessonGrid } from "@/components/site/LessonGrid";
import { LessonFilters } from "@/components/site/LessonFilters";
import { TelegramCta } from "@/components/site/TelegramCta";
import { SparkleOutline, Squiggle } from "@/components/site/Doodles";
import { getPublishedLessons, getTags } from "@/lib/data";
import { toDbLocale } from "@/lib/i18n-fallback";
import { lessonLevelValues } from "@/lib/validation/lesson";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lessonsPage" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: { canonical: `/${locale}/lessons` },
  };
}

export default async function LessonsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ level?: string; tag?: string; trial?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const dbLocale = toDbLocale(locale);

  const level = lessonLevelValues.find((value) => value === query.level?.toUpperCase());

  const [lessons, tags, t, tCommon] = await Promise.all([
    getPublishedLessons(dbLocale, {
      level,
      tagSlug: query.tag,
      trialOnly: query.trial === "1",
    }),
    getTags(dbLocale),
    getTranslations("lessonsPage"),
    getTranslations("common"),
  ]);

  const hasActiveFilters = Boolean(level || query.tag || query.trial);

  return (
    <>
      <Section className="overflow-hidden pt-14 pb-24">
        <SparkleOutline
          color="var(--pink)"
          className="animate-twinkle absolute top-14 right-[10%] hidden size-10 sm:block"
        />
        <Squiggle
          color="var(--brown-soft)"
          className="absolute bottom-6 left-[4%] hidden w-28 opacity-70 sm:block"
        />

        <Container className="relative">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("subtitle")}
          />

          <div className="mt-10">
            <LessonFilters current={query} tags={tags} />
          </div>

          <div className="mt-14">
            <LessonGrid
              lessons={lessons}
              emptyMessage={hasActiveFilters ? t("filters.noResults") : undefined}
            />
          </div>
        </Container>
      </Section>

      <Section tone="gold" className="border-y-2 border-ink py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <p className="max-w-md font-display text-lg font-bold text-ink">
            {t("ctaDescription")}
          </p>
          <TelegramCta
            source="lessons-list"
            label={tCommon("continueInTelegram")}
            tone="ink"
            size="lg"
          />
        </Container>
      </Section>
    </>
  );
}
