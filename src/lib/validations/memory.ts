import { z } from "zod";

export const photoSchema = z.object({
  url: z.string().url(),
  width: z.number().positive(),
  height: z.number().positive(),
  publicId: z.string().optional(),
});

export const musicSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  audioUrl: z.string().url(),
  coverImage: z.string().optional(),
  duration: z.number().positive(),
  snippetStart: z.number().min(0),
  snippetEnd: z.number().positive(),
});

export const createMemorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(2000).optional(),
  photos: z.array(photoSchema).min(1, "At least one photo is required"),
  music: musicSchema.optional(),
  mood: z.string().optional(),
  location: z.string().max(200).optional(),
  collectionIds: z.array(z.string()).optional(),
});

export const updateMemorySchema = createMemorySchema.partial();

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(500).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
