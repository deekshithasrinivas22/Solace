import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Collection from "@/models/Collection";
import { getSession } from "@/lib/api-utils";
import { createCollectionSchema } from "@/lib/validations/memory";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const collections = await Collection.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      collections.map((c) => ({ ...c, _id: String(c._id) }))
    );
  } catch (error) {
    console.error("GET /api/collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
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
    const parsed = createCollectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const collection = await Collection.create({
      ...parsed.data,
      userId: session.user.id,
    });

    return NextResponse.json(
      { ...collection.toObject(), _id: String(collection._id) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/collections:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
