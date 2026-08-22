import type { Metadata } from "next";
import { SettingsBaseForm } from "@/components/admin/SettingsBaseForm";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const [session, settings, socialLinks] = await Promise.all([
    requireAdmin(),
    prisma.siteSettings.findFirst({ include: { translations: true } }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Content shown across the public site — author, hero copy, and Telegram.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">General</h2>
        <SettingsBaseForm
          defaultValues={{
            authorName: settings?.authorName ?? "",
            authorPhotoUrl: settings?.authorPhotoUrl ?? "",
            telegramUrl: settings?.telegramUrl ?? "",
            siteName: settings?.siteName ?? "M Lesson",
          }}
        />
      </section>

      <section className="space-y-4 border-t border-border pt-10">
        <h2 className="text-sm font-semibold">Content by language</h2>
        <SettingsEditor translations={settings?.translations ?? []} />
      </section>

      <section className="border-t border-border pt-10">
        <SocialLinksManager links={socialLinks} />
      </section>

      <section className="space-y-4 border-t border-border pt-10">
        <h2 className="text-sm font-semibold">Account</h2>
        <PasswordChangeForm email={session.user?.email ?? ""} />
      </section>
    </div>
  );
}
