import { NextResponse } from "next/server";
import { pinecone } from "@/lib/utils/pinecone";

export async function POST(request) {
  const body = await request.json();
  const [userId, embedding] = [body.userId.toLowerCase(), body.embedding];

  const index = pinecone.index(userId);
  const queryResponse = await index.query({
    vector: embedding,
    topK: 1,
    includeValues: false,
    includeMetadata: true,
  });

  return NextResponse.json({
    image: queryResponse.matches[0].metadata.imageUrl,
  });
}
