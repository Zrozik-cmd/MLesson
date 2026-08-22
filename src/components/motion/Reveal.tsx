import { cn } from "@/lib/utils";

/**
 * Fades content in on load.
 *
 * This used to be a scroll-triggered framer-motion component, which meant
 * the server sent every block at `opacity: 0` and the page stayed blank if
 * the observer never fired — as happened on iPad. A plain CSS animation
 * can't fail that way: it needs no JavaScript at all, so the content always
 * ends up visible. `prefers-reduced-motion` is honoured globally.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 16,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <div
      className={cn("reveal", className)}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
