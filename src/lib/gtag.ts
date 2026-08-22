/**
 * Google Analytics 4.
 *
 * The measurement ID comes from the environment so local work and previews
 * don't report into the production property — leave it unset and every call
 * here quietly does nothing.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Route changes are client-side, so page views need reporting by hand. */
export function pageview(url: string) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", { page_path: url, page_location: window.location.href });
}

export function track(event: string, params?: GtagParams) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
