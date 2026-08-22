import { getTranslations } from "next-intl/server";
import { LessonCard } from "@/components/site/LessonCard";
import { Reveal } from "@/components/motion/Reveal";
import { Cloud } from "@/components/site/Doodles";
import type { ResolvedLessonSummary } from "@/lib/data";

export async function LessonGrid({
  lessons,
  emptyMessage,
}: {
  lessons: ResolvedLessonSummary[];
  emptyMessage?: string;
}) {
  if (lessons.length === 0) {
    const t = await getTranslations("lessonsPage");
    return (
      <div className="dashed-frame flex flex-col items-center gap-4 px-6 py-16 text-center">
        <Cloud color="var(--brown-soft)" className="w-20" />
        <p className="font-display text-base font-bold text-muted-foreground">
          {emptyMessage ?? t("emptyState")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson, index) => (
        <Reveal key={lesson.slug} delay={(index % 3) * 0.08} className="h-full">
          <LessonCard lesson={lesson} index={index} />
        </Reveal>
      ))}
    </div>
  );
}
