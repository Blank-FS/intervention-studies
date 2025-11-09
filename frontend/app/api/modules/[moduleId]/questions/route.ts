// app/api/modules/[moduleId]/questions/route.ts
import { proxyRequest } from "@/lib/proxy";
import { NextRequest, NextResponse } from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// GET questions for a specific module based on its ID
export async function GET(
  req: NextRequest,
  context: { params: { moduleId: string } }
) {
  const { moduleId } = await context.params;
  return proxyRequest(req, `${BASE_URL}/api/modules/${moduleId}/questions`);
}

// POST a new question to a specific module based on its ID
export async function POST(
  req: NextRequest,
  context: { params: { moduleId: string } }
) {
  const { moduleId } = await context.params;
  return proxyRequest(req, `${BASE_URL}/api/modules/${moduleId}/questions`);
}
