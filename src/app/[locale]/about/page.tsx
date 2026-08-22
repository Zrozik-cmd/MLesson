import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { AuthorPortrait } from "@/components/site/AuthorPortrait";
import { Metric } from "@/components/site/Metric";
import { TelegramCta } from "@/components/site/TelegramCta";
import { Reveal } from "@/components/motion/Reveal";
import { TriTitle } from "@/components/site/DeckTitle";
import {
  DoodleField,
  Sparkle,
  SpeechBubbles,
  Squiggle,
} from "@/components/site/Doodles";
import { getSiteSettings } from "@/lib/settings";
import { toDbLocale } from "@/lib/i18n-fallback";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const settings = await getSiteSettings(toDbLocale(locale));

  return {
    title: t("eyebrow"),
    description: settings.authorShortBio,
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dbLocale = toDbLocale(locale);

  const [settings, t, tCommon] = await Promise.all([
    getSiteSettings(dbLocale),
    getTranslations("aboutPage"),
    getTranslations("common"),
  ]);

  return (
    <>
      <Section className="overflow-hidden pt-12 pb-16">
        <DoodleField className="hidden sm:block" />

        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Reveal className="relative mx-auto max-w-sm lg:max-w-none">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 rotate-[4deg] rounded-[2rem] bg-pink-soft"
                />
                <AuthorPortrait
                  photoUrl={settings.authorPhotoUrl}
                  name={settings.authorName}
                  priority
                  className="relative aspect-[4/5] w-full rotate-[-1.5deg]"
                />
                <Sparkle
                  color="var(--gold)"
                  className="animate-twinkle absolute -top-4 -left-3 size-8"
                />
              </Reveal>
            </div>

            <div className="flex flex-col justify-center lg:col-span-7">
              <Reveal>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-cream px-4 py-1.5 shadow-[3px_3px_0_var(--ink)]">
                  <SpeechBubbles className="size-5" />
                  <span className="eyebrow">{t("eyebrow")}</span>
                </span>

                <TriTitle
                  as="h1"
                  text={settings.authorName}
                  accentWords={1}
                  className="headline mt-6 text-5xl sm:text-6xl"
                />

                <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  {settings.authorShortBio}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {settings.authorMetrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      className="rounded-3xl border-2 border-ink/12 bg-card px-4 py-5"
                    >
                      <Metric value={metric.value} label={metric.label} index={index} />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading eyebrow={t("biographyEyebrow")} title={t("biographyTitle")} />
            <div className="paper-note relative mt-8 p-6 sm:p-8">
              <Squiggle
                color="var(--pink)"
                className="absolute -top-5 right-8 hidden w-24 sm:block"
              />
              <p className="text-base leading-relaxed text-ink/85">{settings.authorBio}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section dark className="overflow-hidden">
        <Sparkle
          color="var(--gold)"
          className="animate-twinkle absolute top-14 right-[12%] hidden size-9 sm:block"
        />
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow={t("philosophyEyebrow")}
              title={t("philosophyTitle")}
              description={t("philosophyDescription")}
              className="[&_h2]:text-cream"
            />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading eyebrow={t("experienceEyebrow")} title={t("experienceTitle")} />
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {settings.authorExperience}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-16 flex flex-col items-center gap-5 rounded-[2rem] border-2 border-ink bg-gold px-6 py-14 text-center shadow-[6px_6px_0_var(--ink)]">
              <SpeechBubbles className="size-11" />
              <TriTitle
                as="h2"
                text={t("ctaTitle")}
                className="headline max-w-xl text-3xl sm:text-4xl"
              />
              <p className="max-w-sm text-base text-ink/75">{t("ctaDescription")}</p>
              <TelegramCta
                source="about"
                label={tCommon("continueInTelegram")}
                tone="ink"
                size="lg"
              />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
