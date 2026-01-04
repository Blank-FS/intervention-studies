import { proxyRequest } from "@/lib/proxy";
import { NextRequest } from "next/server";

const BASE_URL = process.env.INTERNAL_API_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  return proxyRequest(req, `${BASE_URL}${path}`);
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  return proxyRequest(req, `${BASE_URL}${path}`);
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  return proxyRequest(req, `${BASE_URL}${path}`);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  return proxyRequest(req, `${BASE_URL}${path}`);
}
