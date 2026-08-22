"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { pill, type PillVariants } from "@/components/site/Pill";
import { track } from "@/lib/gtag";
import { cn } from "@/lib/utils";

/**
 * The site's conversion. The click is recorded twice on purpose: the
 * /telegram route logs it server-side for the admin dashboard, and this
 * reports it to GA before the browser leaves.
 */
export function TelegramCta({
  source,
  label = "Continue in Telegram",
  tone = "pink",
  size = "md",
  className,
}: {
  source: string;
  label?: string;
  className?: string;
} & PillVariants) {
  return (
    <Link
      href={`/telegram?source=${encodeURIComponent(source)}`}
      onClick={() => track("telegram_click", { source })}
      className={cn(pill({ tone, size }), className)}
    >
      <Send className="transition-transform group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5" />
      {label}
    </Link>
  );
}
