import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Video, Tag, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const [totalTutorials, publishedTutorials, totalCategories] = await Promise.all([
    prisma.tutorial.count(),
    prisma.tutorial.count({ where: { published: true } }),
    prisma.category.count(),
  ]);

  const stats = [
    { label: "Total de tutoriais", value: totalTutorials, icon: Video },
    { label: "Publicados", value: publishedTutorials, icon: Eye },
    { label: "Categorias", value: totalCategories, icon: Tag },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[--foreground]">Dashboard</h1>
        <Button asChild size="sm">
          <Link href="/admin/dashboard/tutorials/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Novo tutorial
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-[--border] p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[--muted] rounded-lg">
                <Icon className="h-4 w-4 text-[--muted-foreground]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[--foreground]">{value}</p>
                <p className="text-xs text-[--muted-foreground]">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/admin/dashboard/tutorials">Ver tutoriais</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/dashboard/categories">Gerenciar categorias</Link>
        </Button>
      </div>
    </div>
  );
}
