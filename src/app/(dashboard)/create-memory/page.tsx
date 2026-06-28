"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X, Loader2, ImageIcon, Music, MapPin } from "lucide-react";
import { createMemorySchema, type CreateMemoryInput } from "@/lib/validations/memory";
import { MOODS } from "@/types";
import type { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemoryStore } from "@/stores/memory-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AudioSnippetEditor from "@/components/AudioSnippetEditor";

export default function CreateMemoryPage() {
  const router = useRouter();
  const addMemory = useMemoryStore((s) => s.addMemory);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioData, setAudioData] = useState<{
    file: File;
    audioUrl: string;
    filename: string;
    duration: number;
  } | null>(null);
  const [snippetStart, setSnippetStart] = useState(0);
  const [snippetEnd, setSnippetEnd] = useState(30);
  const [musicTitle, setMusicTitle] = useState("");
  const [musicArtist, setMusicArtist] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMemoryInput>({
    resolver: zodResolver(createMemorySchema),
    defaultValues: { photos: [] },
  });

  const mood = watch("mood");

  const uploadPhoto = async (file: File) => {
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const photo: Photo = {
        url: data.url,
        width: data.width,
        height: data.height,
        publicId: data.publicId,
      };
      setPhotos((prev) => {
        const updated = [...prev, photo];
        setValue("photos", updated);
        return updated;
      });
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const uploadAudio = async (file: File) => {
    setIsUploadingAudio(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/audio", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      const audio = new Audio(data.audioUrl);
      await new Promise<void>((resolve) => {
        audio.addEventListener("loadedmetadata", () => resolve());
        audio.addEventListener("error", () => resolve());
      });

      const duration = audio.duration && isFinite(audio.duration) ? audio.duration : 180;
      setAudioData({
        file,
        audioUrl: data.audioUrl,
        filename: data.filename,
        duration,
      }); setSnippetEnd(Math.min(30, duration));
      setMusicTitle(file.name.replace(/\.[^/.]+$/, ""));
    } catch {
      toast.error("Failed to upload audio");
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const onSubmit = async (data: CreateMemoryInput) => {
    if (photos.length === 0) {
      toast.error("Please add at least one photo");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateMemoryInput = {
        ...data,
        photos,
        music: audioData
          ? {
            title: musicTitle || audioData.filename,
            artist: musicArtist || "Unknown Artist",
            audioUrl: audioData.audioUrl,
            duration: audioData.duration,
            snippetStart,
            snippetEnd,
          }
          : undefined,
      };

      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error("Failed to create memory");
        console.error(err);
        return;
      }

      const memory = await res.json();
      addMemory(memory);
      toast.success("Memory created!");
      router.push(`/memory/${memory._id}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Memory</h1>
        <p className="text-muted-foreground mt-1">
          Capture a moment with photos, music, and notes
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Photos */}
        <section className="glass-card p-6 space-y-4">
          <Label className="text-base font-semibold">Photos</Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={photo.url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    const updated = photos.filter((_, idx) => idx !== i);
                    setPhotos(updated);
                    setValue("photos", updated);
                  }}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label
              className={cn(
                "aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors",
                isUploadingPhoto && "opacity-50 pointer-events-none"
              )}
            >
              {isUploadingPhoto ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Add photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) Array.from(files).forEach(uploadPhoto);
                }}
              />
            </label>
          </div>
          {errors.photos && (
            <p className="text-xs text-destructive">At least one photo is required</p>
          )}
        </section>

        {/* Details */}
        <section className="glass-card p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give this memory a name"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What made this moment special?"
              rows={4}
              {...register("description")}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mood</Label>
              <Select value={mood} onValueChange={(v) => setValue("mood", v ?? undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="How did you feel?" />
                </SelectTrigger>
                <SelectContent>
                  {MOODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.emoji} {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="inline h-3 w-3 mr-1" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="Where was this?"
                {...register("location")}
              />
            </div>
          </div>
        </section>

        {/* Music */}
        <section className="glass-card p-6 space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Music className="h-4 w-4" />
            Soundtrack (optional)
          </Label>

          {!audioData ? (
            <label
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/50 transition-colors",
                isUploadingAudio && "opacity-50 pointer-events-none"
              )}
            >
              {isUploadingAudio ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <>
                  <Music className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload audio file</p>
                  <p className="text-xs text-muted-foreground mt-1">MP3, WAV, M4A supported</p>
                </>
              )}
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAudio(file);
                }}
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{audioData.filename}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAudioData(null)}
                >
                  Remove
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Track title</Label>
                  <Input
                    value={musicTitle}
                    onChange={(e) => setMusicTitle(e.target.value)}
                    placeholder="Song title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Artist</Label>
                  <Input
                    value={musicArtist}
                    onChange={(e) => setMusicArtist(e.target.value)}
                    placeholder="Artist name"
                  />
                </div>
              </div>
              <AudioSnippetEditor
                audioUrl={audioData.file}
                onChange={({ snippetStart, snippetEnd, duration }) => {
                  setSnippetStart(snippetStart);
                  setSnippetEnd(snippetEnd);
                  setAudioData((prev) =>
                    prev ? { ...prev, duration } : prev
                  );
                }}
              />
            </div>
          )}
        </section>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploadingPhoto}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Memory"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
