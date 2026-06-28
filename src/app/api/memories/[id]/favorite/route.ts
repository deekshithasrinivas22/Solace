import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Memory from "@/models/Memory";
import Favorite from "@/models/Favorite";
import { getSession, serializeMemory } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectDB();

    const memory = await Memory.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    const newFavorite = !memory.favorite;
    memory.favorite = newFavorite;
    await memory.save();

    if (newFavorite) {
      await Favorite.findOneAndUpdate(
        { userId: session.user.id, memoryId: id },
        {},
        { upsert: true }
      );
    } else {
      await Favorite.deleteOne({ userId: session.user.id, memoryId: id });
    }

    return NextResponse.json(serializeMemory(memory));
  } catch (error) {
    console.error("POST /api/memories/[id]/favorite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}
