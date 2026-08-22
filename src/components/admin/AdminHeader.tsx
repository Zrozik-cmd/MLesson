import { SignOutButton } from "@/components/admin/SignOutButton";

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-6 sm:px-8">
      <p className="truncate text-xs text-muted-foreground">{email}</p>
      <SignOutButton />
    </header>
  );
}
