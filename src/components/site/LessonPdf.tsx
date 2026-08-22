"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Download, ExternalLink, FileText, Maximize2 } from "lucide-react";
import { pill } from "@/components/site/Pill";
import { Sparkle } from "@/components/site/Doodles";
import { cn } from "@/lib/utils";

/*
  Lessons ship as PDF decks. The viewer stays closed until asked — decks
  run tens of megabytes, so we don't hand the browser one on page load.
  Opening swaps the cover for an inline frame; the actions below always
  offer a new tab and a download for browsers that won't inline a PDF.
*/

export type LessonPdfLabels = {
  open: string;
  openInNewTab: string;
  fullscreen: string;
  download: string;
  hint: string;
  comingSoon: string;
};

export function LessonPdf({
  pdfUrl,
  thumbnailUrl,
  title,
  labels,
  className,
}: {
  pdfUrl: string | null;
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

  return (
    <div className={cn("space-y-4", className)}>
      {open ? (
        <div
          ref={frameRef}
          className="overflow-hidden overscroll-contain rounded-[1.5rem] border-2 border-ink bg-cream shadow-[6px_6px_0_var(--ink)] [contain:paint] [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
        >
          {/* <object> lets browsers that can't inline a PDF (iOS Safari,
              some Android shells) fall back to a real link instead of a
              blank frame. */}
          <object
            data={`${pdfUrl}#view=FitH`}
            type="application/pdf"
            title={title}
            className="h-[70vh] max-h-[46rem] min-h-[26rem] w-full [:fullscreen>&]:h-screen [:fullscreen>&]:max-h-none"
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
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={labels.open}
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] border-2 border-ink bg-brown shadow-[6px_6px_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--pink)]"
        >
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
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
              thumbnailUrl ? "opacity-100" : "opacity-0",
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
