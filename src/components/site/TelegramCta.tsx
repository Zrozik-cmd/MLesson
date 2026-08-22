import Link from "next/link";
import { Send } from "lucide-react";
import { pill, type PillVariants } from "@/components/site/Pill";
import { cn } from "@/lib/utils";

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
      className={cn(pill({ tone, size }), className)}
    >
      <Send className="transition-transform group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5" />
      {label}
    </Link>
  );
}
