import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TranslationStatusBadge({
  locale,
  translated,
  className,
}: {
  locale: string;
  translated: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        translated ? "text-primary" : "text-amber-600",
        className,
      )}
    >
      {locale}
      {translated ? (
        <CheckCircle2 className="size-3.5" />
      ) : (
        <AlertTriangle className="size-3.5" />
      )}
    </span>
  );
}
