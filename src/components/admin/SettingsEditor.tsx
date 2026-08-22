import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SettingsTranslationForm } from "@/components/admin/SettingsTranslationForm";
import { TranslationStatusBadge } from "@/components/admin/TranslationStatusBadge";
import { localeValues } from "@/lib/validation/lesson";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import type { SiteSettingsTranslation } from "@prisma/client";

export function SettingsEditor({
  translations,
}: {
  translations: SiteSettingsTranslation[];
}) {
  return (
    <Tabs defaultValue="EN">
      <TabsList>
        {localeValues.map((locale) => {
          const translation = translations.find((t) => t.locale === locale);
          return (
            <TabsTrigger key={locale} value={locale} className="gap-1.5">
              <TranslationStatusBadge locale={locale} translated={Boolean(translation)} />
            </TabsTrigger>
          );
        })}
      </TabsList>

      {localeValues.map((locale) => {
        const translation = translations.find((t) => t.locale === locale);
        return (
          <TabsContent key={locale} value={locale} className="pt-6">
            <SettingsTranslationForm
              locale={locale}
              defaultValues={{
                heroEyebrow: translation?.heroEyebrow ?? DEFAULT_SITE_SETTINGS.heroEyebrow,
                heroHeadline: translation?.heroHeadline ?? DEFAULT_SITE_SETTINGS.heroHeadline,
                heroDescription:
                  translation?.heroDescription ?? DEFAULT_SITE_SETTINGS.heroDescription,
                heroCtaText: translation?.heroCtaText ?? DEFAULT_SITE_SETTINGS.heroCtaText,
                heroSecondaryCtaText:
                  translation?.heroSecondaryCtaText ??
                  DEFAULT_SITE_SETTINGS.heroSecondaryCtaText,
                authorBio: translation?.authorBio ?? DEFAULT_SITE_SETTINGS.authorBio,
                authorShortBio:
                  translation?.authorShortBio ?? DEFAULT_SITE_SETTINGS.authorShortBio,
                authorExperience:
                  translation?.authorExperience ?? DEFAULT_SITE_SETTINGS.authorExperience,
                authorMetrics: Array.isArray(translation?.authorMetrics)
                  ? (translation.authorMetrics as { label: string; value: string }[])
                  : DEFAULT_SITE_SETTINGS.authorMetrics,
                siteDescription:
                  translation?.siteDescription ?? DEFAULT_SITE_SETTINGS.siteDescription,
              }}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
