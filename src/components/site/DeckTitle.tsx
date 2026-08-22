import { cn } from "@/lib/utils";

/*
  The decks colour their headlines word by word: the first word magenta,
  the second brown, the rest ink. It reads as a signature at a glance,
  so every H1/H2 on the site runs through here.
*/

/*
  Accents come from CSS tokens rather than fixed brand classes so a
  headline re-tunes itself on the espresso and gold slides.
*/
const ACCENTS = [
  "text-[var(--title-accent-1)]",
  "text-[var(--title-accent-2)]",
] as const;

export function TriTitle({
  text,
  className,
  /** How many leading words get an accent colour. */
  accentWords = 2,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  accentWords?: number;
  as?: "span" | "h1" | "h2" | "h3";
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={cn("text-balance", className)}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={index < accentWords ? ACCENTS[index % ACCENTS.length] : undefined}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

/** Gold brush marker behind a run of text. */
export function Marker({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: "gold" | "pink" | "mint";
  className?: string;
}) {
  return (
    <span
      className={cn(
        tone === "gold" && "mark-gold",
        tone === "pink" && "mark-pink",
        tone === "mint" && "mark-mint",
        "text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Espresso ink blob behind a single word — the deck's "Homework" banner. */
export function InkBanner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("blob-ink font-display font-black", className)}>{children}</span>;
}
