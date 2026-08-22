import { cn } from "@/lib/utils";

/*
  Hand-drawn marginalia lifted from the M Lesson slide decks: sparkles,
  curly arrows, loops and clouds. They are purely decorative, so every
  one of them is aria-hidden and safe to scatter freely.
*/

type DoodleProps = {
  className?: string;
  /** Stroke / fill colour. Defaults to the surrounding text colour. */
  color?: string;
};

export function Sparkle({ className, color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <path
        d="M24 3c1.6 9.6 5.4 15.4 15 18-9.6 2.6-13.4 8.4-15 18-1.6-9.6-5.4-15.4-15-18 9.6-2.6 13.4-8.4 15-18Z"
        fill={color}
      />
    </svg>
  );
}

export function SparkleOutline({ className, color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <path
        d="M24 5c1.4 9 5 14.4 14 17-9 2.6-12.6 8-14 17-1.4-9-5-14.4-14-17 9-2.6 12.6-8 14-17Z"
        stroke={color}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CurlyArrow({ className, color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 80" fill="none" aria-hidden className={className}>
      <path
        d="M6 10c22 2 44 12 58 30 6 8 9 17 10 27"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M60 60c5 4 10 6 14 7 1-5 3-10 6-15"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Loop({ className, color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 70" fill="none" aria-hidden className={className}>
      <path
        d="M6 40c8-26 26-38 36-28 8 8-8 30-18 26-9-4 2-30 20-32 16-2 26 14 30 30"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Squiggle({ className, color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 160 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 14c14-14 26 10 40-2s26 12 40 0 26 10 40-2"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Cloud({ className, color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" aria-hidden className={className}>
      <path
        d="M28 48c-12 0-20-7-20-16S16 16 27 17c3-9 12-14 21-11 7 2 12 8 13 15 10-2 19 4 19 13s-8 14-19 14H28Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Burst({ className, color = "currentColor" }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden className={className}>
      <path
        d="M30 4v12M30 44v12M4 30h12M44 30h12M11 11l9 9M40 40l9 9M49 11l-9 9M20 40l-9 9"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The two-tone speech bubbles from the logo and the "Speaking" slides. */
export function SpeechBubbles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 118" fill="none" aria-hidden className={className}>
      <path d="M62 66h20l-8 30-14-22z" fill="var(--brown)" />
      <circle cx="70" cy="42" r="32" fill="var(--brown)" />
      <path d="M28 78h20l-24 26 2-24z" fill="var(--pink)" />
      <ellipse cx="42" cy="62" rx="34" ry="26" fill="var(--pink)" />
      <g fill="#fff">
        <circle cx="28" cy="62" r="5.4" />
        <circle cx="42" cy="62" r="5.4" />
        <circle cx="56" cy="62" r="5.4" />
      </g>
    </svg>
  );
}

/**
 * A scattered constellation of doodles for hero / CTA backdrops.
 * Positions are hand-placed so the arrangement stays balanced.
 */
export function DoodleField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <Sparkle
        color="var(--gold)"
        className="animate-twinkle absolute top-[12%] left-[6%] size-6"
      />
      <SparkleOutline
        color="var(--pink)"
        className="animate-twinkle absolute top-[26%] right-[9%] size-8 [animation-delay:1.2s]"
      />
      <Loop
        color="var(--mint)"
        className="animate-float absolute top-[8%] right-[16%] w-24 [--tilt:8deg]"
      />
      <Squiggle
        color="var(--brown-soft)"
        className="absolute bottom-[16%] left-[3%] w-28 opacity-70"
      />
      <Cloud
        color="var(--brown-soft)"
        className="animate-float absolute top-[54%] right-[4%] w-20 opacity-60 [animation-delay:2s]"
      />
      <Burst
        color="var(--gold)"
        className="animate-twinkle absolute bottom-[26%] right-[24%] size-7 [animation-delay:0.6s]"
      />
    </div>
  );
}
