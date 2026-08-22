import type { LucideIcon } from "lucide-react";

/** Numbers first, chrome last — no card, just a labelled figure. */
export function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="px-5 py-5">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
