// app/api/questions/[questionId]/route.ts
import { proxyRequest } from "@/lib/proxy";
import { NextRequest, NextResponse } from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(
  req: NextRequest,
  context: { params: { questionId: string } }
) {
  const { questionId } = await context.params;
  return proxyRequest(req, `${BASE_URL}/api/questions/${questionId}`);
}
