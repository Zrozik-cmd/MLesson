import { cva, type VariantProps } from "class-variance-authority";

/*
  The deck's buttons: fat pills with a hard offset shadow that collapses
  when you press them. Shared by every CTA on the site so the marketing
  pages stay consistent without bending the shadcn Button primitive.
*/
export const pill = cva(
  "group/pill inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 font-display font-extrabold whitespace-nowrap transition-all outline-none focus-visible:ring-4 focus-visible:ring-pink/35 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        pink: "border-ink bg-pink text-white shadow-[4px_4px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]",
        ink: "border-ink bg-ink text-cream shadow-[4px_4px_0_var(--brown-soft)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--brown-soft)]",
        gold: "border-ink bg-gold text-ink shadow-[4px_4px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]",
        cream:
          "border-ink bg-cream text-ink shadow-[4px_4px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]",
        outline:
          "border-ink/25 bg-transparent text-ink shadow-none hover:border-ink hover:bg-secondary active:translate-x-0 active:translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-[0.8rem] [&_svg]:size-3.5",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-13 px-7 text-base [&_svg]:size-4.5",
      },
    },
    defaultVariants: { tone: "pink", size: "md" },
  },
);

export type PillVariants = VariantProps<typeof pill>;
