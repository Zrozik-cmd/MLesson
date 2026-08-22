import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { TelegramCta } from "@/components/site/TelegramCta";
import { CurlyArrow, SparkleOutline } from "@/components/site/Doodles";
import { getFaqs } from "@/lib/data";
import { toDbLocale } from "@/lib/i18n-fallback";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: { canonical: `/${locale}/faq` },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [faqs, t, tCommon] = await Promise.all([
    getFaqs(toDbLocale(locale)),
    getTranslations("faqPage"),
    getTranslations("common"),
  ]);

  return (
    <>
      <Section className="overflow-hidden pt-14 pb-20">
        <SparkleOutline
          color="var(--gold)"
          className="animate-twinkle absolute top-16 right-[10%] hidden size-10 sm:block"
        />
        <CurlyArrow
          color="var(--brown-soft)"
          className="absolute top-24 left-[4%] hidden w-20 -scale-x-100 opacity-70 lg:block"
        />

        <Container className="relative max-w-3xl">
          <SectionHeading
            align="center"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("subtitle")}
          />

          <div className="mt-14">
            <FaqAccordion faqs={faqs} emptyMessage={t("emptyState")} />
          </div>
        </Container>
      </Section>

      <Section tone="gold" className="border-y-2 border-ink py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <p className="max-w-md font-display text-lg font-bold text-ink">
            {t("ctaDescription")}
          </p>
          <TelegramCta
            source="faq"
            label={tCommon("continueInTelegram")}
            tone="ink"
            size="lg"
          />
        </Container>
      </Section>
    </>
  );
}
