"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, HelpCircle, Settings, Tag } from "lucide-react";
import { LogoMark } from "@/components/site/LogoMark";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/lessons", label: "Lessons", icon: BookOpen },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border sm:flex sm:flex-col">
      <div className="px-5 py-6">
        <Link href="/admin" className="inline-flex items-center gap-2.5">
          <LogoMark className="h-7" />
          <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          // /admin would otherwise light up on every child route.
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 py-6">
        <Link
          href="/"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← View site
        </Link>
      </div>
    </aside>
  );
}
