import { prisma } from "@/lib/prisma";
import { TutorialForm } from "@/components/admin/TutorialForm";

export default async function NewTutorialPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[--foreground]">Novo tutorial</h1>
      <TutorialForm categories={categories} />
    </div>
  );
}
