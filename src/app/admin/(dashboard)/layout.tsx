import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-scope flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader email={session.user.email ?? "admin"} />
        <main className="flex-1 px-6 py-10 sm:px-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
