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
          className="group/item mb-4 rounded-[1.5rem] border-2 border-ink/12 bg-card px-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] not-last:border-b-2 hover:border-ink/25 data-[state=open]:-translate-y-0.5 data-[state=open]:border-ink data-[state=open]:shadow-[4px_4px_0_var(--ink)] sm:px-6"
        >
          <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline **:data-[slot=accordion-trigger-icon]:text-pink">
            <span className="flex items-start gap-3.5">
              <span
                className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full font-display text-xs font-black transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[state=open]/item:scale-110 group-data-[state=open]/item:rotate-6 ${BADGES[index % BADGES.length]}`}
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
