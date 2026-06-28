"use client";

import { useEffect, useCallback } from "react";
import { CalendarView } from "@/components/Calendar";
import { useMemoryStore } from "@/stores/memory-store";
import { toast } from "sonner";

export default function CalendarPage() {
  const { memories, setMemories, setLoading } = useMemoryStore();

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memories?limit=500");
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground mt-1">
          Browse memories by date
        </p>
      </div>
      <CalendarView memories={memories} />
    </div>
  );
}
