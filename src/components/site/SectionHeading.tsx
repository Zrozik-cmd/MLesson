import { cn } from "@/lib/utils";
import { TriTitle, Marker } from "@/components/site/DeckTitle";
import { Sparkle } from "@/components/site/Doodles";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  accentWords = 2,
  markDescription,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  accentWords?: number;
  /** Paints the deck's gold brush marker behind the description. */
  markDescription?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto flex flex-col items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink/15 bg-secondary px-3.5 py-1.5">
          <Sparkle className="size-3 text-pink" />
          <span className="eyebrow text-brown">{eyebrow}</span>
        </span>
      ) : null}

      <TriTitle
        as="h2"
        text={title}
        accentWords={accentWords}
        className={cn("headline mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]")}
      />

      {description ? (
        markDescription ? (
          <p className="mt-6 text-base leading-[2.1] sm:text-lg">
            <Marker>{description}</Marker>
          </p>
        ) : (
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )
      ) : null}
    </div>
  );
}
