import { NextResponse } from "next/server";
import { pinecone } from "@/lib/utils/pinecone";

export async function POST(request) {
  const body = await request.json();
  const [userId, record] = [body.userId.toLowerCase(), body.record];

  const index = pinecone.index(userId);
  await index.upsert([record]);

  return NextResponse.json({ status: 200 });
}
