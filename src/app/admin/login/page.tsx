import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          M Lesson
        </p>
        <h1 className="mt-2 font-display text-3xl">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage lessons, FAQ, and site settings.
        </p>

        <div className="mt-8">
          <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
