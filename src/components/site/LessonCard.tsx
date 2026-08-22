import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Clock, FileText, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatLessonNumber } from "@/lib/lessons";
import type { ResolvedLessonSummary } from "@/lib/data";

/** Cards rotate their sticker shadow so a grid never looks mechanical. */
const SHADOWS = [
  "hover:shadow-[9px_9px_0_var(--pink)]",
  "hover:shadow-[9px_9px_0_var(--gold)]",
  "hover:shadow-[9px_9px_0_var(--mint)]",
] as const;

export async function LessonCard({
  lesson,
  index,
}: {
  lesson: ResolvedLessonSummary;
  index: number;
}) {
  const [tLevels, tCommon] = await Promise.all([
    getTranslations("levels"),
    getTranslations("common"),
  ]);
  const t = await getTranslations();

  const number = formatLessonNumber(lesson.order ?? index);

  return (
    <Link href={`/lessons/${lesson.slug}`} className="group block h-full">
      <article
        className={`flex h-full flex-col overflow-hidden rounded-[1.75rem] border-2 border-ink bg-card shadow-[5px_5px_0_var(--ink)] transition-all duration-200 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1 ${SHADOWS[index % SHADOWS.length]}`}
      >
        <div
          className={`relative aspect-[4/3] border-b-2 border-ink ${
            lesson.hasPdf ? "bg-cream" : "bg-brown"
          }`}
        >
          {lesson.thumbnailUrl ? (
            <Image
              src={lesson.thumbnailUrl}
              alt={lesson.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={`transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                lesson.hasPdf ? "object-contain p-3" : "object-cover"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brown">
              <span className="headline text-7xl text-cream/60">{number}</span>
            </div>
          )}

          {lesson.hasPdf ? null : (
            <>
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex size-14 items-center justify-center rounded-full border-2 border-ink bg-gold shadow-[3px_3px_0_var(--ink)]">
                  <Play className="size-5 fill-ink text-ink" />
                </span>
              </div>
            </>
          )}

          <span className="absolute top-3 left-3 flex size-11 items-center justify-center rounded-full border-2 border-ink bg-cream font-display text-sm font-black text-ink shadow-[2px_2px_0_var(--ink)]">
            {number}
          </span>

          <span className="absolute top-4 right-3 rounded-full border-2 border-ink bg-gold px-3 py-1 font-display text-[0.7rem] font-black tracking-wide text-ink uppercase">
            {tLevels(lesson.level)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {t("duration", { minutes: lesson.duration })}
            </span>
            {lesson.hasPdf ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-soft px-2.5 py-1 text-[0.7rem] text-ink">
                <FileText className="size-3" />
                PDF
              </span>
            ) : null}
            {lesson.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-secondary px-2.5 py-1 text-[0.7rem] text-brown"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <h3 className="headline-soft mt-3 text-xl text-ink">{lesson.title}</h3>

          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {lesson.shortDescription}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-extrabold text-pink">
            {tCommon("watchLesson")}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
