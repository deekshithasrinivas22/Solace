import { create } from "zustand";
import type { Music } from "@/types";

interface PlayerState {
  currentTrack: (Music & { memoryId?: string; memoryTitle?: string }) | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  setTrack: (
    track: (Music & { memoryId?: string; memoryTitle?: string }) | null
  ) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  volume: 0.8,
  setTrack: (track) =>
    set({ currentTrack: track, isPlaying: !!track, currentTime: 0 }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setVolume: (volume) => set({ volume }),
}));
