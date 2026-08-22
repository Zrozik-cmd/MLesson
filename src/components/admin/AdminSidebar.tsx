import Link from "next/link";
import { LayoutDashboard, BookOpen, HelpCircle, Settings, Tag } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/lessons", label: "Lessons", icon: BookOpen },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground sm:flex sm:flex-col">
      <div className="px-6 py-6">
        <Link href="/admin" className="font-display text-lg">
          M Lesson
        </Link>
        <p className="mt-0.5 text-xs text-sidebar-foreground/60">Admin</p>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-6 py-6">
        <Link
          href="/"
          className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          ← View site
        </Link>
      </div>
    </aside>
  );
}
