"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { resolveVideoSource } from "@/lib/video";
import { cn } from "@/lib/utils";

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  className,
}: {
  videoUrl: string | null;
  thumbnailUrl: string | null;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const source = resolveVideoSource(videoUrl);

  if (!source) {
    return (
      <div
        className={cn(
          "dashed-frame flex aspect-video items-center justify-center font-display text-sm font-bold text-muted-foreground",
          className,
        )}
      >
        Video coming soon
      </div>
    );
  }

  if (playing) {
    return (
      <div
        className={cn(
          "aspect-video overflow-hidden rounded-[1.5rem] border-2 border-ink bg-ink shadow-[6px_6px_0_var(--ink)]",
          className,
        )}
      >
        {source.kind === "file" ? (
          <video
            src={source.url}
            controls
            autoPlay
            className="h-full w-full"
          />
        ) : (
          <iframe
            src={`${source.embedUrl}${source.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={cn(
        "group relative block aspect-video w-full overflow-hidden rounded-[1.5rem] border-2 border-ink bg-brown shadow-[6px_6px_0_var(--ink)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--pink)]",
        className,
      )}
      aria-label={`Play video: ${title}`}
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 900px, 100vw"
          quality={90}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      ) : null}
      <div className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/35" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-20 items-center justify-center rounded-full border-2 border-ink bg-gold shadow-[4px_4px_0_var(--ink)] transition-transform group-hover:scale-105">
          <Play className="size-7 fill-ink text-ink" />
        </span>
      </div>
    </button>
  );
}
