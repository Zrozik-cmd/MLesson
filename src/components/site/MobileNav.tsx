"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
          className="relative flex size-11 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink shadow-[3px_3px_0_var(--ink)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none md:hidden"
        >
          {/* The two icons cross-fade and spin into each other. */}
          <Menu
            className={cn(
              "absolute size-5 transition-all duration-300",
              open ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
            )}
          />
          <X
            className={cn(
              "absolute size-5 transition-all duration-300",
              open ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
            )}
          />
        </button>
      </SheetTrigger>

      {/* The stock sheet only travels 40px, which reads as a flicker on a
          phone — slide the whole panel in from the edge instead, and put a
          real veil behind it. */}
      <SheetContent
        side="right"
        className="w-[85%] max-w-sm border-l-2 border-ink bg-cream p-1 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-open:slide-in-from-right data-closed:slide-out-to-right [&_[data-slot=sheet-close]]:top-3.5 [&_[data-slot=sheet-close]]:right-6 [&_[data-slot=sheet-close]]:size-11 [&_[data-slot=sheet-close]]:rounded-full [&_[data-slot=sheet-close]]:border-2 [&_[data-slot=sheet-close]]:border-ink [&_[data-slot=sheet-close]]:bg-cream [&_[data-slot=sheet-close]]:text-ink [&_[data-slot=sheet-close]]:shadow-[3px_3px_0_var(--ink)] [&_[data-slot=sheet-close]_svg]:size-5 sm:[&_[data-slot=sheet-close]]:top-[1.375rem] sm:[&_[data-slot=sheet-close]]:right-8"
      >
        <SheetHeader>
          <SheetTitle className="headline flex items-center gap-2 text-xl text-ink">
            <Sparkle className="animate-twinkle size-4 text-pink" />
            {menuLabel}
          </SheetTitle>
        </SheetHeader>

        <nav className="stagger flex flex-col gap-2 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="headline-soft rounded-2xl border-2 border-ink/10 bg-card px-4 py-3.5 text-lg text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:text-pink hover:shadow-[3px_3px_0_var(--ink)] active:translate-y-0 active:shadow-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="stagger mt-6 px-4">
          <LanguageSwitcher variant="list" label={languageLabel} />
        </div>

        <div className="stagger mt-8 px-4">
          <TelegramCta source="mobile-nav" label={telegramLabel} className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
