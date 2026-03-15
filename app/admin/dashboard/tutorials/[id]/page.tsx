import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TutorialForm } from "@/components/admin/TutorialForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTutorialPage({ params }: PageProps) {
  const { id } = await params;

  const [tutorial, categories] = await Promise.all([
    prisma.tutorial.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!tutorial) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[--foreground]">Editar tutorial</h1>
      <TutorialForm
        categories={categories}
        initial={{
          id: tutorial.id,
          title: tutorial.title,
          slug: tutorial.slug,
          description: tutorial.description,
          content: tutorial.content,
          youtubeUrl: tutorial.youtubeUrl,
          categoryId: tutorial.categoryId,
          published: tutorial.published,
        }}
      />
    </div>
  );
}
