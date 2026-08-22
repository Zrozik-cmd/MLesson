import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Check, ChevronRight, Clock, Info } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { VideoPlayer } from "@/components/site/VideoPlayer";
import { LessonPdf } from "@/components/site/LessonPdf";
import { TelegramCta } from "@/components/site/TelegramCta";
import { TriTitle, InkBanner } from "@/components/site/DeckTitle";
import { Sparkle, SpeechBubbles } from "@/components/site/Doodles";
import { getLessonBySlug } from "@/lib/data";
import { formatLessonNumber } from "@/lib/lessons";
import { recordEvent } from "@/lib/analytics";
import { toDbLocale } from "@/lib/i18n-fallback";
import { routing, type AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lesson = await getLessonBySlug(toDbLocale(locale), slug);
  if (!lesson) return {};

  const title = lesson.seoTitle || lesson.title;
  const description = lesson.seoDescription || lesson.shortDescription;

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/lessons/${lesson.slug}`]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/lessons/${lesson.slug}`,
      languages: { ...languages, "x-default": `/en/lessons/${lesson.slug}` },
    },
    openGraph: {
      title,
      description,
      images: lesson.thumbnailUrl ? [{ url: lesson.thumbnailUrl }] : undefined,
    },
  };
}

/** Section header inside the lesson body — a small deck slide title. */
function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="headline flex items-center gap-2.5 text-2xl text-ink">
      <Sparkle className="size-4 text-pink" />
      {children}
    </h2>
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const dbLocale = toDbLocale(locale);

  const lesson = await getLessonBySlug(dbLocale, slug);
  if (!lesson) notFound();

  const [t, tLevels, tNav, tCommon] = await Promise.all([
    getTranslations("lessonPage"),
    getTranslations("levels"),
    getTranslations("nav"),
    getTranslations("common"),
  ]);
  const tDuration = await getTranslations();

  await recordEvent("LESSON_VIEW", lesson.slug);

  return (
    <>
      <Section className="overflow-hidden pt-8 pb-14">
        <Container className="relative max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 font-display text-xs font-bold text-muted-foreground"
          >
            <Link href="/lessons" className="hover:text-pink">
              {tNav("lessons")}
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-ink">{lesson.title}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-cream font-display text-sm font-black text-ink shadow-[2px_2px_0_var(--ink)]">
              {formatLessonNumber(lesson.order)}
            </span>
            <span className="rounded-full border-2 border-ink bg-gold px-3.5 py-1.5 font-display text-xs font-black tracking-wide text-ink uppercase">
              {tLevels(lesson.level)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink/12 bg-card px-3.5 py-1.5 font-display text-xs font-bold text-muted-foreground">
              <Clock className="size-3.5" />
              {tDuration("duration", { minutes: lesson.duration })}
            </span>
          </div>

          <TriTitle
            as="h1"
            text={lesson.title}
            className="headline mt-5 text-4xl sm:text-5xl"
          />

          {lesson.isFallback ? (
            <p className="mt-5 flex items-start gap-2.5 rounded-2xl border-2 border-mint bg-mint/25 px-4 py-3 text-sm font-medium text-ink">
              <Info className="mt-0.5 size-4 shrink-0" />
              {t("fallbackNotice")}
            </p>
          ) : null}

          {/* The deck itself is the lesson; video is an optional extra. */}
          <div className="mt-9">
            <LessonPdf
              pdfUrl={lesson.pdfUrl}
              thumbnailUrl={lesson.thumbnailUrl}
              title={lesson.title}
              labels={{
                open: t("openPdf"),
                openInNewTab: t("openInNewTab"),
                fullscreen: t("fullscreen"),
                download: t("downloadPdf"),
                hint: t("pdfHint"),
                comingSoon: t("pdfComingSoon"),
              }}
            />
          </div>

          {lesson.videoUrl ? (
            <div className="mt-10">
              <VideoPlayer
                videoUrl={lesson.videoUrl}
                thumbnailUrl={lesson.thumbnailUrl}
                title={lesson.title}
              />
            </div>
          ) : null}

          <p className="mt-10 text-lg leading-relaxed text-muted-foreground">
            {lesson.description}
          </p>

          {lesson.learningOutcomes.length > 0 ? (
            <div className="mt-12">
              <BlockHeading>{t("whatYoullLearn")}</BlockHeading>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {lesson.learningOutcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex gap-3 rounded-2xl border-2 border-ink/12 bg-card px-4 py-3.5 text-sm leading-relaxed text-ink/85"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-pink text-white">
                      <Check className="size-3" strokeWidth={3.5} />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {lesson.vocabulary.length > 0 ? (
            <div className="mt-12">
              <BlockHeading>{t("usefulVocabulary")}</BlockHeading>
              {/* The deck's vocabulary wall: a grid of word tiles. */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {lesson.vocabulary.map((word, index) => (
                  <span
                    key={word}
                    className={`rounded-2xl border-2 border-ink px-3.5 py-3 text-center font-display text-sm font-extrabold text-ink ${
                      index % 3 === 1
                        ? "bg-gold/50"
                        : index % 3 === 2
                          ? "bg-mint/40"
                          : "bg-pink-soft/50"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {lesson.content ? (
            <div className="mt-12">
              <h2 className="flex">
                <InkBanner className="text-2xl">{t("notes")}</InkBanner>
              </h2>
              <div className="paper-note mt-6 p-6 sm:p-7">
                <p className="text-base leading-relaxed whitespace-pre-line text-ink/85">
                  {lesson.content}
                </p>
              </div>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section tone="gold" className="overflow-hidden border-y-2 border-ink py-16">
        <Sparkle
          color="var(--pink)"
          className="animate-twinkle absolute top-10 left-[12%] hidden size-8 sm:block"
        />

        <Container className="relative flex flex-col items-center gap-5 text-center">
          <SpeechBubbles className="size-11" />
          <TriTitle
            as="h2"
            text={t("ctaTitle")}
            className="headline max-w-2xl text-3xl sm:text-4xl"
          />
          <p className="max-w-sm text-base text-ink/75">{t("ctaDescription")}</p>
          <TelegramCta
            source="lesson"
            label={tCommon("continueInTelegram")}
            tone="ink"
            size="lg"
          />
        </Container>
      </Section>
    </>
  );
}
