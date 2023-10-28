import { NextResponse, NextRequest } from "next/server";

import { pinecone } from "@/lib/utils/pinecone";

export async function GET() {
  const index = await pinecone.listIndexes();

  return NextResponse.json({ index: index });
}
