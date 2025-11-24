// app/api/static/[video]/route.ts
import { getTokenFromCookies } from "@/lib/getToken";
import { NextResponse } from "next/server";

// This route fetches and streams a video file by its name
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoPath = searchParams.get("path");
  if (!videoPath) {
    return NextResponse.json(
      { error: "No video path provided" },
      { status: 400 }
    );
  }

  const token = getTokenFromCookies(req);
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${videoPath}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: text || "Request failed" },
      { status: res.status }
    );
  }

  // Stream the binary video content
  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "video/mp4"; // fallback

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
    },
  });
}
