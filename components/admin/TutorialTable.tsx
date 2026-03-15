"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { toggleTutorialPublished, deleteTutorial } from "@/actions/tutorial.actions";
import { useRouter } from "next/navigation";

interface Tutorial {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  category: { name: string };
  createdAt: Date;
}

export function TutorialTable({ tutorials }: { tutorials: Tutorial[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggle(id: string, current: boolean) {
    setLoadingId(id);
    await toggleTutorialPublished(id, !current);
    router.refresh();
    setLoadingId(null);
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deleteTutorial(deleteId);
    setDeleteId(null);
    router.refresh();
  }

  if (tutorials.length === 0) {
    return (
      <div className="text-center py-16 text-[--muted-foreground]">
        <p>Nenhum tutorial ainda.</p>
        <Link href="/admin/dashboard/tutorials/new" className="text-sm underline mt-1 block">
          Criar primeiro tutorial
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-[--border] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--border] bg-[--muted]">
              <th className="text-left px-4 py-3 font-medium text-[--muted-foreground]">Título</th>
              <th className="text-left px-4 py-3 font-medium text-[--muted-foreground]">Categoria</th>
              <th className="text-left px-4 py-3 font-medium text-[--muted-foreground]">Status</th>
              <th className="text-left px-4 py-3 font-medium text-[--muted-foreground]">Publicar</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {tutorials.map((t, i) => (
              <tr
                key={t.id}
                className={i < tutorials.length - 1 ? "border-b border-[--border]" : ""}
              >
                <td className="px-4 py-3 font-medium text-[--foreground] max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{t.title}</span>
                    <a
                      href={`/${t.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[--muted-foreground] hover:text-[--foreground] shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{t.category.name}</Badge>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.published
                        ? "bg-green-50 text-green-700"
                        : "bg-[--muted] text-[--muted-foreground]"
                    }`}
                  >
                    {t.published ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={t.published}
                    onCheckedChange={() => handleToggle(t.id, t.published)}
                    disabled={loadingId === t.id}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Button asChild size="icon" variant="ghost">
                      <Link href={`/admin/dashboard/tutorials/${t.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteId(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[--muted-foreground]">
            Tem certeza que deseja excluir este tutorial? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
