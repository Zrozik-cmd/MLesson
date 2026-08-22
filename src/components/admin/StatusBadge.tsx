import { Badge } from "@/components/ui/badge";

export function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <Badge variant={isPublished ? "default" : "outline"}>
      {isPublished ? "Published" : "Draft"}
    </Badge>
  );
}
