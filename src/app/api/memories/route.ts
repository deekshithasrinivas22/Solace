import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Memory from "@/models/Memory";
import { getSession, serializeMemory } from "@/lib/api-utils";
import { createMemorySchema } from "@/lib/validations/memory";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const favorite = searchParams.get("favorite");
    const mood = searchParams.get("mood");
    const collectionId = searchParams.get("collectionId");
    const search = searchParams.get("search");
    const date = searchParams.get("date");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const page = parseInt(searchParams.get("page") ?? "1");

    const filter: Record<string, unknown> = { userId: session.user.id };

    if (favorite === "true") filter.favorite = true;
    if (mood) filter.mood = mood;
    if (collectionId) filter.collectionIds = collectionId;
    if (search) {
      filter.$text = { $search: search };
    }
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    const memories = await Memory.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Memory.countDocuments(filter);

    return NextResponse.json({
      memories: memories.map((m) => ({ ...m, _id: String(m._id) })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/memories:", error);
    return NextResponse.json(
      { error: "Failed to fetch memories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createMemorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const memory = await Memory.create({
      ...parsed.data,
      userId: session.user.id,
    });

    return NextResponse.json(serializeMemory(memory), { status: 201 });
  } catch (error) {
    console.error("POST /api/memories:", error);
    return NextResponse.json(
      { error: "Failed to create memory" },
      { status: 500 }
    );
  }
}
