import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { YoutubeEmbed } from "@/components/public/YoutubeEmbed";
import { MarkdownContent } from "@/components/public/MarkdownContent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return tutorials.map((t: { slug: string }) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await prisma.tutorial.findUnique({
    where: { slug, published: true },
    select: { title: true, description: true },
  });
  if (!tutorial) return {};
  return {
    title: tutorial.title,
    description: tutorial.description,
  };
}

export default async function TutorialPage({ params }: PageProps) {
  const { slug } = await params;

  const tutorial = await prisma.tutorial.findUnique({
    where: { slug, published: true },
    include: { category: { select: { name: true } } },
  });

  if (!tutorial) notFound();

  return (
    <main className="min-h-screen bg-[--background]">
      {/* Header */}
      <header className="border-b border-[--border] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[--foreground]"
          >
            Kandle <span className="text-[--muted-foreground] font-normal">Docs</span>
          </Link>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[--muted-foreground] hover:text-[--foreground] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos tutoriais
        </Link>

        {/* Meta */}
        <div className="space-y-2">
          <Badge variant="secondary">{tutorial.category.name}</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-[--foreground] tracking-tight">
            {tutorial.title}
          </h1>
          {tutorial.description && (
            <p className="text-[--muted-foreground] text-base leading-relaxed">
              {tutorial.description}
            </p>
          )}
        </div>

        {/* Video */}
        <YoutubeEmbed youtubeId={tutorial.youtubeId} title={tutorial.title} />

        {/* Markdown content */}
        {tutorial.content && (
          <>
            <Separator />
            <MarkdownContent content={tutorial.content} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[--border] mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-sm text-[--muted-foreground]">
            © {new Date().getFullYear()} Kandle Studio
          </p>
        </div>
      </footer>
    </main>
  );
}
