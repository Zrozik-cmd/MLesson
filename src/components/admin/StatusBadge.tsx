import { cn } from "@/lib/utils";

/** A dot and a word reads faster in a table than a filled pill. */
export function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          isPublished ? "bg-primary" : "bg-muted-foreground/40",
        )}
      />
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
