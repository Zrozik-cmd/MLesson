import Script from "next/script";
import { GA_ID } from "@/lib/gtag";

/**
 * Loads gtag.js once per document.
 *
 * The first page view is left to gtag: sending it ourselves from an effect
 * raced the library's own load and got dropped. PageViewTracker covers the
 * client-side navigations that follow.
 */
export function GoogleAnalytics({ locale }: { locale: string }) {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('set', 'user_properties', { site_language: '${locale}' });
gtag('config', '${GA_ID}', { site_language: '${locale}' });`}
      </Script>
    </>
  );
}
