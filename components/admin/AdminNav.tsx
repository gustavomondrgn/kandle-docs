"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Video, Tag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/tutorials", label: "Tutoriais", icon: Video, exact: false },
  { href: "/admin/dashboard/categories", label: "Categorias", icon: Tag, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-[--border] flex flex-col">
      <div className="px-5 py-5 border-b border-[--border]">
        <Link href="/admin/dashboard">
          <span className="text-base font-semibold text-[--foreground] tracking-tight">
            Kandle <span className="text-[--muted-foreground] font-normal">Admin</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[--accent] text-[--foreground]"
                  : "text-[--muted-foreground] hover:bg-[--accent] hover:text-[--foreground]"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[--border]">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[--muted-foreground] hover:bg-[--accent] hover:text-[--foreground] w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
