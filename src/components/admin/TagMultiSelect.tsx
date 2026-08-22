"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type TagOption = { id: string; name: string };

export function TagMultiSelect({
  tags,
  value,
  onChange,
}: {
  tags: TagOption[];
  value: string[];
  onChange: (tagIds: string[]) => void;
}) {
  if (tags.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No tags yet — create some under Tags in the sidebar.
      </p>
    );
  }

  const toggle = (id: string, checked: boolean) => {
    onChange(checked ? [...value, id] : value.filter((tagId) => tagId !== id));
  };

  return (
    <div className="flex flex-wrap gap-4">
      {tags.map((tag) => (
        <label key={tag.id} className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={value.includes(tag.id)}
            onCheckedChange={(checked) => toggle(tag.id, checked === true)}
          />
          <Label className="cursor-pointer font-normal">{tag.name}</Label>
        </label>
      ))}
    </div>
  );
}
