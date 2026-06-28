import mongoose, { Schema, Document, Model } from "mongoose";
import type { Photo, Music } from "@/types";

export interface IMemory extends Document {
  userId: string;
  title: string;
  description: string;
  photos: Photo[];
  music?: Music;
  mood?: string;
  location?: string;
  favorite: boolean;
  collectionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<Photo>(
  {
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    publicId: { type: String },
  },
  { _id: false }
);

const MusicSchema = new Schema<Music>(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    audioUrl: { type: String, required: true },
    coverImage: { type: String },
    duration: { type: Number, required: true },
    snippetStart: { type: Number, default: 0 },
    snippetEnd: { type: Number, required: true },
  },
  { _id: false }
);

const MemorySchema = new Schema<IMemory>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    photos: { type: [PhotoSchema], default: [] },
    music: { type: MusicSchema },
    mood: { type: String },
    location: { type: String },
    favorite: { type: Boolean, default: false },
    collectionIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

MemorySchema.index({ userId: 1, createdAt: -1 });
MemorySchema.index({ userId: 1, favorite: 1 });
MemorySchema.index({ title: "text", description: "text", location: "text" });

const Memory: Model<IMemory> =
  mongoose.models.Memory || mongoose.model<IMemory>("Memory", MemorySchema);

export default Memory;
