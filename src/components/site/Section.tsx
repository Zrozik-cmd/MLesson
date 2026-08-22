import { cn } from "@/lib/utils";

/**
 * A deck slide, translated to the web. `tone` picks which of the deck's
 * backdrops the block is painted on; `dark` is the espresso slide.
 */
export function Section({
  className,
  dark,
  tone,
  children,
  as: Tag = "section",
}: {
  className?: string;
  dark?: boolean;
  tone?: "cream" | "dark" | "gold" | "paper";
  children: React.ReactNode;
  as?: "section" | "div";
}) {
  const resolved = tone ?? (dark ? "dark" : "cream");

  return (
    <Tag
      className={cn(
        "relative py-20 sm:py-28",
        resolved === "dark" && "section-dark",
        resolved === "gold" && "bg-gold text-ink",
        resolved === "paper" && "bg-secondary",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
