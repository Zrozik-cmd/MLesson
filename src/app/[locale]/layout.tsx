import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { getSiteSettings } from "@/lib/settings";
import { routing } from "@/i18n/routing";
import { toDbLocale } from "@/lib/i18n-fallback";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const [settings, messages] = await Promise.all([
    getSiteSettings(toDbLocale(locale)),
    getMessages(),
  ]);

  return (
    <NextIntlClientProvider messages={messages}>
      <PageViewTracker />
      <Header siteName={settings.siteName} />
      <main className="flex-1">{children}</main>
      <Footer siteName={settings.siteName} siteDescription={settings.siteDescription} />
    </NextIntlClientProvider>
  );
}
