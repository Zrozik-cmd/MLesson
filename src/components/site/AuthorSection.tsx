import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { AuthorPortrait } from "@/components/site/AuthorPortrait";
import { Metric } from "@/components/site/Metric";
import { Reveal } from "@/components/motion/Reveal";
import { TriTitle } from "@/components/site/DeckTitle";
import { Sparkle, Squiggle, CurlyArrow } from "@/components/site/Doodles";
import type { AuthorMetric } from "@/lib/settings";

export function AuthorSection({
  eyebrow,
  name,
  photoUrl,
  bio,
  experience,
  metrics,
}: {
  eyebrow: string;
  name: string;
  photoUrl: string | null;
  bio: string;
  experience: string;
  metrics: AuthorMetric[];
}) {
  return (
    <Section className="overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal className="relative mx-auto max-w-sm lg:max-w-none">
              <div
                aria-hidden
                className="dashed-frame absolute -inset-4 rotate-[-2deg] border-brown-soft"
              />
              <AuthorPortrait
                photoUrl={photoUrl}
                name={name}
                className="relative aspect-[3/4] w-full rotate-[1deg]"
              />
              <Squiggle
                color="var(--mint)"
                className="absolute -bottom-8 -left-6 w-28 opacity-80"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink/15 bg-secondary px-3.5 py-1.5">
                <Sparkle className="size-3 text-pink" />
                <span className="eyebrow text-brown">{eyebrow}</span>
              </span>
              <TriTitle
                as="h2"
                text={name}
                accentWords={1}
                className="headline-soft mt-5 text-4xl sm:text-5xl"
              />
            </Reveal>

            <Reveal delay={0.08}>
              <div className="paper-note relative mt-8 max-w-2xl p-6 sm:p-7">
                <CurlyArrow
                  color="var(--pink)"
                  className="absolute -top-9 right-6 hidden w-16 -scale-x-100 sm:block"
                />
                <p className="text-base leading-relaxed text-ink/85">{bio}</p>
                <p className="mt-4 text-base leading-relaxed text-ink/70">{experience}</p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {metrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className="rounded-3xl border-2 border-ink/12 bg-card px-5 py-5"
                  >
                    <Metric value={metric.value} label={metric.label} index={index} />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
