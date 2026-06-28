import { create } from "zustand";
import type { Memory } from "@/types";

interface MemoryStore {
  memories: Memory[];
  isLoading: boolean;
  setMemories: (memories: Memory[]) => void;
  addMemory: (memory: Memory) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  removeMemory: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  isLoading: false,
  setMemories: (memories) => set({ memories }),
  addMemory: (memory) =>
    set((state) => ({ memories: [memory, ...state.memories] })),
  updateMemory: (id, updates) =>
    set((state) => ({
      memories: state.memories.map((m) =>
        m._id === id ? { ...m, ...updates } : m
      ),
    })),
  removeMemory: (id) =>
    set((state) => ({
      memories: state.memories.filter((m) => m._id !== id),
    })),
  toggleFavorite: (id) =>
    set((state) => ({
      memories: state.memories.map((m) =>
        m._id === id ? { ...m, favorite: !m.favorite } : m
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
