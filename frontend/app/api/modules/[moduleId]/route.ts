import { proxyRequest } from "@/lib/proxy";
import { NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(
  req: NextRequest,
  context: { params: { moduleId: string } }
) {
  const { moduleId } = await context.params;
  return proxyRequest(req, `${BASE_URL}/api/modules/${moduleId}`);
}
