"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { pageview, setLocale } from "@/lib/gtag";

export function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();
  const firstRender = useRef(true);

  useEffect(() => {
    setLocale(locale);

    // gtag already reported the initial view from its config call; only the
    // client-side navigations after it need reporting by hand.
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      pageview(pathname);
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PAGE_VIEW", source: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, locale]);

  return null;
}
