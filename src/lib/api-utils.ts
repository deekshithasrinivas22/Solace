import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function serializeMemory<T extends { _id: unknown; toObject?: () => object }>(
  doc: T
) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: String((obj as { _id: unknown })._id),
  };
}
