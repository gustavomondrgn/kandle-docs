"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TutorialCard } from "./TutorialCard";
import { cn } from "@/lib/utils";

interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string;
  youtubeId: string;
  category: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

interface SearchAndFilterProps {
  tutorials: Tutorial[];
  categories: Category[];
}

export function SearchAndFilter({ tutorials, categories }: SearchAndFilterProps) {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = tutorials;

    if (activeCategoryId) {
      result = result.filter((t) => t.category.id === activeCategoryId);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tutorials, activeCategoryId, query]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--muted-foreground]" />
        <Input
          type="text"
          placeholder="Buscar tutoriais..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategoryId(null)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            activeCategoryId === null
              ? "bg-[--foreground] text-[--background]"
              : "bg-[--muted] text-[--muted-foreground] hover:bg-neutral-200"
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setActiveCategoryId(cat.id === activeCategoryId ? null : cat.id)
            }
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              activeCategoryId === cat.id
                ? "bg-[--foreground] text-[--background]"
                : "bg-[--muted] text-[--muted-foreground] hover:bg-neutral-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      {(query || activeCategoryId) && (
        <p className="text-sm text-[--muted-foreground]">
          {filtered.length} tutorial{filtered.length !== 1 ? "is" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              title={tutorial.title}
              slug={tutorial.slug}
              description={tutorial.description}
              youtubeId={tutorial.youtubeId}
              categoryName={tutorial.category.name}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[--muted-foreground]">
          <p className="text-lg font-medium">Nenhum tutorial encontrado</p>
          <p className="text-sm mt-1">Tente buscar por outro termo ou categoria.</p>
        </div>
      )}
    </div>
  );
}
