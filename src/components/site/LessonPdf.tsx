"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Maximize2,
} from "lucide-react";
import { pill } from "@/components/site/Pill";
import { Sparkle } from "@/components/site/Doodles";
import { cn } from "@/lib/utils";

/*
  Lesson decks are PDFs, but a PDF embed isn't a viewer you can rely on:
  iOS Safari — and therefore every browser on iPhone — renders the first
  page and refuses to scroll. So when the server has rendered the deck to
  page images we show those as a snap-scrolling slide strip, which behaves
  the same everywhere. The embed stays as a fallback for decks stored
  before page rendering existed.

  Either way the deck opens only on request: they run several megabytes.
*/

export type LessonPdfLabels = {
  open: string;
  openInNewTab: string;
  fullscreen: string;
  download: string;
  hint: string;
  comingSoon: string;
  prevSlide: string;
  nextSlide: string;
};

function SlideDeck({
  pages,
  title,
  labels,
}: {
  pages: string[];
  title: string;
  labels: LessonPdfLabels;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, track.children.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }, []);

  // Scroll position is the source of truth, so swiping and the buttons stay
  // in sync without extra bookkeeping.
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") goTo(index + 1);
        if (event.key === "ArrowLeft") goTo(index - 1);
      }}
      className="relative overflow-hidden rounded-[1.5rem] border-2 border-ink bg-ink shadow-[6px_6px_0_var(--ink)] outline-none [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pages.map((page, i) => (
          <div key={page} className="relative aspect-[16/9] w-full shrink-0 snap-center">
            <Image
              src={page}
              alt={`${title} — ${i + 1}/${pages.length}`}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              priority={i === 0}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label={labels.prevSlide}
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        className="absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink shadow-[3px_3px_0_var(--ink)] transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:flex"
      >
        <ChevronLeft className="size-5" />
      </button>

      <button
        type="button"
        aria-label={labels.nextSlide}
        onClick={() => goTo(index + 1)}
        disabled={index >= pages.length - 1}
        className="absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink shadow-[3px_3px_0_var(--ink)] transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:flex"
      >
        <ChevronRight className="size-5" />
      </button>

      <span className="absolute top-3 right-3 rounded-full border-2 border-ink bg-cream px-3 py-1 font-display text-xs font-black text-ink tabular-nums">
        {index + 1} / {pages.length}
      </span>
    </div>
  );
}

export function LessonPdf({
  pdfUrl,
  pdfPages = [],
  thumbnailUrl,
  title,
  labels,
  className,
}: {
  pdfUrl: string | null;
  /** Rendered deck pages; empty falls back to the PDF embed. */
  pdfPages?: string[];
  thumbnailUrl: string | null;
  title: string;
  labels: LessonPdfLabels;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  if (!pdfUrl) {
    return (
      <div
        className={cn(
          "dashed-frame flex aspect-[16/10] flex-col items-center justify-center gap-3 text-center",
          className,
        )}
      >
        <FileText className="size-8 text-brown-soft" />
        <p className="font-display text-sm font-bold text-muted-foreground">
          {labels.comingSoon}
        </p>
      </div>
    );
  }

  const fileName = decodeURIComponent(pdfUrl.split("/").pop() ?? `${title}.pdf`);
  const cover = thumbnailUrl ?? pdfPages[0] ?? null;

  return (
    <div className={cn("space-y-4", className)}>
      {open ? (
        <div ref={frameRef}>
          {pdfPages.length > 0 ? (
            <SlideDeck pages={pdfPages} title={title} labels={labels} />
          ) : (
            <div className="overflow-hidden overscroll-contain rounded-[1.5rem] border-2 border-ink bg-cream shadow-[6px_6px_0_var(--ink)] [contain:paint]">
              <object
                data={`${pdfUrl}#view=FitH`}
                type="application/pdf"
                title={title}
                className="h-[70vh] max-h-[46rem] min-h-[26rem] w-full"
              >
                <div className="flex h-[26rem] flex-col items-center justify-center gap-4 px-6 text-center">
                  <FileText className="size-8 text-brown-soft" />
                  <p className="font-display text-sm font-bold text-muted-foreground">
                    {labels.hint}
                  </p>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={pill({ tone: "pink", size: "md" })}
                  >
                    <ExternalLink />
                    {labels.openInNewTab}
                  </a>
                </div>
              </object>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={labels.open}
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] border-2 border-ink bg-brown shadow-[6px_6px_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--pink)]"
        >
          {cover ? (
            <Image
              src={cover}
              alt={title}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <span aria-hidden className="absolute inset-0 bg-cream">
              <Sparkle color="var(--gold)" className="absolute top-8 left-10 size-8" />
              <Sparkle color="var(--pink)" className="absolute right-12 bottom-10 size-6" />
            </span>
          )}

          {/* Keep the cover slide readable — only the bottom band is veiled. */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/30 to-transparent transition-opacity",
              cover ? "opacity-100" : "opacity-0",
            )}
          />

          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 p-5 sm:p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-gold shadow-[3px_3px_0_var(--ink)] transition-transform group-hover:scale-105">
              <FileText className="size-5 text-ink" />
            </span>
            <span className="rounded-full border-2 border-ink bg-cream px-5 py-2.5 font-display text-sm font-extrabold text-ink shadow-[3px_3px_0_var(--ink)]">
              {labels.open}
            </span>
          </span>
        </button>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {open ? (
          <button
            type="button"
            onClick={() => frameRef.current?.requestFullscreen?.()}
            className={pill({ tone: "outline", size: "sm" })}
          >
            <Maximize2 />
            {labels.fullscreen}
          </button>
        ) : null}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={pill({ tone: "outline", size: "sm" })}
        >
          <ExternalLink />
          {labels.openInNewTab}
        </a>
        <a
          href={pdfUrl}
          download={fileName}
          className={pill({ tone: "outline", size: "sm" })}
        >
          <Download />
          {labels.download}
        </a>
        <p className="text-xs text-muted-foreground">{labels.hint}</p>
      </div>
    </div>
  );
}
