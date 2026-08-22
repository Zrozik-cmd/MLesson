"use client";

import { Link } from "@/i18n/navigation";
import { track } from "@/lib/gtag";
import type { ComponentProps } from "react";

/**
 * A locale-aware link that reports a GA event before navigating. Used for
 * the calls to action we care about converting.
 */
export function TrackedLink({
  event,
  eventParams,
  onClick,
  ...props
}: ComponentProps<typeof Link> & {
  event: string;
  eventParams?: Record<string, string | number | boolean | undefined>;
}) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
