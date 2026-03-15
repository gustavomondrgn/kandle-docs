"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/category.actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { tutorials: number };
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    const result = await createCategory({ name: newName });
    if (result.success) {
      setNewName("");
      router.refresh();
    } else {
      setError(result.error ?? "Erro ao criar");
    }
    setCreating(false);
  }

  async function handleEdit() {
    if (!editId) return;
    const result = await updateCategory(editId, { name: editName });
    if (result.success) {
      setEditId(null);
      router.refresh();
    } else {
      setError(result.error ?? "Erro ao atualizar");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const result = await deleteCategory(deleteId);
    if (result.success) {
      setDeleteId(null);
      router.refresh();
    } else {
      setError(result.error ?? "Não é possível excluir");
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Create form */}
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nova categoria..."
          required
        />
        <Button type="submit" disabled={creating}>
          <Plus className="h-4 w-4 mr-1.5" />
          Criar
        </Button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* List */}
      <div className="rounded-xl border border-[--border] bg-white overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-10 text-[--muted-foreground] text-sm">
            Nenhuma categoria ainda.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--border] bg-[--muted]">
                <th className="text-left px-4 py-3 font-medium text-[--muted-foreground]">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-[--muted-foreground]">Tutoriais</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={i < categories.length - 1 ? "border-b border-[--border]" : ""}
                >
                  <td className="px-4 py-3 font-medium text-[--foreground]">{cat.name}</td>
                  <td className="px-4 py-3 text-[--muted-foreground]">{cat._count.tutorials}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditId(cat.id);
                          setEditName(cat.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar categoria</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Nome da categoria"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir categoria</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[--muted-foreground]">
            Só é possível excluir categorias sem tutoriais vinculados.
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
    </div>
  );
}
