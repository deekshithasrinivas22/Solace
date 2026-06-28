"use client";

import { useEffect, useCallback } from "react";
import { MemoryCard } from "@/components/MemoryCard";
import { useMemoryStore } from "@/stores/memory-store";
import { toast } from "sonner";

export default function FavoritesPage() {
  const { memories, isLoading, setMemories, toggleFavorite, setLoading } =
    useMemoryStore();

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memories?favorite=true");
      const data = await res.json();
      setMemories(data.memories ?? []);
    } catch {
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }, [setMemories, setLoading]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleToggleFavorite = async (id: string) => {
    toggleFavorite(id);
    try {
      await fetch(`/api/memories/${id}/favorite`, { method: "POST" });
      setMemories(memories.filter((m) => m._id !== id || !m.favorite));
    } catch {
      toggleFavorite(id);
      toast.error("Failed to update favorite");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Favorites</h1>
        <p className="text-muted-foreground mt-1">
          Memories you&apos;ve marked as favorites
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-secondary animate-pulse"
            />
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-3xl">❤️</span>
          </div>
          <h3 className="text-lg font-semibold">No favorites yet</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            Tap the heart on any memory to save it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {memories.map((memory) => (
            <MemoryCard
              key={memory._id}
              memory={memory}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
