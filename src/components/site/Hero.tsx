import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/Container";
import { TelegramCta } from "@/components/site/TelegramCta";
import { AuthorPortrait } from "@/components/site/AuthorPortrait";
import { Reveal } from "@/components/motion/Reveal";
import { TriTitle } from "@/components/site/DeckTitle";
import { DoodleField, SpeechBubbles, Sparkle } from "@/components/site/Doodles";
import { pill } from "@/components/site/Pill";
import { Link } from "@/i18n/navigation";

export function Hero({
  eyebrow,
  headline,
  description,
  ctaText,
  secondaryCtaText,
  authorName,
  authorPhotoUrl,
}: {
  eyebrow: string;
  headline: string;
  description: string;
  ctaText: string;
  secondaryCtaText: string;
  authorName: string;
  authorPhotoUrl: string | null;
}) {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
      <DoodleField className="hidden sm:block" />

      {/* Warm glow anchoring the portrait side of the slide. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[34rem] rounded-full bg-gold/25 blur-3xl"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-4 py-1.5 shadow-[3px_3px_0_var(--ink)]">
                <SpeechBubbles className="size-5" />
                <span className="eyebrow">{eyebrow}</span>
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <TriTitle
                as="h1"
                text={headline}
                className="headline mt-6 text-[2.6rem] sm:text-6xl lg:text-[4.25rem]"
              />
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/lessons" className={pill({ tone: "pink", size: "lg" })}>
                  {ctaText}
                  <ArrowRight className="transition-transform group-hover/pill:translate-x-1" />
                </Link>
                <TelegramCta source="hero" label={secondaryCtaText} tone="cream" size="lg" />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.12} className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Gold slab behind the photo — the deck's marker block. */}
              <div
                aria-hidden
                className="absolute inset-0 -translate-x-4 translate-y-4 rotate-[-4deg] rounded-[2rem] bg-gold"
              />
              <AuthorPortrait
                photoUrl={authorPhotoUrl}
                name={authorName}
                priority
                className="relative aspect-[4/5] w-full rotate-[1.5deg]"
              />

              <div className="absolute -bottom-5 -left-3 z-10 flex items-center gap-2 rounded-2xl border-2 border-ink bg-cream px-4 py-2.5 shadow-[4px_4px_0_var(--ink)] rotate-[-3deg] sm:-left-6">
                <SpeechBubbles className="size-6" />
                <span className="font-hand text-xl leading-none font-bold text-ink">
                  {authorName}
                </span>
              </div>

              <Sparkle
                color="var(--pink)"
                className="animate-twinkle absolute -top-4 -right-2 size-8"
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Scrolling vocabulary ribbon — the deck's word walls turned into a band
 * that runs under the hero.
 */
export function HeroMarquee({ words }: { words: string[] }) {
  const track = [...words, ...words];

  return (
    <div className="relative overflow-hidden border-y-2 border-ink bg-ink py-3.5 sm:py-4">
      <div className="flex w-max animate-marquee items-center gap-8 will-change-transform">
        {track.map((word, index) => (
          <span key={`${word}-${index}`} className="flex items-center gap-8">
            <span
              className={`headline text-lg sm:text-xl ${
                index % 3 === 1 ? "text-gold" : index % 3 === 2 ? "text-rose" : "text-cream"
              }`}
            >
              {word}
            </span>
            <Sparkle className="size-3 shrink-0 text-pink" />
          </span>
        ))}
      </div>
    </div>
  );
}
