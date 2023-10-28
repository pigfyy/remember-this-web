import { NextResponse } from "next/server";
import { pinecone } from "@/lib/utils/pinecone";

export async function POST(request) {
  const body = await request.json();
  const uid = body.uid;

  const index = await pinecone.describeIndex(uid.toLowerCase());

  return NextResponse.json({ ready: index.status.ready });
}
