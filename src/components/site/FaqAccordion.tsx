import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Cloud } from "@/components/site/Doodles";
import type { ResolvedFaq } from "@/lib/data";

/** Question badges cycle the deck's spot colours. */
const BADGES = ["bg-pink text-white", "bg-gold text-ink", "bg-mint text-ink"] as const;

export function FaqAccordion({
  faqs,
  emptyMessage,
}: {
  faqs: ResolvedFaq[];
  emptyMessage: string;
}) {
  if (faqs.length === 0) {
    return (
      <div className="dashed-frame flex flex-col items-center gap-4 px-6 py-14 text-center">
        <Cloud color="var(--brown-soft)" className="w-20" />
        <p className="font-display text-base font-bold text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full gap-4">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="mb-4 rounded-[1.5rem] border-2 border-ink/12 bg-card px-5 not-last:border-b-2 sm:px-6"
        >
          <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline **:data-[slot=accordion-trigger-icon]:text-pink">
            <span className="flex items-start gap-3.5">
              <span
                className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full font-display text-xs font-black ${BADGES[index % BADGES.length]}`}
              >
                {index + 1}
              </span>
              <span className="headline-soft text-lg text-ink">{faq.question}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-5 pl-[2.6rem] text-base leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
