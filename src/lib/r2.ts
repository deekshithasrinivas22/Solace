import { supabase } from "./supabase";

const BUCKET = process.env.SUPABASE_AUDIO_BUCKET!;

export async function uploadAudio(
  fileName: string,
  file: Buffer,
  contentType: string
): Promise<string> {

  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Bucket:", BUCKET);
  console.log("File Name:", fileName);
  console.log("Content Type:", contentType);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      contentType,
      upsert: false,
    });

  console.log("Upload Data:", data);
  console.log("Upload Error:", error);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

export async function deleteAudio(fileName: string) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([fileName]);

  if (error) {
    console.error("Supabase Delete Error:", error);
    throw error;
  }
}

export function generateAudioKey(
  userId: string,
  filename: string
): string {
  const ext = filename.split(".").pop() || "mp3";
  return `${userId}/${Date.now()}.${ext}`;
}