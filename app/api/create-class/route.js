import { NextResponse } from "next/server";
import { pinecone } from "@/lib/utils/pinecone";

export async function POST(request) {
  const body = await request.json();
  const uid = body.uid;

  await pinecone.createIndex({
    name: uid.toLowerCase(),
    dimension: 512,
    metric: "cosine",
  });

  return NextResponse.json({ status: 200 });
}
