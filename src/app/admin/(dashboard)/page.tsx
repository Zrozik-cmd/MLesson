import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle2, FileEdit, Send } from "lucide-react";
import { StatTile } from "@/components/admin/StatTile";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { prisma } from "@/lib/prisma";
import { ADMIN_LEVEL_LABELS } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

async function getDashboardData() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [total, published, drafts, telegramClicks, recentLessons] = await Promise.all([
    prisma.lesson.count(),
    prisma.lesson.count({ where: { isPublished: true } }),
    prisma.lesson.count({ where: { isPublished: false } }),
    prisma.analyticsEvent.count({
      where: { type: "TELEGRAM_CLICK", createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.lesson.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { translations: { where: { locale: "EN" } } },
    }),
  ]);

  return { total, published, drafts, telegramClicks, recentLessons };
}

export default async function AdminDashboardPage() {
  const { total, published, drafts, telegramClicks, recentLessons } =
    await getDashboardData();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of your lessons and conversion activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Lessons" value={total} icon={BookOpen} />
        <StatTile label="Published lessons" value={published} icon={CheckCircle2} />
        <StatTile label="Draft lessons" value={drafts} icon={FileEdit} />
        <StatTile label="Telegram clicks (30d)" value={telegramClicks} icon={Send} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Recent lessons</h2>
          <Link href="/admin/lessons" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {recentLessons.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No lessons yet.{" "}
              <Link href="/admin/lessons/new" className="text-primary hover:underline">
                Create your first lesson
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentLessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/admin/lessons/${lesson.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {lesson.translations[0]?.title ?? lesson.slug}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {ADMIN_LEVEL_LABELS[lesson.level]}
                      </p>
                    </div>
                    <StatusBadge isPublished={lesson.isPublished} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
