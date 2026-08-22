"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TelegramCta } from "@/components/site/TelegramCta";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { Sparkle } from "@/components/site/Doodles";

export function MobileNav({
  links,
  menuLabel,
  openMenuLabel,
  telegramLabel,
  languageLabel,
}: {
  links: { href: string; label: string }[];
  menuLabel: string;
  openMenuLabel: string;
  telegramLabel: string;
  languageLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={openMenuLabel}
          className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink shadow-[3px_3px_0_var(--ink)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none md:hidden"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 border-l-2 border-ink bg-cream">
        <SheetHeader>
          <SheetTitle className="headline flex items-center gap-2 text-xl text-ink">
            <Sparkle className="size-4 text-pink" />
            {menuLabel}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-2 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="headline-soft rounded-2xl border-2 border-ink/10 bg-card px-4 py-3.5 text-lg text-ink transition-colors hover:border-ink hover:text-pink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 px-4">
          <LanguageSwitcher variant="list" label={languageLabel} />
        </div>

        <div className="mt-8 px-4">
          <TelegramCta source="mobile-nav" label={telegramLabel} className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
