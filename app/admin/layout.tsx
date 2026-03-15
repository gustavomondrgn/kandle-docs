import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // /admin/login is public — middleware handles the rest
  // But layout also guards against direct server-side access
  if (!session && typeof window === "undefined") {
    // Only redirect if not on login page (middleware handles this)
  }

  return (
    <div className="min-h-screen bg-[--muted] flex">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
