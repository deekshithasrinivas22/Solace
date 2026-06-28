export interface Photo {
  url: string;
  width: number;
  height: number;
  publicId?: string;
}

export interface Music {
  title: string;
  artist: string;
  audioUrl: string;
  coverImage?: string;
  duration: number;
  snippetStart: number;
  snippetEnd: number;
}

export interface Memory {
  _id: string;
  userId: string;
  title: string;
  description: string;
  photos: Photo[];
  music?: Music;
  mood?: string;
  location?: string;
  favorite: boolean;
  collectionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  memoryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  _id: string;
  userId: string;
  memoryId: string;
  createdAt: string;
}

export type Mood =
  | "joyful"
  | "peaceful"
  | "nostalgic"
  | "excited"
  | "melancholic"
  | "grateful"
  | "adventurous"
  | "romantic";

export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "joyful", label: "Joyful", emoji: "😊" },
  { value: "peaceful", label: "Peaceful", emoji: "😌" },
  { value: "nostalgic", label: "Nostalgic", emoji: "🥹" },
  { value: "excited", label: "Excited", emoji: "🤩" },
  { value: "melancholic", label: "Melancholic", emoji: "🌧️" },
  { value: "grateful", label: "Grateful", emoji: "🙏" },
  { value: "adventurous", label: "Adventurous", emoji: "🏔️" },
  { value: "romantic", label: "Romantic", emoji: "💕" },
];
