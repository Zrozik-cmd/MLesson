import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LessonGrid } from "@/components/site/LessonGrid";
import { SparkleOutline } from "@/components/site/Doodles";
import { getTagBySlug, getPublishedLessons } from "@/lib/data";
import { toDbLocale } from "@/lib/i18n-fallback";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tag = await getTagBySlug(toDbLocale(locale), slug);
  if (!tag) return {};

  return {
    title: tag.name,
    description: tag.description ?? undefined,
    alternates: { canonical: `/${locale}/tags/${tag.slug}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const dbLocale = toDbLocale(locale);

  const tag = await getTagBySlug(dbLocale, slug);
  if (!tag) notFound();

  const [lessons, t] = await Promise.all([
    getPublishedLessons(dbLocale, { tagSlug: slug }),
    getTranslations("tagPage"),
  ]);

  return (
    <Section className="overflow-hidden pt-14 pb-24">
      <SparkleOutline
        color="var(--pink)"
        className="animate-twinkle absolute top-14 right-[10%] hidden size-10 sm:block"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={tag.name}
          description={tag.description ?? undefined}
          accentWords={1}
        />

        <div className="mt-14">
          <h2 className="sr-only">{t("lessonsInTag")}</h2>
          <LessonGrid lessons={lessons} emptyMessage={t("emptyState")} />
        </div>
      </Container>
    </Section>
  );
}
