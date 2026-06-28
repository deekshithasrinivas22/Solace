import { NextRequest, NextResponse } from "next/server";
import { uploadAudio, generateAudioKey } from "@/lib/r2";
import { getSession } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/m4a",
      "audio/aac",
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
      return NextResponse.json(
        { error: "File must be an audio file" },
        { status: 400 }
      );
    }

    const key = generateAudioKey(session.user.id, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    const audioUrl = await uploadAudio(key, buffer, file.type || "audio/mpeg");

    return NextResponse.json({
      audioUrl,
      key,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("POST /api/upload/audio:", error);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 }
    );
  }
}
