"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "@/lib/gtag";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pageview(pathname);

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PAGE_VIEW", source: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
