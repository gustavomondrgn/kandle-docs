import { prisma } from "@/lib/prisma";
import { TutorialTable } from "@/components/admin/TutorialTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function TutorialsPage() {
  const tutorials = await prisma.tutorial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[--foreground]">Tutoriais</h1>
        <Button asChild size="sm">
          <Link href="/admin/dashboard/tutorials/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Novo tutorial
          </Link>
        </Button>
      </div>

      <TutorialTable tutorials={tutorials} />
    </div>
  );
}
