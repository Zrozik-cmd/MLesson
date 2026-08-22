import type { Metadata } from "next";
import { Nunito, Nunito_Sans, Caveat } from "next/font/google";
import { getLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { getSiteSettings } from "@/lib/settings";
import { toDbLocale } from "@/lib/i18n-fallback";
import "./globals.css";

// M Lesson voice: rounded heavy display, friendly body, handwritten notes.
// All three carry Cyrillic so RU/UK render in the same brand type.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["600", "700", "800", "900"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getSiteSettings(toDbLocale(locale as "en" | "ru" | "uk"));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.siteName,
      template: `%s — ${settings.siteName}`,
    },
    description: settings.siteDescription,
    openGraph: {
      title: settings.siteName,
      description: settings.siteDescription,
      url: siteUrl,
      siteName: settings.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.siteDescription,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${nunito.variable} ${nunitoSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
