import { getTranslations } from "next-intl/server";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { lessonLevelValues } from "@/lib/validation/lesson";
import type { ResolvedTag } from "@/lib/data";

export type LessonSearchParams = {
  level?: string;
  tag?: string;
  trial?: string;
};

function buildHref(current: LessonSearchParams, patch: Partial<LessonSearchParams>) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.level) params.set("level", next.level);
  if (next.tag) params.set("tag", next.tag);
  if (next.trial) params.set("trial", next.trial);
  const query = params.toString();
  return query ? `/lessons?${query}` : "/lessons";
}

function Chip({
  href,
  active,
  tone = "ink",
  children,
}: {
  href: string;
  active: boolean;
  tone?: "ink" | "gold";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full border-2 px-3.5 py-1.5 font-display text-sm font-bold transition-all",
        active
          ? tone === "gold"
            ? "border-ink bg-gold text-ink shadow-[3px_3px_0_var(--ink)]"
            : "border-ink bg-ink text-cream shadow-[3px_3px_0_var(--brown-soft)]"
          : "border-ink/15 bg-card text-muted-foreground hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1 text-brown">{label}</span>
      {children}
    </div>
  );
}

export async function LessonFilters({
  current,
  tags,
}: {
  current: LessonSearchParams;
  tags: ResolvedTag[];
}) {
  const [t, tLevels] = await Promise.all([
    getTranslations("lessonsPage.filters"),
    getTranslations("levels"),
  ]);

  const hasFilters = Boolean(current.level || current.tag || current.trial);

  return (
    <div className="dashed-frame space-y-4 p-5 sm:p-6">
      <FilterRow label={t("level")}>
        <Chip href={buildHref(current, { level: undefined })} active={!current.level}>
          {t("all")}
        </Chip>
        {lessonLevelValues.map((level) => (
          <Chip
            key={level}
            href={buildHref(current, { level })}
            active={current.level === level}
          >
            {tLevels(level)}
          </Chip>
        ))}
      </FilterRow>

      {tags.length > 0 ? (
        <FilterRow label={t("tags")}>
          <Chip href={buildHref(current, { tag: undefined })} active={!current.tag}>
            {t("all")}
          </Chip>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              href={buildHref(current, { tag: tag.slug })}
              active={current.tag === tag.slug}
            >
              {tag.name}
            </Chip>
          ))}
        </FilterRow>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Chip
          href={buildHref(current, { trial: current.trial ? undefined : "1" })}
          active={Boolean(current.trial)}
          tone="gold"
        >
          {t("trialOnly")}
        </Chip>
        {hasFilters ? (
          <Link
            href="/lessons"
            className="inline-flex items-center gap-1 font-display text-sm font-bold text-pink hover:underline"
          >
            <X className="size-3.5" />
            {t("clear")}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
