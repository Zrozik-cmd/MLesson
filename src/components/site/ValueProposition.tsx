import { getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Loop, Sparkle, SparkleOutline } from "@/components/site/Doodles";

/** Each card gets its own spot colour, mirroring the deck's key slides. */
const TONES = [
  { badge: "bg-pink text-white", ring: "group-hover:border-pink/60" },
  { badge: "bg-gold text-ink", ring: "group-hover:border-gold/60" },
  { badge: "bg-mint text-ink", ring: "group-hover:border-mint/60" },
  { badge: "bg-rose text-ink", ring: "group-hover:border-rose/60" },
] as const;

export async function ValueProposition() {
  const t = await getTranslations("home");

  const values = [
    { number: "01", title: t("value1Title"), description: t("value1Description") },
    { number: "02", title: t("value2Title"), description: t("value2Description") },
    { number: "03", title: t("value3Title"), description: t("value3Description") },
    { number: "04", title: t("value4Title"), description: t("value4Description") },
  ];

  return (
    <Section dark className="overflow-hidden">
      <Loop
        color="var(--mint)"
        className="animate-float absolute top-10 right-8 hidden w-28 opacity-70 sm:block"
      />
      <SparkleOutline
        color="var(--gold)"
        className="animate-twinkle absolute bottom-16 left-10 hidden size-10 sm:block"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow={t("valueEyebrow")}
          title={t("valueTitle")}
          className="[&_h2]:text-cream"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((value, index) => {
            const tone = TONES[index % TONES.length];

            return (
              <Reveal key={value.number} delay={index * 0.06}>
                <div
                  className={`group h-full rounded-[1.75rem] border-2 border-cream/12 bg-card p-7 transition-colors ${tone.ring}`}
                >
                  <span
                    className={`inline-flex size-12 items-center justify-center rounded-full font-display text-base font-black ${tone.badge}`}
                  >
                    {value.number}
                  </span>
                  <h3 className="headline-soft mt-5 text-2xl text-cream">{value.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 opacity-70">
          <Sparkle className="size-3 text-gold" />
          <Sparkle className="size-4 text-pink" />
          <Sparkle className="size-3 text-mint" />
        </div>
      </Container>
    </Section>
  );
}
