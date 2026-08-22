"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { pageview, setLocale } from "@/lib/gtag";

export function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    // Set before the page view so the very first hit carries the locale.
    setLocale(locale);
    pageview(pathname);

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PAGE_VIEW", source: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, locale]);

  return null;
}
