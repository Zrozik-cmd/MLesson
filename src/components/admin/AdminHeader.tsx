import { SignOutButton } from "@/components/admin/SignOutButton";

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6">
      <p className="text-sm text-muted-foreground">Signed in as {email}</p>
      <SignOutButton />
    </header>
  );
}
