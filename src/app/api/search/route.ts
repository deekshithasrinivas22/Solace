import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Memory from "@/models/Memory";
import { getSession } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ memories: [] });
    }

    await connectDB();

    const memories = await Memory.find({
      userId: session.user.id,
      $text: { $search: q },
    })
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .lean();

    return NextResponse.json({
      memories: memories.map((m) => ({ ...m, _id: String(m._id) })),
    });
  } catch (error) {
    console.error("GET /api/search:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
