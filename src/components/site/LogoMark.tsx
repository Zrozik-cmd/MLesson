import Image from "next/image";
import { cn } from "@/lib/utils";

/*
  The official M Lesson wordmark. Two artworks ship with it: the stock
  black-lettered mark for cream backgrounds, and a cream-lettered version
  for the espresso slides. Size it with a height class (`h-11`) — the
  width follows the artwork's aspect ratio.
*/

const SOURCES = {
  ink: "/logo-mlesson.png",
  cream: "/logo-mlesson-cream.png",
} as const;

export function LogoMark({
  className,
  variant = "ink",
  label = "M Lesson",
  priority,
}: {
  className?: string;
  /** `cream` swaps in the light-lettered artwork for dark backgrounds. */
  variant?: keyof typeof SOURCES;
  /** Accessible name — falls back to the brand name. */
  label?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={SOURCES[variant]}
      alt={label}
      width={827}
      height={306}
      priority={priority}
      className={cn("h-10 w-auto", className)}
    />
  );
}
