"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type AppLocale } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const NATIVE_NAMES: Record<AppLocale, string> = {
  en: "English",
  ru: "Русский",
  uk: "Українська",
};

export function LanguageSwitcher({
  variant = "compact",
  label,
}: {
  variant?: "compact" | "list";
  label?: string;
}) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: AppLocale) => {
    router.replace(pathname, { locale: next });
  };

  if (variant === "list") {
    return (
      <div>
        {label ? (
          <p className="eyebrow mb-2 text-brown">{label}</p>
        ) : null}
        <div className="flex gap-2">
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => switchTo(code)}
              className={cn(
                "rounded-full border-2 px-3.5 py-1.5 font-display text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
                code === locale
                  ? "border-ink bg-ink text-cream shadow-[3px_3px_0_var(--brown-soft)]"
                  : "border-ink/15 bg-card text-muted-foreground hover:border-ink hover:text-ink",
              )}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-ink/15 bg-card px-3 font-display text-xs font-extrabold text-ink transition-colors hover:border-ink"
        >
          <Globe className="size-3.5" />
          {locale.toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="stagger rounded-2xl border-2 border-ink/15 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        {LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => switchTo(code)}
            className={cn(
              "font-display text-sm font-bold",
              code === locale && "text-pink",
            )}
          >
            {NATIVE_NAMES[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
