import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Hero, HeroMarquee } from "@/components/site/Hero";
import { AuthorSection } from "@/components/site/AuthorSection";
import { ValueProposition } from "@/components/site/ValueProposition";
import { LessonGrid } from "@/components/site/LessonGrid";
import { TelegramCta } from "@/components/site/TelegramCta";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TriTitle } from "@/components/site/DeckTitle";
import { Burst, Sparkle, SparkleOutline } from "@/components/site/Doodles";
import { pill } from "@/components/site/Pill";
import { getSiteSettings } from "@/lib/settings";
import { getTrialLessons, getTags } from "@/lib/data";
import { toDbLocale } from "@/lib/i18n-fallback";
import { lessonLevelValues } from "@/lib/validation/lesson";
import type { AppLocale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dbLocale = toDbLocale(locale);

  const [settings, trialLessons, tags, t, tCommon, tLevels] = await Promise.all([
    getSiteSettings(dbLocale),
    getTrialLessons(dbLocale, 6),
    getTags(dbLocale),
    getTranslations("home"),
    getTranslations("common"),
    getTranslations("levels"),
  ]);

  // The ribbon under the hero echoes the decks' vocabulary walls. Tags come
  // first because they are the teacher's own words; levels fill any gap.
  const marqueeWords = Array.from(
    new Map(
      [...tags.map((tag) => tag.name), ...lessonLevelValues.map((level) => tLevels(level))].map(
        (word) => [word.toLocaleLowerCase(locale), word],
      ),
    ).values(),
  ).slice(0, 12);

  return (
    <>
      <Hero
        eyebrow={settings.heroEyebrow}
        headline={settings.heroHeadline}
        description={settings.heroDescription}
        ctaText={settings.heroCtaText}
        secondaryCtaText={settings.heroSecondaryCtaText}
        authorName={settings.authorName}
        authorPhotoUrl={settings.authorPhotoUrl}
      />

      <HeroMarquee words={marqueeWords} />

      <AuthorSection
        eyebrow={t("teacherEyebrow")}
        name={settings.authorName}
        photoUrl={settings.authorPhotoUrl}
        bio={settings.authorShortBio}
        experience={settings.authorExperience}
        metrics={settings.authorMetrics}
      />

      <ValueProposition />

      <Section className="overflow-hidden">
        <SparkleOutline
          color="var(--pink)"
          className="animate-twinkle absolute top-16 right-[8%] hidden size-10 sm:block"
        />

        <Container>
          <SectionHeading
            eyebrow={t("trialEyebrow")}
            title={t("trialTitle")}
            description={t("trialDescription")}
            markDescription
          />

          <div className="mt-14">
            <LessonGrid lessons={trialLessons} />
          </div>

          <div className="mt-14 flex justify-center">
            <Link href="/lessons" className={pill({ tone: "ink", size: "lg" })}>
              {tCommon("seeAllLessons")}
              <ArrowRight className="transition-transform group-hover/pill:translate-x-1" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section tone="gold" className="overflow-hidden border-y-2 border-ink">
        <Burst
          color="var(--ink)"
          className="animate-twinkle absolute top-12 left-[10%] hidden size-10 opacity-60 sm:block"
        />
        <Sparkle
          color="var(--pink)"
          className="animate-twinkle absolute right-[12%] bottom-14 hidden size-9 sm:block"
        />

        <Container className="relative flex flex-col items-center text-center">
          <span className="eyebrow rounded-full border-2 border-ink bg-cream px-4 py-1.5">
            {t("ctaEyebrow")}
          </span>

          <TriTitle
            as="h2"
            text={t("ctaTitle")}
            className="headline mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl"
          />

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
            {t("ctaDescription")}
          </p>

          <div className="mt-9">
            <TelegramCta
              source="home-footer-cta"
              label={tCommon("continueInTelegram")}
              tone="ink"
              size="lg"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
