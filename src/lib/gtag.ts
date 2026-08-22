/**
 * Google Analytics 4.
 *
 * The property's measurement ID is baked in so a deploy needs no extra
 * configuration, but tracking only runs in production — development and
 * preview builds would otherwise report into the live property. Set
 * NEXT_PUBLIC_GA_ID to point a given environment somewhere else.
 */
const MEASUREMENT_ID = "G-QEWC1EBSH7";

export const GA_ID =
  process.env.NEXT_PUBLIC_GA_ID ||
  (process.env.NODE_ENV === "production" ? MEASUREMENT_ID : "");

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
