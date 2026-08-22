import { cn } from "@/lib/utils";

const TONES = ["text-pink", "text-brown", "text-ink"] as const;

export function Metric({
  value,
  label,
  index = 0,
  className,
}: {
  value: string;
  label: string;
  /** Rotates the accent colour so a row of metrics reads like a deck slide. */
  index?: number;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <p className={cn("headline text-3xl sm:text-4xl", TONES[index % TONES.length])}>
        {value}
      </p>
      <p className="mt-2 font-display text-sm font-bold text-muted-foreground">{label}</p>
    </div>
  );
}
