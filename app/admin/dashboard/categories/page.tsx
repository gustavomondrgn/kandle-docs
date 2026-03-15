import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { tutorials: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[--foreground]">Categorias</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
