import { NextResponse } from "next/server";
import { pinecone } from "@/lib/utils/pinecone";

export async function POST(request) {
  const body = await request.json();
  const [userId, recordIds] = [body.userId.toLowerCase(), body.recordIds];

  const index = pinecone.index(userId);

  if (recordIds.length > 1) {
    await index.deleteMany(recordIds);
  } else {
    await index.deleteOne(recordIds[0]);
  }

  return NextResponse.json({ status: 200 });
}
