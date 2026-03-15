"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTutorial, updateTutorial } from "@/actions/tutorial.actions";
import { slugify, extractYouTubeId } from "@/lib/utils";

// Dynamic import para evitar SSR issues com o editor
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Category {
  id: string;
  name: string;
}

interface TutorialFormProps {
  categories: Category[];
  initial?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    content?: string | null;
    youtubeUrl: string;
    categoryId: string;
    published: boolean;
  };
}

export function TutorialForm({ categories, initial }: TutorialFormProps) {
  const router = useRouter();
  const isEditing = !!initial;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeUrl ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);

  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  const youtubeId = extractYouTubeId(youtubeUrl);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = { title, slug, description, content, youtubeUrl, categoryId, published };

    const result = isEditing
      ? await updateTutorial(initial!.id, data)
      : await createTutorial(data);

    if (result.success) {
      router.push("/admin/dashboard/tutorials");
      router.refresh();
    } else {
      setError(result.error ?? "Erro ao salvar");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Como editar o cabeçalho do site"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugManuallyEdited(true);
          }}
          placeholder="como-editar-o-cabecalho-do-site"
          required
        />
        <p className="text-xs text-[--muted-foreground]">
          URL final: /{slug || "seu-slug"}
        </p>
      </div>

      {/* YouTube URL */}
      <div className="space-y-1.5">
        <Label htmlFor="youtubeUrl">URL do YouTube</Label>
        <Input
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://youtu.be/abc123"
          required
        />
        {youtubeUrl && !youtubeId && (
          <p className="text-xs text-red-500">URL inválida — use youtube.com/watch?v=... ou youtu.be/...</p>
        )}
        {youtubeId && (
          <p className="text-xs text-green-600">ID detectado: {youtubeId}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label>Categoria</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição curta</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição do que o tutorial ensina..."
          rows={3}
          required
        />
      </div>

      {/* Content (Markdown) */}
      <div className="space-y-1.5">
        <Label>Conteúdo (Markdown)</Label>
        <p className="text-xs text-[--muted-foreground]">
          Opcional. Aparece abaixo do vídeo. Suporta Markdown completo.
        </p>
        <div data-color-mode="light" className="rounded-md overflow-hidden border border-[--border]">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val ?? "")}
            height={400}
            preview="live"
          />
        </div>
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <Switch
          id="published"
          checked={published}
          onCheckedChange={setPublished}
        />
        <Label htmlFor="published" className="cursor-pointer">
          {published ? "Publicado" : "Rascunho"}
        </Label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar tutorial"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dashboard/tutorials")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
