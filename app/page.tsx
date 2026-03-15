import { prisma } from "@/lib/prisma";
import { SearchAndFilter } from "@/components/public/SearchAndFilter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [tutorials, categories] = await Promise.all([
    prisma.tutorial.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        youtubeId: true,
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[--background]">
      {/* Header */}
      <header className="border-b border-[--border] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight text-[--foreground]">
            Kandle <span className="text-[--muted-foreground] font-normal">Docs</span>
          </span>
          <a
            href="https://kandle.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[--muted-foreground] hover:text-[--foreground] transition-colors"
          >
            kandle.studio ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[--border] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[--foreground] tracking-tight">
            Central de tutoriais
          </h1>
          <p className="mt-3 text-[--muted-foreground] text-lg max-w-xl">
            Vídeos passo a passo para você gerenciar seu site com confiança.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <SearchAndFilter tutorials={tutorials} categories={categories} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[--border] mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-sm text-[--muted-foreground]">
            © {new Date().getFullYear()} Kandle Studio
          </p>
        </div>
      </footer>
    </main>
  );
}
