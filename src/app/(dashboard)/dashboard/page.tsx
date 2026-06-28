"use client";

import { useEffect, useCallback } from "react";
import { LayoutGrid, List } from "lucide-react";
import { MemoryCard } from "@/components/MemoryCard";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { useMemoryStore } from "@/stores/memory-store";
import { toast } from "sonner";
import { useState } from "react";

export default function DashboardPage() {
  const { memories, isLoading, setMemories, toggleFavorite, setLoading } =
    useMemoryStore();
  const [view, setView] = useState<"grid" | "timeline">("grid");

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memories");
      const data = await res.json();
      setMemories(data.memories ?? []);
    } catch {
      toast.error("Failed to load memories");
    } finally {
      setLoading(false);
    }
  }, [setMemories, setLoading]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const handleToggleFavorite = async (id: string) => {
    toggleFavorite(id);
    try {
      await fetch(`/api/memories/${id}/favorite`, { method: "POST" });
    } catch {
      toggleFavorite(id);
      toast.error("Failed to update favorite");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Memories</h1>
          <p className="text-muted-foreground mt-1">
            {memories.length} {memories.length === 1 ? "memory" : "memories"} captured
          </p>
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "timeline" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("timeline")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-xl bg-secondary animate-pulse"
                />
              ))
            : memories.map((memory) => (
                <MemoryCard
                  key={memory._id}
                  memory={memory}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
          {!isLoading && memories.length === 0 && (
            <div className="col-span-full">
              <Timeline memories={[]} />
            </div>
          )}
        </div>
      ) : (
        <Timeline
          memories={memories}
          isLoading={isLoading}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}
