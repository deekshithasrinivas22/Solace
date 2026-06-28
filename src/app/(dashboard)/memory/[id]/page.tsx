"use client";

import { useEffect, useState } from "react";
import { Expand, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Trash2,
  Play,
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { MusicPlayer } from "@/components/MusicPlayer";
import { MemoryReplay } from "@/components/MemoryReplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemoryStore } from "@/stores/memory-store";
import { MOODS, type Memory } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReplay, setShowReplay] = useState(false);
  const toggleFavoriteStore = useMemoryStore((s) => s.toggleFavorite);
  const [fullscreen, setFullscreen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  // console.log(memory?.music);

  useEffect(() => {
    async function fetchMemory() {
      try {
        const res = await fetch(`/api/memories/${id}`);
        if (!res.ok) {
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        setMemory(data);
      } catch {
        toast.error("Failed to load memory");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMemory();
  }, [id, router]);

  const handleToggleFavorite = async () => {
    if (!memory) return;
    setMemory({ ...memory, favorite: !memory.favorite });
    toggleFavoriteStore(memory._id);
    try {
      const res = await fetch(`/api/memories/${id}/favorite`, { method: "POST" });
      const updated = await res.json();
      setMemory(updated);
    } catch {
      setMemory({ ...memory, favorite: memory.favorite });
      toggleFavoriteStore(memory._id);
      toast.error("Failed to update favorite");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this memory permanently?")) return;
    try {
      await fetch(`/api/memories/${id}`, { method: "DELETE" });
      toast.success("Memory deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete memory");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!memory) return null;

  const mood = MOODS.find((m) => m.value === memory.mood);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowReplay(true)}
            >
              <Play className="h-4 w-4" />
              Replay
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  memory.favorite && "fill-red-400 text-red-400"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullscreen(true)}
            >
              <Expand className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <PhotoCarousel photos={memory.photos} className="mb-8" />

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(memory.createdAt), "EEEE, MMMM d, yyyy")}
            </p>
            <h1 className="text-3xl font-bold mt-1">{memory.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {mood && (
                <Badge variant="secondary">
                  {mood.emoji} {mood.label}
                </Badge>
              )}
              {memory.location && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {memory.location}
                </Badge>
              )}
            </div>
          </div>

          {memory.description && (
            <p className="text-muted-foreground leading-relaxed text-lg">
              {memory.description}
            </p>
          )}

          {memory.music && (
            <MusicPlayer music={memory.music} />
          )}
        </div>
      </motion.div>

      {showReplay && (
        <MemoryReplay memory={memory} onClose={() => setShowReplay(false)} />
      )}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          {/* Close */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-5 right-5 z-20 text-white hover:bg-white/10"
            onClick={() => setFullscreen(false)}
          >
            <X className="h-7 w-7" />
          </Button>

          {/* Previous */}
          {memory.photos.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-5 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/10"
              onClick={() =>
                setPhotoIndex((i) =>
                  i === 0 ? memory.photos.length - 1 : i - 1
                )
              }
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Next */}
          {memory.photos.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/10"
              onClick={() =>
                setPhotoIndex((i) =>
                  (i + 1) % memory.photos.length
                )
              }
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Image */}
          <Image
            src={memory.photos[photoIndex].url}
            alt={memory.title}
            width={1800}
            height={1200}
            className="max-w-[95vw] max-h-[95vh] object-contain"
            priority
          />

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white text-sm z-20">
            {photoIndex + 1} / {memory.photos.length}
          </div>
        </div>
      )}
    </>
  );
}
